"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineDelete } from "react-icons/ai";

const PurchasePage = () => {
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]); // Units list
  const [selectedVendor, setSelectedVendor] = useState("");
  const [purchaseCart, setPurchaseCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    cost_price: "",
    unit: "",
    quantity: "",
  });

  // Fetch vendors, products, and units
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

    const fetchUnits = async () => {
      const res = await fetch("/api/units");
      const data = await res.json();
      setUnits(data.data || []);
    };

    fetchVendors();
    fetchProducts();
    fetchUnits();
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

  // Handle new product input change
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Add new product
  const handleAddNewProduct = async (e) => {
    e.preventDefault();
    const { name, cost_price, unit, quantity } = newProduct;

    if (!name || !cost_price || !unit || !quantity) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        setProducts((prev) => [...prev, addedProduct.data]);
        setNewProduct({ name: "", cost_price: "", unit: "", quantity: "" });
        alert("Product added successfully.");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Filtered products based on search term
  const filteredProducts = Array.isArray(products)
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Purchase Module
      </h1>

      {/* Vendor Selection */}
      <div className="mb-6">
        <label className="block font-medium text-gray-700 mb-2">
          Select Vendor
        </label>
        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Select Vendor --</option>
          {vendors.map((vendor) => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Product */}
      <form
        onSubmit={handleAddNewProduct}
        className="p-6 border rounded-lg mb-6 bg-white shadow-md"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add New Product
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handleNewProductChange}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="number"
            name="cost_price"
            placeholder="Cost Price"
            value={newProduct.cost_price}
            onChange={handleNewProductChange}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <select
            name="unit"
            value={newProduct.unit}
            onChange={handleNewProductChange}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">-- Select Unit --</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.name}>
                {unit.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={newProduct.quantity}
            onChange={handleNewProductChange}
            className="p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500"
        >
          Add Product
        </button>
      </form>

      {/* Product Search and Listing */}
      <div className="mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <FiSearch className="absolute top-3 right-3 text-gray-500" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg cursor-pointer bg-white"
              whileHover={{ scale: 1.05 }}
              onClick={() => addToPurchaseCart(product)}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">${product.cost_price}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Purchase Cart */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Purchase Cart</h2>
        <ul>
          {purchaseCart.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between bg-white p-4 mb-3 rounded-lg shadow-sm"
            >
              <span className="font-medium">{item.name}</span>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateCart(item.id, "quantity", e.target.value)
                }
                className="w-16 p-2 border rounded-lg text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                value={item.cost_price}
                onChange={(e) =>
                  updateCart(item.id, "cost_price", e.target.value)
                }
                className="w-16 p-2 border rounded-lg text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

      {/* Total and Submit */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow">
        <span className="text-xl font-bold text-gray-700">
          Total: ${total.toFixed(2)}
        </span>
        <button
          onClick={handleSubmitPurchase}
          className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-500"
        >
          Submit Purchase
        </button>
      </div>
    </div>
  );
};

export default PurchasePage;
