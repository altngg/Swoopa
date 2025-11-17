import '../index.css'

interface ListingCardProps {
  title?: string;
  exchangeItem?: string;
}

function ListingCard({ title = 'title', exchangeItem = 'exchangeItem' }: ListingCardProps) {
  return (
    <div className="w-[50em] flex gap-4 p-4 rounded-lg shadow-sm">
      {/* Картинка 164x164px */}
      <div 
        className="flex-shrink-0 w-[10.25rem] h-[10.25rem] rounded bg-[#C4C4C4]"
        style={{ backgroundColor: '#C4C4C4' }}
      />

      <div className="flex-1 flex flex-col w-fit-content">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Обмен на {exchangeItem}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Максим
            </p>
          </div>
          <button
            className="flex-shrink-0 ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Удалить
          </button>
        </div>

        <div className="mt-auto flex justify-end">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Открыть чат
          </button>
        </div>
      </div>
    </div>
  )
}

export default ListingCard;