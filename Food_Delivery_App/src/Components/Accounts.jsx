import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaUserCircle } from 'react-icons/fa';

export default function Accounts() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const userId = getTokenFromCookie();

    if (!userId) {
      alert('Please login first.');
      navigate('/LoginForm');
      return;
    }

    api
      .get(`/api/user/profile/${userId}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch user profile');
        setLoading(false);
        console.error(err);
      });
  }, [navigate]);

  if (loading) return (
    <div className="account-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="account-container">
      <div className="alert alert-danger text-center" role="alert">
        {error}
      </div>
    </div>
  );

  return (
    <div className="account-container">
      <h2>My Account</h2>

      {location.state?.message && (
        <div className="alert alert-success text-center mb-4" role="alert">
          {location.state.message}
        </div>
      )}

      <div className="account-card">
        <div className="profile-section">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="profile-preview" />
          ) : (
            <div className="avatar-placeholder">
              <FaUserCircle />
            </div>
          )}
        </div>

        <div className="info-grid">
          <div className="info-item shadow-sm">
            <div className="info-icon-box"><FaUser /></div>
            <div className="info-content">
              <label>Full Name</label>
              <span>{user?.fullname}</span>
            </div>
          </div>

          <div className="info-item shadow-sm">
            <div className="info-icon-box"><FaEnvelope /></div>
            <div className="info-content">
              <label>Email Address</label>
              <span>{user?.email}</span>
            </div>
          </div>

          <div className="info-item shadow-sm">
            <div className="info-icon-box"><FaPhone /></div>
            <div className="info-content">
              <label>Phone Number</label>
              <span>{user?.phone || 'Not provided'}</span>
            </div>
          </div>

          <div className="info-item shadow-sm">
            <div className="info-icon-box"><FaMapMarkerAlt /></div>
            <div className="info-content">
              <label>Delivery Address</label>
              <span>
                {user?.deliveryAddress 
                  ? `${user.deliveryAddress.line1}${user.deliveryAddress.line2 ? ', ' + user.deliveryAddress.line2 : ''}, ${user.deliveryAddress.city} - ${user.deliveryAddress.pincode}`
                  : 'Address not provided'}
              </span>
            </div>
          </div>
        </div>

        <button 
          className="edit-btn-modern d-flex align-items-center gap-2" 
          onClick={() => navigate('/EditProfile')}
        >
          <FaEdit /> Edit Profile
        </button>
      </div>
    </div>
  );
}
