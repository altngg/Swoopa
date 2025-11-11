import React, { useState } from 'react';

const PublicationSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setSearchQuery(e.target.value)
          }
          placeholder="Поиск по публикациям..."
          className="w-full px-6 py-4 pr-14 text-lg border border-gray-300 rounded-2xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   shadow-sm hover:shadow-md transition-shadow duration-200
                   placeholder-gray-400 text-gray-700"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2
                   text-gray-400 hover:text-blue-500 transition-colors duration-200
                   focus:outline-none focus:text-blue-500"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default PublicationSearch;