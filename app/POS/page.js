"use client";
// pages/POSPage.js

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/Cards/productCardPOS';
import CategoryFilter from "@/components/CategoryFilter";
import Notification from '@/components/Notification';
import Receipt from '@/components/Receipt';
import Modal from '@/components/Modal';
import { motion } from 'framer-motion';
import { FiSearch } from "react-icons/fi";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
  const [showCashInputModal, setShowCashInputModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');



  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.data.wcProducts);
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
    setShowCashInputModal(true);
    setShowPaymentModal(false);
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
      setCashReceived('');
      setShowCashInputModal(false);
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
    setShowPaymentModal(false);
  };

  const handleCompleteSale = () => {
    if (total > 0) {
      setShowPaymentModal(true);
    } else {
      setNotification('Please add products to cart before completing sale.');
      setTimeout(() => setNotification(''), 3000);
    }
  };


  // Update the filtered products based on the search term
  const filteredProducts = selectedCategory === 'All'
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products.filter(product => 
        product.category === selectedCategory && product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <SidebarInset>
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Silk Store
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>POS System</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
    <div className="flex h-full">
      <div className="w-[75%] px-4  mt-2">
      {/* // Include this input element in your JSX for the search bar */}
    
          <div className="mb-4 w-full sm:max-w-xs relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 border border-gray-300 rounded-full p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 pr-10 text-gray-900"
          />
          <FiSearch className="absolute right-3 top-4 text-gray-500" />
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1  gap-4 mt-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
          ))}
        </div>
      </div>

      <div className=" w-[25%] p-4 border-l-2 border-slate-400 flex justify-between flex-col">
        <div>
        <h2 className="text-2xl font-bold mb-4">Cart & Checkout</h2>
        <ul className="space-y-4">
        {cart.map((item) => (
            <motion.li 
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <span className="font-semibold">{item.name}</span>
              <span className="text-gray-700">${item.price}</span>
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
                  className="w-12 border rounded text-center mx-2"
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
                className="text-red-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AiOutlineDelete />
              </motion.button>
            </motion.li>
          ))}
        </ul>
        </div>

        <div>
          <hr className="my-4" />
          <div className="flex justify-between font-bold text-xl">
            <span>Total:</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>

        <button
          onClick={handleCompleteSale}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition duration-200"
        >
          Complete Sale
        </button>
        </div>
      </div>

      {notification && (
        <Notification 
          message={notification} 
          onClose={() => setNotification('')} 
        />
      )}

      {showPaymentModal && (
        <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)}>
          <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
          <button
            onClick={handleCashPayment}
            className="w-full bg-green-400 text-white py-2 rounded mb-2"
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

      {showCashInputModal && (
        <Modal isOpen={showCashInputModal} onClose={() => setShowCashInputModal(false)}>
          <h2 className="text-lg font-bold mb-4">Enter Cash Received</h2>
          <input
            type="number"
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            placeholder="Enter cash amount"
            className="w-full p-2 border rounded mb-4"
          />
          <button
            onClick={completeCashPayment}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            Complete Payment
          </button>
        </Modal>
      )}

      {showReceipt && (
                <Modal isOpen={showReceipt} onClose={() => setShowReceipt(false)}>

        <Receipt
          total={showReceiptTotal}
          cartItems={showReceiptCart}
          refundAmount={refundAmount}
          paymentMethod={paymentMethod}
          onClose={() => setShowReceipt(false)}
        />
        </Modal>

      )}
    </div>
    </SidebarInset>

  );
};

export default POSPage;
