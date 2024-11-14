"use client";
import React, { useEffect, useState } from "react";
import DynamicTable from "@/components/Tables/DynamicTable";
import DynamicModal from "@/components/Modal/DynamicModal";
import ProductCard from "@/components/Cards/ProductCard";
import ProductCardWoo from "@/components/Cards/ProductCardWoo";

import ProductCategoryCard from "@/components/Cards/ProductCategoryCard";
import { motion, MotionConfig } from "framer-motion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

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
  orders: {
    name: "Orders",
    fields: [
      {
        name: "invoice_no",
        type: "text",
        placeholder: "Invoice Number",
        required: true,
      },
      { name: "date", type: "date", placeholder: "Date", required: true },
      { name: "time", type: "time", placeholder: "Time", required: true },
      {
        name: "customer_name",
        type: "text",
        placeholder: "Customer Name",
        required: true,
      },
      {
        name: "customer_contact_no",
        type: "text",
        placeholder: "Customer Contact Number",
        required: true,
      },
      {
        name: "products_purchased",
        type: "array",
        placeholder: "Products Purchased",
        fields: [
          {
            name: "product_name",
            type: "text",
            placeholder: "Product Name",
            required: true,
          },
          {
            name: "quantity",
            type: "number",
            placeholder: "Quantity",
            required: true,
          },
          { name: "rate", type: "number", placeholder: "Rate", required: true },
          {
            name: "amount",
            type: "number",
            placeholder: "Amount",
            required: true,
          },
        ],
        required: true,
      },
      {
        name: "total_amount",
        type: "number",
        placeholder: "Total Amount",
        required: true,
      },
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
  const [Woodata, setWooData] = useState([]);
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
      console.log(initialData.data);
      if (params.entity === "products") {
        setData(initialData.data.products); // Adjust based on your API response structure
      } else {
        setData(initialData.data); // Adjust based on your API response structure
      }
      setWooData(initialData.data.wcProducts);
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
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Silk Store</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{entity.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.4 }}>
        <div className="container mx-auto p-6">
          {params.entity === "orders" ? (
            ""
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedItem(null);
                  setModalOpen(true);
                }}
                className="bg-slate-700 text-slate-50 px-6 py-3 mb-4 rounded-lg shadow-sm transition-transform transform hover:bg-slate-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50"
              >
                Add {entity.name}
              </button>
            </div>
          )}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Responsive Grid Layout */}
          {params.entity === "products" ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mt-4">
              {data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={() => {
                    setSelectedItem(product);
                    setModalOpen(true);
                  }}
                  onDelete={() => handleDelete(product._id)}
                  className="transition-transform transform hover:scale-105"
                />
              ))}
              {Woodata.map((product) => (
                <ProductCardWoo
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {data.map((category) => (
                <ProductCategoryCard
                  key={category.id}
                  category={category}
                  onEdit={() => {
                    setSelectedItem(category);
                    setModalOpen(true);
                  }}
                  onDelete={() => handleDelete(category._id)}
                  className="transition-transform transform hover:scale-105"
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
              entity={entity}
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
      </MotionConfig>
    </SidebarInset>
  );
};

export default DynamicPage;
