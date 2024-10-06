import React from 'react';
import { BiSolidEdit } from "react-icons/bi";


const DynamicTable = ({ data, onEdit, onDelete, headers }) => {
 
  return (
    <table className="min-w-full bg-white text-center border">
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header} className="py-2">{header}</th>
          ))}
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item._id}>
              {headers.map((header) => (
                <td key={header} className="py-2">{item[header.toLowerCase()]}</td>
              ))}
              <td className="py-2">
                <button onClick={() => onEdit(item)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                <BiSolidEdit />

                </button>
                <button onClick={() => onDelete(item._id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headers.length + 1} className="text-center py-8 font-bold">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DynamicTable;
