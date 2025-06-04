import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/ShoppingCart.css";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShoppingCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');
  const [error, setError] = useState(null);

  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        setLoading(false);
        return;
      }

      const { data } = await axios.get('http://localhost:8000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(data.data); // assuming { status, message, data: { cartItems, totalCartPrice } }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/cart/${cartItemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCart(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating quantity');
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:8000/api/cart/${cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCart(data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing item');
    }
  };

  // Apply a coupon
  const applyCoupon = async () => {
  try {
    const { data } = await axios.put(
      'http://localhost:8000/api/cart/applyCoupon',
      { coupon },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    setCart(data.data);
    toast.success('Coupon applied successfully!');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid or expired coupon');
  }
};

  const navigate = useNavigate();

  const handleCheckout = () => {
  const products = cart.cartItems.map((item) => {
    const product = item.product || {};
    return {
      productId: product._id,
      title: product.title,
      // If there's a discount, calculate price per unit accordingly
      price: cart.totalPriceAfterDiscount
        ? (cart.totalPriceAfterDiscount / cart.cartItems.length)
        : product.price,
      colors: product.colors || [],
    };
  });

  // Pass total price (with or without discount)
  const totalPrice = cart.totalPriceAfterDiscount ?? cart.totalCartPrice;

  navigate('/checkout', { state: { products, totalPrice } });
};


  // Render
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!cart || cart.cartItems.length === 0) return <p>Your cart is empty.</p>;

  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>

      <ul className="cart-items">
        {cart.cartItems.map((item) => {
          const product = item.product || {};
          const image = product.images?.[0] || 'https://via.placeholder.com/100';
          const title = product.title || 'Unknown Product';
          const color = item.color || (product.colors && product.colors.length > 0 ? product.colors[0] : 'N/A');

          return (
            <li key={item._id} className="cart-item">
              <img src={image} alt={title} className="item-image" />

              <div className="item-info-row">
                <p className="item-name">{title}</p>
                <p className="item-color">Color: {color}</p>

                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                  />
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
              </div>

              <p className="item-price">
                ${typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
              </p>

              <button className="remove-btn" onClick={() => removeItem(item._id)}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>

      <div className="cart-summary">
        <p>
          Total Price: $
          {typeof cart.totalCartPrice === 'number'
            ? cart.totalCartPrice.toFixed(2)
            : '0.00'}
        </p>
        {typeof cart.totalPriceAfterDiscount === 'number' && (
          <p>
            Price After Discount: $
            {cart.totalPriceAfterDiscount.toFixed(2)}
          </p>
        )}
      </div>

      <div className="apply-coupon">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <button onClick={applyCoupon}>Apply Coupon</button>
      </div>

      <button className="checkout-button" onClick={handleCheckout}>
        Proceed To Checkout
      </button>
    </div>
  );
};

export default ShoppingCart;
