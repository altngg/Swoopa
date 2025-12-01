import React from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import '../index.css';

interface Dialog {
  id: string;
  userName: string;
  lastMessage: string;
  unreadCount?: number;
  timestamp: string;
}

interface DialoguesListProps {
  dialogs: Dialog[];
  onDialogClick: (dialog: Dialog) => void;
  selectedDialogId?: string;
}

function DialoguesList({ dialogs, onDialogClick, selectedDialogId }: DialoguesListProps) {
  return (
    <div className="w-96 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {dialogs.map((dialog) => (
          <div 
            key={dialog.id}
            onClick={() => onDialogClick(dialog)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedDialogId === dialog.id ? 'bg-blue-50 hover:bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <Avatar 
                icon={<UserOutlined />}
                className="bg-gray-300"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900 truncate">
                    {dialog.userName}
                  </h3>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {dialog.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                  {dialog.lastMessage}
                </p>
                {dialog.unreadCount && dialog.unreadCount > 0 && (
                  <div className="inline-flex items-center justify-center min-w-5 h-5 px-1 mt-1 text-xs font-medium text-white bg-red-500 rounded-full">
                    {dialog.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {dialogs.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Нет сообщений
        </div>
      )}
    </div>
  );
}

export default DialoguesList;