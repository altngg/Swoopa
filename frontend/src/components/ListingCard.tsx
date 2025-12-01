import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'

interface ListingCardProps {
  title?: string;
  exchangeItem?: string;
  userName?: string;
  onOpenChat?: () => void;
  onRemove?: () => void;
  onEdit?: () => void;
  mode?: 'favorites' | 'user-account';
}

function ListingCard({ 
  title = 'title', 
  exchangeItem = 'exchangeItem', 
  userName = 'Имя пользователя',
  onOpenChat,
  onRemove,
  onEdit,
  mode = 'favorites'
}: ListingCardProps) {
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOpenChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenChat?.();
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDialog(true);
  };

  const handleConfirmRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
    setShowConfirmDialog(false);
  };

  const handleCancelRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDialog(false);
  };

  const handleUserNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/profile');
  };

  return (
    <>
      <div 
        className="w-[50em] flex gap-4 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-default"
        onClick={handleCardClick}
      >
        {/* Картинка 164x164px */}
        <div 
          className="flex-shrink-0 w-[10.25rem] h-[10.25rem] rounded bg-[#C4C4C4]"
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
              <button
                onClick={handleUserNameClick}
                className="text-sm text-gray-400 mt-1 hover:text-gray-600 transition-colors"
              >
                {userName}
              </button>
            </div>
            <button
              onClick={handleRemoveClick}
              className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Удалить
            </button>
          </div>

          <div className="mt-auto flex justify-end">
            {mode === 'favorites' ? (
              <button
                onClick={handleOpenChatClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Открыть чат
              </button>
            ) : (
              <button
                onClick={handleEditClick}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg p-6 w-[400px] shadow-xl"
            onClick={handleCardClick}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {mode === 'favorites' 
                ? 'Удалить из избранного?' 
                : 'Удалить объявление?'}
            </h3>
            <p className="text-gray-600 mb-6">
              {mode === 'favorites'
                ? `Вы уверены, что хотите удалить "${title}" из списка понравившегося?`
                : `Вы уверены, что хотите удалить объявление "${title}"?`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelRemove}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-medium transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListingCard;