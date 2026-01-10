import apiClient from './apiClient';

export interface Favorite {
  id: number;
  publication_id: number;
  user_id: number;
  publication: {
    id: number;
    name: string;
    slug: string;
    price: string;
    description: string;
    main_image: string | null;
    publication_type: number;
    status: number;
    author: number;
    created_at: string;
  };
}

export const favoritesApi = {
  // Добавление в избранное
  add: async (slug: string): Promise<{ message: string; favorite_id: number }> => {
    const response = await apiClient.post('/main/favorites/add/', { slug });
    return response.data;
  },

  // Удаление из избранного
  remove: async (favoriteId: number): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/main/favorites/remove/${favoriteId}`);
    return response.data;
  },

  // Получение избранных текущего пользователя
  getMyFavorites: async (): Promise<Favorite[]> => {
    const response = await apiClient.get('/main/favorites/my/');
    return response.data;
  },
};