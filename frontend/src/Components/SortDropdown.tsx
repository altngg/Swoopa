import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

type SortOption = 'date' | 'exchange';

interface SortDropdownProps {
  onSortChange: (option: SortOption) => void;
  isVisible: boolean;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<SortOption>('date');

  const sortOptions = [
    { value: 'date', label: 'дате' },
    { value: 'exchange', label: 'обмену' }
  ];

  const handleSortChange = (option: SortOption) => {
    setSelectedSort(option);
    setIsOpen(false);
    onSortChange(option);
  };

  if (!isVisible) return null;

  return (
    <div className="relative flex items-center gap-2">
      <span className="text-sm text-gray-600">Сортировать по:</span>
      
      <div className="relative">
        <button
          className="flex items-center gap-1 px-3 py-2 text-red-500 font-medium hover:bg-gray-50 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>
            {sortOptions.find(option => option.value === selectedSort)?.label}
          </span>
          <DownOutlined className="text-xs" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  selectedSort === option.value 
                    ? 'text-red-500 font-medium' 
                    : 'text-gray-700'
                }`}
                onClick={() => handleSortChange(option.value as SortOption)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortDropdown;