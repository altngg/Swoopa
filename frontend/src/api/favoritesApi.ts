import apiClient from "./apiClient";

export interface Favorite {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  main_image: string | null;
  publication_type: number;
  status: number;
  author_id: number;
  author_username: string;
  created_at: string;
} // change to imported publication interface cause code duplication

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

  getMyFavorites: async (): Promise<Favorite[]> => {
    const response = await apiClient.get("/main/favorites/my/");
    console.log(response.data);

    return response.data;
  },
};
