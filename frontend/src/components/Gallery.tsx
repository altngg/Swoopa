import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import '../index.css'

function Gallery () {

    const hasPhotos = true;

      return (
    <div className="relative flex items-center justify-center w-fit">
      {/* Previous Arrow */}
      {hasPhotos && (
        <button
          className='absolute left-2 z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-md transition-all 
            cursor-pointer'
        >
          <LeftOutlined />
        </button>
      )}

      {/* Photo Container */}
      <div className="w-[25em] h-[25em] h-48 bg-gray-300 rounded-lg flex items-center justify-center">
        {/* {hasPhotos ? (
          <img 
            src={photos[currentIndex]} 
            alt={`Gallery ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : ( */}
          <span className="text-gray-500">No photos</span>
        {/* )} */}
      </div>

      {/* Next Arrow */}
      {hasPhotos && (
        <button
          className='absolute right-2 z-10 p-2 rounded-full bg-white bg-opacity-70 hover:bg-opacity-90 shadow-md transition-all
            cursor-not-allowed opacity-50'
        >
          <RightOutlined />
        </button>
      )}

      {/* Photo Counter
      {hasPhotos && photos.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {photos.length}
        </div>
      )} */}
    </div>
  );
}

export default Gallery;