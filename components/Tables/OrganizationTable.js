import React from 'react';

const OrganizationTable = ({ organizations = [] }) => {
  return (
    <table className="min-w-full bg-white text-center">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Address</th>
          <th className="py-2">Contact</th>
        </tr>
      </thead>
      <tbody>
        {organizations.length > 0 ? (
          organizations.map((organization) => (
            <tr key={organization._id}>
              <td className="py-2">{organization.name}</td>
              <td className="py-2">{organization.address}</td>
              <td className="py-2">{organization.contact}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center py-2">
              No organizations available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrganizationTable;
