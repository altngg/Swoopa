import apiClient from "./apiClient";

export interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
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
  publication_images?: File[];
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

  getUserPublications: async (): Promise<Publication[]> => {
    const response = await apiClient.get("/main/publications/my/");
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
    const formData = new FormData();

    // возможно можно вынести одну и ту же логику в отдельную функцию
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "additional_images" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("additional_images", file);
            }
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.post(
      "/main/publications/create/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("response", response);

    return response.data;
  },

  updatePublication: async (
    slug: string,
    data: Partial<CreatePublicationData>
  ): Promise<Publication> => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "additional_images" && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof File) {
              formData.append("additional_images", file);
            }
          });
        } else if (key === "images_to_delete_ids" && Array.isArray(value)) {
          value.forEach((id) => {
            formData.append("images_to_delete_ids", id);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.patch(
      `/main/publications/${slug}/edit/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
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
    await apiClient.delete(`/main/publications/${slug}/edit/`);
  },

  search: async (query: string): Promise<Publication[]> => {
    const response = await apiClient.get(
      `/main/publications/search?q=${query}`
    );
    return response.data;
  },
};
