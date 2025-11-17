import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UserAccountProps {
  initialTab?: 'ads' | 'messages';
}

const UserAccount: React.FC<UserAccountProps> = ({ initialTab = 'ads' }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (location.pathname === '/user-account/messages') {
      setActiveTab('messages');
    } else if (location.pathname === '/user-account') {
      setActiveTab('ads');
    }
  }, [location]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Личный кабинет</h1>
      <div className="flex border-b">
        <button
          className={`px-4 py-2 ${activeTab === 'ads' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('ads')}
        >
          Мои объявления
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'messages' ? 'border-b-2 border-blue-500' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Сообщения
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'ads' && (
          <div>
            <p>Мои объявления</p>
          </div>
        )}
        {activeTab === 'messages' && (
          <div>
            <p>Сообщения</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;