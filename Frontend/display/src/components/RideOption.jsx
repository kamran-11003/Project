import React from 'react';

const RideOption = ({ name, image, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-lg transition-all ${
        isSelected ? 'bg-blue-50 border-2 border-blue-500' : 'border-2 border-transparent hover:bg-gray-50'
      }`}
    >
      <img src={image} alt={name} className="w-24 h-24 object-cover rounded-lg mb-2" />
      <span className="font-medium text-gray-900">{name}</span>
    </button>
  );
};

export default RideOption;
