import { useNavigate } from "react-router-dom";
import Sidebar from "../compoents/AdminSidebar";
import Header from "../compoents/AdminHeader";
import Footer from "../compoents/AdminFooter";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaPlus,
  FaSignOutAlt,
  FaHome,
} from "react-icons/fa";
import "../styles/Admin.css";

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const navItems = [
    {
      icon: <FaHome className="text-2xl text-blue-600" />,
      label: "Homepage",
      path: "/homepage",
    },
    {
      icon: <FaBox className="text-2xl text-green-600" />,
      label: "Products",
      path: "/products",
    },
    {
      icon: <FaUsers className="text-2xl text-purple-600" />,
      label: "Users",
      path: "/users",
    },
    {
      icon: <FaShoppingCart className="text-2xl text-yellow-500" />,
      label: "Orders",
      path: "/orders",
    },
    {
      icon: <FaPlus className="text-2xl text-pink-600" />,
      label: "Create Coupon",
      path: "/create-coupon",
    },
  ];

  return (
    <>
      <Header />
      <main className="admin-main">
        <h1 className="admin-title">Welcome, Admin</h1>
        <div className="admin-grid">
          {navItems.map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              className="admin-card"
            >
              <div className="admin-card-inner">
                <div className="admin-card-icon">{item.icon}</div>
                <span className="admin-card-label">{item.label}</span>
              </div>
            </div>
          ))}
          <div onClick={handleLogout} className="admin-card logout">
            <div className="admin-card-inner">
              <div className="admin-card-icon">
                <FaSignOutAlt />
              </div>
              <span className="admin-card-label">Logout</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Admin;
