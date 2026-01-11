import '../index.css'
import { EnvironmentOutlined, HeartFilled, MessageOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { Modal, Input, Spin } from 'antd';
import { authApi } from '../api/authApi';

function Navbar() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Москва');
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [availableCities, setAvailableCities] = useState<Array<{id: number, city: string}>>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Простая проверка - есть токен или нет
  const isLoggedIn = !!localStorage.getItem('access_token');
  
  useEffect(() => {
    loadCities();
    
    const savedCity = localStorage.getItem('selected_city');
    const savedCityId = localStorage.getItem('selected_city_id');
    if (savedCity) {
      setSelectedCity(savedCity);
      if (savedCityId) {
        setSelectedCityId(parseInt(savedCityId));
      }
    }
  }, []);

  const loadCities = async () => {
    try {
      setLoadingCities(true);
      const cities = await authApi.getLocations();
      setAvailableCities(cities);
      
      const savedCityId = localStorage.getItem('selected_city_id');
      if (savedCityId) {
        const city = cities.find(c => c.id === parseInt(savedCityId));
        if (city) {
          setSelectedCity(city.city);
          setSelectedCityId(city.id);
        }
      } else if (cities.length > 0) {
        setSelectedCity(cities[0].city);
        setSelectedCityId(cities[0].id);
        localStorage.setItem('selected_city', cities[0].city);
        localStorage.setItem('selected_city_id', cities[0].id.toString());
      }
    } catch (error) {
      console.error('Ошибка при загрузке городов:', error);
      setAvailableCities([
        { id: 1, city: 'Москва' },
        { id: 2, city: 'Санкт-Петербург' },
        { id: 3, city: 'Новосибирск' },
        { id: 4, city: 'Екатеринбург' },
        { id: 5, city: 'Казань' },
      ]);
    } finally {
      setLoadingCities(false);
    }
  };

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

  const handleCitySelect = (cityId: number, cityName: string) => {
    setSelectedCity(cityName);
    setSelectedCityId(cityId);
    setIsCityModalOpen(false);
    setSearchCity('');
    
    localStorage.setItem('selected_city', cityName);
    localStorage.setItem('selected_city_id', cityId.toString());
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    navigate('/login');
  };

  const filteredCities = availableCities.filter(city =>
    city.city.toLowerCase().includes(searchCity.toLowerCase())
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
                paddingRight: '1rem',
                color: '#3b82f6'
              }}/>
            </div>
            <button 
              onClick={handleLogout}
              className="text-[1rem] pr-[2.5rem] font-inter cursor-pointer hover:text-blue-600 transition-colors"
            >
              Выйти
            </button>
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
            {loadingCities ? (
              <div className="text-center py-4">
                <Spin size="small" />
                <p className="text-gray-500 mt-2">Загрузка городов...</p>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                Город не найден
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCityId === city.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleCitySelect(city.id, city.city)}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        selectedCityId === city.id ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {city.city}
                      </span>
                      {selectedCityId === city.id && (
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