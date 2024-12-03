import React, { useState, useEffect } from "react";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { LuX } from "react-icons/lu"; // Lucid X icon for closing modal

const DynamicTable = ({ data, onEdit, onDelete, headers, entity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleHeaders, setVisibleHeaders] = useState(
    headers.map((header) => ({ name: header, visible: true }))
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState(""); // "Cash" or "Card"
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Set items per page to 10

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleHeaderVisibility = (header) => {
    setVisibleHeaders((prev) =>
      prev.map((h) => (h.name === header ? { ...h, visible: !h.visible } : h))
    );
  };

  // Filtered Data based on search term, date range, and payment method
  const filteredData = data.filter((item) => {
    const matchesSearchTerm = headers.some((header) =>
      item[header.toLowerCase()]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const matchesDateRange =
      (!fromDate || new Date(item.date) >= new Date(fromDate)) &&
      (!toDate || new Date(item.date) <= new Date(toDate));

    const matchesPaymentMethod =
      !paymentMethod ||
      item.payment_method?.toLowerCase() === paymentMethod.toLowerCase();

    return matchesSearchTerm && matchesDateRange && matchesPaymentMethod;
  });

  // Calculate Grand Total for filtered data
  const grandTotal = filteredData.reduce(
    (total, item) => total + (item.total_amount || 0),
    0
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleViewProducts = (products) => {
    setSelectedProducts(products);
    setProductModalOpen(true); // Open modal when viewing products
  };

  const handleCloseModal = () => {
    setProductModalOpen(false); // Close modal when done
  };

  return (
    <div className="p-4 sm:p-6 bg-white text-text rounded-lg shadow-lg">
      {/* Grand Total */}
      {entity.name === "Orders" && (
        <div className="m-4 flex justify-base text-lg font-bold text-text text-center ">
          Grand Total: ${grandTotal.toFixed(2)}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-0 sm:mr-4 w-full sm:max-w-xs relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-100 border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10 text-text"
          />
          <FiSearch className="absolute right-3 top-4 text-text" />
        </div>

        {/* Date Range Filter */}
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {entity.name === "Orders" && (
            <>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-text"
              />
              <span className="text-text">to</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-text"
              />
            </>
          )}
        </div>

        {/* Payment Method Dropdown */}
        {entity.name === "Orders" && (
          <div className="relative">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-gray-100 border border-gray-300 rounded-md p-2 text-text focus:outline-none hover:bg-gray-200 transition duration-300"
            >
              <option value="">All Payment Methods</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>
        )}

        {/* Show/Hide Columns Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-100 p-2 text-text rounded-md border border-gray-300 focus:outline-none"
          >
            <IoIosArrowDown className="inline mr-2" />
            Show/Hide Columns
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-md z-50">
              <ul className="py-2 text-sm">
                {headers.map((header) => (
                  <li
                    key={header}
                    className="px-4 py-2 flex justify-between items-center hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleHeaderVisibility(header)}
                  >
                    <span>{header}</span>
                    <span className="text-xs text-gray-500">
                      {visibleHeaders.find((h) => h.name === header)?.visible
                        ? "Hide"
                        : "Show"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white text-center border border-gray-300 rounded-lg shadow-md">
          <thead className="bg-gray-100 text-text uppercase text-sm">
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
          <tbody className="text-text">
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-100 transition duration-300"
                >
                  {visibleHeaders
                    .filter((h) => h.visible)
                    .map((header) => {
                      if (
                        header.name.toLowerCase() === "products_purchased" &&
                        entity.name === "Orders"
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

                      if (header.name.toLowerCase() === "photo") {
                        return (
                          <td
                            key={header.name}
                            className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300"
                          >
                            <img
                              src={item.photo}
                              alt="Product"
                              className="w-12 h-12 rounded-full mx-auto"
                            />
                          </td>
                        );
                      }

                      return (
                        <td
                          key={header.name}
                          className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300"
                        >
                          {item[header.name.toLowerCase()]}
                        </td>
                      );
                    })}
                  <td className="py-3 px-2 sm:px-4 text-sm border-b border-gray-300">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      <BiSolidEdit />
                    </button>
                    <button
                      onClick={() => onDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="py-3 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="text-text text-sm"
          >
            Previous
          </button>
          <span className="mx-2 text-text text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-text text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Product Viewing */}
      {productModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-8 rounded-xl w-11/12 max-w-lg shadow-xl">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Product Details
            </h3>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
            >
              X
            </button>
            <div className="overflow-y-auto p-4 max-h-[500px]">
              {selectedProducts.map((product) => (
                <div key={product.product_name} className="mb-8">
                  {/* Product Name */}
                  <p className="text-xl font-semibold text-gray-800 mb-2">
                    {product.product_name}
                  </p>

                  {/* Product Rate and Quantity in Flexbox layout */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Rate</p>
                      <p className="text-lg font-medium text-gray-800">
                        ${parseFloat(product.rate).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Quantity</p>
                      <p className="text-lg font-medium text-gray-800">
                        {product.quantity}
                      </p>
                    </div>
                  </div>
                  {/* Separator */}
                  <div className="h-1 bg-gray-100 my-4 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
