import React from 'react';

interface ServiceButtonProps {
  children?: string;
  onClick?: () => void;
  className?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const ServiceButton: React.FC<ServiceButtonProps> = ({ 
  children = 'Услуга', 
  onClick,
  className = '',
  rounded = 'full'
}) => {
  const roundedClass = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full'
  }[rounded];

  return (
    <button
      onClick={onClick}
      className={`        
        py-[0.25rem]          
        px-[2rem]                                               
        bg-[#C4C4C4]     
        ${roundedClass}                        
        font-medium                
        text-[14px]
        transition-all             
        duration-200               
        hover:bg-gray-100          
        hover:border-gray-700      
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
      {children}
    </button>
  );
};

export default ServiceButton;