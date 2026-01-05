import { Avatar } from 'antd';
import '../index.css'
import { UserOutlined } from '@ant-design/icons';

interface Dialog {
  id: string;
  userName: string;
  lastMessage: string;
  unreadCount?: number;
  timestamp?: string;
}

interface DialogItemProps {
  dialog: Dialog;
}

const DialogueItem: React.FC<DialogItemProps> = ({ dialog }) => {

    return (
    <div className="flex items-center gap-3 p-3 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
      {/* Profile Picture */}
      <div className="flex-shrink-0">
        <Avatar 
          size="default" 
          icon={<UserOutlined />} 
          className="bg-gray-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* User Name */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-medium text-gray-900 truncate">
            {dialog.userName}
          </h3>
          {dialog.timestamp && (
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {dialog.timestamp}
            </span>
          )}
        </div>

        {/* Last Message (cropped) */}
        <p className="text-sm text-gray-600 truncate">
          {dialog.lastMessage}
        </p>
      </div>

      {/* Unread Counter */}
      {dialog.unreadCount && dialog.unreadCount > 0 && (
        <div className="flex-shrink-0">
          <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {dialog.unreadCount}
          </span>
        </div>
      )}
    </div>
  );
}

export default DialogueItem;