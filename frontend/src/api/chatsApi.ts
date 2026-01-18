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

  // Создание нового чата
  createChat: async (
    publicationId: number,
    author_username: string
  ): Promise<Chat> => {
    const response = await apiClient.post("/chats/create/", {
      publication_id: publicationId,
      author_username: author_username
    });
    return response.data;
  },
  // add message + create offer
  addMessage: async (chat_id: number, text: string): Promise<Message> => {
    const response = await apiClient.post("/chats/add-message/", {
      chat_id,
      text,
    });
    return response.data;
  },

  getMyChats: async (): Promise<Chat[]> => {
    const response = await apiClient.get("/chats/my");
    return response.data;
  },


  getChatByPublicationId: async (
    publicationId: number,
    author_username: string
  ): Promise<Chat & { isNew?: boolean }> => {
    const response = await apiClient.get(
      `/chats/${author_username}/${publicationId}/`
    );
    
    // Добавляем флаг isNew на основе статуса ответа
    const chatData = response.data;
    chatData.isNew = response.status === 201; // 201 = Created, 200 = OK
    
    return chatData;
  },

  // Can get chat by offer id too, but not here probably
};
