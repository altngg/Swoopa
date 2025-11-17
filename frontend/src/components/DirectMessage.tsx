import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

interface DirectMessageProps {
  message: string;
  isCurrentUser: boolean;
  time: string;
  userName: string;
}

function DirectMessage({ message, isCurrentUser, time, userName }: DirectMessageProps) {
  return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {/* Аватар для полученных сообщений */}
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          <Avatar 
            size="default" 
            icon={<UserOutlined />} 
            className="bg-gray-300"
          />
        </div>
      )}

      {/* Контейнер контента сообщения */}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Имя отправителя */}
        {!isCurrentUser && (
          <div className="text-sm text-gray-600 mb-1 ml-1">
            {userName}
          </div>
        )}

        {/* Контейнер пузыря сообщения */}
        <div className="flex flex-col">
          {/* Пузырь сообщения */}
          <div
            className={`
              inline-block px-4 py-2 rounded-2xl border max-w-full w-fit
              ${isCurrentUser 
                ? 'bg-blue-500 text-white border-blue-500 rounded-br-md' 
                : 'bg-white text-gray-800 border-gray-200 rounded-bl-md shadow-sm'
              }
            `}
          >
            <p className="text-sm m-0 break-words whitespace-pre-wrap">{message}</p>
          </div>

          {/* Время */}
          <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
            {time}
          </div>
        </div>
      </div>

      {/* Аватар для отправленных сообщений */}
      {isCurrentUser && (
        <div className="flex-shrink-0">
          <Avatar 
            size="default" 
            icon={<UserOutlined />} 
            className="bg-blue-300"
          />
        </div>
      )}
    </div>
  );
}

export default DirectMessage;