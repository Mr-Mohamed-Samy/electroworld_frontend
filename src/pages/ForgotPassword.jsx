import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ CORRECT

function ForgotPassword() {
  const [formData, setFormData] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // ✅ Use the hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Reset link sent to your email.');
        navigate('/ResetCode');
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      setMessage('Failed to send reset link.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2 style={{color:"white"}}>Get Access To Your Account Again</h2>

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

        <button 
          className="submit-btn" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending Link..." : "Send Reset Link"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default ForgotPassword;
