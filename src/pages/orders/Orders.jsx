import React, { useEffect, useState } from 'react';
import "./orders.css";
import oneplus from "./oneplus.jpeg";
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [userAddresses, setUserAddresses] = useState({});
  const [userId, setUserId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8001/users/me", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const user = await res.json();
          setUserId(user.id);
          setUserAddresses({ [user.id]: user.addresses || [] });
        } else {
          console.error("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching current user info:", err);
      }
    };

    if (token) fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8002/orders/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [userId]);

  useEffect(() => {
    if (orders.length > 0) {
      const fetchProductDetails = async () => {
        const map = {};
        for (const order of orders) {
          if (!map[order.product_id]) {
            try {
              const res = await fetch(`http://localhost:8000/products/${order.product_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                }
              });
              if (res.ok) {
                const product = await res.json();
                map[order.product_id] = product;
              }
            } catch (err) {
              console.error(`Error fetching product ${order.product_id}:`, err);
            }
          }
        }
        setProductsMap(map);
      };

      fetchProductDetails();
    }
  }, [orders, token]);

  return (
    <div className="orders-page">
      <h2 className="head">Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => {
          const product = productsMap[order.product_id];
          const productName = product?.name || "Loading...";
          const productPrice = product?.price || 0;
          const totalPrice = productPrice * order.quantity;

          const address = userAddresses[order.user_id]?.[0];
          const formattedAddress = address
            ? `${address.street}, ${address.city}, ${address.zip}`
            : "Address not available";

          return (
            <div
              key={order.order_id}
              className="order"
              onClick={() => navigate(`/orders/${order.order_id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="product">
                <img src={oneplus} alt="Product" className="order-image" />
                <div className="order-info">
                  <h2 className="order-title">Product: {productName}</h2>
                  <p className="order-description">User ID: {order.user_id}</p>
                  <p className="order-description">Quantity: {order.quantity}</p>
                  <span className="order-price">Price per unit: ${productPrice}</span><br />
                  <span className="order-price">Total Price: ${totalPrice}</span>
                </div>
              </div>

              <div className="order-details">
                <h2 className="order-title">Order Details:</h2>
                <p className="order-description">Order ID: {order.order_id}</p>
                <p className="order-description">Order Status: Confirmed</p>
                <p className="order-description">Shipping Address: {formattedAddress}</p>
              </div>
            </div>
          );
        })
      ) : (
        <p className="order-description">No orders available.</p>
      )}
    </div>
  );
};

export default Orders;
