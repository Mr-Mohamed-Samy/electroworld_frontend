import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import "../styles/ProductDetails.css";

const ProductDetails = ({ product }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("You must be logged in to add to cart");
      return navigate("/signin");
    }

    if (!selectedColor && product.colors?.length > 0) {
      toast.warn("Please select a color before adding to cart");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/cart",
        {
          productId: product._id,
          color: selectedColor || "default",
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("🛒 Product added to cart!");
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add to cart", error);
      toast.error(
        error?.response?.data?.message || "❌ Failed to add to cart"
      );
    }
  };

  const handleBuyNow = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warn("You must be logged in to buy");
    return navigate("/signin");
  }

  if (!selectedColor && product.colors?.length > 0) {
    toast.warn("Please select a color before proceeding");
    return;
  }

  navigate("/checkout", {
    state: {
      products: [
        {
          productId: product._id,
          title: product.title,
          price: product.price,
          colors: product.colors,
          selectedColor: selectedColor || "default",
          quantity,
        },
      ],
    },
  });
};


  const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  const isLoading =
    !product ||
    !Array.isArray(product.images) ||
    product.images.length === 0 ||
    product.price == null;

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-card-details">
      <div className="product-gallery">
        <div className="main-image">
          <img src={selectedImage} alt={product.title} />
        </div>
        {product.images.length > 1 && (
          <div className="thumbnail-images">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setSelectedImage(image)}
                className={`thumbnail ${
                  selectedImage === image ? "active" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.title}</h3>
        <p className="product-description" style={{ color: "white" }}>
          {product.description}
        </p>

        <div className="star-rating-container">
          <StarRating rating={product.ratingsAverage ?? 0} />
          <span className="rating-text">
            ({(product.ratingsAverage ?? 0).toFixed(1)})
          </span>
        </div>

        {product.colors?.length > 0 && (
          <div className="color-selection">
            <label>Choose a color:</label>
            <div className="color-options">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`color-option ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                ></button>
              ))}
            </div>
          </div>
        )}

        <div className="quantity-selection">
          <label style={{ color: "white" }}>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
            style={{ color: "black", width: "10%" }}
          />
        </div>

        <div className="bttns">
          <div className="product-pricee">{product.price.toFixed(2)} DA</div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add To Cart
          </button>
          <button className="add-to-cart-btn" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;