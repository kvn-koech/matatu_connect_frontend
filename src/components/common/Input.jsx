import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  icon = null, // Optional icon on the left
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Optional Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full 
            bg-gray-900 
            text-white 
            placeholder-gray-600
            border 
            rounded-lg 
            px-4 py-3 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-700'}
          `}
          {...props}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;