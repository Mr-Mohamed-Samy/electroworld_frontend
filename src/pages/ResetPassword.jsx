import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('http://localhost:8000/api/auth/resetPassword', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successful!');
        navigate('/Signin');
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Error resetting password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-password-container" style={{height: "70vh"}}>
        <h2 style={{color:"white"}}>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="details"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="newPassword"
            placeholder="New Password"
            className="details"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="details"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default ResetPassword;
