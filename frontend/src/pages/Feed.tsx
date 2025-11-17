import React from 'react';
import ItemCard from '../components/ItemCard';

const Feed = () => {
  const items = [
    { itemId: 1, title: 'iPhone 13', exchangeItem: 'Samsung Galaxy' },
    { itemId: 2, title: 'MacBook Pro', exchangeItem: 'Игровой ноутбук' },
    { itemId: 3, title: 'Nike Air Force', exchangeItem: 'Adidas Ultraboost' },
    { itemId: 4, title: 'Гитара', exchangeItem: 'Синтезатор' },
    { itemId: 5, title: 'Книги', exchangeItem: 'Настольные игры' },
    { itemId: 6, title: 'Скейтборд', exchangeItem: 'Велосипед' },
    { itemId: 7, title: 'PlayStation 5', exchangeItem: 'Xbox Series X' },
    { itemId: 8, title: 'Фотоаппарат', exchangeItem: 'Объектив' },
    { itemId: 9, title: 'Часы', exchangeItem: 'Браслет' },
    { itemId: 10, title: 'Куртка', exchangeItem: 'Пальто' },
  ];

  return (
    <div className="">
      <div className="mt-[3rem] mx-[3] px-[11rem] py-0">
        {/* Заголовок */}
        <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
          Для Вас
        </h1>
        
        {/* Адаптивная сетка */}
        <div className="
          grid 
          grid-cols-1 
          xs:grid-cols-1 xs:  xs: 
          sm:grid-cols-1 sm: sm: 
          md:grid-cols-2 md: md: 
          lg:grid-cols-3 lg: lg:
          xl:grid-cols-6 xl: xl:
          gap-4 
          lg:gap-6
          overflow-y-auto
        ">
          {items.map((item) => (
            <ItemCard 
              key={item.itemId}
              itemId={item.itemId}
              title={item.title}
              exchangeItem={item.exchangeItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;