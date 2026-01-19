import React from "react";

interface ServiceButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  rounded?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  disabled?: boolean;
}

const ServiceButton: React.FC<ServiceButtonProps> = ({
  children = "Услуга",
  onClick,
  className = "",
  rounded = "full",
  disabled = false,
}) => {
  const roundedClass = {
    sm: "rounded",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`        
        py-[0.5rem]          
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
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}               
      `}
    >
      {children}
    </button>
  );
};

export default ServiceButton;
