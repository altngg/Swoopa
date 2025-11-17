import React from 'react';
import ItemCard from '../components/ItemCard';

const Profile = () => {
  // Мок данные пользователя
  const userData = {
    name: 'Максим Нахивич',
    city: 'Москва'
  };

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

  return (
    <div className="px-[11rem] py-0">
      <div className="w-full mx-auto">
        {/* Шапка профиля */}
        <div className="flex items-center gap-8 mb-12 ml-[2em]">
          {/* Аватар 133x133px */}
          <div 
            className="w-[8rem] h-[8rem] rounded-full bg-gray-200 flex items-center justify-center"
            style={{ 
              width: '8rem',
              height: '8rem'
            }}
          >
            <span className="text-gray-500 text-lg">Аватар</span>
          </div>
          
          {/* Информация пользователя */}
          <div className="flex flex-col gap-2">
            {/* Имя пользователя */}
            <h1 className="font-semibold text-[1.25rem] text-gray-900">
              {userData.name}
            </h1>
            
            {/* Город */}
            <p className="font-regular text-[1.125rem] text-gray-600">
              {userData.city}
            </p>
          </div>
        </div>

        {/* Контент профиля */}
        <div className="">
            <div className="">
                <div className="border-t border-gray-200 pt-6">
                    <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
                        Объявления пользователя
                    </h1>
          
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
                        {allItems.map((item) => (
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
        </div>
    </div>
</div>
)};

export default Profile;