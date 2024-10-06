"use client"; // Ensures the component is a client-side component

import React, { useState, useEffect } from 'react';
import OrganizationTable from './Tables/DynamicTable';
import OrganizationModal from './Modal/DynamicModal';

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
   
      </div>

     
    </div>
  );
};

export default Dashboard;
