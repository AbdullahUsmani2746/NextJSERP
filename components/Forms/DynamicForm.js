import React, { useState, useEffect } from "react";

const DynamicForm = ({ entity, initialData, onSubmit, toggleModal }) => {
  const [formData, setFormData] = useState({});
  const [dropdownData, setDropdownData] = useState({
    organizations: [],
    productCategories: [],
    brands: [],
    units: [],
  });
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchData = async () => {
      const fetchPromises = [];

      // Fetch organization data
      if (entity.fields.some((field) => field.name === "organization")) {
        fetchPromises.push(
          fetch("/api/organizations")
            .then((res) => res.json())
            .then((data) => ({ organizations: data.data }))
        );
      }

      // Fetch product category data
      if (entity.fields.some((field) => field.name === "product_category")) {
        fetchPromises.push(
          fetch("/api/product_categories")
            .then((res) => res.json())
            .then((data) => ({ productCategories: data.data }))
        );
      }

      // Fetch brand data
      if (entity.fields.some((field) => field.name === "brand")) {
        fetchPromises.push(
          fetch("/api/brands")
            .then((res) => res.json())
            .then((data) => ({ brands: data.data }))
        );
      }

      // Fetch unit data
      if (entity.fields.some((field) => field.name === "unit")) {
        fetchPromises.push(
          fetch("/api/units")
            .then((res) => res.json())
            .then((data) => ({ units: data.data }))
        );
      }

      // Wait for all the relevant fetches and update state accordingly
      const results = await Promise.all(fetchPromises);
      const mergedResults = results.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setDropdownData((prevData) => ({ ...prevData, ...mergedResults }));
      setLoading(false); // Set loading to false after fetching
    };

    if (
      entity.fields.some((field) =>
        ["organization", "product_category", "brand", "unit"].includes(
          field.name
        )
      )
    ) {
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
      // Parse the selected option value (if it's a JSON string)
      const selectedOption = JSON.parse(value);
      setFormData((prev) => ({
        ...prev,
        [name + "_id"]: selectedOption.id, // Store the selected ID
        [name]: selectedOption.name, // Store the selected name
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

  console.log(formData);
  console.log("Dropdown Data: ", dropdownData);

  // Conditionally render loading message or form
  if (loading) {
    return <div>Loading...</div>; // Display loading state while fetching data
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {entity.fields.map((field) => {
        if (
          ["organization", "product_category", "brand", "unit"].includes(
            field.name
          )
        ) {
          return (
            <select
              key={field.name}
              name={field.name}
              value={JSON.stringify({
                id: formData[field.name + "_id"],
                name: formData[field.name],
              })}
              onChange={handleChange}
              required={field.required}
              className="mysleect border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
          );
        } else {
          return (
            <input
              key={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          );
        }
      })}

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
