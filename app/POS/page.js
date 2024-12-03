"use client";
// pages/POSPage.js

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/Cards/productCardPOS";
import CategoryFilter from "@/components/CategoryFilter";
import Notification from "@/components/Notification";
import Receipt from "@/components/Receipt";
import Modal from "@/components/Modal";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import CustomerModal from "@/components/CustomerModal";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
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

const POSPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [cashReceived, setCashReceived] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [notification, setNotification] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [showReceiptTotal, setShowReceiptTotal] = useState(0);
  const [showReceiptCart, setShowReceiptCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCashInputModal, setShowCashInputModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Customer modal state
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [customerList, setCustomerList] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.data.wcProducts);
    };

    const fetchCategories = async () => {
      const res = await fetch("/api/product_categories");
      const data = await res.json();
      setCategories(data.data);
    };

    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Fetch products and categories...
    const fetchCustomers = async () => {
      const res = await fetch("/api/customers");
      const data = await res.json();
      console.log(data.data);
      setCustomerList(data.data);
    };

    fetchCustomers();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => {
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
    setTotal(total + Number(product.price));
    setNotification(`Added ${product.name} to cart!`);
    setTimeout(() => setNotification(""), 3000);
  };

  const updateCartQuantity = (id, quantity) => {
    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
    const newTotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(newTotal);
  };

  const removeFromCart = (id) => {
    const removedItem = cart.find((item) => item.id === id);
    if (removedItem) {
      setTotal(
        total - Number(removedItem.price) * Number(removedItem.quantity)
      );
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    }
  };

  const submitOrder = async (cart, total, method) => {
    console.log(method);
    const orderData = {
      invoice_no: `INV-${Date.now()}`, // Example invoice number generation
      payment_method: method,
      date: new Date().toISOString().split("T")[0], // Order date in YYYY-MM-DD format
      time: new Date().toLocaleTimeString(), // Order time
      customer_name: customerName, // Replace with actual customer name if available
      customer_contact_no: customerContact, // Replace with actual contact if available
      products_purchased: cart.map((item) => ({
        product_name: item.name,
        quantity: item.quantity,
        rate: item.price,
        amount: item.quantity * item.price,
      })),
      total_amount: total,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to add order");
      }

      const data = await response.json();
      console.log("Order added successfully:", data);
      return { success: true };
    } catch (error) {
      console.error("Error adding order:", error);
      return { success: false, error: "Order could not be saved!" };
    }
  };

  const handleCashPayment = () => {
    setPaymentMethod("cash");
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
      // Call submitOrder to save the order
      submitOrder(cart, total, "Cash").then((result) => {
        if (result.success) {
          setNotification("Transaction completed!");
        } else {
          setNotification(
            "Transaction completed, but order could not be saved!"
          );
        }
      });
      setTimeout(() => setNotification(""), 3000);
      setTotal(0);
      setCashReceived("");
      setShowCashInputModal(false);
    } else {
      setNotification(
        "Cash received is less than total. Please enter a valid amount."
      );
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleCardPayment = () => {
    setShowReceipt(true);
    setShowReceiptTotal(total);
    setShowReceiptCart(cart);
    setRefundAmount(0);

    setCart([]);

    submitOrder(cart, total, "Card").then((result) => {
      if (result.success) {
        setNotification("Transaction completed!");
      } else {
        setNotification("Transaction completed, but order could not be saved!");
      }
    });
    setTimeout(() => setNotification(""), 3000);
    setTotal(0);
    setShowPaymentModal(false);
  };

  const handleCompleteSale = () => {
    if (total > 0) {
      // setShowPaymentModal(true);
      setIsCustomerModalOpen(true); // Open the customer modal
    } else {
      setNotification("Please add products to cart before completing sale.");
      setTimeout(() => setNotification(""), 3000);
    }
  };

  const handleAddOrEdit = async (item) => {
    const method = "POST";
    const url = `/api/customers`;

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
  };

  // Update the filtered products based on the search term
  const filteredProducts =
    selectedCategory === "All"
      ? products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products.filter(
          (product) =>
            product.category === selectedCategory &&
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
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
                      onClick={() =>
                        updateCartQuantity(
                          item.id,
                          Math.max(item.quantity - 1, 1)
                        )
                      }
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
                      onChange={(e) =>
                        updateCartQuantity(item.id, Number(e.target.value))
                      }
                      className="w-12 border rounded text-center mx-2"
                    />
                    <motion.button
                      onClick={() =>
                        updateCartQuantity(item.id, item.quantity + 1)
                      }
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
            onClose={() => setNotification("")}
          />
        )}

        {showPaymentModal && (
          <Modal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
          >
            <h2 className="text-lg font-bold mb-4">Select Payment Method</h2>
            <button
              onClick={handleCashPayment}
              className="w-full bg-green-400 text-white py-2 rounded mb-2"
            >
              Cash
            </button>
            <button
              onClick={() => {
                setPaymentMethod("card");
                handleCardPayment();
              }}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Card
            </button>
          </Modal>
        )}

        {showCashInputModal && (
          <Modal
            isOpen={showCashInputModal}
            onClose={() => setShowCashInputModal(false)}
          >
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

        {isCustomerModalOpen && (
          /* Customer Modal */
          <CustomerModal
            isOpen={isCustomerModalOpen}
            onClose={() => setIsCustomerModalOpen(false)}
            onSelectCustomer={(customer) => {
              setCustomerName(customer.name);
              setCustomerContact(customer.contact);
              setShowPaymentModal(true);
              setIsCustomerModalOpen(false); // Open the customer modal
            }}
            searchCustomer={searchCustomer}
            setSearchCustomer={setSearchCustomer}
            customerList={customerList}
            fetchCustomerByContact={(contact) => {
              // Add logic to fetch customer based on contact if necessary
            }}
            customerName={customerName}
            setCustomerName={setCustomerName}
            customerContact={customerContact}
            setCustomerContact={setCustomerContact}
            saveCustomerInfo={(newCustomer) => {
              // Add logic to save new customer if necessary
              setCustomerName(newCustomer.name);
              setCustomerContact(newCustomer.contact);
              handleAddOrEdit(newCustomer);
              setShowPaymentModal(true);
              setIsCustomerModalOpen(false); // Open the customer modal
            }}
          />
        )}
      </div>
    </SidebarInset>
  );
};

export default POSPage;
