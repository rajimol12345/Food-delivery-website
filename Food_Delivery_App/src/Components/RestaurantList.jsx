import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './RestaurantList.css';

function RestaurantList({ restaurants, searchResults, isSearching }) {
  const displayRestaurants = isSearching ? searchResults : restaurants;
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    
    // Dynamically calculate scroll distance based on first card width + gap
    const card = sliderRef.current.querySelector('.restaurant-card');
    const scrollAmount = card ? card.offsetWidth + 30 : 360; 
    
    sliderRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="restaurant-section">
      <div className="container-fluid px-3 px-lg-5">
        <div className="section-header-container">
          <div className="section-header-professional">
            <div className="header-label">
              <span className="accent-dot"></span>
              TOP RATED
            </div>
            <h2 className="header-title-professional">Popular Restaurants</h2>
            <p className="header-subtitle-professional">Discover the finest culinary experiences curated just for you.</p>
          </div>
          
          {!isSearching && (
            <div className="slider-controls">
              <button className="control-btn prev" aria-label="Previous" onClick={() => scroll('prev')}>
                <FaArrowLeft />
              </button>
              <button className="control-btn next" aria-label="Next" onClick={() => scroll('next')}>
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
        
        <div className="slider-relative-wrapper">
          <div 
            className={`restaurant-slider-container ${isSearching ? 'grid-view' : 'slider-view'}`}
            ref={sliderRef}
          >
            {displayRestaurants.map((restaurant) => (
            <Link
              to={`/restaurant/${restaurant._id}`}
              key={restaurant._id}
              className="restaurant-card"
            >
              <div className="card-accent-bar"></div>
              <div className="card-image-wrapper">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="card-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Restaurant';
                  }}
                />
              </div>
              <div className="card-content">
                <h3 className="restaurant-name">{restaurant.name}</h3>
                
                <div className="detail-row">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value text-truncate">{restaurant.address}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Cuisine:</span>
                  <span className="detail-value">{restaurant.cuisine}</span>
                </div>
                
                <div className="rating-row">
                  <div className="rating-badge">
                    <span className="rating-value">
                      4.5 <span className="star-icon">★</span>
                    </span>
                  </div>
                  <span className="delivery-time">• 25-30 MINS</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
        
        {isSearching && displayRestaurants.length === 0 && (
          <div className="no-results">
            <p>No restaurants match your search.</p>
            <button className="btn-reset" onClick={() => window.location.reload()}>View All</button>
          </div>
        )}
      </div>
    </section>
  );
}

export default RestaurantList;
