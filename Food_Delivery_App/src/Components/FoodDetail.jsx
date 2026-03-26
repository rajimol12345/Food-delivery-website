import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaMinus, FaTruck, FaLeaf, FaClock, FaCheckCircle, FaHeart, FaRegHeart } from 'react-icons/fa';
import './FoodDetail.css';

const FoodDetail = () => {
  const { foodId } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  };

  const userId = getCookie('token');

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`/api/menu/item/${foodId}`);
        setItem(res.data);
        
        // Check if item is in wishlist
        if (userId) {
          const savedRes = await axios.get(`/api/saved/${userId}`);
          const isItemSaved = savedRes.data.some(saved => saved.productId?._id === foodId);
          setIsSaved(isItemSaved);
        }
      } catch (err) {
        console.error('Error loading food item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [foodId, userId]);

  const handleAddToCart = async () => {
    if (!userId) return alert('Please log in to add to cart');
    try {
      await axios.post('/api/cart/addcart', {
        userId,
        menuId: foodId,
        quantity: quantity,
      });
      alert('Added to cart');
      navigate('/Cart');
    } catch (err) {
      console.error('Cart add failed:', err);
      alert('Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!userId) return alert('Please log in to save items');
    try {
      await axios.post('/api/saved/toggle', { userId, productId: foodId });
      setIsSaved(!isSaved);
    } catch (err) {
      console.error('Wishlist toggle failed:', err);
    }
  };

  const incrementQty = () => setQuantity(prev => prev + 1);
  const decrementQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  if (loading) return (
    <div className="loading-spinner-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  if (!item) return <div className="text-center text-danger my-5">Item not found</div>;

  return (
    <div className="food-detail-wrapper">
      <div className="food-detail-card">
        <div className="food-detail-grid">
          {/* Left: Image Section */}
          <div className="food-image-section">
            <div className="food-image-container">
              <button 
                className={`wishlist-icon-standard ${isSaved ? 'saved' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleWishlist();
                }}
                title={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                style={{ top: '25px', right: '25px', width: '50px', height: '50px', fontSize: '22px' }}
              >
                {isSaved ? <FaHeart /> : <FaRegHeart />}
              </button>
              <img
                src={item.image}
                alt={item.name}
                className="food-image-main"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/fallback.jpg';
                }}
              />
              <div className="category-badge">{item.category}</div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="food-info-section">
            <nav className="breadcrumb-nav">
              <span>Menu</span> &gt; <span>{item.category}</span> &gt; <span className="active">{item.name}</span>
            </nav>

            <h1 className="food-title-main">{item.name}</h1>
            
            <div className="rating-info">
              <div className="star-rating">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>
              <span className="reviews-count">(45 Reviews)</span>
            </div>

            <p className="food-desc-large">{item.description}</p>

            <div className="price-section-large">
              <span className="currency-symbol">₹</span>
              <span className="price-value">{item.price}</span>
              <span className="price-label">Per Plate</span>
            </div>

            <hr className="divider-line" />

            <div className="order-controls">
              <div className="quantity-selector-modern">
                <button className="qty-btn" onClick={decrementQty} aria-label="Decrease quantity">
                  <FaMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                <button className="qty-btn" onClick={incrementQty} aria-label="Increase quantity">
                  <FaPlus />
                </button>
              </div>

              <button className="btn-add-to-cart-modern" onClick={handleAddToCart}>
                Add to Cart • ₹{item.price * quantity}
              </button>
            </div>

            <div className="trust-signals-grid">
              <div className="trust-item">
                <FaTruck className="trust-icon" />
                <span>Fast Delivery</span>
              </div>
              <div className="trust-item">
                <FaLeaf className="trust-icon" />
                <span>Freshly Prepared</span>
              </div>
              <div className="trust-item">
                <FaClock className="trust-icon" />
                <span>30-40 Mins</span>
              </div>
              <div className="trust-item">
                <FaCheckCircle className="trust-icon" />
                <span>Quality Check</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
