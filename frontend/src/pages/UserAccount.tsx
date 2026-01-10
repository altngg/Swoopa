/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Badge, message, Select, Spin } from 'antd';
import { 
  UserOutlined, EditOutlined, LogoutOutlined, DeleteOutlined, 
  BellOutlined, CheckOutlined, CloseOutlined 
} from '@ant-design/icons';
import DialoguesList from '../components/DialoguesList';
import DialogueWindow from '../components/DialogueWindow';
import ListingCard from '../components/ListingCard';
import { authApi, type User } from '../api/authApi';
import { publicationsApi, type Publication } from '../api/publicationsApi';
import { favoritesApi, type Favorite } from '../api/favoritesApi';

const { Option } = Select;

interface UserAccountProps {
  initialTab?: 'ads' | 'messages' | 'offers';
}

interface Dialog {
  id: string;
  userName: string;
  lastMessage: string;
  unreadCount?: number;
  timestamp: string;
  itemId: number;
  itemTitle: string;
  offerType?: 'exchange' | 'free';
  status?: 'pending' | 'accepted' | 'rejected';
}

type DialogItem = Dialog;

interface OfferItem {
  id: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  itemId: number;
  itemTitle: string;
  offerType: 'exchange' | 'free';
  selectedItemId?: number;
  selectedItemTitle?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface AdItem {
  mainImage: string | null | undefined;
  itemId: number;
  title: string;
  exchangeItem: string;
  userName: string;
  isFree?: boolean;
  slug?: string;
}

const UserAccount: React.FC<UserAccountProps> = ({ initialTab = 'ads' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ads' | 'messages' | 'offers'>(initialTab);
  const [selectedDialog, setSelectedDialog] = useState<DialogItem | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [userName, setUserName] = useState('');
  const [userCity, setUserCity] = useState('');
  const [tempName, setTempName] = useState('');
  const [tempCity, setTempCity] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomingOffers, setIncomingOffers] = useState<OfferItem[]>([]);
  const [userAds, setUserAds] = useState<AdItem[]>([]);
  const [locations, setLocations] = useState<Array<{id: number, city: string}>>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    loadUserData();
    loadUserPublications();
    loadLocations();
    loadFavorites();
    
    if (location.pathname === '/user-account/messages') {
      setActiveTab('messages');
    } else if (location.pathname === '/user-account/offers') {
      setActiveTab('offers');
    } else {
      setActiveTab('ads');
    }
  }, [location]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const user = await authApi.getCurrentUser();
      setUserName(user.username);
      setUserCity(user.location.city);
      setSelectedLocationId(user.location.id);
      setTempName(user.username);
      setTempCity(user.location.city);
      setUserAvatar(user.profile_picture);
    } catch (error) {
      message.error('Ошибка при загрузке данных пользователя');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const loadUserPublications = async () => {
    try {
      const publications = await publicationsApi.getAll();
      const currentUser = await authApi.getCurrentUser();
      
      const userPublications = publications
        .filter(pub => pub.author_id === currentUser.id)
        .map(pub => ({
          itemId: pub.id,
          title: pub.name,
          exchangeItem: pub.price === "0" ? "Бесплатно" : `Цена: ${pub.price}`,
          userName: pub.author_username,
          isFree: pub.price === "0",
          slug: pub.slug,
          mainImage: pub.main_image
        }));
      
      setUserAds(userPublications);
    } catch (error) {
      console.error('Ошибка при загрузке публикаций:', error);
      message.error('Не удалось загрузить ваши объявления');
    }
  };

  const loadLocations = async () => {
    try {
      const locationsData = await authApi.getLocations();
      setLocations(locationsData);
    } catch (error) {
      console.error('Ошибка при загрузке локаций:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favoritesData = await favoritesApi.getMyFavorites();
      setFavorites(favoritesData);
    } catch (error) {
      console.error('Ошибка при загрузке избранного:', error);
    }
  };

  const loadIncomingOffers = async () => {
    // TODO: Реализовать API для загрузки предложений
    // Пока оставляем пустой массив
    setIncomingOffers([]);
  };

  const handleCloseChat = () => {
    setSelectedDialog(null);
  };

  const handleEditAd = (ad: AdItem) => {
    navigate('/add-post', { 
      state: { 
        mode: 'edit',
        adData: ad
      } 
    });
  };

  const handleNameEditStart = () => {
    setTempName(userName);
    setIsEditingName(true);
  };

  const handleCityEditStart = () => {
    setTempCity(userCity);
    setIsEditingCity(true);
  };

  const handleNameSave = async () => {
    if (tempName.trim() && tempName !== userName) {
      try {
        const response = await authApi.updateUser({ username: tempName.trim() });
        setUserName(tempName.trim());
        message.success(response.message);
      } catch (error) {
        message.error('Ошибка при обновлении имени');
      }
    }
    setIsEditingName(false);
  };

  const handleCitySave = async () => {
    if (tempCity.trim() && tempCity !== userCity) {
      try {
        const location = locations.find(loc => loc.city === tempCity);
        if (location) {
          const response = await authApi.updateUser({ location_id: location.id });
          setUserCity(tempCity.trim());
          setSelectedLocationId(location.id);
          message.success(response.message);
        }
      } catch (error) {
        message.error('Ошибка при обновлении города');
      }
    }
    setIsEditingCity(false);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('access_token');
      setShowLogoutConfirm(false);
      message.success('Вы успешно вышли из системы');
      navigate('/login');
    } catch (error) {
      message.error('Ошибка при выходе из системы');
    }
  };

  const handleDeleteAccount = async () => {
    // TODO: Реализовать API для удаления аккаунта
    console.log('Удаление аккаунта');
    setShowDeleteConfirm(false);
    message.warning('Функция удаления аккаунта временно недоступна');
  };

  const handleDialogClick = (dialog: Dialog) => {
    const typedDialog: DialogItem = {
      id: dialog.id,
      userName: dialog.userName,
      lastMessage: dialog.lastMessage,
      unreadCount: dialog.unreadCount,
      timestamp: dialog.timestamp,
      itemId: dialog.itemId,
      itemTitle: dialog.itemTitle,
      offerType: dialog.offerType,
      status: dialog.status
    };
    setSelectedDialog(typedDialog);
  };

  const handleRemoveAd = async (itemId: number) => {
    try {
      const ad = userAds.find(ad => ad.itemId === itemId);
      if (ad?.slug) {
        await publicationsApi.delete(ad.slug);
        setUserAds(prevAds => prevAds.filter(ad => ad.itemId !== itemId));
        message.success('Объявление удалено');
      }
    } catch (error) {
      message.error('Ошибка при удалении объявления');
    }
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      await favoritesApi.remove(favoriteId);
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      message.success('Удалено из избранного');
    } catch (error) {
      message.error('Ошибка при удалении из избранного');
    }
  };

  const handleOfferResponse = async (offerId: number, status: 'accepted' | 'rejected') => {
    // TODO: Реализовать API для ответа на предложения
    console.log(`Ответ на предложение ${offerId}: ${status}`);
    
    // Обновляем локальное состояние
    setIncomingOffers(prev => 
      prev.map(offer => 
        offer.id === offerId ? { ...offer, status } : offer
      )
    );
    message.success(`Предложение ${status === 'accepted' ? 'принято' : 'отклонено'}`);
  };

  const navigateToTab = (tab: 'ads' | 'messages' | 'offers') => {
    setActiveTab(tab);
    navigate(`/user-account${tab !== 'ads' ? `/${tab}` : ''}`);
  };

  const getPendingOffersCount = () => {
    return incomingOffers.filter(offer => offer.status === 'pending').length;
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await authApi.updateAvatar(file);
      setUserAvatar(response.user.profile_picture);
      message.success('Аватар обновлен');
    } catch (error) {
      message.error('Ошибка при обновлении аватара');
    }
  };

  // Получаем избранные объявления для отображения
  const getFavoriteAds = (): AdItem[] => {
    return favorites.map(fav => ({
      mainImage: fav.publication.main_image,
      itemId: fav.publication.id,
      title: fav.publication.name,
      exchangeItem: fav.publication.price === "0" ? "Бесплатно" : `Цена: ${fav.publication.price}`,
      userName: 'Автор', // Можно добавить получение имени автора если нужно
      isFree: fav.publication.price === "0",
      slug: fav.publication.slug
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 pl-[2rem]">Личный кабинет</h1>
      
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar 
              size={142}
              icon={!userAvatar && <UserOutlined />}
              src={userAvatar}
              className="bg-gray-300 mb-4"
            />
            
            <div className="mt-2 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAvatarUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="avatar-upload"
              />
              <label 
                htmlFor="avatar-upload" 
                className="text-blue-600 text-sm cursor-pointer hover:text-blue-800"
              >
                Изменить фото
              </label>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-2 w-full">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                  <Input
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onPressEnter={handleNameSave}
                    onBlur={handleNameSave}
                    autoFocus
                    className="flex-1"
                  />
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleNameSave}
                  >
                    OK
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-semibold text-gray-900">{userName}</span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleNameEditStart}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-8 w-full">
              {isEditingCity ? (
                <div className="flex items-center gap-2 w-full">
                  <Select
                    value={tempCity}
                    onChange={(value) => setTempCity(value as string)}
                    style={{ width: '100%' }}
                    showSearch
                    placeholder="Выберите город"
                    filterOption={(input, option) =>
                      (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {locations.map(location => (
                      <Option key={location.id} value={location.city}>
                        {location.city}
                      </Option>
                    ))}
                  </Select>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleCitySave}
                  >
                    OK
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-gray-600">{userCity}</span>
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={handleCityEditStart}
                    className="text-gray-400 hover:text-gray-600"
                  />
                </>
              )}
            </div>

            <div className="w-full space-y-1">
              <button
                className={`w-full text-left h-10 px-3 py-2 flex items-center justify-between rounded transition-colors ${
                  activeTab === 'offers' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => navigateToTab('offers')}
              >
                <span className="flex items-center">
                  <BellOutlined className="mr-2" />
                  Предложения
                </span>
                {getPendingOffersCount() > 0 && (
                  <Badge count={getPendingOffersCount()} size="small" />
                )}
              </button>
              
              <button
                className={`w-full text-left h-10 px-3 py-2 flex items-center justify-start rounded transition-colors ${
                  activeTab === 'messages' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => navigateToTab('messages')}
              >
                Сообщения
              </button>
              
              <button
                className={`w-full text-left h-10 px-3 py-2 flex items-center justify-start rounded transition-colors ${
                  activeTab === 'ads' 
                    ? 'bg-blue-50 text-blue-600 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => navigateToTab('ads')}
              >
                Мои объявления
              </button>
              
              <div className="h-px bg-gray-200 my-2"></div>
              
              <Button
                type="text"
                block
                className="text-left h-10 flex items-center justify-start text-gray-600 hover:text-gray-800"
                icon={<LogoutOutlined />}
                onClick={() => setShowLogoutConfirm(true)}
              >
                Выйти
              </Button>
              
              <Button
                type="text"
                danger
                block
                className="text-left h-10 flex items-center justify-start hover:text-red-700"
                icon={<DeleteOutlined />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Удалить аккаунт
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeTab === 'ads' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Мои объявления</h2>
                <button
                  onClick={() => navigate('/add-post')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Добавить объявление
                </button>
              </div>
              <div className="space-y-4">
                {userAds.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    У вас пока нет объявлений
                  </div>
                ) : (
                  userAds.map((item) => (
                    <ListingCard 
                      key={item.itemId}
                      title={item.title}
                      exchangeItem={item.exchangeItem}
                      userName={item.userName}
                      isFree={item.isFree}
                      onEdit={() => handleEditAd(item)}
                      onRemove={() => handleRemoveAd(item.itemId)}
                      mode="user-account"
                      mainImage={item.mainImage}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Входящие предложения</h2>
              
              {incomingOffers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  У вас пока нет новых предложений
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingOffers.map((offer) => (
                    <div key={offer.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Предложение от {offer.fromUserName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {offer.offerType === 'exchange' 
                              ? `Предлагает обмен на: ${offer.selectedItemTitle}` 
                              : 'Хочет забрать даром'}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          offer.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : offer.status === 'accepted'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {offer.status === 'pending' ? 'Ожидает ответа' : 
                           offer.status === 'accepted' ? 'Принято' : 'Отклонено'}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 mb-2">
                          <span className="font-medium">Ваш товар:</span> {offer.itemTitle}
                        </p>
                        <p className="text-sm text-gray-600">
                          Предложение получено: {new Date(offer.createdAt).toLocaleString('ru-RU')}
                        </p>
                      </div>
                      
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => handleOfferResponse(offer.id, 'accepted')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Принять
                          </Button>
                          <Button
                            danger
                            icon={<CloseOutlined />}
                            onClick={() => handleOfferResponse(offer.id, 'rejected')}
                          >
                            Отклонить
                          </Button>
                          <Button
                            onClick={() => {
                              navigateToTab('messages');
                            }}
                          >
                            Написать
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex gap-6">
              <div className="w-96">
                {/* Пока нет API для диалогов, оставляем заглушку */}
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-500 text-center">
                    Раздел сообщений будет доступен позже
                  </p>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-white rounded-lg border border-gray-200">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">Выберите диалог</p>
                    <p className="text-sm">или начните новый разговор</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Выйти из аккаунта"
        open={showLogoutConfirm}
        onOk={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
        okText="Выйти"
        cancelText="Отмена"
        centered
      >
        <p>Вы уверены, что хотите выйти из аккаунта?</p>
      </Modal>

      <Modal
        title="Удалить аккаунт"
        open={showDeleteConfirm}
        onOk={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        okText="Удалить"
        cancelText="Отмена"
        okButtonProps={{ danger: true }}
        centered
      >
        <p className="text-red-600 font-medium mb-2">Внимание! Это действие нельзя отменить.</p>
        <p>Все ваши данные будут удалены безвозвратно.</p>
        <p>Вы уверены, что хотите удалить аккаунт?</p>
      </Modal>
    </div>
  );
};

export default UserAccount;