import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';
import './MenuList.css';

const MenuList = ({ restaurantId, showCustomToast }) => {
  const [menu, setMenu] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [wishlistIsProcessing, setWishlistIsProcessing] = useState(false);

  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const userId = getCookie('token');

  const triggerToast = useCallback((message) => {
    if (showCustomToast) {
      showCustomToast(message);
    } else {
      setToastMessage(message);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [showCustomToast]);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) {
        setLoading(false);
        return;
      }

      try {
        const [menuRes, savedRes] = await Promise.all([
          axios.get(`/api/menu/restaurant/${restaurantId}`),
          userId
            ? axios.get(`/api/saved/${userId}`)
            : Promise.resolve({ data: [] }),
        ]);

        setMenu(menuRes.data);
        setSavedItems(savedRes.data.map((item) => item.productId));
      } catch (error) {
        console.error('Error fetching menu/wishlist:', error);
        triggerToast('Failed to load menu or wishlist');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, userId, triggerToast]);

  const handleAddToWishlist = async (item) => {
    if (!userId) return triggerToast('Please log in to save items.');
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
        // Handle 409 Conflict gracefully
        if (!isSaved) {
          setSavedItems((prev) => [...prev, item._id]);
        }
        triggerToast(`${item.name} is already in your Wishlist.`);
      } else {
        console.error('Wishlist update error:', error);
        triggerToast('Failed to update wishlist.');
      }
    } finally {
      setWishlistIsProcessing(false);
    }
  };

  const handleAddToCart = async (item) => {
    if (!userId) return triggerToast('Please log in to add items to cart.');

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
      console.error('Add to cart error:', error);
      triggerToast('Failed to add item to cart.');
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const handleCardClick = (item) => {
    navigate(`/food/${item._id}`);
  };

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-grow text-warning" role="status" />
      <p className="mt-3 text-muted fw-bold">Loading curated menu...</p>
    </div>
  );
  
  if (!menu.length) return <div className="text-center py-5 text-muted">No menu items found.</div>;

  return (
    <div className="menu-listing-section">
      <div className="menu-title-container">
        <h3 className="menu-title-main">Explore Our Menu</h3>
        <div className="menu-underline"></div>
      </div>

      {showToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }}>
          <div className="toast custom-toast show align-items-center text-white border-0">
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

      <div className="row g-4">
        {menu.map((item) => {
          const isSaved = savedItems.includes(item._id);

          return (
            <div className="col-lg-3 col-md-4 col-sm-6" key={item._id}>
              <div
                className="menu-card card h-100 position-relative"
                onClick={() => handleCardClick(item)}
              >
                {/* Image & Wishlist Overlay */}
                <div className="menu-img-wrapper">
                  <button
                    className={`wishlist-icon-standard ${isSaved ? 'saved' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
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
                    className="menu-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>

                {/* Card Body */}
                <div className="card-body-custom">
                  <h5 className="item-name">{item.name}</h5>
                  <p className="item-desc">{item.description}</p>
                  
                  <div className="item-footer">
                    <span className="item-price">₹{item.price}</span>
                    <button
                      className="add-btn-professional d-flex align-items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      <FaPlus size={12} /> ADD
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuList;
