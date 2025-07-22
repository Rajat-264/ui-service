import React, { useState, useEffect } from 'react';
import "./products.css";
import oneplus from "./oneplus.jpeg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Products = () => {
  const navigate = useNavigate();
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const priceRanges = [
    "All",
    "$0-399",
    "$400-699",
    "$700-899",
    "$900+"
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token missing");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8000/products/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (product) => {
    if (selectedPriceRange === "All") return true;
    const price = product.price;

    if (selectedPriceRange === "$0-399") return price <= 399;
    if (selectedPriceRange === "$400-699") return price >= 400 && price <= 699;
    if (selectedPriceRange === "$700-899") return price >= 700 && price <= 899;
    if (selectedPriceRange === "$900+") return price >= 900;

    return true;
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <div className="keywords-container">
          {selectedPriceRange !== "All" && (
            <span 
              className="keyword"
              onClick={() => setSelectedPriceRange("All")}
            >
              {selectedPriceRange} ×
            </span>
          )}
        </div>
      </div>

      <div className="products-content">
        <div className="filters-sidebar">
          <div className="filter-group">
            <div className="filter-header">
              <span className="filter-label">Price</span>
            </div>
            <div className="filter-options">
              {priceRanges.map((range) => (
                <div key={range} className="filter-option">
                  <input 
                    type="radio" 
                    id={`price-${range}`} 
                    name="price" 
                    className="filter-radio"
                    checked={selectedPriceRange === range}
                    onChange={() => setSelectedPriceRange(range)}
                  />
                  <label htmlFor={`price-${range}`}>{range}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="products-grid">
          {loading ? (
            <p>Loading...</p>
          ) : products.filter(filterProducts).length === 0 ? (
            <p>No products found</p>
          ) : (
            products.filter(filterProducts).map((product) => (
              <div 
                className="product-card" 
                key={product.id} 
                onClick={() => navigate("/product-detail/" + product.id)}
              >
                <img src={oneplus} alt="Product" className="product-image" />
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-stock">Stock: {product.stock}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
