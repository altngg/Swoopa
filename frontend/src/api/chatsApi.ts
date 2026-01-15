import apiClient from "./apiClient";

export interface Message {
  id: number;
  author_username: string;
  text: string;
  created_at: string;
}

export interface Chat {
  chat: {
    id: number;
    publication: {
      id: number;
      name: string;
      slug: string;
      price: string;
      description: string;
      main_image: string | null;
      publication_type: number;
      status: number;
      author_username: string;
      created_at: string;
    };
    created_at: string;
    author_username: string;
  };
  messages: Message[];
}

export const chatsApi = {
  // add message + create offer
  addMessage: async (chat_id: number, text: string): Promise<Message> => {
    const response = await apiClient.post("/chats/add-message/", {
      chat_id,
      text,
    });
    console.log(response);

    return response.data;
  },

  // Get my messages
  getMyMessages: async (): Promise<Chat[]> => {
    const response = await apiClient.get("/chats/my");
    return response.data;
  },

  // Get chat by publication id
  getChatByPublicationId: async (
    publicationId: number,
    author_username: string
  ): Promise<Chat> => {
    const response = await apiClient.get(
      `/chats/${author_username}/${publicationId}/`
    );
    console.log(response);

    return response.data;
  },

  // Can get chat by offer id too, but not here probably
};
