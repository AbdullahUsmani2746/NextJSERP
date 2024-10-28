"use client";
// pages/POSPage.js

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/Cards/productCardPOS';
import CategoryFilter from "@/components/CategoryFilter";
import Notification from '@/components/Notification'; // Import Notification
import Receipt from '@/components/Receipt'; // Import Receipt
import Modal from '@/components/Modal'; // Import Modal
import { motion } from 'framer-motion';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [cashReceived, setCashReceived] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [showReceiptTotal, setShowReceiptTotal] = useState(0);
  const [showReceiptCart, setShowReceiptCart] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCashInputModal, setShowCashInputModal] = useState(false); // New state for cash input
  const [refundAmount, setRefundAmount] = useState(0); // New state for refunds

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data.products);
    };

    const fetchCategories = async () => {
      const res = await fetch('/api/product_categories');
      const data = await res.json();
      setCategories(data.data);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item.id === product.id);
      if (existingProduct) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setTotal(total + Number(product.price));
    setNotification(`Added ${product.name} to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  const updateCartQuantity = (id, quantity) => {
    setCart((prevCart) => {
      return prevCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    });
    const newTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const removeFromCart = (id) => {
    const removedItem = cart.find(item => item.id === id);
    if (removedItem) {
      setTotal(total - (Number(removedItem.price) * Number(removedItem.quantity)));
      setCart((prevCart) => prevCart.filter(item => item.id !== id));
    }
  };

  const handleCashPayment = () => {
    setPaymentMethod('cash');
    setShowCashInputModal(true); // Show cash input modal
    setShowPaymentModal(false); // Close payment modal
  };

  const completeCashPayment = () => {
    const cash = Number(cashReceived);
    if (cash >= total) {
      const change = cash - total;
      setRefundAmount(change);
      setShowReceipt(true);
      setShowReceiptTotal(total);
      setShowReceiptCart(cart);

      setCart([]);
      setNotification('Transaction completed!');
      setTimeout(() => setNotification(''), 3000);
      setTotal(0);
      setCashReceived(''); // Reset cash received input
      setShowCashInputModal(false); // Close cash input modal
    } else {
      setNotification('Cash received is less than total. Please enter a valid amount.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleCardPayment = () => {
    setShowReceipt(true);
    setShowReceiptTotal(total);
    setShowReceiptCart(cart);
    setRefundAmount(0);

    setCart([]);
    setNotification('Transaction completed!');
    setTimeout(() => setNotification(''), 3000);
    setTotal(0);
    setShowPaymentModal(false); // Close payment modal
  };

  const handleCompleteSale = () => {
    if (total > 0) {
      setShowPaymentModal(true);
    } else {
      setNotification('Please add products to cart before completing sale.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="flex h-screen">
      <div className="w-3/5 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Products</h2>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      <div className="w-2/5 p-4 bg-white border-l">
        <h2 className="text-xl font-bold mb-4">Cart & Checkout</h2>
        <ul className="mb-4">
          {cart.map((item) => (
            <motion.li 
              key={item.id}
              className="flex justify-between items-center mb-2 relative"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <span>{item.name}</span>
              <span>${item.price}</span>
              <div className="flex items-center">
                <motion.button 
                  onClick={() => updateCartQuantity(item.id, Math.max(item.quantity - 1, 1))}
                  className="text-blue-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AiOutlineMinus />
                </motion.button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartQuantity(item.id, Number(e.target.value))}
                  className="w-16 border rounded text-center mx-2"
                />
                <motion.button 
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="text-blue-500"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AiOutlinePlus />
                </motion.button>
              </div>
              <motion.button 
                onClick={() => removeFromCart(item.id)} 
                className="text-red-500 absolute right-0"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineDelete />
              </motion.button>
            </motion.li>
          ))}
        </ul>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>${Number(total).toFixed(2)}</span>
        </div>

        <button
          onClick={handleCompleteSale}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Complete Sale
        </button>
      </div>

      {/* Show Notification */}
      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification('')} 
        />
      )}

      {/* Payment Method Selection Modal */}
      {showPaymentModal && (
        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
          <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
          <button
            onClick={handleCashPayment} // Directly handle cash payment
            className="w-full bg-green-500 text-white py-2 rounded mb-2"
          >
            Cash
          </button>
          <button
            onClick={() => {
              setPaymentMethod('card');
              handleCardPayment();
            }}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Card
          </button>
        </Modal>
      )}

      {/* Cash Input Modal */}
      {showCashInputModal && (
        <Modal isOpen={showCashInputModal} onClose={() => setShowCashInputModal(false)}>
          <h2 className="text-lg font-bold mb-4">Enter Cash Received</h2>
          <input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full border rounded p-2 mb-4"
            placeholder="Cash Received"
          />
          <button
            onClick={completeCashPayment}
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Confirm Payment
          </button>
        </Modal>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)}>

        <Receipt 
          cartItems={showReceiptCart}
          total={showReceiptTotal}
          paymentMethod={paymentMethod}
          refundAmount={refundAmount} // Include refund amount for display
          storeDetails={{
            name: "Your Store Name",
            address: "Your Store Address",
            phone: "Your Store Phone",
          }}
          onClose={() => {
      setRefundAmount(0);
      setShowReceipt(false);
      setShowReceiptTotal(0);
      setShowReceiptCart(0);
          }}
        />
                </Modal>

      )}
    </div>
  );
};

export default POSPage;
