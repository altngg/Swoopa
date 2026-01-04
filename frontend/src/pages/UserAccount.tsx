import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal, Badge } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, DeleteOutlined, BellOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import DialoguesList from '../components/DialoguesList';
import DialogueWindow from '../components/DialogueWindow';
import ListingCard from '../components/ListingCard';

interface UserAccountProps {
  initialTab?: 'ads' | 'messages' | 'offers';
}

interface AdItem {
  itemId: number;
  title: string;
  exchangeItem: string;
  userName: string;
  isFree?: boolean;
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

type DialogItem = Dialog

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

const UserAccount: React.FC<UserAccountProps> = ({ initialTab = 'ads' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ads' | 'messages' | 'offers'>(initialTab);
  const [selectedDialog, setSelectedDialog] = useState<DialogItem | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [userName, setUserName] = useState('Максим Нахивич');
  const [userCity, setUserCity] = useState('Москва');
  const [tempName, setTempName] = useState(userName);
  const [tempCity, setTempCity] = useState(userCity);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [incomingOffers, setIncomingOffers] = useState<OfferItem[]>([]);
  
  const [userAds, setUserAds] = useState<AdItem[]>([
    { 
      itemId: 1, 
      title: 'Мока кофеварка', 
      exchangeItem: 'Урок английского', 
      userName: 'Максим',
      isFree: false
    },
    { 
      itemId: 2, 
      title: 'Книги по программированию', 
      exchangeItem: 'Кофемашина', 
      userName: 'Максим',
      isFree: false
    },
    { 
      itemId: 3, 
      title: 'Старый журнальный столик', 
      exchangeItem: '', 
      userName: 'Максим',
      isFree: true
    },
  ]);

  const mockDialogs: Dialog[] = [
    {
      id: '1',
      userName: 'Петр',
      lastMessage: 'Хей, вам еще интересен товар?',
      unreadCount: 2,
      timestamp: '10:30 AM',
      itemId: 1,
      itemTitle: 'Мока кофеварка',
      offerType: 'exchange',
      status: 'pending'
    },
    {
      id: '2', 
      userName: 'Ссаныч',
      lastMessage: 'Спасиб за сделку, книга класс',
      timestamp: 'Вчера',
      itemId: 2,
      itemTitle: 'Книги по программированию',
      offerType: 'exchange',
      status: 'accepted'
    },
    {
      id: '3',
      userName: 'Анна',
      lastMessage: 'Когда можем встретиться?',
      unreadCount: 1,
      timestamp: 'Сегодня',
      itemId: 3,
      itemTitle: 'Старый журнальный столик',
      offerType: 'free',
      status: 'pending'
    },
  ];

  useEffect(() => {
    // Загрузка входящих предложений
    loadIncomingOffers();
    
    // Определение активной вкладки из URL
    if (location.pathname === '/user-account/messages') {
      setActiveTab('messages');
    } else if (location.pathname === '/user-account/offers') {
      setActiveTab('offers');
    } else {
      setActiveTab('ads');
    }
  }, [location]);

  const loadIncomingOffers = () => {
    // Мок данные входящих предложений
    const mockOffers: OfferItem[] = [
      {
        id: 1,
        fromUserId: 'user456',
        fromUserName: 'Анна Петрова',
        toUserId: 'user123',
        itemId: 1,
        itemTitle: 'Мока кофеварка',
        offerType: 'exchange',
        selectedItemId: 4,
        selectedItemTitle: 'Книга "JavaScript для профессионалов"',
        status: 'pending',
        createdAt: '2024-01-15 14:30'
      },
      {
        id: 2,
        fromUserId: 'user789',
        fromUserName: 'Иван Сидоров',
        toUserId: 'user123',
        itemId: 3,
        itemTitle: 'Старый журнальный столик',
        offerType: 'free',
        status: 'pending',
        createdAt: '2024-01-16 09:15'
      }
    ];
    setIncomingOffers(mockOffers);
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

  const handleNameSave = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleCitySave = () => {
    if (tempCity.trim()) {
      setUserCity(tempCity.trim());
    }
    setIsEditingCity(false);
  };

  const handleLogout = () => {
    console.log('Выход из аккаунта');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    console.log('Удаление аккаунта');
    setShowDeleteConfirm(false);
    navigate('/');
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

  const handleRemoveAd = (itemId: number) => {
    setUserAds(prevAds => prevAds.filter(ad => ad.itemId !== itemId));
  };

  const handleOfferResponse = (offerId: number, status: 'accepted' | 'rejected') => {
    // Обновление статуса предложения
    setIncomingOffers(prev => 
      prev.map(offer => 
        offer.id === offerId ? { ...offer, status } : offer
      )
    );

    // Создание диалога при принятии предложения
    if (status === 'accepted') {
      const offer = incomingOffers.find(o => o.id === offerId);
      if (offer) {
        createDialogFromOffer(offer);
      }
    }
  };

  const createDialogFromOffer = (offer: OfferItem) => {
    // Создание нового диалога из предложения
    const newDialog: Dialog = {
      id: `offer-${offer.id}`,
      userName: offer.fromUserName,
      lastMessage: `Предложение ${offer.offerType === 'exchange' ? 'обмена' : 'забрать даром'}`,
      timestamp: 'Сейчас',
      itemId: offer.itemId,
      itemTitle: offer.itemTitle,
      offerType: offer.offerType,
      status: 'accepted'
    };

    // Здесь должен быть API запрос для сохранения диалога
    console.log('Создан диалог:', newDialog);
    
    // Добавляем новый диалог в список
    // В реальном приложении здесь был бы запрос к API
  };

  const navigateToTab = (tab: 'ads' | 'messages' | 'offers') => {
    setActiveTab(tab);
    navigate(`/user-account${tab !== 'ads' ? `/${tab}` : ''}`);
  };

  const getPendingOffersCount = () => {
    return incomingOffers.filter(offer => offer.status === 'pending').length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 pl-[2rem]">Личный кабинет</h1>
      
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            <Avatar 
              size={142}
              icon={<UserOutlined />}
              className="bg-gray-300 mb-4"
            />
            
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
                  <Input
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    onPressEnter={handleCitySave}
                    onBlur={handleCitySave}
                    autoFocus
                    className="flex-1"
                  />
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
                              // Переход к диалогу или создание нового
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
                <DialoguesList 
                  dialogs={mockDialogs}
                  onDialogClick={handleDialogClick}
                  selectedDialogId={selectedDialog?.id}
                />
              </div>
              
              <div className="flex-1">
                {selectedDialog ? (
                  <div className="h-[calc(100vh-200px)] pb-3">
                    <DialogueWindow 
                      onClose={handleCloseChat}
                      itemId={selectedDialog.itemId}
                      dialogUserName={selectedDialog.userName}
                      lastMessage={selectedDialog.lastMessage}
                      offerType={selectedDialog.offerType}
                      offerStatus={selectedDialog.status}
                    />
                  </div>
                ) : (
                  <div className="h-[calc(100vh-200px)] flex items-center justify-center bg-white rounded-lg border border-gray-200">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">Выберите диалог</p>
                      <p className="text-sm">или начните новый разговор</p>
                    </div>
                  </div>
                )}
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