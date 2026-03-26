import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "./Rating.css";

const Rating = ({ restaurantId, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token") || localStorage.getItem("userId");

  useEffect(() => {
    if (!restaurantId) return;

    const loadRatings = async () => {
      try {
        setLoading(true);
        const avgRes = await axios.get(`/api/rate/average/${restaurantId}`);
        setAverage(avgRes.data.average ?? 0);

        if (userId) {
          try {
            const userRes = await axios.get(`/api/rate/${restaurantId}/${userId}`);
            setRating(userRes.data.rating ?? 0);
          } catch (err) {
            setRating(0);
          }
        }
      } catch (err) {
        console.error("Rating load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, [restaurantId, userId]);

  const submitRating = async (value) => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    setRating(value);

    try {
      if (onRatingSubmit) {
        await onRatingSubmit(value);
      } else {
        await axios.post("/api/rate", {
          restaurantId,
          userId,
          rating: value,
        });
        alert("Rating saved!");
      }

      const avg = await axios.get(`/api/rate/average/${restaurantId}`);
      setAverage(avg.data.average ?? 0);
    } catch (err) {
      console.error("Rating submission error:", err);
      alert("Failed to submit rating.");
    }
  };

  if (loading) return <span className="rating-loading">Loading rating...</span>;

  return (
    <div className="rating-wrapper">
      <div className="stars-row">
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <FaStar
              key={value}
              className="star-icon"
              size={22}
              color={(hover ?? rating) >= value ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(null)}
              onClick={() => submitRating(value)}
            />
          );
        })}
      </div>
      <p className="avg-rating-text">
        Average Rating: <b>{average.toFixed(1)}</b> / 5
      </p>
    </div>
  );
};

export default Rating;
