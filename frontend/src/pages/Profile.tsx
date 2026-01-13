/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import { getImageUrl } from '../api/apiClient';
import apiClient from '../api/apiClient';

interface User {
  id: number;
  username: string;
  email: string;
  location: {
    id: number;
    city: string;
  };
  profile_picture: string | null;
  date_joined: string;
}

interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  main_image: string | null;
  publication_type_name: string;
  status_name: string;
  author_username: string;
  author_id: number;
  created_at: string;
  images: any[];
}

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User | null>(null);
  const [userPublications, setUserPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Получаем данные пользователя
        const userResponse = await apiClient.get(`/users/${id}`);
        setUserData(userResponse.data);
        
        // Получаем все публикации пользователя
        try {
          const publicationsResponse = await apiClient.get('/main/publications');
          const allPublications = publicationsResponse.data;
          
          // Фильтруем публикации по автору
          const userPublicationsData = allPublications.filter(
            (pub: Publication) => pub.author_id === parseInt(id)
          );
          setUserPublications(userPublicationsData);
        } catch (pubError) {
          console.error('Ошибка при загрузке публикаций:', pubError);
          // Если не удалось загрузить публикации, продолжаем без них
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Функция для получения URL аватарки
  const getAvatarUrl = (path: string | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  if (loading) {
    return (
      <div className="px-[11rem] py-0">
        <div className="w-full mx-auto text-center py-12">
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="px-[11rem] py-0">
        <div className="w-full mx-auto text-center py-12">
          <p className="text-red-500">{error || 'Пользователь не найден'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-[11rem] py-0">
      <div className="w-full mx-auto">
        {/* Шапка профиля */}
        <div className="flex items-center gap-8 mb-12 ml-[2em]">
          {/* Аватар */}
          <div 
            className="w-[8rem] h-[8rem] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
            style={{ 
              width: '8rem',
              height: '8rem'
            }}
          >
            {userData.profile_picture ? (
              <img 
                src={getAvatarUrl(userData.profile_picture)}
                alt={`${userData.username} avatar`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/128x128?text=Аватар';
                }}
              />
            ) : (
              <span className="text-gray-500 text-lg">Аватар</span>
            )}
          </div>
          
          {/* Информация пользователя */}
          <div className="flex flex-col gap-2">
            {/* Имя пользователя */}
            <h1 className="font-semibold text-[1.25rem] text-gray-900">
              {userData.username}
            </h1>
            
            {/* Email */}
            <p className="font-regular text-[1rem] text-gray-600">
              {userData.email}
            </p>
            
            {/* Город */}
            <p className="font-regular text-[1.125rem] text-gray-600">
              {userData.location.city}
            </p>
            
            {/* Дата регистрации */}
            <p className="font-regular text-[0.875rem] text-gray-500">
              На сайте с {new Date(userData.date_joined).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        {/* Контент профиля */}
        <div className="">
          <div className="">
            <div className="border-t border-gray-200 pt-6">
              <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
                Объявления пользователя ({userPublications.length})
              </h1>
    
              {userPublications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  У пользователя пока нет объявлений
                </div>
              ) : (
                <div className="
                  grid 
                  grid-cols-2 
                  sm:grid-cols-3 
                  md:grid-cols-4 
                  lg:grid-cols-5 
                  xl:grid-cols-6 
                  gap-4 
                  lg:gap-6
                ">
                  {userPublications.map((publication) => (
                    <ItemCard 
                      key={publication.id}
                      itemId={publication.id}
                      title={publication.name}
                      exchangeItem={publication.price === "0" ? "Бесплатно" : publication.price}
                      slug={publication.slug}
                      mainImage={publication.main_image}
                      isFree={publication.price === "0"}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;