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
        w-[20rem]                   
        px-4                        
        py-2                       
        bg-white                   
        border-2                   
        border-gray-600            
        ${roundedClass}            
        text-gray-600              
        font-medium                
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
        text-base                  
        leading-normal             
        ${className}               
      `}
      style={{
        fontSize: '1rem',          
      }}
    >
      {children}
    </button>
  );
};

export default ServiceButton;