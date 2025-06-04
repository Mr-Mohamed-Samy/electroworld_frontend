import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/CreateCoupon.css';

const CreateCoupon = () => {
  const [name, setName] = useState('');
  const [expire, setExpire] = useState('');
  const [discount, setDiscount] = useState(20);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [coupons, setCoupons] = useState([]);

  const token = localStorage.getItem('token'); // Adjust for your auth logic
  const API_BASE = 'http://localhost:8000/api/Coupon';

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data.data || res.data);
    } catch (err) {
      console.error('Error fetching coupons:', err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post(
        API_BASE,
        { name, expire, discount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('Coupon created successfully!');
      setName('');
      setExpire('');
      setDiscount(20);
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Coupon deleted.');
      fetchCoupons();
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete coupon.');
    }
  };

  return (
    <div className="create-coupon-container">
      <h2>Admin: Create New Coupon</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="coupon-form">
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Expire Date</label>
          <input
            type="date"
            value={expire}
            onChange={(e) => setExpire(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            required
            min={1}
            max={100}
          />
        </div>

        <button type="submit" className="create-btn">
          Create Coupon
        </button>
      </form>

      <h3>Existing Coupons</h3>
      <table className="coupon-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Expire</th>
            <th>Discount (%)</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon._id}>
              <td>{coupon.name}</td>
              <td>{new Date(coupon.expire).toLocaleDateString()}</td>
              <td>{coupon.discount}</td>
              <td>{new Date(coupon.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(coupon._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {coupons.length === 0 && (
        <p className="error-message">No coupons found.</p>
      )}
    </div>
  );
};

export default CreateCoupon;  