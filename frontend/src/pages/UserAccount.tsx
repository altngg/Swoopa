import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input, Modal } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import DialoguesList from '../components/DialoguesList';
import DialogueWindow from '../components/DialogueWindow';
import ListingCard from '../components/ListingCard';

interface UserAccountProps {
  initialTab?: 'ads' | 'messages';
}

interface AdItem {
  itemId: number;
  title: string;
  exchangeItem: string;
  userName: string;
}

interface DialogItem {
  id: string;
  userName: string;
  lastMessage: string;
  unreadCount?: number;
  timestamp: string;
}

const UserAccount: React.FC<UserAccountProps> = ({ initialTab = 'ads' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ads' | 'messages'>(initialTab);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);
  const [userName, setUserName] = useState('Максим Нахивич');
  const [userCity, setUserCity] = useState('Москва');
  const [tempName, setTempName] = useState(userName);
  const [tempCity, setTempCity] = useState(userCity);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Моки для примера
  const userAds: AdItem[] = [
    { 
      itemId: 1, 
      title: 'Мока кофеварка', 
      exchangeItem: 'Урок английского', 
      userName: 'Максим' 
    },
    { 
      itemId: 2, 
      title: 'Книги по программированию', 
      exchangeItem: 'Кофемашина', 
      userName: 'Максим' 
    },
  ];

  const mockDialogs: DialogItem[] = [
    {
      id: '1',
      userName: 'Петр',
      lastMessage: 'Хей, вам еще интересен товар?',
      unreadCount: 2,
      timestamp: '10:30 AM'
    },
    {
      id: '2', 
      userName: 'Ссаныч',
      lastMessage: 'Спасиб за сделку, книга класс',
      timestamp: 'Вчера'
    },
  ];

  React.useEffect(() => {
    if (location.pathname === '/user-account/messages') {
      setActiveTab('messages');
    } else if (location.pathname === '/user-account') {
      setActiveTab('ads');
    }
  }, [location]);

  const handleOpenChat = (itemId: number) => {
    setSelectedChat(itemId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
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
    // Реализация выхода
    console.log('Выход из аккаунта');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const handleDeleteAccount = () => {
    // Реализация удаления аккаунта
    console.log('Удаление аккаунта');
    setShowDeleteConfirm(false);
    navigate('/');
  };

  const handleDialogClick = (dialog: DialogItem) => {
    const dialogId = parseInt(dialog.id);
    if (!isNaN(dialogId)) {
      setSelectedChat(dialogId);
    }
  };

  const handleRemoveAd = (itemId: number) => {
    // Логика удаления объявления
    console.log('Удалить объявление', itemId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Личный кабинет</h1>
      
      <div className="flex gap-6">
        {/* Левая панель с профилем */}
        <div className="w-64 flex-shrink-0 bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center mb-6">
            {/* Круглая иконка профиля 142x142 */}
            <Avatar 
              size={142}
              icon={<UserOutlined />}
              className="bg-gray-300 mb-4"
            />
            
            {/* Имя пользователя с иконкой редактирования */}
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

            {/* Город с иконкой редактирования */}
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

            {/* Навигационное меню */}
            <div className="w-full space-y-4">
              <Button
                type={activeTab === 'messages' ? 'primary' : 'text'}
                block
                className="text-left h-auto py-2 flex items-center justify-start"
                onClick={() => {
                  setActiveTab('messages');
                  navigate('/user-account/messages');
                }}
              >
                Сообщения
              </Button>
              
              <Button
                type={activeTab === 'ads' ? 'primary' : 'text'}
                block
                className="text-left h-auto py-2 flex items-center justify-start"
                onClick={() => {
                  setActiveTab('ads');
                  navigate('/user-account');
                }}
              >
                Мои объявления
              </Button>
              
              <Button
                type="text"
                block
                className="text-left h-auto py-2 flex items-center justify-start text-gray-600"
                icon={<LogoutOutlined />}
                onClick={() => setShowLogoutConfirm(true)}
              >
                Выйти
              </Button>
              
              <Button
                type="text"
                danger
                block
                className="text-left h-auto py-2 flex items-center justify-start"
                icon={<DeleteOutlined />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Удалить аккаунт
              </Button>
            </div>
          </div>
        </div>

        {/* Правая панель с контентом */}
        <div className="flex-1">
          {activeTab === 'ads' && (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Мои объявления</h2>
              <div className="space-y-4">
                {userAds.map((item) => (
                  <ListingCard 
                    key={item.itemId}
                    title={item.title}
                    exchangeItem={item.exchangeItem}
                    userName={item.userName}
                    onOpenChat={() => handleOpenChat(item.itemId)}
                    onRemove={() => handleRemoveAd(item.itemId)}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="flex gap-6">
              {/* Список диалогов */}
              <div className="w-96">
                <DialoguesList 
                  dialogs={mockDialogs}
                  onDialogClick={handleDialogClick}
                />
              </div>
              
              {/* Окно чата */}
              <div className="flex-1">
                {selectedChat ? (
                  <div className="h-[calc(100vh-200px)]">
                    <DialogueWindow 
                      onClose={handleCloseChat}
                      itemId={selectedChat}
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

      {/* Модальное окно подтверждения выхода */}
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

      {/* Модальное окно подтверждения удаления аккаунта */}
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