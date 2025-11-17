import React, { useState, useMemo, useEffect } from 'react';
import ItemCard from '../components/ItemCard';
import SortDropdown from '../components/SortDropdown';

const Feed = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'date' | 'exchange'>('date');

  const allItems = [
    { itemId: 1, title: 'iPhone 13', exchangeItem: 'Samsung Galaxy', date: new Date('2024-01-15'), isFreeExchange: false },
    { itemId: 2, title: 'MacBook Pro', exchangeItem: 'Игровой ноутбук', date: new Date('2024-01-10'), isFreeExchange: false },
    { itemId: 3, title: 'Nike Air Force', exchangeItem: 'Adidas Ultraboost', date: new Date('2024-01-20'), isFreeExchange: true },
    { itemId: 4, title: 'Гитара', exchangeItem: 'Синтезатор', date: new Date('2024-01-05'), isFreeExchange: false },
    { itemId: 5, title: 'Книги по программированию', exchangeItem: 'Настольные игры', date: new Date('2024-01-18'), isFreeExchange: true },
    { itemId: 6, title: 'Скейтборд', exchangeItem: 'Велосипед', date: new Date('2024-01-12'), isFreeExchange: false },
    { itemId: 7, title: 'PlayStation 5', exchangeItem: 'Xbox Series X', date: new Date('2024-01-08'), isFreeExchange: false },
    { itemId: 8, title: 'Фотоаппарат Canon', exchangeItem: 'Объектив', date: new Date('2024-01-22'), isFreeExchange: true },
    { itemId: 9, title: 'Часы Rolex', exchangeItem: 'Браслет', date: new Date('2024-01-03'), isFreeExchange: false },
    { itemId: 10, title: 'Куртка зимняя', exchangeItem: 'Пальто', date: new Date('2024-01-25'), isFreeExchange: true },
  ];

  // Слушаем события поиска
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      const { query, isActive } = event.detail;
      setSearchQuery(query);
      setIsSearchActive(isActive);
    };

    window.addEventListener('searchPerformed', handleSearch as EventListener);
    
    return () => {
      window.removeEventListener('searchPerformed', handleSearch as EventListener);
    };
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = allItems;

    // Поиск только если есть запрос и поиск активен
    if (isSearchActive && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.exchangeItem.toLowerCase().includes(query)
      );
    }

    // Сортировка
    filtered = [...filtered].sort((a, b) => {
      if (sortOption === 'date') {
        return b.date.getTime() - a.date.getTime();
      } else {
        if (a.isFreeExchange && !b.isFreeExchange) return -1;
        if (!a.isFreeExchange && b.isFreeExchange) return 1;
        return b.date.getTime() - a.date.getTime();
      }
    });

    return filtered;
  }, [searchQuery, sortOption, isSearchActive]);

  const handleSortChange = (option: 'date' | 'exchange') => {
    setSortOption(option);
  };

  return (
    <div className="p-6">
      <div className="mt-[2rem] mx-[3rem] min-h-screen">
        {/* Заголовок и сортировка */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-inter font-semibold text-2xl text-gray-900">
            {isSearchActive && searchQuery ? 'Результаты поиска' : 'Для Вас'}
          </h1>
          
          {/* Сортировка показывается только при активном поиске */}
          <SortDropdown 
            onSortChange={handleSortChange}
            isVisible={isSearchActive && searchQuery.trim() !== ''}
          />
        </div>
        
        {/* Адаптивная сетка - твой оригинальный лейаут */}
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
          {filteredAndSortedItems.map((item) => (
            <ItemCard 
              key={item.itemId}
              itemId={item.itemId}
              title={item.title}
              exchangeItem={item.exchangeItem}
            />
          ))}
        </div>

        {/* Сообщение если нет результатов поиска */}
        {isSearchActive && searchQuery && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            По запросу "{searchQuery}" ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;