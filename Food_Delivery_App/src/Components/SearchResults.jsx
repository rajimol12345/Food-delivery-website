import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./searchResults.css";

function SearchResults() {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savedItems, setSavedItems] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wishlistIsProcessing, setWishlistIsProcessing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  const triggerToast = useCallback((message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError("");

        const [searchRes, savedRes] = await Promise.all([
          axios.get(`/api/search?q=${encodeURIComponent(query)}`),
          userId ? axios.get(`/api/saved/${userId}`) : Promise.resolve({ data: [] })
        ]);

        const data = searchRes.data;
        const finalResults = Array.isArray(data) ? data : (Array.isArray(data.results) ? data.results : []);
        setResults(finalResults);
        setSavedItems(savedRes.data.map(item => item.productId));

      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load results. Please try again.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, userId]);

  const handleAddToWishlist = async (item) => {
    if (!userId) return triggerToast("Please log in to save items.");
    if (wishlistIsProcessing) return;

    const isSaved = savedItems.includes(item._id);
    setWishlistIsProcessing(true);

    try {
      if (isSaved) {
        await axios.delete(`/api/saved/${userId}/${item._id}`);
        setSavedItems((prev) => prev.filter((id) => id !== item._id));
        triggerToast(`${item.name} removed from Wishlist.`);
      } else {
        await axios.post(`/api/saved/add`, {
          userId,
          productId: item._id,
        });
        setSavedItems((prev) => [...prev, item._id]);
        triggerToast(`${item.name} added to Wishlist.`);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (!isSaved) {
          setSavedItems((prev) => [...prev, item._id]);
        }
        triggerToast(`${item.name} is already in your Wishlist.`);
      } else {
        console.error("Wishlist update error:", error);
        triggerToast("Failed to update wishlist.");
      }
    } finally {
      setWishlistIsProcessing(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!userId) return triggerToast("Please log in to add items to cart.");

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await axios.post(`/api/cart/addcart`, {
        userId,
        menuId: item._id,
        quantity: 1,
      });
      triggerToast(`${item.name} added to cart.`);
    } catch (error) {
      console.error("Add to cart error:", error);
      triggerToast("Failed to add item to cart.");
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const handleCardClick = (item) => {
    navigate(`/food/${item._id}`);
  };

  const getSortedResults = () => {
    let sorted = [...results];
    if (sortBy === "priceLow") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") sorted.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return sorted;
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <h2 className="mt-3">Searching for "{query}"...</h2>
    </div>
  );

  const displayResults = getSortedResults();

  return (
    <div className="search-results-page">
      <div className="search-results-container">
        <div className="search-results-card shadow-lg">
          <div className="search-header-flex">
            <h2 className="search-results-title">Search Results for "{query}"</h2>
            
            <div className="search-filters-bar">
              <span className="filter-label">Sort by:</span>
              <select 
                className="filter-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {showToast && (
            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
              <div className="toast show align-items-center text-white bg-dark border-0 shadow-lg">
                <div className="d-flex">
                  <div className="toast-body">{toastMessage}</div>
                  <button
                    type="button"
                    className="btn-close btn-close-white me-2 m-auto"
                    onClick={() => setShowToast(false)}
                  ></button>
                </div>
              </div>
            </div>
          )}

          {error && <div className="alert alert-danger text-center">{error}</div>}

          {results.length === 0 && !error ? (
            <div className="text-center py-5">
              <p className="fs-4 text-muted">No items found matching your search.</p>
              <button className="btn-home-back" onClick={() => navigate("/Home")}>Back to Home</button>
            </div>
          ) : (
            <div className="results-list">
              {displayResults.map((item) => {
                const isSaved = savedItems.includes(item._id);

                return (
                  <div className="result-item" key={item._id} onClick={() => handleCardClick(item)}>
                    <div className="result-item-left">
                      <div className="result-image-wrapper">
                        <button
                          className={`wishlist-btn ${isSaved ? "active" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToWishlist(item);
                          }}
                        >
                          {isSaved ? <FaHeart /> : <FaRegHeart />}
                        </button>
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="result-image" 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/150?text=Food';
                          }}
                        />
                      </div>
                      <div className="result-info">
                        <h4 className="result-name">{item.name}</h4>
                        <p className="result-description">{item.description}</p>
                      </div>
                    </div>
                    <div className="result-item-right">
                      <span className="result-price">₹{item.price}</span>
                      <button 
                        className="btn-add-cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
