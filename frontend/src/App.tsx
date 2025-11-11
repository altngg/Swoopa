//для залитой кнопки проверка
// import React from 'react';
// import ServiceButton from './Components/ButtonFilled';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-600 p-8 flex flex-col items-center justify-center">
//         <ServiceButton>Услуга</ServiceButton>
//       </div>
    
//   );
// }

// export default App;

//для незалитой кнопки
// import InvertedButton from './Components/ButtonOutline';

// const App = () => {
//   return (
//     <div className="min-h-screen bg-gray-600 p-8 flex flex-col items-center justify-center">
//       {/* На сером фоне будут белые кнопки */}
//       <InvertedButton
//         text="Товар" 
//         className="mb-4"
//       />
      
//     </div>
//   );
// };

// export default App;

//для поля ввода проверка 
// import MessageInput from './Components/Field';

// const ChatComponent = () => {
//   return (
//     <div className="min-h-screen bg-gray-600 p-8 flex flex-col items-center justify-center">
//       {/* Другие компоненты чата */}
//       <div className="fixed bottom-4 left-4 right-4">
//         <MessageInput />
//       </div>
//     </div>
//   );
// };
// export default ChatComponent




// import React from 'react';
// import ExchangeCard from './Components/ExchangeCard';

// interface ExchangeItem {
//   id: number;
//   itemName: string;
//   date: string;
//   exchangeFor: string;
//   userName: string;
// }

// const ExchangeList: React.FC = () => {
//   const exchangeItems: ExchangeItem[] = [
//     {
//       id: 1,
//       itemName: "Мока кофеварка",
//       date: "14 ноября",
//       exchangeFor: "Урок английского",
//       userName: "Максим"
//     },
    
//   ];

//   const handleExchange = (itemId: number, userName: string) => {
//     console.log(`Предложен обмен для товара ${itemId} с пользователем ${userName}`);
//     // Логика предложения обмена
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
//       {exchangeItems.map((item) => (
//         <ExchangeCard
//           key={item.id}
//           itemName={item.itemName}
//           date={item.date}
//           exchangeFor={item.exchangeFor}
//           userName={item.userName}
//           onExchange={() => handleExchange(item.id, item.userName)}
//         />
//       ))}
//     </div>
//   );
// };

// export default ExchangeList;



// import React from 'react';
// import PublicationSearch from './Components/SearchField';

// const App: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
//           Блог компании
//         </h1>
//         <PublicationSearch />
        
//         {/* Дополнительный контент */}
//         <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {/* Здесь будут карточки публикаций */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;
import React from 'react';
import LoginInput from './Components/LoginPassword';

const LoginForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
      
        
        {/* Использование компонента LoginInput */}
        <LoginInput />
        
        
      </div>
    </div>
  );
};

export default LoginForm;