import apiClient from './apiClient';

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
  slug: string;
  price: string;
  description: string;
  publication_type: number;
  status?: number;
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
    const response = await apiClient.get('/main/publications');
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Publication> => {
    const response = await apiClient.get(`/main/publications/${slug}`);
    return response.data;
  },

  create: async (data: CreatePublicationData): Promise<Publication> => {
    const response = await apiClient.post('/main/publications', data);
    return response.data;
  },

  update: async (slug: string, data: Partial<CreatePublicationData>): Promise<Publication> => {
    const response = await apiClient.patch(`/main/publications/${slug}`, data);
    return response.data;
  },

  changeStatus: async (slug: string, status_id: number): Promise<Publication> => {
    const response = await apiClient.patch(`/main/publications/${slug}/change-status`, { status_id });
    return response.data;
  },

  delete: async (slug: string): Promise<void> => {
    await apiClient.delete(`/main/publications/${slug}`);
  },

  search: async (query: string): Promise<Publication[]> => {
    const response = await apiClient.get(`/main/publications/search?q=${query}`);
    return response.data;
  },
};