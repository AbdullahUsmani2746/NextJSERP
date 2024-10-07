import React from "react";
import { BiSolidEdit } from "react-icons/bi";
import { RiDeleteBin6Line } from "react-icons/ri"; // Importing a delete icon

const DynamicTable = ({ data, onEdit, onDelete, headers }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-center border border-gray-200 shadow-md rounded-lg">
        <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
          <tr>
            {headers.map((header) => (
              <th key={header} className="py-3 px-4 border-b">
                {header}
              </th>
            ))}
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition duration-300"
              >
                {headers.map((header) => (
                  <td key={header} className="py-3 px-4 border-b text-sm">
                    {item[header.toLowerCase()]}
                  </td>
                ))}
                <td className="py-3 px-4 border-b flex justify-center space-x-2">
                  <button
                    onClick={() => onEdit(item)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-yellow-600 flex items-center"
                  >
                    <BiSolidEdit className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md transition duration-300 hover:bg-red-600 flex items-center"
                  >
                    <RiDeleteBin6Line className="mr-1" />
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length + 1}
                className="text-center py-8 font-bold text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
