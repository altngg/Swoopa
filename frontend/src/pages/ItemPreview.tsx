/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { HeartOutlined, HeartFilled, MessageOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import Gallery from "../components/Gallery";
import ButtonFilled from "../components/ButtonFilled";
import { Modal, message, Spin } from "antd";
import { publicationsApi } from "../api/publicationsApi";
import { chatsApi } from "../api/chatsApi";
import { authApi } from "../api/authApi";
import { favoritesApi } from "../api/favoritesApi";

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
  const [isLiked, setIsLiked] = useState(false);

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

    // copied from itemCard
    const checkIfFavorite = async () => {
      try {
        const favorites = await favoritesApi.getMyFavorites(); // плохо тк сто запросов на один итем делается, как по другому сделать пока не придумала
        const isFavorite = favorites.some((fav) => fav.slug === id);
        setIsLiked(isFavorite);
      } catch (error: unknown) {
        // Если не авторизован, не показываем ошибку
        const err = error as { response?: { status?: number } };
        if (err.response?.status !== 401) {
          console.error("Ошибка при проверке избранного:", error);
        }
      }
    };
    checkIfFavorite();
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

  // copied from ItemCard
  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (isLiked) {
        const favorites = await favoritesApi.getMyFavorites();
        const favorite = favorites.find((fav) => fav.slug === id);

        if (favorite) {
          await favoritesApi.removeFromFavorites(favorite.slug);
          setIsLiked(false);
        }
      } else {
        await favoritesApi.addToFavorites(id);
        setIsLiked(true);
      }
    } catch (error: unknown) {
      console.error("Ошибка при обновлении избранного:", error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  // Найти существующий чат для этой публикации
  const findExistingChatForPublication = () => {
    if (!itemData || existingChats.length === 0) return null;
    return existingChats.find(
      (chat) => chat.chat.publication.id === itemData.id
    );
  };

  const existingChat = findExistingChatForPublication();

  const handleCreateChat = async (
    offerType: "exchange" | "free",
    selectedItemId?: number
  ) => {
    console.log("🚀 === НАЧАЛО handleCreateChat ===");
    console.log("📊 Параметры:", { offerType, selectedItemId });
    console.log("📦 Данные товара:", itemData);
    console.log("👤 Текущий пользователь:", currentUser);

    if (!itemData || !currentUser) {
      console.log("❌ Нет данных товара или пользователя");
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    if (currentUser.id === itemData.author_id) {
      console.log("❌ Пользователь пытается создать чат с самим собой");
      message.warning("Нельзя создать чат с самим собой");
      return;
    }

    setIsCreatingChat(true);

    try {
      let chatData;

      // Сначала пытаемся получить существующий чат
      try {
        console.log("🟡 ШАГ 1: Пробуем получить существующий чат");
        chatData = await chatsApi.getChatByPublicationId(
          itemData.id,
          itemData.author_username
        );
        console.log("✅ Существующий чат найден, ID:", chatData.chat.id);
      } catch (getError: any) {
        // Если чат не найден (404), создаем новый
        if (getError.response?.status === 404) {
          console.log("🟡 Чат не найден, создаем новый...");
          chatData = await chatsApi.createChat(
            itemData.id,
            itemData.author_username
          );
          console.log("✅ Новый чат создан, ID:", chatData.chat.id);
        } else {
          // Другие ошибки
          throw getError;
        }
      }

      // Добавляем первое сообщение
      const greetingMessage =
        offerType === "exchange"
          ? selectedItemId
            ? `Здравствуйте, предлагаю обмен на мой товар (ID: ${selectedItemId}).`
            : "Здравствуйте, хочу поговорить об обмене."
          : "Здравствуйте, хочу забрать даром.";

      console.log("🟡 ШАГ 2: Добавляем первое сообщение:", greetingMessage);
      await chatsApi.addMessage(chatData.chat.id, greetingMessage);
      console.log("✅ Первое сообщение добавлено");

      // Обновляем список чатов
      console.log("🟡 ШАГ 3: Обновляем список чатов");
      const updatedChats = await chatsApi.getMyChats();
      setExistingChats(updatedChats);
      console.log("✅ Список чатов обновлен, количество:", updatedChats.length);

      // Переходим в чат
      console.log("🟡 ШАГ 4: Переходим в чат");
      const chatUrl = `/user-account/messages/${chatData.chat.id}`;
      console.log("🔗 URL для перехода:", chatUrl);
      navigate(chatUrl);

      message.success("Чат создан! Переход к сообщениям...");
    } catch (error: any) {
      console.error("❌ Ошибка при создании чата:", error);
      console.error("Детали ошибки:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
      });

      // Обработка различных ошибок
      if (error.response?.status === 400) {
        message.error(
          "Ошибка при создании чата: " +
            (error.response.data.detail || "Неизвестная ошибка")
        );
      } else if (error.response?.status === 401) {
        message.warning("Сессия истекла, требуется повторная авторизация");
        navigate("/login");
      } else if (error.response?.status === 403) {
        message.error("У вас нет прав для создания чата");
      } else {
        message.error("Неизвестная ошибка при создании чата");
      }
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleExchangeClick = async () => {
    console.log("🟡 === handleExchangeClick ВЫЗВАН ===");

    if (!currentUser) {
      console.log("❌ Нет пользователя, редирект на логин");
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    if (!itemData) {
      console.log("❌ Нет данных товара");
      return;
    }

    console.log("📦 Товар:", itemData.name, "ID:", itemData.id);
    console.log(
      "👤 Пользователь:",
      currentUser.username,
      "ID:",
      currentUser.id
    );
    console.log("👤 Автор товара ID:", itemData.author_id);

    // Если пользователь кликает на свой же товар
    if (currentUser.id === itemData.author_id) {
      console.log("❌ Пользователь пытается создать чат со своим товаром");
      message.warning("Нельзя создать чат для своего же товара");
      return;
    }

    try {
      setCheckingChats(true);

      // 1. Проверяем существующие чаты
      console.log("🟡 Проверяем существующие чаты...");
      const allChats = await chatsApi.getMyChats();
      console.log("✅ Чатов найдено:", allChats.length);

      // Ищем чат с этой публикацией
      const existingChat = allChats.find((chat: any) => {
        const match = chat.chat.publication.id === itemData.id;
        console.log("📝 Сравниваем:", {
          chatPubId: chat.chat.publication.id,
          itemId: itemData.id,
          match: match,
        });
        return match;
      });

      if (existingChat) {
        console.log("✅ Чат уже существует! ID:", existingChat.chat.id);
        console.log("🔗 Переходим в чат...");
        navigate(`/user-account/messages/${existingChat.chat.id}`);
        return;
      }

      console.log("❌ Чат не найден, создаем новый...");

      // 2. Создаем чат
      console.log("🟡 Создаем чат...");
      const chatData = await chatsApi.getChatByPublicationId(
        itemData.id,
        itemData.author_username
      );

      console.log("✅ Чат создан/получен:", chatData);
      console.log("🆔 ID чата:", chatData.chat.id);

      // 3. Добавляем первое сообщение
      const greetingMessage = "Здравствуйте, хочу поговорить об обмене.";
      console.log("🟡 Добавляем первое сообщение:", greetingMessage);
      await chatsApi.addMessage(chatData.chat.id, greetingMessage);

      // 4. Переходим в чат
      console.log("🔗 Переходим в чат:", chatData.chat.id);
      navigate(`/user-account/messages/${chatData.chat.id}`);

      message.success("Чат создан!");
    } catch (error: any) {
      console.error("❌ Ошибка:", error);
      console.error("Детали:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 400) {
        message.error(
          "Ошибка: " + (error.response.data.detail || "неизвестная ошибка")
        );
      } else if (error.response?.status === 404) {
        message.error("Не удалось найти или создать чат");
      } else {
        message.error("Неизвестная ошибка");
      }
    } finally {
      setCheckingChats(false);
    }
  };

  const handleFreeTakeClick = async () => {
    console.log("🟡 === handleFreeTakeClick ВЫЗВАН ===");

    if (!currentUser) {
      message.warning("Необходимо авторизоваться");
      navigate("/login");
      return;
    }

    if (!itemData) return;

    if (currentUser.id === itemData.author_id) {
      message.warning("Нельзя создать чат для своего же товара");
      return;
    }

    try {
      setCheckingChats(true);

      // 1. Проверяем существующие чаты
      const allChats = await chatsApi.getMyChats();
      const existingChat = allChats.find(
        (chat: any) => chat.chat.publication.id === itemData.id
      );

      if (existingChat) {
        navigate(`/user-account/messages/${existingChat.chat.id}`);
        return;
      }

      // 2. Создаем чат
      const chatData = await chatsApi.getChatByPublicationId(
        itemData.id,
        itemData.author_username
      );

      // 3. Добавляем первое сообщение
      const greetingMessage = "Здравствуйте, хочу забрать даром.";
      await chatsApi.addMessage(chatData.chat.id, greetingMessage);

      // 4. Переходим в чат
      navigate(`/user-account/messages/${chatData.chat.id}`);

      message.success("Чат создан!");
    } catch (error: any) {
      console.error("❌ Ошибка:", error);
      message.error("Не удалось создать чат");
    } finally {
      setCheckingChats(false);
    }
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

  const isFreeItem =
    itemData.price.toLowerCase().includes("бесплатно") ||
    itemData.price.toLowerCase() === "free" ||
    itemData.price === "0";

  // Определяем что показывать на кнопке
  const getButtonContent = () => {
    if (checkingChats || isCreatingChat) {
      return {
        text: checkingChats ? "Проверка..." : "Создание чата...",
        isExisting: false,
        disabled: true,
      };
    }

    if (existingChat) {
      return { text: "Перейти в чат", isExisting: true, disabled: false };
    }

    return {
      text: isFreeItem ? "Забрать даром" : "Предложить обмен",
      isExisting: false,
      disabled: false,
    };
  };

  const button = getButtonContent();

  return (
    <div className="px-[20rem] py-0">
      <div className="w-full">
        <div className="flex gap-[5rem] mb-12">
          <div className="flex-1">
            <Gallery
              images={
                itemData.images?.map((img) =>
                  img.image.startsWith("http")
                    ? img.image
                    : `http://localhost:8000${img.image}`
                ) || []
              }
            />
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
                onClick={handleLikeClick}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {isLiked ? (
                  <HeartFilled className="text-[1.2rem] text-red-500" />
                ) : (
                  <HeartOutlined className="text-[1.2rem] text-gray-600 hover:text-red-500" />
                )}
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
                  className="bg-blue-400 hover:bg-blue-500 text-white hover:text-black"
                >
                  <MessageOutlined className="mr-2" />
                  {button.text}
                </ButtonFilled>
              ) : isFreeItem ? (
                <ButtonFilled
                  onClick={handleFreeTakeClick}
                  disabled={button.disabled}
                  className={
                    isCreatingChat ? "bg-blue-400 hover:bg-blue-500" : ""
                  }
                >
                  {button.text}
                </ButtonFilled>
              ) : (
                <ButtonFilled
                  onClick={handleExchangeClick}
                  disabled={button.disabled}
                  className={
                    isCreatingChat ? "bg-blue-400 hover:bg-blue-500" : ""
                  }
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
