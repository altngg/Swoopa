import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "antd";
import { UserOutlined, CloseOutlined, LinkOutlined } from "@ant-design/icons";
import DirectMessage from "./DirectMessage";
import MessageInputField from "./MessageInputField";
import { chatsApi, type Chat } from "../api/chatsApi";
import { useNavigate } from "react-router-dom";

interface DialogueWindowProps {
  onClose: () => void;
  selectedChat: Chat;
  userName: string;
  userAvatar?: string | null;
}

const DialogueWindow: React.FC<DialogueWindowProps> = ({
  onClose,
  selectedChat,
  userName,
  userAvatar,
}) => {
  const navigate = useNavigate();
  const publicationAuthor = selectedChat.chat.publication.author_username;
  const chatAuthor = selectedChat.chat.author_username;
  const isCurrentUser = userName === publicationAuthor;
  const dialogUserName = isCurrentUser ? chatAuthor : publicationAuthor;
  const dialogueUserAvatar = isCurrentUser
    ? selectedChat.chat.author_profile_picture
    : selectedChat.chat.publication.author_profile_picture;

  const [messages, setMessages] = useState(selectedChat.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (text: string) => {
    const newMessage = await chatsApi.addMessage(selectedChat.chat.id, text);
    setMessages([...messages, newMessage]);
  };

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Обработчик клика на ссылку публикации
  const handlePublicationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const publicationSlug =
      selectedChat.chat.publication.slug || selectedChat.chat.publication.id;
    navigate(`/item/${publicationSlug}`);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 flex flex-col min-h-[600px]">
      {/* Шапка чата */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar
            src={dialogueUserAvatar}
            icon={<UserOutlined />}
            className="bg-gray-300"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {dialogUserName}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <LinkOutlined className="text-xs" />
              <button
                onClick={handlePublicationClick}
                className="text-blue-600 hover:text-blue-800 hover:underline truncate max-w-[200px] text-left"
              >
                {selectedChat.chat.publication.name}
              </button>
            </div>
          </div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        />
      </div>

      {/* Область сообщений с прокруткой */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4"
        style={{
          minHeight: "400px",
          maxHeight: "calc(100vh - 220px)",
        }}
      >
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.author_username === userName;
            const timeCreated = new Date(message.created_at)
              .toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
              .replace(/, /g, " ");

            return (
              <DirectMessage
                key={message.id}
                message={message.text}
                isCurrentUser={isCurrentUser}
                time={timeCreated}
                userName={isCurrentUser ? "Вы" : dialogUserName}
                userAvatar={userAvatar}
                dialogueUserAvatar={dialogueUserAvatar}
              />
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Поле ввода */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <MessageInputField onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default DialogueWindow;
