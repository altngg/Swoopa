import '../index.css'
import DialogueItem from './DialogueItem';

function DialoguesList() {

  const mockDialogs = [
    {
      id: '1',
      userName: 'Петр',
      lastMessage: 'Хей, вам еще интересен товар?',
      unreadCount: 2,
      timestamp: '10:30 AM'
    },
    {
      id: '2', 
      userName: 'Ссаныч',
      lastMessage: 'Спасиб за сделку, книга класс',
      timestamp: 'Вчера'
    },
    {
      id: '3',
      userName: 'Вася 2 подъезд',
      lastMessage: 'Можем встретиться завтра в 3 часа?',
      unreadCount: 1,
      timestamp: '9:15'
    },
    {
      id: '4',
      userName: 'Макс',
      lastMessage: 'темка есть',
      timestamp: 'Пн'
    }
  ];

  const handleDialogClick = (dialog: unknown) => {
    console.log(dialog);
  };

  return (
    <>
    <div className="w-80 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Сообщения</h2>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {mockDialogs.map((dialog) => (
          <div 
            key={dialog.id}
            onClick={() => handleDialogClick(dialog)}
          >
            <DialogueItem dialog={dialog} />
          </div>
        ))}
      </div>

      {mockDialogs.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Нет сообщений
        </div>
      )}
    </div>
    </>
  );
}

export default DialoguesList;