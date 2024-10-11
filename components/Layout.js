// components/Layout.js
import React from "react";
import Sidebar from "./Sidebar";  // Import your Sidebar component

const Layout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar should remain constant */}
      <Sidebar />
      
      {/* Main content area */}
      <main className="flex-grow p-6">
        {children} {/* Dynamic content will be rendered here */}
      </main>
    </div>
  );
};

export default Layout;
