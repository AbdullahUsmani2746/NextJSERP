// components/ProductCard.js

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'; // Importing icons

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1); // State to manage quantity

  const handleAddToCart = () => {
    if (quantity > 0) {
      onAddToCart({ ...product, quantity });
      setQuantity(1); // Reset quantity after adding to cart
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className="w-80  border rounded-lg p-4 shadow-md hover:shadow-lg cursor-pointer bg-white relative"
      onClick={handleAddToCart} // Add to cart when clicking anywhere on the card
    >
      <img
        src={product.photo}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-500 font-bold mt-2">${product.price}</p>
      
      {/* Quantity Control */}
      <div className="flex items-center mt-4">
        <motion.button 
          onClick={() => setQuantity(Math.max(quantity - 1, 1))} // Prevent negative quantity
          className="text-blue-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlineMinus />
        </motion.button>
        
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 1)} // Ensure quantity is at least 1
          className="w-16 border text-center mx-2 rounded"
        />
        
        <motion.button 
          onClick={() => setQuantity(quantity + 1)} // Increase quantity
          className="text-blue-500"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AiOutlinePlus />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
