import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import type { ItemCardProps } from '../types';
import { useState, useEffect } from 'react';

function ItemCard({ itemId, title = 'Название товара', exchangeItem = 'предмет обмена' }: ItemCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  // Загружаем состояние лайка из localStorage
  useEffect(() => {
    const savedLikes = localStorage.getItem('itemLikes');
    if (savedLikes) {
      const likes = JSON.parse(savedLikes);
      if (likes[itemId]) {
        setIsLiked(true);
      }
    }
  }, [itemId]);

  // Сохраняем состояние лайка
  useEffect(() => {
    const savedLikes = localStorage.getItem('itemLikes');
    const likes = savedLikes ? JSON.parse(savedLikes) : {};
    
    if (isLiked) {
      likes[itemId] = true;
    } else {
      delete likes[itemId];
    }
    
    localStorage.setItem('itemLikes', JSON.stringify(likes));
  }, [isLiked, itemId]);

  const handleCardClick = () => {
    navigate(`/item/${itemId}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  return (
    <div 
      className="flex flex-col gap-3 p-2 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Картинка без лайка */}
      <div className="relative">
        <div 
          className="w-[14rem] h-[15rem] rounded bg-[#C4C4C4]"
          style={{ backgroundColor: '#C4C4C4' }}
        />
      </div>

      {/* Текст под картинкой с лайком на одном уровне */}
      <div className="flex flex-col gap-1 w-[14rem]">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-[1.125rem] text-gray-900 truncate flex-1">
            {title}
          </h3>
          {/* Иконка лайка рядом с названием */}
          <button 
            className={`flex-shrink-0 transition-colors ${
              isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
            onClick={handleLikeClick}
          >
            {isLiked ? (
              <HeartFilled className="text-[1.2rem]" />
            ) : (
              <HeartOutlined className="text-[1.2rem]" />
            )}
          </button>
        </div>
        
        <p className="text-[0.875rem] text-gray-600 truncate">
          Обмен на {exchangeItem}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;