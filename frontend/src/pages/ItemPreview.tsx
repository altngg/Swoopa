/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery';
import ButtonFilled from '../components/ButtonFilled';
import { Modal, message } from 'antd';
import { publicationsApi } from '../api/publicationsApi';
// import { favoritesApi } from '../api/favoritesApi';
// import { authApi } from '../api/authApi';

interface ItemPreviewProps {
  isFree?: boolean;
}

interface UserItem {
  id: number;
  name: string;
  exchangeFor?: string;
}

interface PublicationImage {
  id: number;
  image: string;
  publication: number;
  order: number;
}

interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  main_image: string | null;
  publication_type_name: string;
  status_name: string;
  author_username: string;
  author_id: number;
  created_at: string;
  images: PublicationImage[];
}

const ItemPreview: React.FC<ItemPreviewProps> = ({ isFree = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [userItems, setUserItems] = useState<UserItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [itemData, setItemData] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [favoriteId, setFavoriteId] = useState<number | null>(null);
  const [allImages, setAllImages] = useState<string[]>([]);

  // Локальная функция для получения URL изображения
  const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';
    if (typeof path !== 'string') {
      console.error('❌ getImageUrl получил не строку:', path);
      return '';
    }
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  // Получение данных товара
  useEffect(() => {
    const fetchItemData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        console.log('🟡 Начинаем загрузку публикации по slug:', id);
        
        const publication = await publicationsApi.getBySlug(id);
        console.log('✅ Получены данные публикации:', publication);
        setItemData(publication);
        
        // Формируем массив всех изображений: main_image + images
        const imagesArray: string[] = [];
        
        console.log('🟡 main_image из API:', publication.main_image);
        console.log('🟡 images из API:', publication.images);
        
        // Добавляем main_image если он есть
        if (publication.main_image) {
          const mainImageUrl = getImageUrl(publication.main_image);
          console.log('🟡 main_image URL:', mainImageUrl);
          if (mainImageUrl) {
            imagesArray.push(mainImageUrl);
          }
        }
        
        // Добавляем дополнительные изображения
        if (publication.images && Array.isArray(publication.images)) {
          console.log(`🟡 Найдено ${publication.images.length} дополнительных изображений`);
          
          publication.images.forEach((imgObj: PublicationImage, index: number) => {
            console.log(`🟡 Объект изображения ${index}:`, imgObj);
            
            // Извлекаем путь из объекта
            if (imgObj && imgObj.image) {
              const imageUrl = getImageUrl(imgObj.image);
              console.log(`🟡 Изображение ${index} URL:`, imageUrl);
              if (imageUrl && !imagesArray.includes(imageUrl)) {
                imagesArray.push(imageUrl);
              }
            } else {
              console.warn(`⚠️ Объект изображения ${index} не содержит поле image:`, imgObj);
            }
          });
        } else {
          console.log('ℹ️ images не является массивом или пустой:', publication.images);
        }
        
        console.log('✅ Всего изображений для галереи:', imagesArray.length);
        console.log('✅ Список изображений:', imagesArray);
        setAllImages(imagesArray);
        
        // Временные заглушки для отображения
        setUserItems([]);
        setCurrentUser(null);
      } catch (error) {
        console.error('❌ Ошибка при загрузке товара:', error);
        message.error('Не удалось загрузить данные товара');
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [id]);

  // Функция для обработки клика по лайку
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!itemData) return;
    
    try {
      navigate('/login');
    } catch (error: any) {
      console.error('❌ Ошибка при обновлении избранного:', error);
      message.error('Не удалось обновить избранное');
    }
  };

  const handleExchangeClick = () => {
    if (!currentUser) {
      message.warning('Для предложения обмена необходимо авторизоваться');
      navigate('/login');
      return;
    }
    setShowExchangeModal(true);
  };

  const handleFreeTakeClick = async () => {
    if (!currentUser || !itemData) return;
    
    try {
      // Здесь должен быть API запрос для отправки предложения "забрать даром"
      // Пока используем заглушку
      sendOffer({ type: 'free', itemId: itemData.id });
      setIsOfferSent(true);
      message.success('Предложение отправлено!');
    } catch (error) {
      console.error('Ошибка при отправке предложения:', error);
      message.error('Не удалось отправить предложение');
    }
  };

  // Исправленная функция для клика по имени пользователя
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('🟡 Клик по имени пользователя');
    console.log('🟡 itemData:', itemData);
    console.log('🟡 author_id:', itemData?.author_id);
    
    if (itemData && itemData.author_id) {
      console.log(`🟡 Переход на профиль пользователя с ID: ${itemData.author_id}`);
      navigate(`/users/${itemData.author_id}`);
    } else {
      console.error('❌ Нет данных для перехода на профиль');
      message.info('Просмотр профиля временно недоступен');
    }
  };

  interface OfferData {
    type: 'exchange' | 'free';
    itemId: number;
    selectedItemId?: number;
  }

  const sendOffer = (offerData: OfferData) => {
    console.log('📤 Отправка предложения:', offerData);
    
    createChat({
      itemId: itemData!.id,
      fromUserId: currentUser?.id,
      toUserId: itemData!.author_id,
      offerType: itemData!.price.toLowerCase().includes('бесплатно') ? 'free' : 'exchange',
      selectedItemId: offerData.selectedItemId,
    });
  };

  const createChat = (chatData: any) => {
    console.log('💬 Создание чата:', chatData);
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItemId(itemId);
  };

  const handleConfirmExchange = () => {
    if (!selectedItemId && !itemData?.price.toLowerCase().includes('бесплатно')) {
      message.warning('Пожалуйста, выберите предмет для обмена');
      return;
    }

    sendOffer({
      type: 'exchange',
      itemId: itemData!.id,
      selectedItemId: selectedItemId || undefined,
    });

    setShowExchangeModal(false);
    setIsOfferSent(true);
    message.success('Предложение обмена отправлено!');
  };

  if (loading) {
    return (
      <div className="px-[20rem] py-0">
        <div className="w-full text-center py-12">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="px-[20rem] py-0">
        <div className="w-full text-center py-12">
          <p>Товар не найден</p>
        </div>
      </div>
    );
  }

  const isFreeItem = itemData.price.toLowerCase().includes('бесплатно') || 
                     itemData.price.toLowerCase() === 'free' || 
                     itemData.price === '0';

  // Отладочная информация
  console.log('📊 ==== ОТЛАДОЧНАЯ ИНФОРМАЦИЯ ====');
  console.log('📊 Название товара:', itemData.name);
  console.log('📊 Author ID для перехода:', itemData.author_id);
  console.log('📊 Username:', itemData.author_username);
  console.log('📊 Main image путь:', itemData.main_image);
  console.log('📊 Images array (объекты):', itemData.images);
  console.log('📊 Всего изображений для галереи:', allImages.length);
  console.log('📊 Изображения для галереи:', allImages);

  return (
    <div className="px-[20rem] py-0">
      <div className="w-full">
        <div className="flex gap-[5rem] mb-12">
          <div className="flex-1">
            {/* Передаем все изображения в галерею */}
            <Gallery images={allImages} />
          </div>
          
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-semibold text-[1.5rem] text-gray-900 mb-2">
                  {itemData.name}
                </h1>
                <p className="text-[1rem] text-gray-600">
                  {new Date(itemData.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long'
                  })}
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
                {isFreeItem ? 'Отдам даром' : `Обмен на ${itemData.price}`}
              </p>
              <p 
                className="text-[1.25rem] text-gray-600 hover:cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleUserClick}
                style={{ cursor: 'pointer' }}
              >
                {itemData.author_username}
              </p>
            </div>
            
            <div className="mt-[3rem] mb-4">
              {isFreeItem ? (
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
            Выберите один из ваших предметов для обмена на "{itemData.name}"
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
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    {item.exchangeFor && (
                      <p className="text-sm text-gray-600">Обмен на: {item.exchangeFor}</p>
                    )}
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