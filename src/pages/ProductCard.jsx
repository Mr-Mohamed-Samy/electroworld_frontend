import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

import "../styles/ProductCard.css";

function ProductCard({ id, title, image, price, colors = [], rating = 0 }) {
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(colors[0] || "default");

  const handleBuyNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You must be logged in to buy");
      return navigate("/signin");
    }

    const quantity = 1;

    navigate("/checkout", {
      state: {
        products: [
          {
            productId: id,
            title,
            price,
            colors,
            selectedColor,
            quantity,
          },
        ],
      },
    });
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("You must be logged in to add to wishlist");
      return navigate("/signin");
    }

    try {
      await axios.post(
        "http://localhost:8000/api/wishlist",
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("💖 Product added to wishlist!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add to wishlist"
      );
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("You must be logged in to add to cart");
      return navigate("/signin");
    }

    const selectedColor = colors.length > 0 ? colors[0] : "default";

    try {
      const response = await axios.post(
        "http://localhost:8000/api/cart",
        {
          productId: id,
          color: selectedColor,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🛒 Product added to cart!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "❌ Failed to add to cart"
      );
    }
  };

  
  

  return (
    <div className="product-card">
      <Link to={`/products/details/${id}`} className="product-link">
        <img src={image} alt={title} className="product-image" />
        <h3 className="product-title">{title}</h3>
      </Link>

      <div className="product-price" style={{ color: "black" }}>
        {price} DA
      </div>

      

      <div className="button-row">
        <button className="btn buy" onClick={handleBuyNow}>
          Buy Now
        </button>
        <div className="cart-wishlist-row">
          <button
            className="btn cart"
            onClick={handleAddToWishlist}
            title="Add to Wishlist"
          >
            <FiHeart />
          </button>

          <button
            className="btn cart"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            <FiShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
