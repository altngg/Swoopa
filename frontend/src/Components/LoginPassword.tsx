import React from 'react';

const LoginInput: React.FC = () => {
  return (
    <div className="w-full max-w-sm">
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Введите логин"
      />
    </div>
  );
};

export default LoginInput;