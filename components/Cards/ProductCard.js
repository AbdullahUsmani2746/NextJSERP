import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow">
      <img src={product.photo} alt={product.name} className="w-full h-32 object-cover mb-2 rounded" />
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p>Price: ${product.price}</p>
      <p>SKU: {product.sku}</p>
      <div className="flex justify-between mt-4">
        <button onClick={onEdit} className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
        <button onClick={onDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;
