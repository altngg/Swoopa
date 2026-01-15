import apiClient from "./apiClient";

export interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  main_image: string | null;
  publication_type_name: string;
  publication_type?: number;
  status_name: string;
  status?: number;
  author_username: string;
  author_id: number;
  created_at: string;
  images: PublicationImage[]; // Изменить здесь тоже
}

export interface CreatePublicationData {
  name: string;
  price: string;
  description: string;
  publication_type_slug: string;
  status: number;
  main_image?: string | null; // в целом считаю что это поле можно удалить с бэка, и фронт будет тянуть просто первую фотку из всех
  publication_images?: string[] | null;
}

export interface PublicationImage {
  id: number;
  image: string;
  publication: number;
  order: number;
}

export interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  main_image: string | null;
  publication_type_name: string;
  publication_type?: number;
  status_name: string;
  status?: number;
  author_username: string;
  author_id: number;
  created_at: string;
  images: PublicationImage[];
}

export const publicationsApi = {
  getAll: async (): Promise<Publication[]> => {
    const response = await apiClient.get("/main/publications");
    return response.data;
  },

  getPublicationBySlug: async (slug: string): Promise<Publication> => {
    const response = await apiClient.get(`/main/publications/${slug}`);
    return response.data;
  },

  createPublication: async (
    data: CreatePublicationData
  ): Promise<Publication> => {
    console.log("data", data);

    const response = await apiClient.post("/main/publications/create/", data);
    console.log("response", response);

    return response.data;
  },

  updatePublication: async (
    slug: string,
    data: Partial<CreatePublicationData>
  ): Promise<Publication> => {
    const response = await apiClient.patch(
      `/main/publications/${slug}/edit/`,
      data
    );
    return response.data;
  },

  changeStatus: async (
    slug: string,
    status_id: number
  ): Promise<Publication> => {
    const response = await apiClient.patch(
      `/main/publications/${slug}/change-status`,
      { status_id }
    );
    return response.data;
  },

  deletePublication: async (slug: string): Promise<void> => {
    await apiClient.delete(`/main/publications/${slug}`);
  },

  search: async (query: string): Promise<Publication[]> => {
    const response = await apiClient.get(
      `/main/publications/search?q=${query}`
    );
    return response.data;
  },
};
