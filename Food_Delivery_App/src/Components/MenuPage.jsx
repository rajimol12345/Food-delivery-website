// src/pages/MenuPage.jsx
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./MenuPage.css";

const MenuPage = ({ showCustomToast }) => {
  const { categoryName } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [wishlistIsProcessing, setWishlistIsProcessing] = useState(false);
  const [cartIsProcessing, setCartIsProcessing] = useState(false);

  // Filter States
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('relevance');

  const triggerToast = useCallback((message) => {
    if (showCustomToast) {
      showCustomToast(message);
    } else {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [showCustomToast]);

  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = getCookie("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const menuRes = await axios.get(
          `/api/menu/menus/category/${encodeURIComponent(categoryName)}`
        );
        console.log("Menu items data:", menuRes.data);

        let savedRes = { data: [] };
        if (userId) {
          savedRes = await axios.get(`/api/saved/${userId}`);
        }

        setMenuItems(menuRes.data);
        setSavedItems(savedRes.data.map((item) => item.productId));
        setToastMessage("");
      } catch (err) {
        console.error("Error fetching menu by category:", err);
        triggerToast(err.response?.data?.message || "Failed to fetch menu by category");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, userId, triggerToast]);

  const handleAddToWishlist = async (item) => {
    if (!userId) {
      triggerToast("Please log in to save items.");
      return;
    }
    if (wishlistIsProcessing) return;

    const isAlreadySaved = savedItems.includes(item._id);
    setWishlistIsProcessing(true);

    try {
      if (isAlreadySaved) {
        await axios.delete(`/api/saved/${userId}/${item._id}`);
        setSavedItems((prev) => prev.filter((id) => id !== item._id));
        triggerToast(`${item.name} removed from Wishlist.`);
      } else {
        await axios.post("/api/saved/add", { userId, productId: item._id });
        setSavedItems((prev) => [...prev, item._id]);
        triggerToast(`${item.name} added to Wishlist.`);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        if (!isAlreadySaved) {
          setSavedItems((prev) => [...prev, item._id]);
        }
        triggerToast(`${item.name} is already in your Wishlist.`);
      } else {
        console.error("Wishlist error:", error);
        triggerToast("Failed to update wishlist.");
      }
    } finally {
      setWishlistIsProcessing(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!userId) {
      triggerToast("Please log in to add items to cart.");
      return;
    }
    if (cartIsProcessing) return;
    setCartIsProcessing(true);

    try {
      await axios.post("/api/cart/addcart", {
        userId,
        menuId: item._id,
        quantity: 1,
      });

      triggerToast(`${item.name} added to cart.`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      triggerToast("Failed to add item to cart.");
    } finally {
      setTimeout(() => setCartIsProcessing(false), 500);
    }
  };

  const handleCardClick = (item) => {
    navigate(`/food/${item._id}`);
  };

  // Compute filtered & sorted items
  const getProcessedItems = () => {
    let items = [...menuItems];

    if (filterType === 'veg') {
      items = items.filter(item => 
        item.isVeg === true || 
        (item.category && item.category.toLowerCase() === 'veg') || 
        item.name.toLowerCase().includes('veg')
      );
    } else if (filterType === 'non-veg') {
      items = items.filter(item => 
        item.isVeg === false || 
        (item.category && item.category.toLowerCase() === 'non-veg') || 
        item.name.toLowerCase().includes('chicken') || 
        item.name.toLowerCase().includes('mutton') || 
        item.name.toLowerCase().includes('fish') || 
        item.name.toLowerCase().includes('egg')
      );
    }

    if (sortOrder === 'price-low') {
      items.sort((a,b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      items.sort((a,b) => b.price - a.price);
    } else if (sortOrder === 'rating') {
      items.sort((a,b) => (b.rating || 0) - (a.rating || 0));
    }

    return items;
  };

  const displayItems = getProcessedItems();

  if (loading) return <p className="text-center mt-5">Loading menu...</p>;

  return (
    <div className="menu-page bg-light py-5">
      {/* Custom Toast */}
      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast show align-items-center text-white bg-dark border-0">
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

      {/* Premium Filter Bar */}
      <div className="container-fluid px-4 mb-4">
        <div className="pro-filter-bar">
          <div className="pro-filter-chips">
            <button className={`pro-filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All Items</button>
            <button className={`pro-filter-btn ${filterType === 'veg' ? 'active' : ''}`} onClick={() => setFilterType('veg')}>Veg Only</button>
            <button className={`pro-filter-btn ${filterType === 'non-veg' ? 'active' : ''}`} onClick={() => setFilterType('non-veg')}>Non-Veg</button>
          </div>
          <div className="pro-filter-sort">
            <select className="pro-sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="relevance">Relevance</option>
              <option value="rating">Top Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="menu-grid row g-4 px-4">
        {displayItems.length > 0 ? (
          displayItems.map((item) => {
            const isSaved = savedItems.includes(item._id);
            return (
              <div className="col-md-3" key={item._id}>
                <div
                  className="card h-100 shadow-sm position-relative menu-card-premium"
                  onClick={() => handleCardClick(item)}
                >
                  {/* Image & Wishlist Overlay */}
                  <div className="menu-img-wrapper position-relative">
                    <button 
                      className={`wishlist-icon-standard ${isSaved ? "saved" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(item);
                      }}
                      title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      {isSaved ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/150?text=No+Image";
                      }}
                      className="card-img-top"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="card-body d-flex flex-column">
                    <h5 className="fw-bold text-dark">{item.name}</h5>
                    <p className="text-muted small">{item.description}</p>
                    <p className="fw-bolder fs-5 text-success mb-3">₹{item.price}</p>

                    <div className="mt-auto">
                      <button
                        className="btn btn-primary w-100 premium-add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-12 text-center py-5 text-muted">
            <h4>No items match your filter criteria.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
