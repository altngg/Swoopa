import { Avatar } from 'antd'
import '../index.css'
import { UserOutlined } from '@ant-design/icons';

function DirectMessage () {

    const isCurrentUser = false;

    return (
    <div className={`flex gap-3 mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {/* Profile Picture for received messages */}
      {!isCurrentUser && (
        <div className="flex-shrink-0">
          <Avatar 
            size="default" 
            icon={<UserOutlined />} 
            className="bg-gray-300"
          />
        </div>
      )}

      {/* Message Content Container */}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
        {/* Sender Name */}
        {!isCurrentUser && (
          <div className="text-sm text-gray-600 mb-1 ml-1">
            Max
          </div>
        )}

        {/* Message Bubble Container */}
        <div className="flex flex-col">
          {/* Message Bubble */}
          <div
            className={`
              inline-block px-4 py-2 rounded-2xl border max-w-full w-fit
              ${isCurrentUser 
                ? 'bg-blue-500 text-white border-blue-500 rounded-br-md' 
                : 'bg-white text-gray-800 border-gray-200 rounded-bl-md shadow-sm'
              }
            `}
          >
            <p className="text-sm m-0 break-words whitespace-pre-wrap">Alo nu kak tam s dengami</p>
          </div>

          {/* Timestamp */}
          <div className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
            4:20
          </div>
        </div>
      </div>

      {/* Profile Picture for sent messages */}
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