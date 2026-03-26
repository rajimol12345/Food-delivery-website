import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera, FaArrowLeft, FaSave, FaUserCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    profilePic: '',
    deliveryAddress: {
      line1: '',
      line2: '',
      city: '',
      pincode: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const userId = getTokenFromCookie();

  useEffect(() => {
    if (!userId) {
      toast.error('Please login first.');
      navigate('/LoginForm');
      return;
    }

    axios
      .get(`/food-ordering-app/api/user/profile/${userId}`)
      .then((res) => {
        setForm({
          ...res.data,
          deliveryAddress: res.data.deliveryAddress || {
            line1: '',
            line2: '',
            city: '',
            pincode: '',
          },
        });
        setPreview(res.data.profilePic || null);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to fetch user data');
        console.error(err);
        setLoading(false);
      });
  }, [navigate, userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, profilePic: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `/food-ordering-app/api/user/profile/${userId}`,
        form
      );
      toast.success('Profile updated successfully!');
      setTimeout(() => navigate('/Accounts'), 1500);
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Failed to update profile');
    }
  };

  if (loading) return (
    <div className="account-container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="account-container">
      <h2>Edit Profile</h2>
      
      <div className="account-card">
        <form onSubmit={handleSubmit} className="account-form">
          
          <div className="file-upload-wrapper">
            <div className="profile-section">
              {preview ? (
                <img src={preview} alt="Profile Preview" className="profile-preview" />
              ) : (
                <div className="avatar-placeholder">
                  <FaUserCircle />
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange} 
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            <button 
              type="button" 
              className="custom-file-btn d-flex align-items-center gap-2"
              onClick={() => fileInputRef.current.click()}
            >
              <FaCamera /> Change Photo
            </button>
          </div>

          <div className="form-section-title">Personal Information</div>
          
          <div className="form-group">
            <label><FaUser /> Full Name</label>
            <input
              type="text"
              name="fullname"
              className="form-input-modern"
              value={form.fullname}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label><FaEnvelope /> Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input-modern"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="form-group">
              <label><FaPhone /> Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input-modern"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="form-section-title">Delivery Address</div>

          <div className="form-group">
            <label><FaMapMarkerAlt /> Address Line 1</label>
            <input
              type="text"
              name="line1"
              className="form-input-modern"
              value={form.deliveryAddress.line1}
              onChange={handleAddressChange}
              placeholder="Street name, Building No."
              required
            />
          </div>

          <div className="form-group">
            <label><FaMapMarkerAlt /> Address Line 2 (Optional)</label>
            <input
              type="text"
              name="line2"
              className="form-input-modern"
              value={form.deliveryAddress.line2}
              onChange={handleAddressChange}
              placeholder="Apartment, Floor, Landmark"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                className="form-input-modern"
                value={form.deliveryAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
                required
              />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                className="form-input-modern"
                value={form.deliveryAddress.pincode}
                onChange={handleAddressChange}
                placeholder="Pincode"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel d-flex align-items-center justify-content-center gap-2" onClick={() => navigate('/Accounts')}>
              <FaArrowLeft /> Back
            </button>
            <button type="submit" className="btn-save d-flex align-items-center justify-content-center gap-2">
              <FaSave /> Save Changes
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
