import React from "react";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import "../index.css";
import type { Chat } from "../api/chatsApi";

interface DialoguesListProps {
  dialogs: Chat[];
  onDialogClick: (dialog: Chat) => void;
  selectedDialogId?: number;
  userName: string;
}

function DialoguesList({
  dialogs,
  onDialogClick,
  selectedDialogId,
  userName,
}: DialoguesListProps) {
  return (
    <div className="w-96 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {dialogs.map((dialog, index) => {
          const publicationAuthor = dialog.chat.publication.author_username;
          const chatAuthor = dialog.chat.author_username;
          const isCurrentUser = userName === publicationAuthor;
          const dialogUserName = isCurrentUser ? chatAuthor : publicationAuthor;
          const dialogueUserAvatar = isCurrentUser
            ? dialog.chat.author_profile_picture
            : dialog.chat.publication.author_profile_picture;

          const dateCreated = new Date(dialog.chat.created_at);
          const publicationName = dialog.chat.publication.name;
          const publicationPrice = dialog.chat.publication.price;

          // Проверяем, является ли публикация бесплатной
          const isFreePublication =
            publicationPrice === "0" ||
            publicationPrice.toLowerCase().includes("бесплатно") ||
            publicationPrice.toLowerCase() === "free";

          return (
            <div
              key={index}
              onClick={() => onDialogClick(dialog)}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedDialogId === dialog.chat.id
                  ? "bg-blue-50 hover:bg-blue-50"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <Avatar
                  src={dialogueUserAvatar}
                  icon={<UserOutlined />}
                  className="bg-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <h3 className="font-medium text-gray-900 truncate">
                        {dialogUserName}
                      </h3>
                      {/* Название публикации */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium text-gray-700 truncate">
                          {publicationName}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            isFreePublication
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isFreePublication ? "Даром" : "Обмен"}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {dateCreated.toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-2">
                    {dialog.messages[0]?.text || "Нет сообщений"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {dialogs.length === 0 && (
        <div className="p-8 text-center text-gray-500">Нет сообщений</div>
      )}
    </div>
  );
}

export default DialoguesList;
