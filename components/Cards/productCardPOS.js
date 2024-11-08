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
      className="flex justify-center items-center flex-col w-[250px] h-[250px] border rounded-lg p-4 shadow-sm hover:shadow-lg cursor-pointer bg-white relative"
      onClick={handleAddToCart} // Add to cart when clicking anywhere on the card
    >
      <img
        src={product.images[0].src}
        alt={product.name}
        className="w-[150px] h-[150px] object-cover rounded-md mb-4"
      />
      <h3 className=" text-center text-lg font-bold">{product.name}</h3>

      
     
    </motion.div>
  );
};

export default ProductCard;
