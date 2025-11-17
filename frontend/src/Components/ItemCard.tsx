import { HeartOutlined } from '@ant-design/icons';
import '../index.css';

function ItemCard() {
  return (
    <div className="w-[12rem] flex flex-col gap-2 p-3 rounded-lg">
      {/* Картинка с иконкой лайка */}
      <div className="relative">
        <div 
          className="w-full h-40 rounded bg-[#C4C4C4]"
          style={{ backgroundColor: '#C4C4C4' }}
        />
        {/* Иконка лайка в правом нижнем углу картинки */}
        <button className="absolute bottom-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors">
          <HeartOutlined className="text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Текст под картинкой */}
      <div className="flex flex-col gap-1 w-full">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {'Название товара'}
        </h3>
        <p className="text-xs text-gray-600 truncate">
          Обмен на {'предмет обмена'}
        </p>
      </div>
    </div>
  );
}

export default ItemCard;