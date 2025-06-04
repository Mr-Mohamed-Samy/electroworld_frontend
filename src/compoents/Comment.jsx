import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/Comment.css";

function Comment({ productId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await axios.get(`http://localhost:8000/api/review?product=${productId}`);
        setComments(res.data.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    fetchComments();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a review');
      return;
    }
    if (rating <= 0) {
      alert('Please select a rating');
      return;
    }
    if (!newComment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/review',
        {
          product: productId,
          rating,
          title: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => [...prev, response.data.data]);
      setNewComment('');
      setRating(0);
    } catch (error) {
      console.error('Error submitting review:', error.response?.data || error.message);
      alert('Failed to submit review');
    }
  };

  return (
    <>
      {!isAdmin ? (
        <>
          {/* Add Comment Form */}
          <div className="comment-container">
            <h4 className="add-comment-heading">Add Your Review</h4>

            <form className="comment-form" onSubmit={handleSubmit}>
              <label className="form-label">
                Rating:
                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                >
                  <option value={0}>Select rating</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                Comment:
                <textarea
                  className="form-textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your review here"
                />
              </label>

              <button className="submit-button" type="submit">Submit Review</button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="comment-list-container">
            <h3 className="comment-heading">Comments</h3>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div className="comment-item" key={comment._id}>
                  <div className="comment-header">
                    <span className="comment-user">{comment.user?.name || 'Anonymous'}</span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="comment-title">{comment.title}</p>
                  <div className="comment-rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`star ${star <= comment.rating ? 'filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-comments">No comments yet.</p>
            )}
          </div>
        </>
      ) : (
        <div className="admin-comment-message">
          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "1.2rem", color: "#666" }}>
            Comments are hidden for admin users.
          </p>
        </div>
      )}
    </>
  );
}

export default Comment;
