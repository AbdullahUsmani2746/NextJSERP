"use client"
import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/Cards/ProductCard'; // Assuming you have this component

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products'); // API endpoint to fetch products
        if (res.ok) {
          const data = await res.json();
          console.log(data.data)
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", res.status);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Products;
