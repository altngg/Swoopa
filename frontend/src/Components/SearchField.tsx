import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

const SearchField: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search query:', searchQuery);
    
    // Сохраняем состояние поиска
    const event = new CustomEvent('searchPerformed', { 
      detail: { query: searchQuery, isActive: !!searchQuery.trim() } 
    });
    window.dispatchEvent(event);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-w-[80rem] max-w-4xl mx-auto mb-[3rem]">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Поиск по публикациям..."
          className="w-full px-[0.7rem] py-[0.5rem] text-[18px] border-[1px] border-gray-300 rounded-3xl 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   shadow-sm hover:shadow-md transition-shadow duration-200
                   placeholder-gray-400 text-gray-700 font-regular"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2
                   text-gray-400 hover:text-blue-500 transition-colors duration-200
                   focus:outline-none focus:text-blue-500"
        >
          <SearchOutlined style={{ fontSize: '24px', paddingLeft: '1rem' }}/>
        </button>
      </form>
    </div>
  );
};

export default SearchField;