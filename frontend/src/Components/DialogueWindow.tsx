import React, { useState } from 'react';
import { Avatar, Button } from 'antd';
import { UserOutlined, CloseOutlined } from '@ant-design/icons';
import DirectMessage from './DirectMessage';
import MessageInputField from './MessageInputField';

interface DialogueWindowProps {
  onClose: () => void;
  itemId: number;
  dialogUserName?: string;
  lastMessage?: string;
}

const DialogueWindow: React.FC<DialogueWindowProps> = ({ 
  onClose, 
  dialogUserName = 'Пользователь',
  lastMessage = ''
}) => {
  const [messages, setMessages] = useState([
    { id: 1, text: lastMessage, isCurrentUser: false, time: '10:30' },
    { id: 2, text: 'Деньги есть, готов обсудить обмен', isCurrentUser: true, time: '10:32' },
    { id: 3, text: 'Отлично! Когда можем встретиться?', isCurrentUser: false, time: '10:33' },
    { id: 4, text: 'В любое время после 18:00', isCurrentUser: true, time: '10:35' },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: messages.length + 1,
      text,
      isCurrentUser: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="w-full h-full bg-white rounded-lg border border-gray-200 flex flex-col">
      {/* Шапка диалога */}
      <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar 
            icon={<UserOutlined />} 
            className="bg-gray-300"
          />
          <div>
            <div className="text-sm font-medium text-gray-900">{dialogUserName}</div>
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

      {/* Область сообщений с прокруткой */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <DirectMessage
              key={message.id}
              message={message.text}
              isCurrentUser={message.isCurrentUser}
              time={message.time}
              userName={message.isCurrentUser ? 'Вы' : dialogUserName}
            />
          ))}
        </div>
      </div>

      {/* Поле ввода сообщения */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <MessageInputField onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default DialogueWindow;