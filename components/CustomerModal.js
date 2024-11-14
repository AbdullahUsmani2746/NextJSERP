import React, { useState } from "react";

const CustomerModal = ({
  isOpen,
  onClose,
  onSelectCustomer,
  searchCustomer,
  setSearchCustomer,
  customerList,
  fetchCustomerByContact,
  customerName,
  setCustomerName,
  customerContact,
  setCustomerContact,
  saveCustomerInfo,
}) => {
  if (!isOpen) return null;

  const handleSearch = () => {
    // Implement the search logic
    fetchCustomerByContact(searchCustomer);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-lg font-bold mb-4">Customer Information</h2>

        {/* Search Input */}
        <input
          type="text"
          value={searchCustomer}
          onChange={(e) => setSearchCustomer(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Search by contact"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded mb-4"
        >
          Search Customer
        </button>

        {/* Customer List */}
        <ul className="space-y-2 mb-4">
          {customerList.length === 0 ? (
            <li className="text-red-500">No customers found.</li>
          ) : customerList.filter((customer) =>
              customer.contact.includes(searchCustomer)
            ).length === 0 ? (
            <li className="text-red-500">No matching customers found.</li>
          ) : (
            customerList
              .filter((customer) => customer.contact.includes(searchCustomer))
              .map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => onSelectCustomer(customer)}
                  className="cursor-pointer text-blue-500"
                >
                  {customer.name} - {customer.contact}
                </li>
              ))
          )}
        </ul>

        {/* New Customer Input */}
        <h3 className="text-sm font-semibold">Or Enter New Customer Info:</h3>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Customer Name"
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          value={customerContact}
          onChange={(e) => setCustomerContact(e.target.value)}
          placeholder="Customer Contact"
          className="w-full p-2 border rounded mb-4"
        />
        <button
          onClick={() =>
            saveCustomerInfo({ name: customerName, contact: customerContact })
          }
          className="w-full bg-green-500 text-white py-2 rounded mb-4"
        >
          Save New Customer
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-500 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomerModal;
