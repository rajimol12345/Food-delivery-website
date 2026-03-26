import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-professional">
      <div className="footer-top">
        <div className="container-fluid px-3 px-lg-5">
          <div className="row g-4">
            {/* Brand Section */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand">
                <h2 className="footer-logo-text">EatYoWay<span>.</span></h2>
                <p className="footer-description">
                  Delivering happiness to your doorstep, one meal at a time. Experience the finest culinary delights from your favorite local restaurants.
                </p>
                <div className="footer-social-wrapper">
                  <a href="#!" className="social-link facebook"><FaFacebookF /></a>
                  <a href="#!" className="social-link instagram"><FaInstagram /></a>
                  <a href="#!" className="social-link twitter"><FaTwitter /></a>
                  <a href="#!" className="social-link youtube"><FaYoutube /></a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6">
              <div className="footer-links-group">
                <h4 className="footer-heading">Quick Links</h4>
                <ul className="footer-links-list">
                  <li><Link to="/Home">Home</Link></li>
                  <li><Link to="/RestaurantList">Restaurants</Link></li>
                  <li><Link to="/SavedItems">Wishlist</Link></li>
                  <li><Link to="/Order">My Orders</Link></li>
                  <li><Link to="/offers">Latest Offers</Link></li>
                </ul>
              </div>
            </div>

            {/* Support & Account */}
            <div className="col-lg-2 col-md-6">
              <div className="footer-links-group">
                <h4 className="footer-heading">Support</h4>
                <ul className="footer-links-list">
                  <li><Link to="/Accounts">My Account</Link></li>
                  <li><Link to="/Cart">View Cart</Link></li>
                  <li><Link to="/checkout">Checkout</Link></li>
                  <li><Link to="/help">Help Center</Link></li>
                  <li><Link to="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact Details */}
            <div className="col-lg-4 col-md-6">
              <div className="footer-contact-group">
                <h4 className="footer-heading">Get in Touch</h4>
                <div className="contact-item">
                  <div className="contact-icon"><FaMapMarkerAlt /></div>
                  <div className="contact-text">
                    123 Gourmet Avenue, Food City,<br />Chennai, Tamil Nadu - 600001
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><FaPhoneAlt /></div>
                  <div className="contact-text">+91 98765 43210</div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><FaEnvelope /></div>
                  <div className="contact-text">support@eatyoway.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-professional">
        <div className="container-fluid px-3 px-lg-5">
          <div className="footer-bottom-wrapper">
            <p className="copyright-text">
              © {new Date().getFullYear()} <span>EatYoWay</span>. All Rights Reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#!">Terms of Service</a>
              <a href="#!">Cookie Policy</a>
              <a href="#!">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
