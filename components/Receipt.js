"use client";
// components/Receipt.js

import React from 'react';

const Receipt = ({ cartItems, total, paymentMethod, refundAmount, storeDetails, onClose }) => {
  const onPrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            .receipt-items { margin: 20px 0; }
            .receipt-total { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>${storeDetails.name}</h2>
          <p>${storeDetails.address}</p>
          <p>${storeDetails.phone}</p>
          <h3>Receipt</h3>
          <div class="receipt-items">
            <ul>
              ${cartItems.map(item => `
                <li>${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}</li>
              `).join('')}
            </ul>
          </div>
          <div class="receipt-total">
            <span>Total: $${total.toFixed(2)}</span><br />
            <span>Payment Method: ${paymentMethod === 'cash' ? 'Cash' : 'Card'}</span><br />
            ${refundAmount > 0 ? `<span style="color: red;">Refund Amount: $${refundAmount.toFixed(2)}</span>` : ''}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="receipt-modal-content">
      <h2>{storeDetails.name}</h2>
      <p>{storeDetails.address}</p>
      <p>{storeDetails.phone}</p>
      <h3>Receipt</h3>
      <ul>
        {cartItems.map(item => (
          <li key={item.id} className="flex justify-between">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-bold">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold">
        <span>Payment Method:</span>
        <span>{paymentMethod === 'cash' ? 'Cash' : 'Card'}</span>
      </div>
      {refundAmount > 0 && (
        <div className="flex justify-between font-bold text-red-500">
          <span>Refund Amount:</span>
          <span>${refundAmount.toFixed(2)}</span>
        </div>
      )}
      <button onClick={onPrint} className="w-full bg-blue-500 text-white py-2 rounded mt-4">
        Print Receipt
      </button>
      <button onClick={onClose} className="w-full bg-gray-500 text-white py-2 rounded mt-2">
        Close
      </button>
    </div>
  );
};

export default Receipt;
