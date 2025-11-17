import React, { useState } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ButtonFilled from '../components/ButtonFilled';
// import ExchangeCard from '../components/ExchangeCard';

const ItemPreview = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showExchangeCard, setShowExchangeCard] = useState(false);

  // Мок данные для товара
  const itemData = {
    title: 'Мока кофеварка',
    date: '14 ноября',
    exchangeFor: 'Урок английского',
    userName: 'Максим',
    description: 'Досталась мне от деда. Готов отдать за урок по презент перфекту. Дистанционно. Только самовывоз.'
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleExchangeClick = () => {
    setShowExchangeCard(!showExchangeCard);
  };

  
  const handleUserClick = () => {
    navigate('/profile');
  };

  return (
    <div className="px-[20rem] py-0">
      {/* Основной контейнер с ограничением ширины как у поиска */}
      <div className="w-full">
        
        {/* Верхняя часть: галерея и информация */}
        <div className="flex gap-[5rem] mb-12">
          
          {/* Галерея слева */}
          <div className="flex-1">
            <Gallery />
          </div>
          
          {/* Информация справа */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-semibold text-[1.5rem] text-gray-900 mb-2">
                  {itemData.title}
                </h1>
                <p className="text-[1rem] text-gray-600">
                  {itemData.date}
                </p>
              </div>
              
              {/* Иконка лайка */}
              <button 
                onClick={handleLikeClick}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {isLiked ? (
                  <HeartFilled className="text-red-500 text-[1.5rem]" />
                ) : (
                  <HeartOutlined className="text-gray-600 text-[1.5rem]" />
                )}
              </button>
            </div>
            
            {/* Информация об обмене */}
            <div className="mb-4">
              <p className="text-[1.25rem] text-gray-900 mb-1">
                Обмен на {itemData.exchangeFor}
              </p>
              <p className="text-[1.25rem] text-gray-600"
               onClick={handleUserClick} >
                {itemData.userName}
                
              </p>
            </div>
            
            {/* Кнопка предложить обмен */}
            <div className="mt-[3rem] mb-4">
              <ButtonFilled onClick={handleExchangeClick}>
                Предложить обмен
              </ButtonFilled>
            </div>
            
            {/* {showExchangeCard && (
              <div className="w-full">
                <ExchangeCard
                  itemName={itemData.title}
                  date={itemData.date}
                  exchangeFor={itemData.exchangeFor}
                  userName={itemData.userName}
                />
              </div>
            )} */}
          </div>
        </div>
        
        {/* Описание товара */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-[1.25rem] text-gray-600 mb-4">
            Описание
          </h2>
          <p className="text-[1.25rem] text-gray-900">
            {itemData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemPreview;