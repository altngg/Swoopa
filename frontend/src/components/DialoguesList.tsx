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
          const dialogUserName =
            userName === publicationAuthor ? chatAuthor : publicationAuthor;

          const dateCreated = new Date(dialog.chat.created_at);

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
                {/* <Avatar icon={<UserOutlined />} className="bg-gray-300" /> commented cause i don't wanna deal with imgs yet */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 truncate">
                      {dialogUserName}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {dateCreated.toLocaleDateString("ru-RU")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {dialog.messages[0]?.text}
                  </p>

                  {/* Информация о предложении, если есть */}
                  {/* {dialog.offerType && (
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        dialog.offerType === "exchange"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {dialog.offerType === "exchange" ? "Обмен" : "Даром"}
                    </span>
                    {dialog.status && (
                      <span
                        className={`text-xs px-1.5 py-0.5 rounded ${
                          dialog.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : dialog.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dialog.status === "pending"
                          ? "Ожидает"
                          : dialog.status === "accepted"
                          ? "Принято"
                          : "Отклонено"}
                      </span>
                    )}
                  </div>
                )} */}

                  {/* {dialog.unreadCount && dialog.unreadCount > 0 && (
                  <div className="inline-flex items-center justify-center min-w-5 h-5 px-1 mt-1 text-xs font-medium text-white bg-red-500 rounded-full">
                    {dialog.unreadCount}
                  </div>
                )} */}
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
