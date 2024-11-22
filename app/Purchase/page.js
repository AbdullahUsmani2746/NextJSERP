"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";

const PurchasePage = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [total, setTotal] = useState(0);
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
      setProducts(data.data);
    };

    fetchVendors();
    fetchProducts();
  }, []);

  // Add product to the purchase cart
  const addToPurchaseCart = (product) => {
    setPurchaseCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Update quantity and cost in the cart
  const updateCart = (id, field, value) => {
    setPurchaseCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, [field]: Number(value) } : item
      )
    );
  };

  // Remove product from the cart
  const removeFromCart = (id) => {
    setPurchaseCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Calculate total price
  useEffect(() => {
    const newTotal = purchaseCart.reduce(
      (acc, item) => acc + item.quantity * item.cost_price,
      0
    );
    setTotal(newTotal);
  }, [purchaseCart]);

  // Submit Purchase
  const handleSubmitPurchase = async () => {
    if (!selectedVendor) {
      alert("Please select a vendor.");
      return;
    }

    const purchaseOrder = {
      vendor_id: selectedVendor,
      date: new Date().toISOString().split("T")[0],
      products: purchaseCart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        cost_price: item.cost_price,
        total_price: item.quantity * item.cost_price,
      })),
      total,
    };

    try {
      const response = await fetch("/api/purchases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseOrder),
      });

      if (response.ok) {
        alert("Purchase order saved successfully.");
        setPurchaseCart([]);
        setTotal(0);
        setSelectedVendor("");
      } else {
        alert("Failed to save purchase order.");
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
    }
  };

  //   // Filtered products based on search term
  const filteredProducts = Array.isArray(products)
  ? products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase Module</h1>

      {/* Vendor Selection */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Vendor</label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="w-full p-3 border rounded"
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
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded"
          />
          <FiSearch className="absolute top-3 right-3 text-gray-500" />
        </div>
        <div className="grid grid-cols-4 gap-4 mt-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="p-4 border rounded shadow cursor-pointer"
              whileHover={{ scale: 1.05 }}
              onClick={() => addToPurchaseCart(product)}
            >
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-sm text-gray-600">${product.cost_price}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Cart */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Purchase Cart</h2>
        <ul>
          {purchaseCart.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between mb-2"
            >
              <span>{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateCart(item.id, "quantity", e.target.value)
                }
                className="w-16 p-1 border rounded text-center"
              />
              <input
                type="number"
                value={item.cost_price}
                onChange={(e) =>
                  updateCart(item.id, "cost_price", e.target.value)
                }
                className="w-16 p-1 border rounded text-center"
              />
              <motion.button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineDelete />
              </motion.button>
            </li>
          ))}
        </ul>
      </div>

      {/* Total and Submit */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Total: ${total.toFixed(2)}</h3>
        <button
          onClick={handleSubmitPurchase}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
          Submit Purchase
        </button>
      </div>
    </div>
  );
};

export default PurchasePage;
