import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

const DynamicTable = ({ data, onEdit, onDelete, headers, entity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleHeaders, setVisibleHeaders] = useState(
    headers.map((header) => ({ name: header, visible: true }))
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleHeaderVisibility = (header) => {
    setVisibleHeaders((prev) =>
      prev.map((h) => (h.name === header ? { ...h, visible: !h.visible } : h))
    );
  };

  const filteredData = data.filter((item) =>
    headers.some((header) =>
      item[header.toLowerCase()]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  );

  const handleViewProducts = (products) => {
    setSelectedProducts(products);
    setProductModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 bg-white text-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-0 sm:mr-4 w-full sm:max-w-xs relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-100 border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10 text-gray-900"
          />
          <FiSearch className="absolute right-3 top-4 text-gray-500" />
        </div>

        {/* Column Visibility Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center bg-gray-100 border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none hover:bg-gray-200 transition duration-300"
          >
            Columns
            <IoIosArrowDown className="ml-2" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-3">
              {headers.map((header) => (
                <label
                  key={header}
                  className="flex items-center py-1 text-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={
                      visibleHeaders.find((h) => h.name === header)?.visible
                    }
                    onChange={() => toggleHeaderVisibility(header)}
                    className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded transition duration-150 ease-in-out mr-2"
                  />
                  <span>{header}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white text-center border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-800 uppercase text-sm">
            <tr>
              {visibleHeaders
                .filter((h) => h.visible)
                .map((header) => (
                  <th
                    key={header.name}
                    className="py-3 px-2 sm:px-4 border-b border-gray-300"
                  >
                    {header.name}
                  </th>
                ))}
              <th className="py-3 px-2 sm:px-4 border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 transition duration-300"
                >
                  {visibleHeaders
                    .filter((h) => h.visible)
                    .map((header) => {
                      // Handle the nested product data when entity is "orders"
                      if (
                        header.name.toLowerCase() === "products_purchased" &&
                        entity === "orders"
                      ) {
                        return (
                          <td
                            key={header.name}
                            className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300"
                          >
                            <button
                              onClick={() =>
                                handleViewProducts(item.products_purchased)
                              }
                              className="bg-blue-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-blue-600 text-xs sm:text-sm"
                            >
                              View Products
                            </button>
                          </td>
                        );
                      }

                      // Regular table rendering for non-nested fields
                      if (header.name.toLowerCase() === "photo") {
                        return (
                          <td
                            key={header.name}
                            className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300"
                          >
                            <img
                              src={item.photo}
                              alt="Product"
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover mx-auto"
                            />
                          </td>
                        );
                      }

                      // Render standard fields, such as text
                      return (
                        <td
                          key={header.name}
                          className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300"
                        >
                          {typeof item[header.name.toLowerCase()] === "object"
                            ? (<button
                            onClick={() =>
                              handleViewProducts(item.products_purchased)
                            }
                            className="bg-blue-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-blue-600 text-xs sm:text-sm"
                          >
                            View Products
                          </button>)
                            : item[header.name.toLowerCase()]}
                        </td>
                      );
                    })}
                  <td className="py-3 px-2 sm:px-4 flex justify-center items-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-yellow-600 flex items-center text-xs sm:text-sm"
                    >
                      <BiSolidEdit className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-red-600 flex items-center text-xs sm:text-sm"
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

      {/* Product Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-semibold mb-4">Products Purchased</h2>
            <ul>
              {selectedProducts.map((product, index) => (
                <li key={index} className="border-b py-2">
                  <p>
                    <strong>Product:</strong> {product.product_name}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Rate:</strong> {product.rate}
                  </p>
                  <p>
                    <strong>Amount:</strong> {product.amount}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setProductModalOpen(false)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
