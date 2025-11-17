import React from 'react';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';

const MessageInput: React.FC = () => {
  const handleSend = () => {
    console.log('Send message');
  };

  const handleFileAdd = () => {
    console.log('Add file');
  };
  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <button
        onClick={handleFileAdd}
        className="absolute left-3 z-10 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <PaperClipOutlined style={{ fontSize: '18px' }} />
      </button>

      {/* Message Input Field */}
      <input
        type="text"
        placeholder="Сообщение"
        className="w-full pl-10 pr-12 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
        onKeyDown={handleKeyPress}
      />

      <button
        onClick={handleSend}
        className="absolute right-3 z-10 text-gray-500 hover:text-gray-700 transition-colors duration-200"
      >
        <SendOutlined style={{ fontSize: '18px' }} />
      </button>
    </div>
  );
};

export default MessageInput;