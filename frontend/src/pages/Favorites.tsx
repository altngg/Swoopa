import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import DialogueWindow from "../components/DialogueWindow";
import { useNavigate } from "react-router-dom";
import { favoritesApi, type Favorite } from "../api/favoritesApi";
import type { Chat } from "../api/chatsApi";

const Favorites = () => {
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<Favorite[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserFavorites();
  }, []);

  const loadUserFavorites = async () => {
    try {
      const userFavorites = await favoritesApi.getMyFavorites();
      setFavoriteItems(userFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleOpenChat = (itemId: number) => {
    setSelectedChat(itemId);
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
  };

  const handleRemoveItem = async (itemId: number, favoriteSlug: string) => {
    setFavoriteItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
    console.log(itemId);

    await favoritesApi.removeFromFavorites(favoriteSlug);
  };

  return (
    <div className="min-h-screen px-[11rem] py-0">
      {/* Заголовок */}
      <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
        Понравившееся
      </h1>

      {/* Основной контейнер с разделением экрана */}
      <div className="flex gap-1">
        <div className="w-2/3 space-y-4">
          {favoriteItems.map((item) => (
            <ListingCard
              key={item.id}
              title={item.name}
              exchangeItem={item.price}
              userName={item.author_username}
              onOpenChat={() => handleOpenChat(item.id)}
              onRemove={() => handleRemoveItem(item.id, item.slug)}
            />
          ))}
        </div>

        <div className="w-1/3">
          {selectedChat && (
            <div className="fixed top-[27vh] right-[11rem] h-screen w-[calc(33.333%-2rem)]">
              <DialogueWindow
                onClose={handleCloseChat}
                selectedChat={selectedChat}
                userName=""
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
