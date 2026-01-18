/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled, MessageOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Gallery from "../components/Gallery";
import ButtonFilled from "../components/ButtonFilled";
import { Modal, message, Spin } from "antd";
import { publicationsApi } from "../api/publicationsApi";
import { chatsApi } from '../api/chatsApi';
import { authApi } from '../api/authApi';

interface PublicationImage {
  id: number;
  image: string;
  publication: number;
  order: number;
}

interface Publication {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  author_username: string;
  author_id: number;
  created_at: string;
  images: PublicationImage[];
}

interface Chat {
  chat: {
    id: number;
    publication: {
      id: number;
      name: string;
    };
    author_username: string;
  };
}

const ItemPreview: React.FC<{ isFree?: boolean }> = ({ isFree = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [itemData, setItemData] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [existingChats, setExistingChats] = useState<Chat[]>([]);
  const [checkingChats, setCheckingChats] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Загружаем пользователя
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const user = await authApi.getCurrentUser();
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
      }
    };
    loadUser();
  }, []);

  // Загружаем данные товара
  useEffect(() => {
    const loadItemData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const publication = await publicationsApi.getPublicationBySlug(id);
        setItemData(publication);
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        message.error("Не удалось загрузить товар");
      } finally {
        setLoading(false);
      }
    };
    loadItemData();
  }, [id]);

  // После загрузки пользователя и товара проверяем существующие чаты
  useEffect(() => {
    const checkExistingChats = async () => {
      if (!currentUser || !itemData || currentUser.id === itemData.author_id) {
        return;
      }

      setCheckingChats(true);
      try {
        // Загружаем ВСЕ чаты пользователя
        const allChats = await chatsApi.getMyChats();
        
        // Ищем чат с этой публикацией
        const existingChat = allChats.find(
          (chat: any) => chat.chat.publication.id === itemData.id
        );
        
        setExistingChats(allChats);
        
        if (existingChat) {
          console.log("Чат уже существует, ID:", existingChat.chat.id);
        } else {
          console.log("Чат не найден, можно создать новый");
        }
      } catch (error) {
        console.error("Ошибка при проверке чатов:", error);
      } finally {
        setCheckingChats(false);
      }
    };

    if (currentUser && itemData) {
      checkExistingChats();
    }
  }, [currentUser, itemData]);

  // Найти существующий чат для этой публикации
  const findExistingChatForPublication = () => {
    if (!itemData || existingChats.length === 0) return null;
    return existingChats.find(chat => chat.chat.publication.id === itemData.id);
  };

  const existingChat = findExistingChatForPublication();

  // Функция создания чата (ВЫЗЫВАЕТСЯ ТОЛЬКО ЕСЛИ ЧАТА ЕЩЕ НЕТ)
  const handleCreateChat = async (offerType: "exchange" | "free", selectedItemId?: number) => {
    if (!itemData || !currentUser) {
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    if (currentUser.id === itemData.author_id) {
      message.warning("Нельзя создать чат с самим собой");
      return;
    }

    // Если чат уже существует - переходим в него
    if (existingChat) {
      navigate(`/user-account/messages/${existingChat.chat.id}`);
      return;
    }

    setIsCreatingChat(true);
    
    try {
      console.log("🟡 СОЗДАЕМ НОВЫЙ ЧАТ для публикации", itemData.id);
      
      // 1. Создаем чат
      const chatData = await chatsApi.getChatByPublicationId(
        itemData.id,
        itemData.author_username
      );
      
      console.log("✅ Чат создан:", chatData);
      
      // 2. Добавляем первое сообщение
      const greetingMessage = offerType === "exchange" 
        ? "Здравствуйте, хочу поговорить об обмене." 
        : "Здравствуйте, хочу забрать даром.";
      
      console.log("🟡 Добавляем первое сообщение:", greetingMessage);
      await chatsApi.addMessage(chatData.chat.id, greetingMessage);
      console.log("✅ Первое сообщение добавлено");
      
      // 3. Переходим в чат с ID в URL
      navigate(`/user-account/messages/${chatData.chat.id}`);
      
      message.success("Чат создан! Переход к сообщениям...");
      
    } catch (error: any) {
      console.error("❌ Ошибка при создании чата:", error);
      
      // Если чат уже существует (статус 200)
      if (error.response?.status === 200 || error.response?.status === 201) {
        const chatData = error.response.data;
        navigate(`/user-account/messages/${chatData.chat.id}`);
        message.info("Чат уже существует. Переход к сообщениям...");
      } else {
        message.error("Ошибка при создании чата");
      }
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleExchangeClick = () => {
    if (!currentUser) {
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    // Если чат уже существует - переходим в него
    if (existingChat) {
      navigate(`/user-account/messages/${existingChat.chat.id}`);
      return;
    }

    const isFreeItem = itemData?.price.toLowerCase().includes("бесплатно") || 
                      itemData?.price.toLowerCase() === "free" ||
                      itemData?.price === "0";
    
    if (isFreeItem) {
      handleCreateChat("free");
    } else {
      setShowExchangeModal(true);
    }
  };

  const handleFreeTakeClick = () => {
    if (!currentUser) {
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    // Если чат уже существует - переходим в него
    if (existingChat) {
      navigate(`/user-account/messages/${existingChat.chat.id}`);
      return;
    }

    handleCreateChat("free");
  };

  const handleGoToChat = () => {
    if (existingChat) {
      navigate(`/user-account/messages/${existingChat.chat.id}`);
    }
  };

  const handleConfirmExchange = () => {
    if (!selectedItemId) {
      message.warning("Выберите предмет для обмена");
      return;
    }
    handleCreateChat("exchange", selectedItemId);
    setShowExchangeModal(false);
  };

  if (loading) {
    return (
      <div className="px-[20rem] py-0">
        <div className="w-full text-center py-12">
          <Spin />
        </div>
      </div>
    );
  }

  if (!itemData) {
    return (
      <div className="px-[20rem] py-0">
        <div className="w-full text-center py-12">
          <p>Товар не найден</p>
        </div>
      </div>
    );
  }

  const isFreeItem = itemData.price.toLowerCase().includes("бесплатно") ||
                    itemData.price.toLowerCase() === "free" ||
                    itemData.price === "0";

  // Определяем что показывать на кнопке
  const getButtonContent = () => {
    if (checkingChats) {
      return { text: "Проверка...", isExisting: false, disabled: true };
    }

    if (existingChat) {
      return { text: "Перейти в чат", isExisting: true, disabled: false };
    }

    if (isCreatingChat) {
      return { text: "Создание чата...", isExisting: false, disabled: true };
    }

    return {
      text: isFreeItem ? "Забрать даром" : "Предложить обмен",
      isExisting: false,
      disabled: false
    };
  };

  const button = getButtonContent();

  return (
    <div className="px-[20rem] py-0">
      <div className="w-full">
        <div className="flex gap-[5rem] mb-12">
          <div className="flex-1">
            <Gallery images={itemData.images?.map(img => 
              img.image.startsWith("http") ? img.image : `http://localhost:8000${img.image}`
            ) || []} />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="font-semibold text-[1.5rem] text-gray-900 mb-2">
                  {itemData.name}
                </h1>
                <p className="text-[1rem] text-gray-600">
                  {new Date(itemData.created_at).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <HeartOutlined className="text-gray-600 text-[1.5rem]" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-[1.25rem] text-gray-900 mb-1">
                {isFreeItem ? "Отдам даром" : `Обмен на ${itemData.price}`}
              </p>
              <p className="text-[1.25rem] text-gray-600">
                {itemData.author_username}
              </p>
            </div>

            <div className="mt-[3rem] mb-4">
              {button.isExisting ? (
                <ButtonFilled
                  onClick={handleGoToChat}
                  disabled={button.disabled}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <MessageOutlined className="mr-2" />
                  {button.text}
                </ButtonFilled>
              ) : isFreeItem ? (
                <ButtonFilled
                  onClick={handleFreeTakeClick}
                  disabled={button.disabled}
                  className={isCreatingChat ? "bg-blue-400 hover:bg-blue-500" : ""}
                >
                  {button.text}
                </ButtonFilled>
              ) : (
                <ButtonFilled
                  onClick={handleExchangeClick}
                  disabled={button.disabled}
                  className={isCreatingChat ? "bg-blue-400 hover:bg-blue-500" : ""}
                >
                  {button.text}
                </ButtonFilled>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-[1.25rem] text-gray-600 mb-4">Описание</h2>
          <p className="text-[1.25rem] text-gray-900">{itemData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ItemPreview;