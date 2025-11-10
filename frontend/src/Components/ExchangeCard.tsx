import React from 'react';

interface ExchangeCardProps {
  itemName: string;
  date: string;
  exchangeFor: string;
  userName: string;
  onExchange?: () => void; 
}


const ExchangeCard: React.FC<ExchangeCardProps> = ({
  itemName,
  date,
  exchangeFor,
  userName
}) => {
  const handleExchange = () => {
    console.log('Предложить обмен');
    // Логика для предложения обмена
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Заголовок карточки */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">{itemName}</h2>
        <p className="text-sm text-gray-500 mt-1">{date}</p>
      </div>
      
      {/* Основной контент */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" 
                />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Обмен на</span>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-gray-800">{exchangeFor}</p>
          <p className="text-xs text-gray-600 mt-1">{userName}</p>
        </div>
      </div>
      
      {/* Кнопка действия */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={handleExchange}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Предложить обмен
        </button>
      </div>
    </div>
  );
};

// Пример использования компонента
// const App: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <ExchangeCard
//         itemName="Мока кофеварка"
//         date="14 ноября"
//         exchangeFor="Урок английского"
//         userName="Максим"
//       />
//     </div>
//   );
// };

export default ExchangeCard;