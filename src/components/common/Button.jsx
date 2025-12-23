import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-green-600 hover:bg-green-500 text-black focus:ring-green-500 border border-transparent",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500 border border-gray-700",
    danger: "bg-red-600 hover:bg-red-500 text-white focus:ring-red-500 border border-transparent",
    outline: "bg-transparent border-2 border-green-600 text-green-500 hover:bg-green-600/10",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader size="sm" color={variant === 'primary' ? 'black' : 'white'} className="mr-2" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;