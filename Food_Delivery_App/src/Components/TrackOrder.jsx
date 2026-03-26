import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaClipboardList, FaUtensils, FaMotorcycle, FaHome } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(1);
  const mapRef = useRef(null);
  const googleMap = useRef(null);

  // --- CONFIGURATION ---
  // Replace this with your real Google Maps API Key
  const apiKey = "YOUR_API_KEY_HERE";
  // Check if we should use the live map or the professional fallback
  const isApiKeyValid = apiKey && apiKey !== "YOUR_API_KEY_HERE";

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus((prev) => (prev < 4 ? prev + 1 : prev));
    }, 10000); 
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.google) return;

      const userPos = { lat: 13.0418, lng: 80.2341 };
      const restaurantPos = { lat: 13.0500, lng: 80.2400 };
      const partnerPos = { lat: 13.0450, lng: 80.2370 };

      try {
        googleMap.current = new window.google.maps.Map(mapRef.current, {
          center: partnerPos,
          zoom: 15,
          styles: [
            { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#7c93a3" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
            { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f5f5f5" }] }
          ],
          disableDefaultUI: true,
        });

        const createMarker = (position, title, label) => {
          return new window.google.maps.Marker({
            position,
            map: googleMap.current,
            title,
            label: { text: label, color: 'white', fontWeight: 'bold' }
          });
        };

        createMarker(restaurantPos, "Restaurant", "R");
        createMarker(partnerPos, "Delivery Partner", "P");
        createMarker(userPos, "Your Home", "H");

        new window.google.maps.Polyline({
          path: [restaurantPos, partnerPos, userPos],
          geodesic: true,
          strokeColor: "#fc8019",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map: googleMap.current
        });
      } catch (err) {
        console.error("Map initialization failed", err);
      }
    };

    if (isApiKeyValid && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        if (script && document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    } else if (window.google && isApiKeyValid) {
      initMap();
    }
  }, [isApiKeyValid]);

  return (
    <div className="track-order-container">
      <div className="track-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaChevronLeft /> Back
        </button>
        <div className="order-summary-mini">
          <span>Order ID: <strong>#{orderId?.slice(-8).toUpperCase()}</strong></span>
          <span className="dot">•</span>
          <span>Estimated Delivery: <strong>25-30 mins</strong></span>
        </div>
      </div>

      <div className="track-grid">
        <div className="track-info-card">
          <h2 className="track-title">Track your order</h2>
          <p className="track-subtitle">Hang tight! Your delicious meal is being prepared with love.</p>

          <div className="status-stepper">
            <div className={`step ${status >= 1 ? 'active' : ''}`}>
              <div className="step-icon-bg confirmed"><FaClipboardList /></div>
              <div className="step-content">
                <h4>Order Confirmed</h4>
                <p>We have received your order</p>
              </div>
            </div>
            <div className={`step ${status >= 2 ? 'active' : ''}`}>
              <div className="step-icon-bg preparing"><FaUtensils /></div>
              <div className="step-content">
                <h4>Preparing Food</h4>
                <p>Chef is working their magic</p>
              </div>
            </div>
            <div className={`step ${status >= 3 ? 'active' : ''}`}>
              <div className="step-icon-bg shipping"><FaMotorcycle /></div>
              <div className="step-content">
                <h4>Out for Delivery</h4>
                <p>Our partner is on the way</p>
              </div>
            </div>
            <div className={`step ${status >= 4 ? 'active' : ''}`}>
              <div className="step-icon-bg delivered"><FaHome /></div>
              <div className="step-content">
                <h4>Delivered</h4>
                <p>Enjoy your meal!</p>
              </div>
            </div>
            <div className="progress-line" style={{ height: `${(status - 1) * 33.33}%` }}></div>
          </div>

          <div className="delivery-partner-card">
            <div className="partner-details">
              <img src="https://ui-avatars.com/api/?name=Rahul+Kumar&background=fc8019&color=fff" alt="Partner" />
              <div>
                <h4>Rahul Kumar</h4>
                <p>Your delivery partner</p>
              </div>
            </div>
            <button className="call-btn"><FaPhoneAlt /> Call Partner</button>
          </div>
        </div>

        <div className="track-map-card">
          {!isApiKeyValid ? (
            <div className="map-fallback active">
              <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" alt="Aristic Map" />
            </div>
          ) : (
            <>
              {!window.google && (
                <div className="map-loading-overlay">
                  <div className="spinner"></div>
                  <p>Initializing Live Tracking...</p>
                </div>
              )}
              <div className="map-placeholder" ref={mapRef}></div>
            </>
          )}
          
          <div className="map-info">
            <div className="info-stat"><FaClock /><span>12 mins away</span></div>
            <div className="info-stat"><FaMapMarkerAlt /><span>T. Nagar, Chennai</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
