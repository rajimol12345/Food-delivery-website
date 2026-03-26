import React from 'react';
import './OfferPopup.css';
import offerImage from './img/offer.png'; // A placeholder for a dedicated offer image

const OfferPopup = ({ onClose }) => {
  return (
    <div className="offer-popup-overlay" onClick={onClose}>
      <div className="offer-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="offer-popup-close" onClick={onClose}>&times;</button>
        <div className="offer-popup-image-container">
          <img src={offerImage} alt="Special Offer" className="offer-popup-image" />
        </div>
        <div className="offer-popup-text-container">
          <h2 className="offer-popup-title">Flash Sale!</h2>
          <p className="offer-popup-description">
            Get an exclusive <span className="offer-popup-highlight">50% OFF</span> on your next order. Don't miss out!
          </p>
          <a href="/offers" className="offer-popup-cta">View Offers</a>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;
