// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { collection, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    profits: "$0", 
  });

  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats((prev) => ({ ...prev, users: snapshot.size }));
    });

    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      setStats((prev) => ({ ...prev, products: snapshot.size }));
    });

    const unsubOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setStats((prev) => ({
        ...prev,
        orders: snapshot.size,
        profits: `$${(snapshot.size * 20).toLocaleString()}`, // Example profit formula
      }));
    });

    // Cleanup on unmount
    return () => {
      unsubUsers();
      unsubProducts();
      unsubOrders();
    };
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="dashboard-container">
        <div className="stat-card">
          <div className="stat-title">Total Users</div>
          <div className="stat-value">{stats.users}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Products</div>
          <div className="stat-value">{stats.products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Orders</div>
          <div className="stat-value">{stats.orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Profits</div>
          <div className="stat-value">{stats.profits}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


