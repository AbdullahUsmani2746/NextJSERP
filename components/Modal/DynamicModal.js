import React from 'react';
import DynamicForm from '@/components/Forms/DynamicForm';

const DynamicModal = ({ isOpen, toggleModal, onSubmit, initialData, entity }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl mb-4">{initialData ? `Edit ${entity.name}` : `Add ${entity.name}`}</h2>
        <DynamicForm initialData={initialData} onSubmit={onSubmit} toggleModal={toggleModal} entity={entity} />
      </div>
    </div>
  );
};

export default DynamicModal;
