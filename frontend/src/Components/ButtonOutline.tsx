import React from 'react';

interface InvertedButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const InvertedButton: React.FC<InvertedButtonProps> = ({ 
  text, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-[20rem]
        px-4
        py-2
        bg-transparent
        border-2
        border-current
        rounded-full
        text-current
        font-medium
        transition-all
        duration-200
        hover:opacity-80
        active:opacity-60
        focus:outline-none
        focus:ring-2
        focus:ring-current
        focus:ring-opacity-50
        text-base
        leading-normal
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default InvertedButton;