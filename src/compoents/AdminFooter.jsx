import React from "react";
import "../styles/AdminFooter.css";

const AdminFooter = () => {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} Admin Dashboard. All rights reserved.</p>
    </footer>
  );
};

export default AdminFooter;
