import React, { useEffect, useState } from 'react';
import "./product-detail.css";
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import oneplus from "./oneplus.jpeg"; // Assuming this is the image you want to display

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch product details using ID from route param
    const fetchProduct = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token missing");
        return;
      }

      try {
        console.log("Fetching product with ID:", id);
        const res = await axios.get(`http://localhost:8000/products/${id}`, {
          headers: {
          Authorization: `Bearer ${token}`
          }
      });

        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <img src={oneplus} alt={product.name} className="product-detail-image" />
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <span className="product-detail-price">${product.price}</span>
          <p className="product-detail-stock">Stock: {product.stock}</p>

          <div className="buttons">
            <Link to={`/checkout?id=${product.id}`} style={{ textDecoration: 'none' }}>
              <button className="btn">Buy Now</button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
