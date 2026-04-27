import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaMapMarkerAlt, FaGem, FaApple, FaGooglePlay, FaArrowRight, FaPlay } from 'react-icons/fa';
import './Index.css';

const Index = () => {
  return (
    <div className="index-premium">
      {/* HEADER */}
      <header className="premium-nav">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="premium-logo">EatYoWay<span>.</span></div>
          <div className="nav-auth-buttons">
            <Link to="/LoginForm" className="btn-nav-login">Login</Link>
            <Link to="/RegisterForm" className="btn-nav-signup">Sign Up</Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="premium-hero">
        <div className="hero-bg-overlay"></div>
        <div className="container position-relative z-index-2">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-7 text-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="badge-premium mb-3">#1 Food Delivery Service</span>
                <h1 className="hero-title-premium">
                  Delicious Food <br />
                  <span>Delivered Fast.</span>
                </h1>
                <p className="hero-subtitle-premium">
                  Experience the best culinary delights from top restaurants, delivered right to your doorstep with lightning speed and care.
                </p>
                <div className="hero-cta-group">
                  <Link to="/RegisterForm" className="btn-premium-primary">
                    Get Started <FaArrowRight />
                  </Link>
                  <button className="btn-premium-outline">
                    <FaPlay className="me-2" /> How it Works
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="premium-features py-100">
        <div className="container">
          <div className="section-header-center">
            <h2 className="title-md">Why Choose EatYoWay?</h2>
            <p className="subtitle-md">We bring together the best of technology and taste.</p>
          </div>
          <div className="row g-4 mt-5">
            <div className="col-md-4">
              <motion.div className="feature-item-premium" whileHover={{ y: -10 }}>
                <div className="icon-wrapper"><FaRocket /></div>
                <h3>Super Fast Delivery</h3>
                <p>Our optimized delivery routes ensure your food arrives hot and fresh every time.</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div className="feature-item-premium" whileHover={{ y: -10 }}>
                <div className="icon-wrapper"><FaMapMarkerAlt /></div>
                <h3>Live Tracking</h3>
                <p>Follow your meal's journey in real-time from the restaurant kitchen to your door.</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div className="feature-item-premium" whileHover={{ y: -10 }}>
                <div className="icon-wrapper"><FaGem /></div>
                <h3>Exclusive Rewards</h3>
                <p>Earn points on every order and unlock premium discounts at your favorite spots.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* APP PROMO */}
      <section className="premium-app-promo">
        <div className="container">
          <div className="app-promo-inner">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="promo-title">Food delivery in your pocket</h2>
                <p className="promo-text">Download our mobile app to order faster, track your food effortlessly, and get exclusive app-only deals.</p>
                <div className="app-store-btns">
                  <div className="store-btn">
                    <FaApple className="icon" />
                    <div>
                      <small>Download on the</small>
                      <strong>App Store</strong>
                    </div>
                  </div>
                  <div className="store-btn">
                    <FaGooglePlay className="icon" />
                    <div>
                      <small>Get it on</small>
                      <strong>Google Play</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 d-none d-lg-block">
                <div className="phone-mockup-premium">
                  <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" alt="App Preview" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="final-cta text-center py-100">
        <div className="container">
          <h2 className="cta-title">Ready to satisfy your cravings?</h2>
          <Link to="/RegisterForm" className="btn-premium-primary lg">Order Your First Meal Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
