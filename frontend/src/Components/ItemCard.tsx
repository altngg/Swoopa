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
  isFree?: boolean
}

function ItemCard({ itemId, title = 'Название товара', exchangeItem = 'предмет обмена' }: ItemCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkIfFavorite = useCallback(async () => {
    try {
      const favorites = await favoritesApi.getMyFavorites();
      const isFavorite = favorites.some(fav => fav.publication.id === itemId);
      setIsLiked(isFavorite);
    } catch (error: unknown) {
      console.error('Ошибка при проверке избранного:', error);
    }
  }, [itemId]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const handleCardClick = () => {
    // TODO: Добавить slug когда будет в API
    navigate(`/item/${itemId}`);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isLiked) {
        const favorites = await favoritesApi.getMyFavorites();
        const favorite = favorites.find(fav => fav.publication.id === itemId);
        if (favorite) {
          await favoritesApi.remove(favorite.id);
          setIsLiked(false);
        }
      } else {
        // TODO: Нужен slug для добавления в избранное
        // await favoritesApi.add(slug);
        setIsLiked(true);
      }
    } catch (error: unknown) {
      console.error('Ошибка при обновлении избранного:', error);
      const isUnauthorized = error instanceof Error && 'response' in error && 
        (error as { response?: { status?: number } }).response?.status === 401;
      if (isUnauthorized) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex flex-col gap-3 p-2 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div 
          className="w-[14rem] h-[15rem] rounded bg-[#C4C4C4] flex items-center justify-center"
          style={{ backgroundColor: '#C4C4C4' }}
        >
          <span className="text-gray-500">Изображение</span>
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
          {exchangeItem}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;