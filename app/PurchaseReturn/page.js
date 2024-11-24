"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const PurchaseReturnPage = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [returnCart, setReturnCart] = useState([]);
  const [totalRefund, setTotalRefund] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vendors and products
  useEffect(() => {
    const fetchVendors = async () => {
      const res = await fetch("/api/vendors");
      const data = await res.json();
      setVendors(data.data || []);
    };

    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.data.wcProducts || []);
    };

    fetchVendors();
    fetchProducts();
  }, []);

  // Add product to the return cart
  const addToReturnCart = (product) => {
    setReturnCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, returnQuantity: item.returnQuantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, returnQuantity: 1 }];
    });
  };

  // Update return quantity and cost
  const updateCart = (id, field, value) => {
    setReturnCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  // Remove product from the return cart
  const removeFromCart = (id) => {
    setReturnCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate total refund
  useEffect(() => {
    const newTotalRefund = returnCart.reduce(
      (acc, item) => acc + item.returnQuantity * item.cost_price,
      0
    );
    setTotalRefund(newTotalRefund);
  }, [returnCart]);

  // Submit Purchase Return
  const handleSubmitReturn = async () => {
    if (!selectedVendor) {
      alert("Please select a vendor.");
      return;
    }

    const returnOrder = {
      vendor_id: selectedVendor,
      date: new Date().toISOString().split("T")[0],
      products: returnCart.map((item) => ({
        product_id: item.id,
        returnQuantity: item.returnQuantity,
        cost_price: item.cost_price,
        total_refund: item.returnQuantity * item.cost_price,
      })),
      totalRefund,
    };

    try {
      const response = await fetch("/api/purchase-returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnOrder),
      });

      if (response.ok) {
        alert("Purchase return processed successfully.");
        setReturnCart([]);
        setTotalRefund(0);
        setSelectedVendor("");
      } else {
        alert("Failed to process purchase return.");
      }
    } catch (error) {
      console.error("Error processing return:", error);
    }
  };

  // Filtered products based on search term
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Purchase Return</h1>

      {/* Vendor Selection */}
      <div className="mb-6">
        <label className="block font-medium mb-2 text-gray-700">Vendor</label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="w-full p-3 border rounded shadow focus:outline-none focus:ring focus:ring-indigo-500"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Search and Listing */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded shadow focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <FiSearch className="absolute top-3 right-3 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="p-4 border rounded shadow cursor-pointer bg-gray-50 hover:bg-indigo-50"
              whileHover={{ scale: 1.05 }}
              onClick={() => addToReturnCart(product)}
            >
              <h3 className="text-lg font-medium text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600">${product.cost_price}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Return Cart */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Return Cart</h2>
        <ul>
          {returnCart.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between mb-3 border p-3 rounded shadow"
            >
              <span className="text-gray-700">{item.name}</span>
              <input
                type="number"
                value={item.returnQuantity}
                onChange={(e) =>
                  updateCart(item.id, "returnQuantity", e.target.value)
                }
                className="w-16 p-2 border rounded text-center shadow"
              />
              <motion.button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
                whileHover={{ scale: 1.2 }}
              >
                <AiOutlineDelete />
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* Total Refund and Submit */}
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray-800">
          Total Refund: ${totalRefund.toFixed(2)}
        </span>
        <button
          onClick={handleSubmitReturn}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
        >
          Submit Return
        </button>
      </div>
    </div>
  );
};

export default PurchaseReturnPage;
