import React from "react";
import Image from "next/image";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

const ProductCard = ({ product, onEdit, onDelete }) => {
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="border border-gray-300 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out bg-white max-w-sm mx-auto sm:max-w-none sm:flex sm:items-start sm:space-x-6"
    >
      <div className="w-full sm:w-48 h-48 mb-4 relative rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={product.images[0].src}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <div className="flex-grow">
        <h2 className="text-xl font-medium mb-2 text-gray-900">
          {product.name}
        </h2>
        <p className="text-gray-700 mb-1">
          Price:{" "}
          <span className="text-gray-900 font-semibold">
            ${product.price}
          </span>
        </p>
        <p className="text-gray-700 mb-1">
          SKU:{" "}
          <span className="text-gray-900 font-semibold">{product.sku}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Barcode:{" "}
          <span className="text-gray-900 font-semibold">{product.barcode}</span>
        </p>

        <div className="flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-md shadow hover:shadow-lg transition-all duration-200"
          >
            <FiEdit className="mr-2" /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-md shadow hover:shadow-lg transition-all duration-200"
          >
            <FiTrash2 className="mr-2" /> Delete
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
