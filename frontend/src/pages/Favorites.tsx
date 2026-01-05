import React, { useState } from 'react';
import ListingCard from '../components/ListingCard';
import DialogueWindow from '../components/DialogueWindow';

const Favorites = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [favoriteItems, setFavoriteItems] = useState([
    { 
      itemId: 1, 
      title: 'Мока кофеварка', 
      exchangeItem: 'Урок английского', 
      userName: 'Максим' 
    },
    { 
      itemId: 2, 
      title: 'Вторая кофеварка', 
      exchangeItem: 'Урок немецкого', 
      userName: 'Анна' 
    },
    { 
      itemId: 3, 
      title: 'Настольная лампа', 
      exchangeItem: 'Книги', 
      userName: 'Иван' 
    },
    { 
      itemId: 4, 
      title: 'Стул офисный', 
      exchangeItem: 'Растение', 
      userName: 'Ольга' 
    },
    { 
      itemId: 5, 
      title: 'Книги по программированию', 
      exchangeItem: 'Кофемашина', 
      userName: 'Дмитрий' 
    },
  ]);

  const handleOpenChat = (itemId: number) => {
    setSelectedChat(itemId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const handleRemoveItem = (itemId: number) => {
    setFavoriteItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  };

  return (
    <div className="min-h-screen px-[11rem] py-0">
      {/* Заголовок */}
      <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
        Понравившееся
      </h1>
      
      {/* Основной контейнер с разделением экрана */}
      <div className="flex gap-1">
        {/* Список ListingCards - занимает 2/3 */}
        <div className="w-2/3 space-y-4">
          {favoriteItems.map((item) => (
            <ListingCard 
              key={item.itemId}
              title={item.title}
              exchangeItem={item.exchangeItem}
              userName={item.userName}
              onOpenChat={() => handleOpenChat(item.itemId)}
              onRemove={() => handleRemoveItem(item.itemId)}
            />
          ))}
        </div>

        <div className="w-1/3">
          {selectedChat && (
            <div className="fixed top-[27vh] right-[11rem] h-screen w-[calc(33.333%-2rem)]">
              <DialogueWindow 
                onClose={handleCloseChat}
                itemId={selectedChat}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;