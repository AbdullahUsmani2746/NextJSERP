import React, { useState, useEffect } from 'react';

const DynamicForm = ({ entity, initialData, onSubmit, toggleModal }) => {
  const [formData, setFormData] = useState({});
  const [dropdownData, setDropdownData] = useState({ organizations: [], productCategories: [], brands: [], units: [] });

  useEffect(() => {
    // Function to selectively fetch data based on required fields in entity
    const fetchData = async () => {
      const fetchPromises = [];

      // Check if `organization_id` is needed
      if (entity.fields.some(field => field.name === 'organization')) {
        fetchPromises.push(fetch('/api/organizations').then(res => res.json()).then(data => ({ organizations: data.data })));
        console.log()
      }

      // Check if `product_category_id` is needed
      if (entity.fields.some(field => field.name === 'product_category')) {
        fetchPromises.push(fetch('/api/product_categories').then(res => res.json()).then(data => ({ productCategories: data.data })));
      }

      // Check if `brand_id` is needed
      if (entity.fields.some(field => field.name === 'brand')) {
        fetchPromises.push(fetch('/api/brands').then(res => res.json()).then(data => ({ brands: data.data })));
      }

      // Check if `unit_id` is needed
      if (entity.fields.some(field => field.name === 'unit')) {
        fetchPromises.push(fetch('/api/units').then(res => res.json()).then(data => ({ units: data.data })));
      }

      // Wait for all the relevant fetches and update state accordingly
      const results = await Promise.all(fetchPromises);

      const mergedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      console.log(mergedResults)
      setDropdownData(prevData => ({ ...prevData, ...mergedResults }));
      console.log(dropdownData)

    };

    

    // Call fetchData only if there are dropdowns to fetch
    if (entity.fields.some(field => ['organization', 'product_category', 'brand', 'unit'].includes(field.name))) {
      fetchData();
    }

    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [entity, initialData]);

  useEffect(() => {
    console.log('Updated dropdownData:', dropdownData);
  }, [dropdownData]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
  
    // If the input type is 'file', capture the file object instead of a string
    if (type === 'file') {
      // Get the first file from the file input
      const file = e.target.files[0];
      
      setFormData((prev) => ({
        ...prev,
        [name]: file, // Store the file object in formData
      }));
    } else {
      // Handle all other input types as usual
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    toggleModal();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {entity.fields.map((field) => {
        if (field.name === 'organization') {
          return (
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              className="border p-2 w-full"
            >
              <option value="">Select Organization</option>
              {dropdownData.organizations.map((org) => (
                <option key={org._id} value={JSON.stringify({ id: org._id, name: org.name })}>
                  {org.name}
                </option>
              ))}
            </select>
          );
        } else if (field.name === 'product_category') {
          return (
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              className="border p-2 w-full"
            >
              <option value="">Select Product Category</option>
              {dropdownData.productCategories.map((category) => (
                <option key={category._id} value={JSON.stringify({ id: category._id, name: category.name })}>
                  {category.name}
                </option>
              ))}
            </select>
          );
        } else if (field.name === 'brand') {
          return (
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              className="border p-2 w-full"
            >
              <option value="">Select Brand</option>
              {dropdownData.brands.map((brand) => (
                <option key={brand._id} value={JSON.stringify({ id: brand._id, name: brand.name })}>
                  {brand.name}
                </option>
              ))}
            </select>
          );
        } else if (field.name === 'unit') {
          return (
            <select
              key={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              className="border p-2 w-full"
            >
              <option value="">Select Unit</option>
              {dropdownData.units.map((unit) => (
                <option key={unit._id} value={JSON.stringify({ id: unit._id, name: unit.name })}>
                  {unit.name}
                </option>
              ))}
            </select>
          );
        } else {
          return (
            <>
            {field.type === 'file' ? ( // Check if the input type is 'file'
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                onChange={handleChange}
                required={field.required}
                className="border p-2 w-full"
              />
            ) : (
              <input
                key={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={handleChange}
                required={field.required}
                className="border p-2 w-full"
              />
            )}
          </>
          );
        }
      })}
      <div className="flex justify-end">
        <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={toggleModal}>
          Cancel
        </button>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
