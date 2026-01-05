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
        py-[0.25rem]          
        px-[2rem]  
        text-[14px]
        bg-transparent
        border-[1px]
        border-current
        rounded-full
        font-medium
        transition-all             
        duration-200               
        hover:bg-gray-100          
        hover:border-gray-100      
        active:bg-gray-200         
        active:border-gray-800     
        focus:outline-none        
        focus:ring-2               
        focus:ring-gray-400       
        focus:ring-opacity-50                  
        leading-normal    
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default InvertedButton;