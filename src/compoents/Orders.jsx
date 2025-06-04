import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]); // Track updating orders

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const ordersData = response.data?.data || [];
      const transformedOrders = ordersData
        .map((order) => {
          const products = (order.cartItems || []).map((item) => {
            const product = item?.product;
            return {
              title: product?.title || "Unnamed",
              quantity: item?.quantity ?? 0,
              price: item?.price ?? 0,
            };
          });

          const { details, city, phone } = order.shippingAddress || {};

          return {
            id: order._id,
            order_id: order._id,
            userName: order.user?.name || "Unnamed",
            products,
            total_price: order.totalOrderPrice ?? 0,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            status: order.isDelivered
              ? "Delivered"
              : order.isPaid
              ? "Paid"
              : "Pending",
            phone: phone || "No phone",
            address: city || "No address",
            details: details || "No details",
          };
        })
        .filter(order => order && !(order.isPaid && order.isDelivered)); // Hide completed orders

      setOrders(transformedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error);
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/order/${id}/pay`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (error) {
      console.error("Failed to mark paid:", error.response?.data || error);
      alert("Failed to update order status.");
    } finally {
      setLoadingIds((prev) => prev.filter((orderId) => orderId !== id));
    }
  };

  const handleMarkDelivered = async (id) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/order/${id}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchOrders();
    } catch (error) {
      console.error("Failed to mark delivered:", error.response?.data || error);
      alert("Failed to update order status.");
    } finally {
      setLoadingIds((prev) => prev.filter((orderId) => orderId !== id));
    }
  };

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Details</th>
            <th>Products</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No orders found.
              </td>
            </tr>
          )}
          {orders.map((order) => {
            const isLoading = loadingIds.includes(order.id);
            return (
              <tr key={order.id}>
                <td>{order.order_id}</td>
                <td>{order.userName}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>
                <td>{order.details}</td>
                <td>
                  <ul>
                    {order.products.map((p, idx) => (
                      <li key={idx} style={{ marginBottom: "1em" }}>
                        <p>{p.title}</p>
                        <br />
                        Quantity: {p.quantity} — Price: ${p.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>${order.total_price.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  <button
                    disabled={order.isPaid || isLoading}
                    onClick={() => handleMarkPaid(order.id)}
                    className="btn btn-paid"
                  >
                    {isLoading && !order.isPaid ? "Updating..." : "Mark as Paid"}
                  </button>
                  <button
                    disabled={order.isDelivered || isLoading}
                    onClick={() => handleMarkDelivered(order.id)}
                    className="btn btn-delivered"
                  >
                    {isLoading && order.isPaid && !order.isDelivered
                      ? "Updating..."
                      : "Mark as Delivered"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
