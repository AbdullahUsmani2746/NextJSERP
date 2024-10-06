import React from 'react';

const ProductCategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow">
      <img src={category.photo} alt={category.name} className="w-full h-32 object-cover mb-2 rounded" />
      <h2 className="text-lg font-semibold">{category.name}</h2>
      <p>{category.description}</p>
      <div className="flex justify-between mt-4">
        <button onClick={onEdit} className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
        <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
};

export default ProductCategoryCard;
