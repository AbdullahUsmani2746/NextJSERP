// components/CategoryFilter.js

import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  console.log(categories)

  
  return (
    <div className="flex space-x-2 mb-4">
      <button
        className={`rounded-full px-4 py-2 text-sm ${selectedCategory === 'All' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onSelectCategory('All')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`rounded-full px-4 py-2 text-sm ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
