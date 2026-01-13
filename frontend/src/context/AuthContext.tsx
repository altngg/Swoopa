/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, refreshToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Инициализируем состояние на основе наличия токена в localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("access_token");
    return !!token;
  });

  useEffect(() => {
    console.log("AuthProvider mounted, isLoggedIn:", isLoggedIn);
    console.log("Token exists:", localStorage.getItem("access_token"));

    // Дополнительная проверка при монтировании
    const token = localStorage.getItem("access_token");
    if (token && !isLoggedIn) {
      console.log("Found token but state is false, correcting...");
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string, refreshToken?: string) => {
    localStorage.setItem("access_token", token);
    if (refreshToken) {
      localStorage.setItem("refresh_token", refreshToken);
    }
    setIsLoggedIn(true);
    console.log("User logged in, token saved");
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
