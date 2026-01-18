import React, { useEffect, useState } from "react";
import ListingCard from "../components/ListingCard";
import DialogueWindow from "../components/DialogueWindow";
import { useNavigate } from "react-router-dom";
import { favoritesApi } from "../api/favoritesApi";
import { chatsApi, type Chat } from "../api/chatsApi";
import { authApi } from "../api/authApi";
import type { Publication } from "../api/publicationsApi";

// add open publication on select
const Favorites = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string>("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [favoriteItems, setFavoriteItems] = useState<Publication[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserData();
    loadUserFavorites();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setUserName(user.username);
    } catch (error) {
      console.error("Error loading user data: ", error);
    }
  };

  const loadUserFavorites = async () => {
    try {
      const userFavorites = await favoritesApi.getMyFavorites();
      setFavoriteItems(userFavorites);
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const handleOpenChat = async (
    publicationId: number,
    authorUsername: string
  ) => {
    try {
      const fullChat = await chatsApi.getChatByPublicationId(
        publicationId,
        authorUsername
      );
      setSelectedChat(fullChat);
    } catch (error) {
      alert("Вы не можете создавать чаты с собой"); // change to something more good looking
      console.error("Error loading chat:", error);
    }
  };

  const handleRemoveItem = async (itemId: number, favoriteSlug: string) => {
    setFavoriteItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );

    await favoritesApi.removeFromFavorites(favoriteSlug);
  };

  return (
    <div className="min-h-screen px-[11rem] py-0">
      <h1 className="font-inter font-semibold text-2xl mb-8 text-gray-900">
        Понравившееся
      </h1>

      <div className="flex gap-1">
        <div className="w-2/3 space-y-4">
          {favoriteItems.map((item) => (
            <ListingCard
              item={item}
              key={item.id}
              onOpenChat={() => handleOpenChat(item.id, userName)}
              onRemove={() => handleRemoveItem(item.id, item.slug)}
            />
          ))}
        </div>

        <div className="w-1/3">
          {selectedChat && (
            <div className="fixed bottom-0 right-[9rem] h-[calc(80%)] w-[calc(33.333%-2rem)]">
              <DialogueWindow
                onClose={() => {
                  setSelectedChat(null);
                }}
                selectedChat={selectedChat}
                userName={userName}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
