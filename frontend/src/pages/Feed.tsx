import React, { useState, useMemo, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import SortDropdown from '../components/SortDropdown';
import { useLocation } from 'react-router-dom';
import { publicationsApi, type Publication } from '../api/publicationsApi'; // Добавьте type
import { Spin } from 'antd';

const Feed = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'date' | 'exchange'>('date');
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    
    if (query) {
      setSearchQuery(query);
      setIsSearchActive(true);
    } else {
      setSearchQuery('');
      setIsSearchActive(false);
    }
  }, [location.search]);

  const loadPublications = async () => {
    try {
      setLoading(true);
      const data = await publicationsApi.getAll();
      setPublications(data);
    } catch (error) {
      console.error('Ошибка при загрузке публикаций:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedPublications = useMemo(() => {
    let filtered = publications;

    if (isSearchActive && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.name.toLowerCase().includes(query) ||
        pub.description.toLowerCase().includes(query)
      );
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        const aIsFree = parseFloat(a.price) === 0;
        const bIsFree = parseFloat(b.price) === 0;
        if (aIsFree && !bIsFree) return -1;
        if (!aIsFree && bIsFree) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [publications, searchQuery, sortOption, isSearchActive]);

  const handleSortChange = (option: 'date' | 'exchange') => {
    setSortOption(option);
  };

  return (
    <div className="p-6">
      <div className="mt-[2rem] mx-[3rem] min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-inter font-semibold text-2xl text-gray-900">
            {isSearchActive && searchQuery ? 'Результаты поиска' : 'Для Вас'}
          </h1>
          
          <SortDropdown 
            onSortChange={handleSortChange}
            isVisible={isSearchActive && searchQuery.trim() !== ''}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <>
            <div className="
              grid 
              grid-cols-1 
              xs:grid-cols-2 
              sm:grid-cols-3 
              md:grid-cols-4 
              lg:grid-cols-5 
              xl:grid-cols-6
              overflow-y-auto
            ">
              {filteredAndSortedPublications.map((pub) => {
                // Преобразуем images в правильный формат
                const imagesArray = pub.images ? 
                  pub.images.map(img => typeof img === 'string' ? { image: img } : img) 
                  : [];

                return (
                  <ItemCard 
                    key={pub.id}
                    itemId={pub.id}
                    title={pub.name}
                    exchangeItem={pub.price}
                    slug={pub.slug}
                    isFree={parseFloat(pub.price) === 0}
                    mainImage={pub.main_image}
                    images={imagesArray} // Теперь это массив объектов { image: string }
                  />
                );
              })}
            </div>

            {isSearchActive && searchQuery && filteredAndSortedPublications.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                По запросу "{searchQuery}" ничего не найдено
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Feed;