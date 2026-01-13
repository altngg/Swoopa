import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface GalleryProps {
  images: string[];
}

function Gallery({ images }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPhotos = images && images.length > 0;

  const handlePrev = () => {
    setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  };

  // Используем URL как есть, так как они уже обработаны getImageUrl
  const getImageUrl = (path: string) => {
    if (!path) return '';
    return path; // URL уже должен быть полным
  };

  return (
    <div className="relative flex items-center justify-center w-fit">
      {/* Previous Arrow */}
      {hasPhotos && images.length > 1 && (
        <button
          onClick={handlePrev}
          className='absolute left-2 z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-md transition-all cursor-pointer'
        >
          <LeftOutlined />
        </button>
      )}

      {/* Photo Container */}
      <div className="w-[35em] h-[35em] rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
        {hasPhotos ? (
          <img 
            src={getImageUrl(images[currentIndex])}
            alt={`Gallery ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error loading image:', images[currentIndex]);
              e.currentTarget.src = 'https://via.placeholder.com/560x560?text=Изображение+не+загружено';
            }}
          />
        ) : (
          <span className="text-gray-500">Нет изображений</span>
        )}
      </div>

      {/* Next Arrow */}
      {hasPhotos && images.length > 1 && (
        <button
          onClick={handleNext}
          className='absolute right-2 z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-md transition-all cursor-pointer'
        >
          <RightOutlined />
        </button>
      )}

      {/* Photo Counter */}
      {hasPhotos && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

export default Gallery;