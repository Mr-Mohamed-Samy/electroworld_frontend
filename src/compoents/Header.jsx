import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import image from "../assets/logo2.png";
import like from "../assets/heart-.png";
import cart from "../assets/shopping-cart.png";
import manIcon from "../assets/man.png";
import defaultpfp from "../assets/defaultpfp.jpg";
import Search from "./Search.jsx";

function Header({ searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    setIsLoggedIn(!!token);
    setUserRole(user?.role || null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserRole(null);
    navigate("/signin");
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const currentPath = location.pathname;
    if (currentPath.startsWith("/products/category/")) {
      const params = new URLSearchParams(location.search);
      params.set("search", term);
      navigate(`${currentPath}?${params.toString()}`, { replace: true });
    } else {
      navigate(`/products/category/all?search=${encodeURIComponent(term)}`, {
        replace: true,
      });
    }
  };

  const categories = [
    "Mobile Phones",
    "Tablets & iPads",
    "Laptops & Computers",
    "Gaming",
    "Cameras & Photography",
    "Smart Home Devices",
    "Networking & Storage",
    "Office Electronics",
    "Chargers & Power",
    "Headphones & Speakers",
  
  ];

  return (
    <>
      <div className="header-wrapper">
        <div className="header-top">
          <Link to="/homepage">
            <div className="logo_container">
              <img src={image} className="logo_style" alt="ElectroWorld Logo" />
              <h2 className="logo_text">ElectroWorld</h2>
            </div>
          </Link>

          <div className="header-bottom">
            <Search
              onSearch={handleSearch}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <div className="icons">
            <Link to="/wishlist">
              <img src={like} className="img" alt="Wishlist" />
            </Link>
            <Link to="/cart">
              <img src={cart} className="img" alt="cart" />
            </Link>
            <div className="profile-container" ref={dropdownRef}>
              <img
                src={isLoggedIn ? defaultpfp : manIcon}
                className="img profile-icon"
                alt="Profile"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              />
              {isDropdownOpen && (
                <div className="profile-dropdown">
                  {isLoggedIn ? (
                    <>
                      <Link to="/UserPage">Profile</Link>
                      <Link
                        to="/homepage"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLogout();
                        }}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/signin">Login</Link>
                      <Link to="/signup">Sign Up</Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="category-selector">
          <select
            onChange={(e) => {
              const selectedCategory = e.target.value;
              if (selectedCategory) {
                navigate(
                  `/products/category/${encodeURIComponent(selectedCategory)}`
                );
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default Header;