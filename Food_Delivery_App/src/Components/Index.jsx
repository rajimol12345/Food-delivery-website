import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaMapMarkerAlt, FaGem, FaApple, FaGooglePlay } from 'react-icons/fa';
import './Index.css';

const Index = () => {
  return (
    <div className="index-page">
      {/* Navigation Header */}
      <header className="index-header">
        <div className="logo">EatToWay</div>
        <nav className="headnav-buttons">
          <Link to="/LoginForm" className="headnav-item login">Login</Link>
          <Link to="/RegisterForm" className="headnav-item signup">Signup</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="index-hero">
        <div className="index-hero-content">
          <h1 className="index-hero-title">Hungry? You're in the Right Place.</h1>
          <p className="index-hero-subtitle">
            Order delicious meals from the best local restaurants delivered straight to your doorstep.
          </p>
          <Link to="/LoginForm" className="index-hero-btn">Get Started</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="index-features">
        <div className="section-title-wrap">
          <h2>Why Choose EatToWay?</h2>
          <p>We combine technology with taste to bring you the smoothest food ordering experience.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon"><FaRocket /></span>
            <h3>Ultra Fast Delivery</h3>
            <p>Our delivery partners are optimized to get your food while it's still piping hot.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaMapMarkerAlt /></span>
            <h3>Live Tracking</h3>
            <p>Track your order in real-time from the kitchen to your front door.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon"><FaGem /></span>
            <h3>Best Offers</h3>
            <p>Enjoy exclusive discounts and deals from your favorite restaurants every day.</p>
          </div>
        </div>
      </section>

      {/* App Promo Section */}
      <section className="app-promo-container">
        <div className="app-promo">
          <div className="app-promo-content">
            <h2>Order on the go</h2>
            <p>Download our mobile app for a faster and more personalized experience. Available on iOS and Android.</p>
            <div className="app-links">
              <div className="app-btn">
                <FaApple className="app-icon" />
                <div className="btn-text">
                  <span className="small-text">Download on the</span>
                  <span className="large-text">App Store</span>
                </div>
              </div>
              <div className="app-btn">
                <FaGooglePlay className="app-icon" />
                <div className="btn-text">
                  <span className="small-text">GET IT ON</span>
                  <span className="large-text">Google Play</span>
                </div>
              </div>
            </div>
          </div>
          <div className="app-promo-image">
            <div className="phone-mockup">
               <div className="mock-screen">
                  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80" alt="App Preview" className="mock-app-image" />
                  <div className="mock-overlay">
                    <div className="mock-logo-small">EatToWay</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
