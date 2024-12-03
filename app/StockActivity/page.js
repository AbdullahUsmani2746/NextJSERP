"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

const StockActivity = () => {
  const [activityEntries, setActivityEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    code: "",
    product: "",
    openQty: "",
    packingQty: "",
    salesQty: "",
    closeQty: "",
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10); // Number of entries per page

  const componentRef = useRef();

  // Fetch activity entries
  useEffect(() => {
    axios
      .get("/api/stockactivity")
      .then((response) => {
        setActivityEntries(response.data);
        setFilteredEntries(response.data);
      })
      .catch((error) => console.error("Error fetching stock activity:", error));
  }, []);

  // Handle form submission for adding or updating an entry
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axios
        .put(`/api/stockactivity/${editEntry._id}`, newEntry)
        .then((response) => {
          setActivityEntries((prev) =>
            prev.map((entry) =>
              entry._id === editEntry._id ? response.data : entry
            )
          );
          setFilteredEntries((prev) =>
            prev.map((entry) =>
              entry._id === editEntry._id ? response.data : entry
            )
          );
          setEditMode(false);
          setShowModal(false);
          resetNewEntry();
        })
        .catch((error) =>
          console.error("Error updating stock activity entry:", error)
        );
    } else {
      axios
        .post("/api/stockactivity", newEntry)
        .then((response) => {
          setActivityEntries((prev) => [...prev, response.data]);
          setFilteredEntries((prev) => [...prev, response.data]);
          setShowModal(false);
          resetNewEntry();
        })
        .catch((error) =>
          console.error("Error adding stock activity entry:", error)
        );
    }
  };

  // Reset new entry form
  const resetNewEntry = () => {
    setNewEntry({
      code: "",
      product: "",
      openQty: "",
      packingQty: "",
      salesQty: "",
      closeQty: "",
    });
  };

  // Handle deletion of a stock activity entry
  const handleDelete = (id) => {
    axios
      .delete(`/api/stockactivity/${id}`)
      .then(() => {
        setActivityEntries((prev) => prev.filter((entry) => entry._id !== id));
        setFilteredEntries((prev) => prev.filter((entry) => entry._id !== id));
      })
      .catch((error) =>
        console.error("Error deleting stock activity entry:", error)
      );
  };

  // Handle edit of a stock activity entry and show the modal
  const handleEdit = (entry) => {
    setNewEntry(entry);
    setEditEntry(entry);
    setEditMode(true);
    setShowModal(true); // Open modal on edit
  };

  // Date Filtering
  const handleFilter = () => {
    let filtered = activityEntries;
    if (fromDate && toDate) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(fromDate) && entryDate <= new Date(toDate);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        entry.product.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  };

  // Search handler
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    handleFilter();
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Download the activity as Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEntries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockActivity");
    XLSX.writeFile(wb, "StockActivity.xlsx");
  };

  // Print functionality using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container mx-auto p-4 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6">Stock Activity</h1>

      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Product"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-3 border border-gray-300 rounded shadow w-1/4"
        />
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500"
        >
          Add Entry
        </button>
      </div>

      {/* Date Filter Form */}
      <div className="mb-6">
        <label className="mr-2">From:</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="mr-4 p-2 border border-gray-300 rounded"
        />
        <label className="mr-2">To:</label>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="mr-4 p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleFilter}
          className="px-6 py-2 bg-gray-600 text-white rounded shadow"
        >
          Filter
        </button>
      </div>

      {/* Stock Activity Table */}
      <table className="table-auto w-full border-collapse mb-6 shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 border">Code</th>
            <th className="p-3 border">Product</th>
            <th className="p-3 border">Open Qty</th>
            <th className="p-3 border">Packing Qty</th>
            <th className="p-3 border">Sales Qty</th>
            <th className="p-3 border">Close Qty</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry) => (
            <tr key={entry._id}>
              <td className="p-3 border">{entry.code}</td>
              <td className="p-3 border">{entry.product}</td>
              <td className="p-3 border">{entry.openQty}</td>
              <td className="p-3 border">{entry.packingQty}</td>
              <td className="p-3 border">{entry.salesQty}</td>
              <td className="p-3 border">{entry.closeQty}</td>
              <td className="p-3 border">
                <button
                  onClick={() => handleEdit(entry)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-400 text-white rounded ml-2"
        >
          Previous
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastEntry >= filteredEntries.length}
          className="px-4 py-2 bg-gray-400 text-white rounded ml-2"
        >
          Next
        </button>
      </div>

      {/* Download and Print Options */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleDownloadExcel}
          className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-500 mr-4"
        >
          Download Excel
        </button>
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-purple-600 text-white rounded shadow hover:bg-purple-500"
        >
          Print
        </button>
      </div>

      {/* Modal for Add/Edit Entry */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-2xl mb-4">{editMode ? "Edit" : "Add"} Entry</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">Code</label>
              <input
                type="text"
                value={newEntry.code}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, code: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Product</label>
              <input
                type="text"
                value={newEntry.product}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, product: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Open Qty</label>
              <input
                type="number"
                value={newEntry.openQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, openQty: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Packing Qty</label>
              <input
                type="number"
                value={newEntry.packingQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, packingQty: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Sales Qty</label>
              <input
                type="number"
                value={newEntry.salesQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, salesQty: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <label className="block mb-2">Close Qty</label>
              <input
                type="number"
                value={newEntry.closeQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, closeQty: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded mb-4"
              />
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                  {editMode ? "Update" : "Add"} Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockActivity;
