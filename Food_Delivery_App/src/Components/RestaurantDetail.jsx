import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaUtensils, FaArrowLeft, FaTag } from 'react-icons/fa';
import MenuList from './MenuList';
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { restaurantid } = useParams(); 
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios.get('/api/restaurants/list')
      .then(response => {
        const found = response.data.find(r => r._id?.toString() === restaurantid);
        if (found) {
          setRestaurant(found);
        } else {
          setError('Restaurant not found');
        }
      })
      .catch(() => setError('Failed to load restaurant data.'));
  }, [restaurantid]);

  const handleAddToWishlist = (item) => {
    const itemId = item.id || item._id;
    const alreadySaved = wishlist.some(savedItem => (savedItem.id || savedItem._id) === itemId);

    if (!alreadySaved) {
      setWishlist(prev => [...prev, item]);
    }
  };

  if (error) {
    return (
      <div className="error-container p-5 text-center">
        <h2 className="text-danger mb-4">{error}</h2>
        <Link to="/" className="back-link mx-auto" style={{ width: 'fit-content' }}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="loader-container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }} />
        <p className="mt-3 fw-bold text-muted">Curating your menu...</p>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-page">
      {/* Hero Section */}
      <section className="restaurant-hero">
        <div className="back-btn-wrapper">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Home
          </Link>
        </div>
        
        <img
          src={restaurant.image || 'https://via.placeholder.com/1200x500?text=Restaurant+Hero'}
          alt={restaurant.name}
          className="hero-image"
        />
        
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>{restaurant.name}</h1>
            <div className="hero-badges">
              <span className="badge-item rating">
                <FaStar /> {restaurant.rating || '4.0'}
              </span>
              <span className="badge-item">
                <FaUtensils /> {restaurant.cuisine}
              </span>
              <span className="badge-item">
                <FaClock /> {restaurant.openingHours || '10 AM - 11 PM'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="restaurant-info-section">
        <div className="info-grid">
          <div className="main-info">
            <div className="info-card">
              <h4>Restaurant Details</h4>
              <div className="detail-list">
                <div className="detail-item">
                  <span className="detail-label"><FaMapMarkerAlt className="me-2" /> Address</span>
                  <span className="detail-value">{restaurant.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FaPhone className="me-2" /> Phone</span>
                  <span className="detail-value">{restaurant.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FaEnvelope className="me-2" /> Email</span>
                  <span className="detail-value">{restaurant.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label"><FaUtensils className="me-2" /> Cuisine</span>
                  <span className="detail-value">{restaurant.cuisine}</span>
                </div>
              </div>

              {restaurant.history && (
                <div className="about-section mt-5">
                  <h4>About the Restaurant</h4>
                  <p className="text-muted" style={{ lineHeight: '1.8' }}>{restaurant.history}</p>
                </div>
              )}
            </div>
          </div>

          <div className="side-info">
            <div className="offers-sidebar">
              {restaurant.offers?.length > 0 ? (
                <div className="promo-card">
                  <div className="promo-title">
                    <FaTag /> AVAILABLE OFFERS
                  </div>
                  <ul className="promo-list">
                    {restaurant.offers.map((offer, i) => (
                      <li key={i} className="promo-item">{offer}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="promo-card" style={{ borderStyle: 'solid', borderColor: '#eee' }}>
                  <div className="promo-title" style={{ color: '#888' }}>
                    <FaTag /> No current offers
                  </div>
                  <p className="small text-muted mb-0">Stay tuned for upcoming promotions!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-listing-section">
        <MenuList
          restaurantId={restaurant._id}
          menu={restaurant.menu}
          handleAddToWishlist={handleAddToWishlist}
        />
      </section>
    </div>
  );
};

export default RestaurantDetail;
