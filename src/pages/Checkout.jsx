import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { products = [] } = location.state || {};

  const [quantities, setQuantities] = useState({});
  const [colors, setColors] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    details: "",
    phone: "",
    city: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(false);

  // Initialize quantities and colors
  useEffect(() => {
    const initialQuantities = {};
    const initialColors = {};
    products.forEach((product) => {
      initialQuantities[product.productId] = 1;
      initialColors[product.productId] = product.colors?.[0] || "";
    });
    setQuantities(initialQuantities);
    setColors(initialColors);
  }, [products]);

  const handleQuantityChange = (productId, value) => {
    if (value >= 1) {
      setQuantities((prev) => ({ ...prev, [productId]: value }));
    }
  };

  const handleColorChange = (productId, value) => {
    setColors((prev) => ({ ...prev, [productId]: value }));
  };

  const handleChangeAddress = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return toast.error("Please log in first");
    }

    if (
      !shippingAddress.details ||
      !shippingAddress.phone ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return toast.error("Please fill in all shipping address fields");
    }

    setLoading(true);

    try {
      // 1. Add each product to the cart
      for (const product of products) {
        await axios.post(
          "http://localhost:8000/api/cart",
          {
            productId: product.productId,
            quantity: quantities[product.productId],
            color: colors[product.productId],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // 2. Get updated cart to retrieve cartId
      const cartRes = await axios.get("http://localhost:8000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cartId = cartRes.data.data._id;

      // 3. Create order
      const orderRes = await axios.post(
        `http://localhost:8000/api/order/${cartId}`,
        { shippingAddress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("✅ Order placed successfully!");
      navigate("/order-success", { state: { order: orderRes.data.data } });
    } catch (error) {
      toast.error(error?.response?.data?.message || "❌ Failed to place order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => {
      const qty = quantities[product.productId] || 1;
      return sum + product.price * qty;
    }, 0);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {products.map((product) => (
        <div key={product.productId} className="checkout-product">
          <h3>{product.title}</h3>
          <p>Price: {product.price} DA</p>

          {product.colors.length > 0 && (
            <div>
              <label>Color: </label>
              <select
                value={colors[product.productId]}
                onChange={(e) =>
                  handleColorChange(product.productId, e.target.value)
                }
              >
                {product.colors.map((color, idx) => (
                  <option key={idx} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Quantity: </label>
            <input
              type="number"
              value={quantities[product.productId]}
              min="1"
              onChange={(e) =>
                handleQuantityChange(product.productId, Number(e.target.value))
              }
              style={{ textAlign: "center" }}
            />
          </div>

          <p>
            Subtotal:{" "}
            {(product.price * (quantities[product.productId] || 1)).toFixed(2)}{" "}
            DA
          </p>
        </div>
      ))}

      <hr />
      <h3>Total Price: {calculateTotal().toFixed(2)} DA</h3>

      <h4>Shipping Address</h4>
      <input
        name="details"
        placeholder="Street / Address"
        value={shippingAddress.details}
        onChange={handleChangeAddress}
        required
      />
      <input
        name="phone"
        placeholder="Phone"
        value={shippingAddress.phone}
        onChange={handleChangeAddress}
        required
      />
      <input
        name="city"
        placeholder="City"
        value={shippingAddress.city}
        onChange={handleChangeAddress}
        required
      />
      <input
        name="postalCode"
        placeholder="Postal Code"
        value={shippingAddress.postalCode}
        onChange={handleChangeAddress}
        required
      />

      <button onClick={handleConfirmOrder} disabled={loading} type="submit">
        {loading ? "Placing Order..." : "Confirm Order"}
      </button>
    </div>
  );
}

export default Checkout;
