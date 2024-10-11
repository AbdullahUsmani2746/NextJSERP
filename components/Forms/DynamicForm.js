import React, { useState, useEffect } from "react";

const DynamicForm = ({ entity, initialData, onSubmit, toggleModal }) => {
  const [formData, setFormData] = useState({});
  const [dropdownData, setDropdownData] = useState({
    organizations: [],
    productCategories: [],
    brands: [],
    units: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchPromises = [];

      if (entity.fields.some((field) => field.name === "organization")) {
        fetchPromises.push(
          fetch("/api/organizations")
            .then((res) => res.json())
            .then((data) => ({ organizations: data.data }))
        );
      }

      if (entity.fields.some((field) => field.name === "product_category")) {
        fetchPromises.push(
          fetch("/api/product_categories")
            .then((res) => res.json())
            .then((data) => ({ product_categorys: data.data }))
        );
      }

      if (entity.fields.some((field) => field.name === "brand")) {
        fetchPromises.push(
          fetch("/api/brands")
            .then((res) => res.json())
            .then((data) => ({ brands: data.data }))
        );
      }

      if (entity.fields.some((field) => field.name === "unit")) {
        fetchPromises.push(
          fetch("/api/units")
            .then((res) => res.json())
            .then((data) => ({ units: data.data }))
        );
      }

      if (fetchPromises.length > 0) {
        const results = await Promise.all(fetchPromises);
        const mergedResults = results.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setDropdownData((prevData) => ({ ...prevData, ...mergedResults }));
      }

      setLoading(false);
    };

    const fieldsToFetch = entity.fields.some((field) =>
      ["organization", "product_category", "brand", "unit"].includes(field.name)
    );

    if (fieldsToFetch) {
      fetchData();
    }

    setFormData(initialData || {});
  }, [entity, initialData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else if (type === "select-one") {
      const selectedOption = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        [name + "_id"]: selectedOption.id,
        [name]: selectedOption.name,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    toggleModal();
  };

  // Custom file input for better UI
  const renderFileInput = (field) => (
    <div className="col-span-2">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {field.placeholder}
      </label>
      <input
        type="file"
        name={field.name}
        onChange={handleChange}
        className="hidden"
        id={`file-input-${field.name}`}
      />
      <label
        htmlFor={`file-input-${field.name}`}
        className="cursor-pointer flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        {field.placeholder}
      </label>
      {formData[field.name] && (
        <span className="mt-2 block text-sm text-gray-600">
          {formData[field.name].name}
        </span>
      )}
    </div>
  );

  // Conditionally render loading message or form
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entity.fields.map((field) => {
          if (field.type === "file") {
            return renderFileInput(field);
          }

          if (["organization", "product_category", "brand", "unit"].includes(field.name)) {
            return (
              <div key={field.name}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Select {field.name.replace("_", " ")}
                </label>
                <select
                  name={field.name}
                  value={JSON.stringify({
                    id: formData[field.name + "_id"],
                    name: formData[field.name],
                  })}
                  onChange={handleChange}
                  required={field.required}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="">Select {field.name.replace("_", " ")}</option>
                  {dropdownData[field.name + "s"]?.map((item) => (
                    <option
                      key={item._id}
                      value={JSON.stringify({ id: item._id, name: item.name })}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            );
          } else {
            return (
              <div key={field.name}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  {field.placeholder}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            );
          }
        })}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          onClick={toggleModal}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
