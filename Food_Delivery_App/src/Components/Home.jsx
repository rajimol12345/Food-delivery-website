import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTruck, FaUtensils, FaMobileAlt, FaStar, FaQuoteLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import api from '../api';
import Search from './Search';
import FoodCategory from './FoodCategory';
import RestaurantList from './RestaurantList';
import OfferPopup from './OfferPopup';
import Offers from './Offers';

import img1 from './img/hero1.jpg';
import img2 from './img/hero2.avif';
import img3 from './img/hero3.jpg';
import burgerImg from './img/burger.png';
import './Home.css';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showOffer, setShowOffer] = useState(false);

  const carouselImages = [img1, img2, img3];

  const heroTexts = [
    { title: "Savor Every Moment With Fast Delivery", subtitle: "Bringing your favorite flavors from the city's best kitchens right to your dining table." },
    { title: "Premium Quality Food, Anytime Anywhere", subtitle: "Expertly crafted meals prepared with the freshest ingredients and delivered with care." },
    { title: "Discover Local Culinary Gems", subtitle: "Explore a world of tastes from top-rated restaurants and hidden local favorites." }
  ];

  const stats = [
    { value: "500+", label: "Restaurants" },
    { value: "50k+", label: "Happy Customers" },
    { value: "15min", label: "Avg Delivery Time" },
    { value: "4.8", label: "App Rating" }
  ];

  const testimonials = [
    { name: "Sarah J.", text: "The fastest delivery service I've ever used. The food always arrives piping hot!", rating: 5 },
    { name: "Michael R.", text: "A massive variety of restaurants to choose from. Love the exclusive deals!", rating: 5 },
    { name: "Emily D.", text: "The app is so easy to use. Tracking my order in real-time is a game changer.", rating: 4 }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const resRes = await api.get("/api/restaurants");
        setRestaurants(resRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();

    const timer = setTimeout(() => setShowOffer(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  const handleSearch = (type, query) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = restaurants.filter(res =>
      res.name.toLowerCase().includes(searchTerm) ||
      res.cuisine.toLowerCase().includes(searchTerm) ||
      res.address?.toLowerCase().includes(searchTerm)
    );

    setSearchResults(filtered);
    setIsSearching(true);
  };

  return (
    <div className="home-professional">
      {/* HERO SECTION - REFINED */}
      <section className="hero-modern">
        <div className="carousel-background">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className="slide-bg"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{ backgroundImage: `url(${carouselImages[currentSlide]})` }}
            />
          </AnimatePresence>
          <div className="hero-overlay-gradient"></div>
        </div>

        <div className="container hero-container">
          <div className="row align-items-center">
            <div className="col-lg-7 text-start">
              <motion.div
                key={currentSlide + "-content"}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hero-text-content"
              >
                <span className="hero-tagline">Premium Food Delivery</span>
                <h1 className="hero-main-title">{heroTexts[currentSlide].title}</h1>
                <p className="hero-description">{heroTexts[currentSlide].subtitle}</p>
                <div className="hero-actions">
                  <button className="btn-primary-modern">Order Now <FaArrowRight /></button>
                  <button className="btn-secondary-modern">View Offers</button>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <motion.img 
                src={burgerImg} 
                className="floating-hero-img" 
                alt="Delicious Burger"
                animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SEARCH & CATEGORIES */}
      <div className="search-category-section">
        <div className="container">
          <div className="search-wrapper-floating">
            <Search onSearch={handleSearch} />
          </div>
          <FoodCategory />
        </div>
      </div>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-md-3 col-6 mb-4 mb-md-0">
                <div className="stat-card">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get your favorite food in 3 simple steps</p>
          </div>
          <div className="row mt-5">
            <div className="col-md-4 text-center step-item">
              <div className="step-icon-box">
                <FaUtensils className="step-icon" />
                <span className="step-number">1</span>
              </div>
              <h4>Select Restaurant</h4>
              <p>Choose from our vast list of curated top-rated restaurants.</p>
            </div>
            <div className="col-md-4 text-center step-item">
              <div className="step-icon-box">
                <FaStar className="step-icon" />
                <span className="step-number">2</span>
              </div>
              <h4>Select Your Dish</h4>
              <p>Browse the menu and pick your favorite delicious meals.</p>
            </div>
            <div className="col-md-4 text-center step-item">
              <div className="step-icon-box">
                <FaTruck className="step-icon" />
                <span className="step-number">3</span>
              </div>
              <h4>Fast Delivery</h4>
              <p>Our delivery experts ensure your food reaches you hot and fresh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFERS SECTION */}
      <div className="offers-container-modern">
        <Offers offers={[...new Set(restaurants.flatMap(res => res.offers || []))]} />
      </div>

      {/* RESTAURANTS LIST */}
      <section className="restaurants-list-wrapper">
        <RestaurantList
          restaurants={restaurants}
          searchResults={searchResults}
          isSearching={isSearching}
        />
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title text-white">What Our Customers Say</h2>
          </div>
          <div className="row">
            {testimonials.map((t, i) => (
              <div key={i} className="col-md-4 mb-4">
                <motion.div 
                  className="testimonial-card"
                  whileHover={{ y: -10 }}
                >
                  <FaQuoteLeft className="quote-icon" />
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-footer">
                    <h5 className="customer-name">{t.name}</h5>
                    <div className="rating-stars">
                      {[...Array(t.rating)].map((_, idx) => <FaStar key={idx} />)}
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD PROMO */}
      <section className="app-download-section">
        <div className="container">
          <div className="app-promo-card">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2>Download the EatYoWay App</h2>
                <p>Get the best food delivery experience on your phone. Faster ordering, real-time tracking, and exclusive app-only offers.</p>
                <div className="app-buttons-flex">
                  <div className="app-btn-mock">
                    <FaMobileAlt />
                    <span>App Store</span>
                  </div>
                  <div className="app-btn-mock">
                    <FaMobileAlt />
                    <span>Play Store</span>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 text-center d-none d-lg-block">
                <FaCheckCircle className="promo-big-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER POPUP */}
      {showOffer && <OfferPopup onClose={() => setShowOffer(false)} />}
    </div>
  );
};

export default Home;
