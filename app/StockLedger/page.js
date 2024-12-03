"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";

const StockLedger = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    date: "",
    transaction: "",
    transNumber: "",
    inQty: "",
    outQty: "",
    balQty: "",
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

  // Fetch ledger entries
  useEffect(() => {
    axios
      .get("/api/stockledger")
      .then((response) => {
        setLedgerEntries(response.data);
        setFilteredEntries(response.data);
      })
      .catch((error) => console.error("Error fetching stock ledger:", error));
  }, []);

  // Handle form submission for adding or updating an entry
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      axios
        .put(`/api/stockledger/${editEntry._id}`, newEntry)
        .then((response) => {
          setLedgerEntries((prev) =>
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
          console.error("Error updating stock ledger entry:", error)
        );
    } else {
      axios
        .post("/api/stockledger", newEntry)
        .then((response) => {
          setLedgerEntries((prev) => [...prev, response.data]);
          setFilteredEntries((prev) => [...prev, response.data]);
          setShowModal(false);
          resetNewEntry();
        })
        .catch((error) =>
          console.error("Error adding stock ledger entry:", error)
        );
    }
  };

  // Reset new entry form
  const resetNewEntry = () => {
    setNewEntry({
      date: "",
      transaction: "",
      transNumber: "",
      inQty: "",
      outQty: "",
      balQty: "",
    });
  };

  // Handle deletion of a stock ledger entry
  const handleDelete = (id) => {
    axios
      .delete(`/api/stockledger/${id}`)
      .then(() => {
        setLedgerEntries((prev) => prev.filter((entry) => entry._id !== id));
        setFilteredEntries((prev) => prev.filter((entry) => entry._id !== id));
      })
      .catch((error) =>
        console.error("Error deleting stock ledger entry:", error)
      );
  };

  // Handle edit of a stock ledger entry and show the modal
  const handleEdit = (entry) => {
    setNewEntry(entry);
    setEditEntry(entry);
    setEditMode(true);
    setShowModal(true); // Open modal on edit
  };

  // Date Filtering
  const handleFilter = () => {
    let filtered = ledgerEntries;
    if (fromDate && toDate) {
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= new Date(fromDate) && entryDate <= new Date(toDate);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((entry) =>
        entry.transaction.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Download the ledger as Excel
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredEntries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "StockLedger");
    XLSX.writeFile(wb, "StockLedger.xlsx");
  };

  // Print functionality using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container mx-auto p-4 bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6">Stock Ledger</h1>

      {/* Search */}
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search Transaction"
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

      {/* Stock Ledger Table */}
      <table className="table-auto w-full border-collapse mb-6 shadow-md">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Transaction</th>
            <th className="p-3 border">Trans#</th>
            <th className="p-3 border">In Qty</th>
            <th className="p-3 border">Out Qty</th>
            <th className="p-3 border">Bal Qty</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEntries.map((entry) => (
            <tr key={entry._id}>
              <td className="p-3 border">{entry.date}</td>
              <td className="p-3 border">{entry.transaction}</td>
              <td className="p-3 border">{entry.transNumber}</td>
              <td className="p-3 border">{entry.inQty}</td>
              <td className="p-3 border">{entry.outQty}</td>
              <td className="p-3 border">{entry.balQty}</td>
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

      {/* Print and Download Excel */}
      <div className="mt-4 flex justify-between">
        {/* <button
          onClick={handlePrint}
          className="px-6 py-2 bg-green-600 text-white rounded shadow"
        >
          Print All Pages
        </button> */}
        <button
          onClick={handleDownloadExcel}
          className="px-6 py-2 bg-gray-600 text-white rounded shadow"
        >
          Download Excel
        </button>
      </div>

      {/* Modal for Adding/Editing Entries */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? "Edit Entry" : "Add New Entry"}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="date"
                value={newEntry.date}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, date: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Transaction"
                value={newEntry.transaction}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, transaction: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Trans#"
                value={newEntry.transNumber}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, transNumber: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="In Qty"
                value={newEntry.inQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, inQty: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Out Qty"
                value={newEntry.outQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, outQty: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <input
                type="number"
                placeholder="Bal Qty"
                value={newEntry.balQty}
                onChange={(e) =>
                  setNewEntry({ ...newEntry, balQty: e.target.value })
                }
                className="p-2 w-full mb-4 border border-gray-300 rounded"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                  {editMode ? "Update Entry" : "Add Entry"}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockLedger;
