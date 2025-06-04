import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/OrderSuccess.css";

function OrderSuccess() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="order-success-container">
        <h2>⚠️ No order data found</h2>
        <Link to="/homepage">
          <button className="order-success-button">Go Home</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="order-success-container">
      <h2>✅ Thank You!</h2>
      <p>Your order has been placed successfully.</p>

      <h4>Order ID: {order._id}</h4>
      <h4>Status: {order.status}</h4>
      <h4>Total: {order.totalOrderPrice} DA</h4>

      <div style={{ textAlign: "left", marginTop: 20 }}>
        <h3>Shipping Address</h3>
        <p>{order.shippingAddress?.details}</p>
        <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
        <p>📞 {order.shippingAddress?.phone}</p>
      </div>

      <Link to="/homepage">
        <button className="order-success-button" style={{ marginTop: 20 }}>
          Continue Shopping
        </button>
      </Link>
    </div>
  );
}

export default OrderSuccess;
