import '../index.css'
import { EnvironmentOutlined, HeartFilled, MessageOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Modal, Input } from 'antd';

function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = false; // Временно false для тестирования логина
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  
  // Список доступных городов
  const availableCities = [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
    'Уфа',
    'Красноярск',
    'Воронеж',
    'Пермь',
    'Волгоград'
  ];

  const handleFavoritesClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/favorites');
  };

  const handleMessagesClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/user-account/messages');
  };

  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    navigate('/user-account');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/login?mode=register');
  };

  const handleCityClick = () => {
    setIsCityModalOpen(true);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    setSearchCity('');
    
    // Здесь можно добавить логику для изменения данных в зависимости от города
    console.log(`Выбран город: ${city}`);
  };

  const filteredCities = availableCities.filter(city =>
    city.toLowerCase().includes(searchCity.toLowerCase())
  );

  return (
    <>
      <nav className="flex items-center justify-between p-3 bg-white">
        <div className="flex items-center gap-3">
          <div 
            className="font-galindo ml-[2.5rem] text-[1.25rem] pt-[3px] cursor-pointer"
            onClick={() => navigate('/feed')}
          >
            SWOOPA
          </div>
          <div 
            className="flex items-center gap-1 cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleCityClick}
          >
            <EnvironmentOutlined style={{ fontSize: '20px', paddingLeft: '1rem' }}/>
            <span className="text-[1rem] pl-[0.05rem]">{selectedCity}</span>
            <DownOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
          </div>
        </div>
        
        {!isLoggedIn ? (
          <div className="flex items-center gap-4">
            <div className="flex gap-3 text-sm">
              <span 
                className="text-[1rem] pr-[0.5rem] font-inter cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleLoginClick}
              >
                Войти
              </span>
              <span 
                className="text-[1rem] pr-[1rem] mr-[2.5rem] font-inter cursor-pointer hover:text-blue-600 transition-colors"
                onClick={handleRegisterClick}
              >
                Зарегистрироваться
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="cursor-pointer" onClick={handleFavoritesClick}>
              <HeartFilled style={{ 
                fontSize: '20px', 
                paddingRight: '1rem',
                color: '#3b82f6'
              }}/>
            </div>
            <div className="flex gap-3 text-sm">
              <div className="cursor-pointer" onClick={handleMessagesClick}>
                <MessageOutlined style={{ 
                  fontSize: '20px', 
                  paddingRight: '1rem',
                  color: '#3b82f6'
                }}/>
              </div>
              <div className="cursor-pointer" onClick={handleUserClick}>
                <UserOutlined style={{ 
                  fontSize: '20px', 
                  paddingRight: '2.5rem',
                  color: '#3b82f6'
                }}/>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Модальное окно выбора города */}
      <Modal
        title="Выберите ваш город"
        open={isCityModalOpen}
        onCancel={() => {
          setIsCityModalOpen(false);
          setSearchCity('');
        }}
        footer={null}
        width={400}
      >
        <div className="py-4">
          <Input
            placeholder="Начните вводить название города"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            className="mb-4"
          />
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Город не найден
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCities.map((city) => (
                  <div
                    key={city}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCity === city
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleCitySelect(city)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        selectedCity === city ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {city}
                      </span>
                      {selectedCity === city && (
                        <span className="text-blue-500 text-sm">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Не нашли свой город?</p>
            <button
              onClick={() => {
                // Можно добавить функционал для предложения города
                console.log('Предложить город');
                setIsCityModalOpen(false);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Предложить добавление города
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;