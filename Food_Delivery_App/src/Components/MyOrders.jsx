import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaBox, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard, FaCheckCircle } from "react-icons/fa";
import Rating from "./Rating.jsx";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(`/api/order/myorders?userId=${userId}`);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.error ||
          err.message ||
          "Failed to load orders. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setErrorMsg("User not logged in.");
      setLoading(false);
    }
  }, [userId, fetchOrders]);

  const handleRatingSubmit = async (orderId, value) => {
    try {
      await axios.post(`/api/rate`, {
        restaurantId: orderId,
        userId,
        rating: value,
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  if (loading)
    return (
      <div className="orders-loader-container">
        <div className="orders-spinner"></div>
        <p>Fetching your delicious history...</p>
      </div>
    );

  if (errorMsg)
    return (
      <div className="orders-empty-state">
        <div className="error-icon">!</div>
        <h3>Oops! Something went wrong</h3>
        <p>{errorMsg}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
      </div>
    );

  if (!orders.length)
    return (
      <div className="orders-empty-state">
        <div className="empty-cart-icon">🛒</div>
        <h3>No orders yet</h3>
        <p>Hungry? Place your first order and it will appear here!</p>
        <button onClick={() => window.location.href='/Home'} className="browse-btn">Browse Menu</button>
      </div>
    );

  return (
    <div className="my-orders-wrapper">
      <div className="orders-container-modern">
        <header className="orders-page-header">
          <h1 className="orders-main-title">My Orders</h1>
          <p className="orders-subtitle">Track and manage your recent orders</p>
        </header>

        <div className="orders-list-modern">
          {orders.map((order) => (
            <div className="order-card-modern" key={order._id}>
              {/* Card Header */}
              <div className="order-card-header">
                <div className="order-meta-info">
                  <div className="order-id-badge">
                    <FaBox className="meta-icon" />
                    <span>ID: {order._id.substring(0, 12)}...</span>
                  </div>
                  <div className="order-date-badge">
                    <FaCalendarAlt className="meta-icon" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <div className="order-status-pill delivered">
                  <FaCheckCircle /> Delivered
                </div>
              </div>

              {/* Info Section */}
              <div className="order-info-grid">
                <div className="info-block">
                  <span className="block-label">Delivery Address</span>
                  <div className="block-content">
                    <FaMapMarkerAlt className="content-icon" />
                    <p>{order.address?.name}<br />{order.address?.line1}, {order.address?.city} - {order.address?.pincode}</p>
                  </div>
                </div>
                <div className="info-block">
                  <span className="block-label">Payment Method</span>
                  <div className="block-content">
                    <FaCreditCard className="content-icon" />
                    <p>{order.paymentMethod || "Online Payment"}</p>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="order-items-wrapper">
                <span className="items-section-title">Order Items ({order.items?.length || 0})</span>
                <div className="items-scroll-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="item-img-container">
                        <img
                          src={item.image || "https://via.placeholder.com/80?text=No+Image"}
                          alt={item.name}
                          onError={(e) => { e.target.src = "https://via.placeholder.com/80?text=No+Image"; }}
                        />
                      </div>
                      <div className="item-text-info">
                        <span className="item-name-bold">{item.name}</span>
                        <span className="item-quantity-tag">Quantity: {item.quantity}</span>
                      </div>
                      <div className="item-price-tag">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="order-card-footer">
                <div className="footer-total-section">
                  <span className="total-label-modern">Order Total</span>
                  <span className="total-amount-modern">₹{order.totalAmount || order.amount || 0}</span>
                </div>
                <div className="footer-action-section">
                  <div className="rating-mini-box">
                    <span className="rate-this-label">Rate your meal</span>
                    <Rating
                      restaurantId={order._id}
                      onRatingSubmit={(value) => handleRatingSubmit(order._id, value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
