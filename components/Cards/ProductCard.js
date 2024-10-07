import React from "react";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white max-w-sm mx-auto"
    >
      <div className="w-full h-48 mb-4 relative rounded-lg overflow-hidden">
        <Image
          src={product.photo}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        {product.name}
      </h2>
      <p className="text-gray-600 mb-2">
        Price:{" "}
        <span className="text-gray-900 font-medium">${product.price}</span>
      </p>
      <p className="text-gray-600 mb-2">
        SKU: <span className="text-gray-900 font-medium">{product.sku}</span>
      </p>

      <div className="flex justify-between items-center mt-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiEdit className="mr-2" /> Edit
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDelete}
          className="flex items-center bg-gradient-to-r from-pink-500 to-orange-600 text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <FiTrash2 className="mr-2" /> Delete
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
