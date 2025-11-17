import '../index.css'
import { useNavigate } from 'react-router-dom';
import type { ListingCardProps } from '../types';

function ListingCard({ 
  itemId, 
  title = 'title', 
  exchangeItem = 'exchangeItem', 
  isEditable = false,
  onDelete,
  onEdit 
}: ListingCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isEditable && onEdit) {
      onEdit(itemId);
    } else {
      navigate(`/item/${itemId}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(itemId);
    }
  };

  const handleOpenChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/user-account/messages');
  };

  return (
    <div 
      className="w-[40em] flex gap-4 p-4 rounded-lg shadow-sm cursor-pointer"
      onClick={handleCardClick}
    >
      <div 
        className="flex-shrink-0 w-[6rem] h-20 rounded bg-[#C4C4C4]"
        style={{ backgroundColor: '#C4C4C4' }}
      />

      <div className="flex-1 flex flex-col w-fit-content">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Обмен на {exchangeItem}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Максим
            </p>
          </div>
          {isEditable && (
            <button
              className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
              onClick={handleDelete}
            >
              Удалить
            </button>
          )}
        </div>

        <div className="mt-auto flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
            onClick={handleOpenChat}
          >
            Открыть чат
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;