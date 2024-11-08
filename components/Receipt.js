"use client";
// components/Receipt.js

import React, { useState } from 'react';

const Receipt = ({ cartItems, total, paymentMethod, refundAmount, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printError, setPrintError] = useState(null);

  // Demo store details
  const storeDetails = {
    name: "Demo Store",
    address: "1234 Market St, Suite 100, Cityville, ST 12345",
    phone: "(123) 456-7890",
  };

  const onPrint = () => {
    // Validate receipt data
    if (cartItems.length === 0) {
      setPrintError('No items in cart to print.');
      return;
    }

    setIsPrinting(true);
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      setPrintError('Print window could not be opened. Please check your browser settings.');
      setIsPrinting(false);
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; color: #333; }
            .store-details { text-align: center; margin-bottom: 20px; }
            .receipt-items { margin: 20px 0; }
            .receipt-total { font-weight: bold; font-size: 18px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <div class="store-details">
            <h2>${storeDetails.name}</h2>
            <p>${storeDetails.address}</p>
            <p>${storeDetails.phone}</p>
            <p>${new Date().toLocaleString()}</p>
          </div>
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
    
    // Allow time for the document to render before printing
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
      setIsPrinting(false);
    };

    printWindow.onerror = () => {
      setPrintError('An error occurred while printing. Please try again.');
      setIsPrinting(false);
    };
  };

  return (
    <div className="receipt-modal-content p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold text-center">Receipt</h2>
      <div className="store-details text-center mb-4">
        <h3 className="text-lg">{storeDetails.name}</h3>
        <p>{storeDetails.address}</p>
        <p>{storeDetails.phone}</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
      <ul>
        {cartItems.map(item => (
          <li key={item.id} className="flex justify-between py-1 border-b">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between font-bold mt-4">
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
      {printError && <div className="error text-center mt-4">{printError}</div>}
      <button 
        onClick={onPrint} 
        disabled={isPrinting}
        className={`w-full bg-blue-500 text-white py-2 rounded mt-4 ${isPrinting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isPrinting ? 'Printing...' : 'Print Receipt'}
      </button>
      <button onClick={onClose} className="w-full bg-gray-500 text-white py-2 rounded mt-2">
        Close
      </button>
    </div>
  );
};

export default Receipt;
