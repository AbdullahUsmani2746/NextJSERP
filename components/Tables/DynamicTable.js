import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";

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
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">

      <div className="flex items-center justify-between ">
      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Column Visibility Toggles */}
      <div className="mb-4">
        {headers.map((header) => (
          <label key={header} className="inline-flex items-center mr-4">
            <input
              type="checkbox"
              checked={visibleHeaders.find((h) => h.name === header)?.visible}
              onChange={() => toggleHeaderVisibility(header)}
              className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded transition duration-150 ease-in-out"
            />
            <span className="ml-2 text-gray-600">{header}</span>
          </label>
        ))}
      </div>
</div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-center border border-gray-200 rounded-lg shadow-md">
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
                    <td key={header.name} className="py-3 px-4 text-sm">
                      {header.name.toLowerCase() === "photo" ? (
                        <img
                          src={item.photo} // Assuming 'photo' is the key for the image URL
                          alt="Product"
                          className="w-16 h-16 rounded-full object-cover mx-auto"
                        />
                      ) : (
                        item[header.name.toLowerCase()]
                      )}
                    </td>
                  ))}
                  <td className="py-8 px-4 flex justify-center items-center space-x-2 h-full">
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-yellow-600 flex items-center"
                    >
                      <BiSolidEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-red-600 flex items-center"
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
    </div>
  );
};

export default DynamicTable;
