"use client";
import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/Tables/DynamicTable";
import DynamicModal from "@/components/Modal/DynamicModal";
import ProductCard from "@/components/Cards/ProductCard";
import ProductCategoryCard from "@/components/Cards/ProductCategoryCard";
import { motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";

const entityConfig = {
  organizations: {
    name: "Organizations",
    fields: [
      { name: "name", type: "text", placeholder: "Name", required: true },
      { name: "email", type: "email", placeholder: "Email", required: true },
      { name: "contact", type: "text", placeholder: "Contact" },
      { name: "address", type: "text", placeholder: "Address" },
      { name: "city", type: "text", placeholder: "City" },
      { name: "country", type: "text", placeholder: "Country" },
    ],
  },
  users: {
    name: "Users",
    fields: [
      {
        name: "username",
        type: "text",
        placeholder: "Username",
        required: true,
      },
      { name: "email", type: "email", placeholder: "Email", required: true },
      {
        name: "password",
        type: "password",
        placeholder: "Password",
        required: true,
      },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  companies: {
    name: "Companies",
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "Company Name",
        required: true,
      },
      { name: "address", type: "text", placeholder: "Address" },
      { name: "contact", type: "text", placeholder: "Phone Number" },
      { name: "email", type: "email", placeholder: "Email" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  vendors: {
    name: "Vendors",
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "Vendor Name",
        required: true,
      },
      { name: "address", type: "text", placeholder: "Address" },
      { name: "contact", type: "text", placeholder: "Phone Number" },
      { name: "email", type: "email", placeholder: "Email" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  customers: {
    name: "Customers",
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "Customer Name",
        required: true,
      },
      { name: "address", type: "text", placeholder: "Address" },
      { name: "contact", type: "text", placeholder: "Phone Number" },
      { name: "email", type: "email", placeholder: "Email" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  brands: {
    name: "Brands",
    fields: [
      { name: "name", type: "text", placeholder: "Brand Name", required: true },
      { name: "description", type: "text", placeholder: "Description" },
      { name: "photo", type: "file", placeholder: "Upload Photo" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  units: {
    name: "Units",
    fields: [
      { name: "name", type: "text", placeholder: "Unit Name", required: true },
      { name: "symbol", type: "text", placeholder: "Symbol" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  product_categories: {
    name: "Product Categories",
    fields: [
      {
        name: "name",
        type: "text",
        placeholder: "Category Name",
        required: true,
      },
      { name: "description", type: "text", placeholder: "Description" },
      { name: "photo", type: "file", placeholder: "Upload Photo" },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
    ],
  },
  products: {
    name: "Products",
    fields: [
      {
        name: "reference",
        type: "text",
        placeholder: "Reference",
        required: true,
      },
      {
        name: "name",
        type: "text",
        placeholder: "Product Name",
        required: true,
      },
      {
        name: "organization",
        type: "select",
        placeholder: "Organization",
        required: true,
      },
      {
        name: "product_category",
        type: "select",
        placeholder: "Product Category",
        required: true,
      },
      { name: "brand", type: "select", placeholder: "Brand", required: true },
      { name: "unit", type: "select", placeholder: "Unit", required: true },
      { name: "slug", type: "text", placeholder: "Slug" },
      { name: "sku", type: "text", placeholder: "SKU" },
      { name: "weight", type: "text", placeholder: "Weight" },
      { name: "price", type: "number", placeholder: "Price", required: true },
      { name: "stock_alert", type: "number", placeholder: "Stock Alert" },
      { name: "photo", type: "file", placeholder: "Upload Photo" },
    ],
  },
};

const DynamicPage = ({ params }) => {
  const entity = entityConfig[params.entity];
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/${params.entity}`, {
        next: { revalidate: 10 },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      const initialData = await res.json();
      setData(initialData.data); // Adjust based on your API response structure
    } catch (err) {
      console.error(err);
      setError("Error fetching data.");
    }
  };

  const handleAddOrEdit = async (item) => {
    const method = selectedItem ? "PUT" : "POST";
    const url = `/api/${params.entity}`;

    if (item.photo) {
      const imageData = new FormData();
      imageData.append("file", item.photo);

      const imageResponse = await fetch("/api/upload", {
        method: "POST",
        body: imageData,
      });

      if (!imageResponse.ok) {
        const errorMessage = await imageResponse.text();
        console.error("Error uploading file:", errorMessage);
        return;
      }

      const { filename } = await imageResponse.json();
      item.photo = filename;
    }

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    fetchData();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/${params.entity}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [params.entity]); // Include params.entity to refetch when the entity changes

  return (
    <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
      <div className="app">
        <Sidebar />
        <div className="flex-1 p-6 main-content">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {entity.name}
            </h1>
            <button
              onClick={() => {
                setSelectedItem(null);
                setModalOpen(true);
              }}
              className="bg-blue-600 text-white px-6 py-3 my-3 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add {entity.name}
            </button>

            {/* Handle error display */}
            {error && <p className="text-red-500">{error}</p>}

            {params.entity === "products" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {data.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => {
                      setSelectedItem(product);
                      setModalOpen(true);
                    }}
                    onDelete={() => handleDelete(product._id)}
                  />
                ))}
              </div>
            ) : params.entity === "product_categories" ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {data.map((category) => (
                  <ProductCategoryCard
                    key={category.id}
                    category={category}
                    onEdit={() => {
                      setSelectedItem(category);
                      setModalOpen(true);
                    }}
                    onDelete={() => handleDelete(category._id)}
                  />
                ))}
              </div>
            ) : (
              <DynamicTable
                data={data}
                headers={entity.fields.map(
                  (field) =>
                    field.name.charAt(0).toUpperCase() + field.name.slice(1)
                )}
                onEdit={(item) => {
                  setSelectedItem(item);
                  setModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            )}

            <DynamicModal
              isOpen={modalOpen}
              toggleModal={() => setModalOpen(false)}
              onSubmit={handleAddOrEdit}
              initialData={selectedItem}
              entity={entity}
            />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
};

export default DynamicPage;