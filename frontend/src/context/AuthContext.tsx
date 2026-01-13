/* eslint-disable react-refresh/only-export-components */
// AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('access_token');
    const hasToken = !!token && token !== 'undefined' && token !== 'null' && token.length > 10;
    
    console.log('🔄 ИНИЦИАЛИЗАЦИЯ AuthProvider:', {
      token: token,
      hasToken: hasToken,
      tokenLength: token?.length,
      tokenIsUndefined: token === 'undefined',
      tokenIsNull: token === 'null',
      tokenType: typeof token
    });
    
    if (token === 'undefined' || token === 'null') {
      console.warn('⚠️ Found invalid token, removing it');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      return false;
    }
    
    return hasToken;
  });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('🚀 AuthProvider mounted', {
      isLoggedIn,
      token: token,
      tokenIsValid: token && token !== 'undefined' && token !== 'null',
      refresh_token: localStorage.getItem('refresh_token')
    });
  }, []);

  const login = (token: string, refreshToken?: string) => {
    // ВАЖНО: Проверяем что токен не "undefined"
    if (!token || token === 'undefined' || token === 'null') {
      console.error('❌ INVALID TOKEN PROVIDED TO login():', token);
      throw new Error('Invalid token provided');
    }
    
    console.log('🔑 login() called with:', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      tokenType: typeof token,
      refreshTokenProvided: !!refreshToken
    });
    
    // Дополнительная проверка
    if (token.length < 10) {
      console.error('❌ Token too short:', token);
      throw new Error('Token too short');
    }
    
    localStorage.setItem('access_token', token);
    if (refreshToken && refreshToken !== 'undefined' && refreshToken !== 'null') {
      localStorage.setItem('refresh_token', refreshToken);
    }
    
    // Проверяем сохранение
    const savedToken = localStorage.getItem('access_token');
    console.log('✅ Token saved to localStorage:', {
      savedCorrectly: savedToken === token,
      savedLength: savedToken?.length,
      savedValue: savedToken?.substring(0, 20) + '...'
    });
    
    setIsLoggedIn(true);
  };

  const logout = () => {
    console.log('👋 Logout called');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  const getToken = (): string | null => {
    const token = localStorage.getItem('access_token');
    const isValid = token && token !== 'undefined' && token !== 'null';
    
    console.log('🔐 getToken():', {
      token: isValid ? token.substring(0, 20) + '...' : token,
      isValid: isValid,
      length: token?.length
    });
    
    return isValid ? token : null;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};