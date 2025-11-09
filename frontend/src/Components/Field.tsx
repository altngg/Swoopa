import { useState } from 'react';

const MessageInput = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Отправка сообщения:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-4/5 max-w-4xl mx-auto">
      <div className="flex items-center bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        {/* Иконка "Смотрите также" слева */}
        <div className="mr-3 text-gray-400 hover:text-gray-600 cursor-pointer">
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>

        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
          className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-500 text-sm"
        />
        
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`ml-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            message.trim() 
              ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transform rotate-0"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MessageInput;