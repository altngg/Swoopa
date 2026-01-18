import apiClient from "./apiClient";
import type { Publication } from "./publicationsApi";

export const favoritesApi = {
  addToFavorites: async (
    slug: string
  ): Promise<{ message: string; favorite_id: number }> => {
    const response = await apiClient.post("/main/favorites/add/", { slug });
    return response.data;
  },

  removeFromFavorites: async (
    favoriteSlug: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.delete(
      `/main/favorites/remove/${favoriteSlug}/`
    );
    return response.data;
  },

  getMyFavorites: async (): Promise<Publication[]> => {
    const response = await apiClient.get("/main/favorites/my/");
    console.log(response.data);

    return response.data;
  },
};
