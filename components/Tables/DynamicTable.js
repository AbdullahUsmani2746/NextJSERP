import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const DynamicTable = ({ data, onEdit, onDelete, headers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleHeaders, setVisibleHeaders] = useState(
    headers.map((header) => ({ name: header, visible: true }))
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleHeaderVisibility = (header) => {
    setVisibleHeaders((prev) =>
      prev.map((h) =>
        h.name === header ? { ...h, visible: !h.visible } : h
      )
    );
  };

  const filteredData = data.filter((item) =>
    headers.some((header) =>
      item[header.toLowerCase()]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <motion.div 
      className="p-6 rounded-lg "
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="mb-4 flex items-center border rounded-md overflow-hidden shadow-sm w-[45%]">
          <div className="flex items-center px-3 ">
            <FiSearch className="text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="border-0 focus:outline-none focus:ring-0 w-full p-3 bg-gray-200"
          />
        </div>

        {/* Column Visibility Toggles */}
        <div className="mb-4 flex flex-wrap">
          {headers.map((header) => (
            <label key={header} className="inline-flex items-center mr-4 mb-2">
              <input
                type="checkbox"
                checked={visibleHeaders.find((h) => h.name === header)?.visible}
                onChange={() => toggleHeaderVisibility(header)}
                className="hidden"
              />
              <span className="flex items-center cursor-pointer">
                <span className={`w-6 h-6 flex items-center justify-center rounded-lg border border-gray-400 transition duration-200 ${visibleHeaders.find((h) => h.name === header)?.visible ? 'bg-blue-500 border-blue-500' : 'bg-white'}`}>
                  {visibleHeaders.find((h) => h.name === header)?.visible && (
                    <motion.span
                      className="w-3 h-3 bg-white rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </span>
                <span className="ml-2 text-gray-600">{header}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-center border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-blue-500 text-white uppercase text-sm">
            <tr>
              {visibleHeaders.filter((h) => h.visible).map((header) => (
                <th key={header.name} className="py-3 px-4 border-b">
                  {header.name}
                </th>
              ))}
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100 transition duration-300">
                  {visibleHeaders.filter((h) => h.visible).map((header) => (
                    <td key={header.name} className="py-3 px-4 border-b text-sm">
                      {header.name === "photo" ? (
                        <img
                          src={item.photo} // Assuming `item.photo` contains the image URL
                          alt="Product"
                          className="w-12 h-12 object-cover rounded-full mx-auto"
                        />
                      ) : (
                        item[header.name.toLowerCase()]
                      )}
                    </td>
                  ))}
                  <td className="py-3 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-yellow-600 flex items-center border-b-2 border-yellow-600"
                    >
                      <BiSolidEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-red-600 flex items-center border-b-2 border-red-600"
                    >
                      <RiDeleteBin6Line className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleHeaders.filter((h) => h.visible).length + 1}
                  className="text-center py-8 font-bold text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DynamicTable;
