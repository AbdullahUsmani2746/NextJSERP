// components/Notification.js

import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg transition-transform transform animate-bounce">
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 font-bold">X</button>
    </div>
  );
};

export default Notification;
