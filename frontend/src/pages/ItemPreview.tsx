import React, { useState, useEffect } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ButtonFilled from '../components/ButtonFilled';
import Modal from 'antd/lib/modal/Modal';
import { message } from 'antd';

const ItemPreview = ({ isFree = false }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [userItems, setUserItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Мок данные для товара
  const itemData = {
    id: 1,
    title: 'Мока кофеварка',
    date: '14 ноября',
    exchangeFor: 'Урок английского',
    userName: 'Максим',
    userId: 123,
    description: 'Досталась мне от деда. Готов отдать за урок по презент перфекту. Дистанционно. Только самовывоз.',
    isFree: isFree
  };

  // Мок данные публикаций текущего пользователя
  const mockUserItems = [
    { id: 1, title: 'Книга "React для начинающих"', exchangeFor: 'Кофеварка' },
    { id: 2, title: 'Набор отверток', exchangeFor: 'Книги по программированию' },
    { id: 3, title: 'Комнатный горшок с цветком', exchangeFor: 'Что-нибудь интересное' },
  ];

  useEffect(() => {
    // Здесь должен быть запрос к API для получения публикаций пользователя
    setUserItems(mockUserItems);
  }, []);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const handleExchangeClick = () => {
    setShowExchangeModal(true);
  };

  const handleFreeTakeClick = () => {
    // Отправка предложения "забрать даром"
    sendOffer({ type: 'free', itemId: itemData.id });
    setIsOfferSent(true);
    message.success('Предложение отправлено!');
  };

  const handleUserClick = () => {
    navigate('/profile');
  };

  const sendOffer = (offerData) => {
    // Здесь должен быть API запрос для отправки предложения
    console.log('Отправка предложения:', offerData);
    
    // Создаем чат между пользователями
    createChat({
      itemId: itemData.id,
      fromUserId: 'current-user-id', // ID текущего пользователя
      toUserId: itemData.userId,
      offerType: itemData.isFree ? 'free' : 'exchange',
      selectedItemId: selectedItemId,
    });
  };

  const createChat = (chatData) => {
    // API запрос для создания чата
    console.log('Создание чата:', chatData);
  };

  const handleItemSelect = (itemId) => {
    setSelectedItemId(itemId);
  };

  const handleConfirmExchange = () => {
    if (!selectedItemId && !itemData.isFree) {
      message.warning('Пожалуйста, выберите предмет для обмена');
      return;
    }

    sendOffer({
      type: 'exchange',
      itemId: itemData.id,
      selectedItemId: selectedItemId,
    });

    setShowExchangeModal(false);
    setIsOfferSent(true);
    message.success('Предложение обмена отправлено!');
  };

  return (
    <div className="px-[20rem] py-0">
      <div className="w-full">
        <div className="flex gap-[5rem] mb-12">
          <div className="flex-1">
            <Gallery />
          </div>
          
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
            
            <div className="mb-4">
              <p className="text-[1.25rem] text-gray-900 mb-1">
                {itemData.isFree ? 'Отдам даром' : `Обмен на ${itemData.exchangeFor}`}
              </p>
              <p 
                className="text-[1.25rem] text-gray-600 hover:cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleUserClick}
              >
                {itemData.userName}
              </p>
            </div>
            
            <div className="mt-[3rem] mb-4">
              {itemData.isFree ? (
                <ButtonFilled 
                  onClick={handleFreeTakeClick}
                  disabled={isOfferSent}
                  className={isOfferSent ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {isOfferSent ? 'Предложение отправлено' : 'Забрать даром'}
                </ButtonFilled>
              ) : (
                <ButtonFilled 
                  onClick={handleExchangeClick}
                  disabled={isOfferSent}
                  className={isOfferSent ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {isOfferSent ? 'Предложение отправлено' : 'Предложить обмен'}
                </ButtonFilled>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-[1.25rem] text-gray-600 mb-4">
            Описание
          </h2>
          <p className="text-[1.25rem] text-gray-900">
            {itemData.description}
          </p>
        </div>
      </div>

      {/* Модальное окно выбора публикации для обмена */}
      <Modal
        title="Выберите предмет для обмена"
        open={showExchangeModal}
        onCancel={() => setShowExchangeModal(false)}
        onOk={handleConfirmExchange}
        okText="Предложить обмен"
        cancelText="Отмена"
        width={600}
      >
        <div className="py-4">
          <p className="mb-4 text-gray-600">
            Выберите один из ваших предметов для обмена на "{itemData.title}"
          </p>
          
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {userItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedItemId === item.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleItemSelect(item.id)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    selectedItemId === item.id
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}></div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">Обмен на: {item.exchangeFor}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {userItems.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              У вас пока нет публикаций для обмена
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ItemPreview;