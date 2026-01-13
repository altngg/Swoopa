import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { favoritesApi } from '../api/favoritesApi';

interface ItemCardProps {
  itemId: number;
  title: string;
  exchangeItem: string;
  slug: string;
  isFree?: boolean;
  mainImage?: string | null;
  images?: string; // Оставляем как string, так как теперь передаем строку
}

function ItemCard({ 
  itemId, 
  title = 'Название товара', 
  exchangeItem = 'предмет обмена',
  slug,
  isFree,
  mainImage,
  images
}: ItemCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkIfFavorite = useCallback(async () => {
    try {
      const favorites = await favoritesApi.getMyFavorites();
      const isFavorite = favorites.some(fav => fav.publication.id === itemId);
      setIsLiked(isFavorite);
    } catch (error: unknown) {
      // Если не авторизован, не показываем ошибку
      const err = error as { response?: { status?: number } };
      if (err.response?.status !== 401) {
        console.error('Ошибка при проверке избранного:', error);
      }
    }
  }, [itemId]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const handleCardClick = () => {
    navigate(`/item/${slug}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isLiked) {
        // Удаляем из избранного
        const favorites = await favoritesApi.getMyFavorites();
        const favorite = favorites.find(fav => fav.publication.id === itemId);
        if (favorite) {
          await favoritesApi.remove(favorite.id);
          setIsLiked(false);
        }
      } else {
        // Добавляем в избранное
        await favoritesApi.add(slug);
        setIsLiked(true);
      }
    } catch (error: unknown) {
      console.error('Ошибка при обновлении избранного:', error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        // Если не авторизован, перенаправляем на логин
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  // Используем mainImage как основной, а если его нет - используем images
  const imageUrl = getImageUrl(mainImage || images);

  return (
    <div 
      className="flex flex-col gap-3 p-2 cursor-pointer hover:shadow-lg transition-shadow rounded-lg"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="w-[14rem] h-[15rem] rounded overflow-hidden bg-gray-200 flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Если изображение не загрузилось, показываем заглушку
                e.currentTarget.src = 'https://via.placeholder.com/224x240?text=Нет+изображения';
                e.currentTarget.className = 'w-full h-full object-contain p-4';
              }}
            />
          ) : (
            <span className="text-gray-500">Нет изображения</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-[14rem]">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[1.125rem] text-gray-900 truncate flex-1">
            {title}
          </h3>
          <button 
            className={`flex-shrink-0 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleLikeClick}
            disabled={loading}
          >
            {isLiked ? (
              <HeartFilled className="text-[1.2rem] text-red-500" />
            ) : (
              <HeartOutlined className="text-[1.2rem] text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>
        
        <p className="text-[0.875rem] text-gray-600 truncate">
          {isFree ? 'Бесплатно' : exchangeItem}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;