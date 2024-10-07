import React from "react";
import { AiOutlineClose } from "react-icons/ai"; // Importing a close icon
import DynamicForm from "@/components/Forms/DynamicForm";

const DynamicModal = ({
  isOpen,
  toggleModal,
  onSubmit,
  initialData,
  entity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            {initialData ? `Edit ${entity.name}` : `Add ${entity.name}`}
          </h2>
          <button
            onClick={toggleModal}
            className="text-gray-600 hover:text-gray-900"
          >
            <AiOutlineClose size={24} />
          </button>
        </div>
        <DynamicForm
          initialData={initialData}
          onSubmit={onSubmit}
          toggleModal={toggleModal}
          entity={entity}
        />
      </div>
    </div>
  );
};

export default DynamicModal;
