import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/UserPage.css";
import defaultpfp from "../assets/defaultpfp.jpg";

const UserPage = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userData, setUserData] = useState({});
  const [orders, setOrders] = useState([]);
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (activeSection === "account" || activeSection === "orders") {
      axios
        .get("http://localhost:8000/api/user/getMe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          const { _id, name, email, wilaya, profileImageUrl } = res.data.data;
          setUserData({ userId: _id, name, email, wilaya });
          if (profileImageUrl) setProfileImage(profileImageUrl);
        })
        .catch((err) => {
          console.error("Error loading profile:", err);
          toast.error(err.response?.data?.error || "Failed to load profile.");
        });
    }
  }, [activeSection]);

  useEffect(() => {
    if (activeSection !== "orders") return;

    axios
      .get("http://localhost:8000/api/order", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
        toast.error("Failed to fetch orders.");
      });
  }, [activeSection]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    axios
      .post("http://localhost:8000/api/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setProfileImage(res.data.profileImageUrl))
      .catch(() => toast.error("Failed to upload image."));
  };

  const handleChangePassword = () => {
    if (!currentPasswordInput || !newPassword) {
      toast.warning("Please fill in both fields.");
      return;
    }

    axios
      .put(
        "http://localhost:8000/api/user/changeMyPassword",
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        toast.success("Password updated!");
        setCurrentPasswordInput("");
        setNewPassword("");
      })
      .catch((err) =>
        toast.error(err.response?.data?.error || "Failed to change password.")
      );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/homepage";
  };

  const filteredOrders = orders.filter((order) => {
    const orderUserId =
      typeof order.user === "string" ? order.user : order.user?._id;
    return orderUserId === userData.userId;
  });

  return (
    <div className="mobile-container">
      <ToastContainer position="top-center" autoClose={3000} />
      <h1 className="profile-title">Profile</h1>

      <div className="profile-pic-wrapper">
        <img
          src={profileImage || defaultpfp}
          alt="Profile"
          className="profile-pic"
        />
        <label className="upload-icon">
          📷
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      <div className="menu-card" onClick={() => setActiveSection("account")}>
        🧑‍💼 My Account
      </div>
      <div className="menu-card" onClick={() => setActiveSection("orders")}>
        🔔 My Orders
      </div>
      <div className="menu-card" onClick={() => setActiveSection("settings")}>
        🔐 Account Settings
      </div>
      <div className="menu-card" onClick={handleLogout}>
        🚪 Log Out
      </div>

      {activeSection === "account" && (
        <div className="section">
          <h2 style={{ color: "black" }}>Personal Information</h2>
          <p>
            <b>Name:</b> {userData.name}
          </p>
          <p>
            <b>Email:</b> {userData.email}
          </p>
          <p>
            <b>Wilaya:</b> {userData.wilaya}
          </p>
        </div>
      )}

      {activeSection === "orders" && (
        <div className="section">
          <h2 style={{ color: "black" }}>Order History</h2>
          {filteredOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="card p-4 mb-4 border rounded shadow-sm"
              >
                <p>
                  <b>ID:</b> {order._id}
                </p>
                <p>
                  <b>Total:</b> {order.totalOrderPrice} DA
                </p>
                <p>
                  <b>Status:</b>{" "}
                  {order.status ||
                    (order.isDelivered ? "Delivered" : "Pending")}
                </p>
                {order.isDelivered && order.deliveredAt && (
                  <p>
                    <b>Delivered At:</b>{" "}
                    {new Date(order.deliveredAt).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeSection === "settings" && (
        <div className="section">
          <h2 style={{ color: "black" }}>Account Settings</h2>
          <label>
            Current Password:
            <input
              type="password"
              value={currentPasswordInput}
              onChange={(e) => setCurrentPasswordInput(e.target.value)}
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </label>
          <button onClick={handleChangePassword} className="button">
            Change Password
          </button>
        </div>
      )}
    </div>
  );
};

export default UserPage;
