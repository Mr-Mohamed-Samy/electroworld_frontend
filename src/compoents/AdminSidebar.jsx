import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  FaHome,
  FaBox,
  FaUsers,
  FaSignOutAlt,
  FaClipboardList,
  FaPlus,
} from "react-icons/fa";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false); 
  const sidebarRef = useRef(null);

  const handleLinkClick = () => {
    setIsOpen(false); 
  };

  const handleClickOutside = (event) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !event.target.classList.contains("sidebar-toggle")
    ) {
      setIsOpen(false); 
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNavClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <>
      
      {!isOpen && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      )}

      
      <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">Admin Dashboard</div>

        <div className="sidebar-body">
          <nav className="sidebar-nav">
            <NavLink to="/homepage" className={getNavClass} onClick={handleLinkClick}>
              <FaHome className="sidebar-icon" /> Homepage
            </NavLink>
            <NavLink
              to="/products"
              className={getNavClass}
              onClick={handleLinkClick}
            >
              <FaBox className="sidebar-icon" /> Products
            </NavLink>
            <NavLink
              to="/users"
              className={getNavClass}
              onClick={handleLinkClick}
            >
              <FaUsers className="sidebar-icon" /> Users
            </NavLink>
            <NavLink
              to="/orders"
              className={getNavClass}
              onClick={handleLinkClick}
            >
              <FaClipboardList className="sidebar-icon" /> Orders
            </NavLink>
            <NavLink
              to="/create-coupon"
              className={getNavClass}
              onClick={handleLinkClick}
            >
              <FaPlus className="sidebar-icon" /> Create Coupons
            </NavLink>

            <NavLink
              to="/signin"
              className={getNavClass}
              onClick={handleLinkClick}
            >
              <FaSignOutAlt className="sidebar-icon" /> Log Out
            </NavLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

