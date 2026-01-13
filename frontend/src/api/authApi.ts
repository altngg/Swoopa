import apiClient from "./apiClient";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  location: number;
}

export interface User {
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

export interface AuthResponse {
  access: string;
  refresh: string;
}

export const authApi = {
  // Вход
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post("/token/", data);

    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
    }

    return response.data.refresh, response.data.access;
  },

  // Регистрация
  // тут бы возвращать код, который приходит в ответе, и если он 200, то входить
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post("/users/register/", data);
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response.data;
  },

  // Выход
  logout: async (): Promise<void> => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  // Получение текущего пользователя
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/users/me/");
    return response.data;
  },

  // Обновление данных пользователя
  updateUser: async (data: {
    username?: string;
    email?: string;
    location_id?: number;
  }): Promise<{ message: string; user: User }> => {
    const response = await apiClient.patch("/users/me/update/", data);
    return response.data;
  },

  // Обновление аватара
  updateAvatar: async (
    file: File
  ): Promise<{ message: string; user: User }> => {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await apiClient.post(
      "/users/me/update-picture/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Получение всех локаций
  getLocations: async (): Promise<Array<{ id: number; city: string }>> => {
    const response = await apiClient.get("/users/locations/");
    return response.data;
  },

  getUserById: async (userId: number): Promise<User> => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },
};
