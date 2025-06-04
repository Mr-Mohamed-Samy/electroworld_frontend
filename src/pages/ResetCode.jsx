import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetCode() {
  const [formData, setFormData] = useState({ passwordResetCode: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, passwordResetCode: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:8000/api/auth/verifyPassResetCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetCode: formData.passwordResetCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Reset code verification failed');
      }

      // Save token or user ID in state, context, or localStorage as needed
      // Redirect to password reset form
      navigate('/ResetPassword');
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="forgot-password-container">
        <h2 style={{color:"white"}}>Reset Code</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="passwordResetCode"
            placeholder="Enter Reset Code"
            className="details"
            value={formData.passwordResetCode}
            onChange={handleChange}
            required
          />

          <button
            className="submit-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Submit Reset Code'}
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </>
  );
}

export default ResetCode;
