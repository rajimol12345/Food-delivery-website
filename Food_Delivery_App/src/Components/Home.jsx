import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    { title: "Order Fresh & Hot Food Anytime", subtitle: "Fast Delivery • Tasty Meals • Best Restaurants Near You" },
    { title: "Get Your Favourite Meals Delivered", subtitle: "Tasty • Affordable • Delivered in Minutes" },
    { title: "Discover Delicious Food Near You", subtitle: "Fresh Ingredients • Best Chefs • Great Taste" }
  ];

  // Load food and restaurant data
  useEffect(() => {
    const loadData = async () => {
      try {
        const resRes = await axios.get("/api/restaurants");
        console.log("Restaurants data:", resRes.data);
        setRestaurants(resRes.data);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();

    // Show popup after 2 seconds
    const timer = setTimeout(() => setShowOffer(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // Handle search
  const handleSearch = (type, query) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = restaurants.filter(res =>
      res.name.toLowerCase().includes(searchTerm) ||
      res.cuisine.toLowerCase().includes(searchTerm) ||
      res.address?.toLowerCase().includes(searchTerm) ||
      (res.specials?.join(" ") || "").toLowerCase().includes(searchTerm)
    );

    setSearchResults(filtered);
    setIsSearching(true);
  };

  return (
    <>
      <Search onSearch={handleSearch} />
      <FoodCategory />

      {/* HERO SECTION */}
      <section className="hero">
        <div className="carousel">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              className={`carousel-slide ${currentSlide === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${img})` }}
            ></div>
          ))}
        </div>

        <div className="overlay"></div>

        <div className="hero-content">
          <div key={currentSlide + "-badge"} className="hero-badge fade-text">🔥 100% FRESH & HOT</div>
          <h1 key={currentSlide + "-title"} className="hero-title fade-text">
            {heroTexts[currentSlide].title}
          </h1>
          <p key={currentSlide + "-sub"} className="hero-subtitle fade-text">
            {heroTexts[currentSlide].subtitle}
          </p>
          <div key={currentSlide + "-btns"} className="hero-buttons fade-text">
            <a href="/restaurants" className="btn-hero primary" style={{ textDecoration: 'none' }}>Order Now</a>
            <a href="/offers" className="btn-hero secondary" style={{ textDecoration: 'none' }}>Explore Offers</a>
          </div>
        </div>

        <img src={burgerImg} className="burger" alt="burger" />
      </section>

      {/* DEDICATED OFFERS SECTION */}
      <Offers 
        offers={[...new Set(restaurants.flatMap(res => res.offers || []))]} 
      />

      {/* OFFER POPUP */}
      {showOffer && <OfferPopup onClose={() => setShowOffer(false)} />}

      <div className="fade-in">
        <RestaurantList
          restaurants={restaurants}
          searchResults={searchResults}
          isSearching={isSearching}
        />
      </div>
    </>
  );
};

export default Home;
