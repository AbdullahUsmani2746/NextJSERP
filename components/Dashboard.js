"use client"; // Ensures the component is a client-side component

import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import DatePicker from "react-datepicker"; // Assuming you have date picker library for the range selector
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [salesData, setSalesData] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalCashSales: 0,
    totalCardSales: 0,
    cashOrders: 0,
    cardOrders: 0,
    salesByDateRange: {
      day: { cash: 0, card: 0 },
      month: { cash: 0, card: 0 },
      year: { cash: 0, card: 0 },
    },
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showCharts, setShowCharts] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const salesResponse = await fetch("/api/orders");
        const sales = await salesResponse.json();
        console.log(sales);

        // Initialize counters
        let cashOrders = 0;
        let cardOrders = 0;
        const salesByDateRange = {
          day: { cash: 0, card: 0 },
          month: { cash: 0, card: 0 },
          year: { cash: 0, card: 0 },
        };

        // Filter orders by selected date range
        const filteredSales = sales.data.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            (!startDate || orderDate >= new Date(startDate)) &&
            (!endDate || orderDate <= new Date(endDate))
          );
        });

        filteredSales.forEach((order) => {
          const date = new Date(order.createdAt);
          const now = new Date();
          const diffTime = Math.abs(now - date);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          const isSameMonth = date.getMonth() === now.getMonth();
          const isSameYear = date.getFullYear() === now.getFullYear();

          const totalAmount = order.total_amount;
          const isCash = order.payment_method === "Cash";
          const isCard = order.payment_method === "Card";

          if (isCash) {
            cashOrders++;
            if (diffDays <= 1) salesByDateRange.day.cash += totalAmount;
            if (isSameMonth) salesByDateRange.month.cash += totalAmount;
            if (isSameYear) salesByDateRange.year.cash += totalAmount;
          }

          if (isCard) {
            cardOrders++;
            if (diffDays <= 1) salesByDateRange.day.card += totalAmount;
            if (isSameMonth) salesByDateRange.month.card += totalAmount;
            if (isSameYear) salesByDateRange.year.card += totalAmount;
          }
        });

        setSalesData({
          totalOrders: filteredSales.length,
          totalProducts: filteredSales.reduce((acc, order) => {
            return (
              acc +
              order.products_purchased.reduce(
                (sum, product) => sum + product.quantity,
                0
              )
            );
          }, 0),
          totalCashSales: salesByDateRange.year.cash,
          totalCardSales: salesByDateRange.year.card,
          cashOrders,
          cardOrders,
          salesByDateRange,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchDashboardData();
  }, [startDate, endDate]); // Re-fetch data when date range is changed

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleChartVisibility = () => {
    setShowCharts(!showCharts);
  };

  const handleSearchClick = () => {
    // This function will trigger the data fetching logic with the selected date range
    // Re-fetch the data when the search button is clicked
    console.log(
      "Fetching data with the selected date range",
      startDate,
      endDate
    );
    // You can modify the useEffect logic to call the fetch function when the search button is clicked
  };

  // Sales by Date Range Chart (Line Chart)
  const salesChartData = {
    labels: ["Day", "Month", "Year"],
    datasets: [
      {
        label: "Cash Sales",
        data: [
          salesData.salesByDateRange.day.cash,
          salesData.salesByDateRange.month.cash,
          salesData.salesByDateRange.year.cash,
        ],
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
      {
        label: "Card Sales",
        data: [
          salesData.salesByDateRange.day.card,
          salesData.salesByDateRange.month.card,
          salesData.salesByDateRange.year.card,
        ],
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.1,
      },
    ],
  };

  // Payment Method Sales Chart (Bar Chart)
  const paymentMethodChartData = {
    labels: ["Cash", "Card"],
    datasets: [
      {
        label: "Sales",
        data: [salesData.totalCashSales, salesData.totalCardSales],
        backgroundColor: ["rgba(75,192,192,0.2)", "rgba(153, 102, 255, 0.2)"],
        borderColor: ["rgba(75,192,192,1)", "rgba(153, 102, 255, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex-1 p-6 main-content bg-gray-50">
      {/* Removed heading */}

      {/* Dashboard Overview */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-3xl">{salesData.totalOrders}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Products Sale</h2>
          <p className="text-3xl">{salesData.totalProducts}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Cash Sales</h2>
          <p className="text-3xl">{salesData.totalCashSales}</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-lg font-semibold">Total Card Sales</h2>
          <p className="text-3xl">{salesData.totalCardSales}</p>
        </div>
      </div>

      {/* Date Range Filter Below the Card Section */}
      <div className="flex justify-between mb-8 mt-4">
        <div className="flex items-center justify-center space-x-4 w-full">
          <div className="flex items-center">
            <label className="mr-4">Start Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              className="px-4 py-2 border border-gray-300 rounded"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <div className="flex items-center">
            <label className="mr-4">End Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              className="px-4 py-2 border border-gray-300 rounded"
              dateFormat="yyyy/MM/dd"
            />
          </div>
          <button
            onClick={handleSearchClick}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Toggle Chart Visibility */}
      <div className="flex justify-between mb-4">
        <button
          onClick={toggleChartVisibility}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showCharts ? "Hide Charts" : "Show Charts"}
        </button>
      </div>

      {/* Show the Charts if enabled */}
      {showCharts && (
        <div className="flex justify-between gap-6">
          <div className="w-1/2">
            <h2 className="text-lg font-semibold mb-4">Sales by Date Range</h2>
            <Line data={salesChartData} options={{ responsive: true }} />
          </div>
          <div className="w-1/2">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <Bar data={paymentMethodChartData} options={{ responsive: true }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
