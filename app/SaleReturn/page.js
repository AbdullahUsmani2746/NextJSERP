"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AiOutlineSearch, AiOutlineDelete } from "react-icons/ai";
import Notification from "@/components/Notification";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
const SaleReturn = () => {
  const [returnCart, setReturnCart] = useState([]);
  const [searchInvoice, setSearchInvoice] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [notification, setNotification] = useState("");

  // Fetch Invoice Details
  const fetchInvoiceDetails = async () => {
    try {
      const res = await fetch(`/api/orders?invoice_no=${searchInvoice}`);
      const data = await res.json();
      console.log(data.data);
      if (data && data.data) {
        setInvoiceDetails(data.data);
      } else {
        setNotification("Invoice not found!");
        setTimeout(() => setNotification(""), 3000);
      }
    } catch (error) {
      console.error("Error fetching invoice:", error);
      setNotification("Failed to fetch invoice.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  // Add product to return cart
  const addToReturnCart = (product) => {
    setReturnCart((prevCart) => {
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
    setNotification(`Added ${product.product_name} to return cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  // Remove product from return cart
  const removeFromReturnCart = (id) => {
    setReturnCart((prevCart) => prevCart.filter((item) => item.id !== id));
    setNotification("Product removed from return cart.");
    setTimeout(() => setNotification(""), 3000);
  };

  // Process Return
  const handleReturnSubmission = async () => {
    const returnData = {
      invoice_no: invoiceDetails.invoice_no,
      date: new Date().toISOString().split("T")[0],
      returned_products: returnCart.map((item) => ({
        product_name: item.product_name,
        quantity: item.quantity,
        rate: item.rate,
        refund_amount: item.quantity * item.rate,
      })),
    };

    try {
      const res = await fetch("/api/sales_return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(returnData),
      });

      // if (res.ok) {
      //   // Update the Orders Table
      //   const updatedProducts = invoiceDetails.products_purchased.filter(
      //     (product) =>
      //       !returnCart.some((returned) => returned.id === product.id)
      //   );
      //   const updatedInvoice = {
      //     ...invoiceDetails,
      //     products_purchased: updatedProducts,
      //     total_amount: updatedProducts.reduce(
      //       (acc, item) => acc + item.rate * item.quantity,
      //       0
      //     ),
      //     is_returned: "YES",
      //   };

      //   await fetch(`/api/orders/${invoiceDetails.invoice_no}`, {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(updatedInvoice),
      //   });

      //   setNotification("Return processed successfully!");
      //   setReturnCart([]);
      //   setInvoiceDetails(null);
      //   setTimeout(() => setNotification(""), 3000);
      // } else {
      //   throw new Error("Failed to process return.");
      // }
    } catch (error) {
      console.error("Error processing return:", error);
      setNotification("Failed to process return.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Silk Store</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>POS System</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 flex flex-col gap-6 h-full">
        {notification && <Notification message={notification} />}
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Sale Return</h2>

        {/* Search Invoice */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter Invoice Number"
            value={searchInvoice}
            onChange={(e) => setSearchInvoice(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-lg p-3 shadow-md focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
          />
          <motion.button
            onClick={fetchInvoiceDetails}
            className="bg-black text-white px-5 py-3 rounded-lg shadow-lg hover:bg-gray-900"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AiOutlineSearch className="inline mr-2" />
            Search
          </motion.button>
        </div>

        {/* Invoice Details */}
        {invoiceDetails && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-3">Invoice Details</h3>
            <p>
              <strong>Invoice No:</strong> {invoiceDetails.invoice_no}
            </p>
            <p>
              <strong>Date:</strong> {invoiceDetails.date}
            </p>
            <ul className="space-y-2 mt-3">
              {invoiceDetails.products_purchased.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow"
                >
                  <span>{product.product_name}</span>
                  <span>${product.rate}</span>
                  <motion.button
                    onClick={() => addToReturnCart(product)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Return
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Return Cart */}
        {returnCart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-50 p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Return Cart</h3>
            <ul className="space-y-2">
              {returnCart.map((item) => (
                <motion.li
                  key={item.id}
                  className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
                >
                  <span>{item.product_name}</span>
                  <span>${item.rate}</span>
                  <span>Qty: {item.quantity}</span>
                  <motion.button
                    onClick={() => removeFromReturnCart(item.id)}
                    className="text-red-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AiOutlineDelete />
                  </motion.button>
                </motion.li>
              ))}
            </ul>
            <button
              onClick={handleReturnSubmission}
              className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700"
            >
              Process Return
            </button>
          </div>
        )}
      </div>
    </SidebarInset>
  );
};

export default SaleReturn;
