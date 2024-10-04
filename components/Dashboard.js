"use client"; // Ensures the component is a client-side component

import React, { useState, useEffect } from 'react';
import OrganizationTable from './Tables/OrganizationTable';
import OrganizationModal from './Modal/OrganizationModal';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    // Fetch data from your API endpoint
    const fetchOrganizations = async () => {
      const response = await fetch('/api/organization'); // Fetch from API
      const data = await response.json();
      setOrganizations(data.data);
    };
    fetchOrganizations();
  }, []);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="flex-1 p-6 main-content">
      <div className="mb-6">
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={toggleModal}
        >
          Add Organization
        </button>
      </div>

      <OrganizationTable organizations={organizations} />

      {isModalOpen && (
        <OrganizationModal toggleModal={toggleModal} />
      )}
    </div>
  );
};

export default Dashboard;
