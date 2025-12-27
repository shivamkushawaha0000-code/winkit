import React, { useState, useEffect } from "react";
import { X, Package, Calendar, ChevronRight, ShoppingBag } from "lucide-react";
import "../css/OrderPanel.css";

const API_BASE_URL = "https://winkit-6fzf.onrender.com/api/orders";

export default function OrderPanel({ open, onClose }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchOrders();
  }, [open]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!open) return null;

  return (
    <div className="order-overlay" onClick={onClose}>
      <div className="order-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="order-header">
          <div className="header-content">
            <ShoppingBag size={20} className="header-icon" />
            <h3>Order History</h3>
          </div>
          <button onClick={onClose} className="close-drawer-btn">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="order-body">
          {loading ? (
            <div className="order-loader">
              <div className="spinner"></div>
              <p>Fetching your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-circle">
                <Package size={40} />
              </div>
              <h4>No orders yet</h4>
              <p>Hungry? Place your first order now!</p>
              <button className="shop-now-btn" onClick={onClose}>Start Shopping</button>
            </div>
          ) : (
            <div className="order-cards-container">
              {orders.map((order) => (
                <div key={order._id} className="order-premium-card">
                  <div className="order-card-header">
                    <div className="order-id-stack">
                      <span className="order-label">ORDER #{order._id.slice(-6).toUpperCase()}</span>
                      <span className="order-timestamp">
                        <Calendar size={12} /> {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="order-card-body">
                    <p className="items-preview">
                      {order.items.map(i => `${i.quantity}x ${i.productName}`).join(", ")}
                    </p>
                  </div>

                  <div className="order-card-footer">
                    <div className="total-stack">
                      <span className="total-label">Amount Paid</span>
                      <span className="total-value">₹{order.totalAmount}</span>
                    </div>
                    <button className="reorder-btn">
                      Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}