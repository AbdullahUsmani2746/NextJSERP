// components/Cart.js

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Notification from './Notification';

const Cart = ({ cartItems, onRemoveFromCart, total, handlePayment }) => {
  const [cashReceived, setCashReceived] = useState('');
  const [showNotification, setShowNotification] = useState({ message: '', type: '' });

  const calculateRefund = () => {
    const refund = cashReceived - total;
    return refund >= 0 ? refund.toFixed(2) : 0;
  };

  const handleCashPayment = () => {
    const refund = calculateRefund();
    if (cashReceived < total) {
      setShowNotification({ message: 'Insufficient cash received!', type: 'error' });
    } else {
      handlePayment(refund);
      setShowNotification({ message: 'Payment successful!', type: 'success' });
      setCashReceived('');
    }
  };

  return (
    <div className="w-2/5 p-4 bg-white border-l">
      {showNotification.message && (
        <Notification message={showNotification.message} type={showNotification.type} />
      )}
      <h2 className="text-xl font-bold mb-4">Cart & Checkout</h2>
      <ul className="mb-4">
        {cartItems.map((item, index) => (
          <li key={index} className="flex justify-between mb-2">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
            <motion.button 
              onClick={() => onRemoveFromCart(item.id)}
              className="text-red-500 ml-2"
              whileHover={{ scale: 1.1 }}
            >
              &#10006; {/* Close icon */}
            </motion.button>
          </li>
        ))}
      </ul>
      <hr className="my-2" />
      <div className="flex justify-between font-bold text-lg">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      
      <div className="mb-4 mt-4">
        <label className="text-lg font-semibold">Cash Received:</label>
        <input
          type="number"
          value={cashReceived}
          onChange={(e) => setCashReceived(e.target.value)}
          placeholder="Enter cash amount"
          className="w-full border rounded p-2"
        />
        <div className="flex justify-between font-bold text-lg mt-2">
          <span>Refund:</span>
          <span>${calculateRefund()}</span>
        </div>
      </div>
      <button
        onClick={handleCashPayment}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Complete Transaction
      </button>
    </div>
  );
};

export default Cart;
