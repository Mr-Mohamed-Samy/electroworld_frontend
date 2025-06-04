import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHeart } from "react-icons/ai";
import "../styles/Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8000/api/wishlist",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/");
      setWishlist(res.data.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      await api.delete(`/${id}`);
      fetchWishlist();
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (!token) {
    return (
      <div className="wishlist-container">
        <h2>You must be logged in to view your wishlist.</h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="wishlist-empty">No items found.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlist.map((product) => (
            <li key={product._id} className="wishlist-item">
              <div className="product-info">
                <img src={product.images?.[0]} alt={product.title} />
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <div className="rating-price-row">
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          style={{
                            color:
                              n <= Math.round(product.ratingsAverage) ? "#2BCDFA" : "#ccc",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="product-price">{product.price} DA</p>
                  </div>
                </div>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(product._id)}
                title="Remove from wishlist"
              >
                <AiFillHeart color="white" size={24} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;