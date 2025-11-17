import { HeartOutlined } from '@ant-design/icons';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import type { ItemCardProps } from '../types';

function ItemCard({ itemId, title = 'Название товара', exchangeItem = 'предмет обмена' }: ItemCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/item/${itemId}`);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Логика для лайка
  };

  return (
    <div 
      className="w-[12rem] flex flex-col gap-2 p-3 rounded-lg cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div 
          className="w-full h-40 rounded bg-[#C4C4C4]"
          style={{ backgroundColor: '#C4C4C4' }}
        />
        <button 
          className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={handleLikeClick}
        >
          <HeartOutlined className="text-gray-600 hover:text-red-500" />
        </button>
      </div>

      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {title}
        </h3>
        <p className="text-xs text-gray-600 truncate">
          Обмен на {exchangeItem}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;