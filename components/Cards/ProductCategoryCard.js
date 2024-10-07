import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ProductCategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border border-gray-200 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white max-w-sm mx-auto"
    >
      <div className="w-full h-48 mb-4 relative rounded-lg overflow-hidden">
        <img
          src={category.photo}
          alt={category.name}
          className="object-cover w-full h-full rounded-lg"
        />
      </div>
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        {category.name}
      </h2>
      <p className="text-gray-600 mb-4">{category.description}</p>

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

export default ProductCategoryCard;
