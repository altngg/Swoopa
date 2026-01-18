import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "antd";
import { UserOutlined, CloseOutlined } from "@ant-design/icons";
import DirectMessage from "./DirectMessage";
import MessageInputField from "./MessageInputField";
import { chatsApi, type Chat } from "../api/chatsApi";

interface DialogueWindowProps {
  onClose: () => void;
  selectedChat: Chat;
  userName: string;
  offerType?: "exchange" | "free";
  offerStatus?: "pending" | "accepted" | "rejected";
}

// add publication preview as the first message
const DialogueWindow: React.FC<DialogueWindowProps> = ({
  onClose,
  selectedChat,
  userName,
  offerType = "exchange",
  offerStatus = "pending",
}) => {
  const publicationAuthor = selectedChat.chat.publication.author_username;
  const chatAuthor = selectedChat.chat.author_username;
  const dialogUserName =
    userName === publicationAuthor ? chatAuthor : publicationAuthor;

  const [messages, setMessages] = useState(selectedChat.messages);
  const socketRef = useRef<WebSocket | null>(null); 

  useEffect(() => {
    console.log('Trying to connect WebSocket for chat:', selectedChat.chat.id);
    const chatId = selectedChat.chat.id;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const socket = new WebSocket(`${wsProtocol}://${window.location.host}/ws/chat/${chatId}/`);

    socket.onopen = () => {
      console.log('WebSocket connected for chat', chatId);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        id: Date.now(), // временный ID, переделать в получение из API(?)
        author_username: data.sender_username,
        text: data.message,
        created_at: data.timestamp
      }]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socketRef.current = socket;

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [selectedChat.chat.id]);

  const handleSendMessage = async (text: string) => {
    const newMessage = await chatsApi.addMessage(selectedChat.chat.id, text);
    setMessages([...messages, newMessage]);
  };

  // Отображение информации о предложении, если оно есть
  const renderOfferInfo = () => {
    if (!offerType) return null;

    return (
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
        <div className="text-sm text-blue-800">
          <strong>Предложение:</strong>{" "}
          {offerType === "exchange" ? "Обмен" : "Забрать даром"} •
          <span
            className={`ml-2 px-2 py-0.5 rounded text-xs ${
              offerStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : offerStatus === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {offerStatus === "pending"
              ? "Ожидает ответа"
              : offerStatus === "accepted"
              ? "Принято"
              : "Отклонено"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 flex flex-col">
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar icon={<UserOutlined />} className="bg-gray-300" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {dialogUserName}
            </div>
            <div className="text-xs text-gray-500">был в сети в 04:20</div>
          </div>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        />
      </div>

      {/* Информация о предложении */}
      {renderOfferInfo()}

      <div className="flex-1 p-4 overflow-y-auto">
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
              />
            );
          })}
        </div>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <MessageInputField onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default DialogueWindow;
