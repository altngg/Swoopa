/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getImageUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Интерфейсы
interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  location: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  location: {
    id: number;
    city: string;
  };
  profile_picture: string | null;
  date_joined: string;
}

interface AuthResponse {
  message: string;
  user: User;
  access_token?: string;
  refresh_token?: string;
}

// Главная функция API
const authApi = {
  // Логин с fetch для отладки
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log('🔐 LOGIN REQUEST to /users/login/');
    console.log('📤 Data:', { username: data.username });
    
    try {
      // Используем fetch для отладки
      const rawResponse = await fetch(`${API_BASE_URL}/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseText = await rawResponse.text();
      console.log('📥 Raw response text:', responseText);
      
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ FAILED TO PARSE JSON:', e);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }
      
      console.log('📦 Parsed response:', parsedData);
      
      // Проверяем есть ли токен
      if (!parsedData.access_token) {
        console.error('❌ NO ACCESS TOKEN! Response keys:', Object.keys(parsedData));
        console.error('Full response:', parsedData);
        throw new Error('Сервер не вернул токен');
      }
      
      // Проверяем что токен не "undefined"
      if (parsedData.access_token === 'undefined' || parsedData.access_token === 'null') {
        console.error('❌ TOKEN IS "undefined" OR "null"!');
        throw new Error('Некорректный токен от сервера');
      }
      
      // Сохраняем токен
      localStorage.setItem('access_token', parsedData.access_token);
      if (parsedData.refresh_token) {
        localStorage.setItem('refresh_token', parsedData.refresh_token);
      }
      
      console.log('✅ TOKEN SAVED SUCCESSFULLY');
      console.log('🔑 Token preview:', parsedData.access_token.substring(0, 20) + '...');
      
      return parsedData;
    } catch (error: any) {
      console.error('❌ LOGIN ERROR:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw error;
    }
  },

  // Регистрация
  register: async (data: RegisterData): Promise<AuthResponse> => {
    console.log('📝 REGISTER REQUEST to /users/register/');
    
    try {
      const rawResponse = await fetch(`${API_BASE_URL}/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseText = await rawResponse.text();
      console.log('📥 Raw register response:', responseText);
      
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ FAILED TO PARSE JSON:', e);
        throw new Error(`Invalid JSON: ${responseText.substring(0, 100)}`);
      }
      
      if (!parsedData.access_token) {
        console.error('❌ NO TOKEN IN REGISTER RESPONSE!');
        throw new Error('Нет токена в ответе регистрации');
      }
      
      localStorage.setItem('access_token', parsedData.access_token);
      if (parsedData.refresh_token) {
        localStorage.setItem('refresh_token', parsedData.refresh_token);
      }
      
      console.log('✅ REGISTER SUCCESS, Token saved');
      
      return parsedData;
    } catch (error: any) {
      console.error('❌ REGISTER ERROR:', error);
      throw error;
    }
  },

  // Выход
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/users/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Получение текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/users/me/');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      
      throw error;
    }
  },

  // Обновление данных пользователя
  updateUser: async (data: { 
    username?: string; 
    email?: string; 
    location_id?: number 
  }): Promise<{ message: string; user: User }> => {
    try {
      const response = await apiClient.patch('/users/me/update/', data);
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Обновление аватара
  updateAvatar: async (file: File): Promise<{ message: string; user: User }> => {
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);
      
      const response = await apiClient.post('/users/me/update-picture/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Update avatar error:', error);
      throw error;
    }
  },

  // Получение всех локаций
  getLocations: async (): Promise<Array<{ id: number; city: string }>> => {
    try {
      const response = await apiClient.get('/users/locations/');
      return response.data;
    } catch (error: any) {
      console.error('Get locations error:', error);
      throw error;
    }
  },

  // Проверка авторизации
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token && token !== 'undefined' && token !== 'null';
  },
  
  getUserById: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};
