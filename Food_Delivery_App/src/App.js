import React from 'react';
import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// Component imports
import Header from './Components/Header';
import RegisterForm from './Components/RegisterForm';
import LoginForm from './Components/LoginForm';
import Home from './Components/Home';
import Footer from './Components/Footer';
import Cart from './Components/Cart';
import MyOrders from './Components/MyOrders.jsx';
import Logout from './Components/Logout';
import Index from './Components/Index';
import RestaurantDetail from './Components/RestaurantDetail';
import Checkout from './Components/Checkout';
import PaymentPage from './Components/PaymentPage.jsx';
import RestaurantList from './Components/RestaurantList';
import SavedItems from './Components/SavedItems';
import Searchpage from './Components/Searchpage.jsx';
import Accounts from './Components/Accounts';
import EditProfile from './Components/EditProfile';
import FoodDetail from './Components/FoodDetail';
import PlaceOrder from './Components/PlaceOrder.jsx';
import SearchResults from './Components/SearchResults.jsx';
import MenuPage from './Components/MenuPage.jsx';
import OrderSuccessPage from './Components/OrderSuccessPage.jsx';
import TrackOrder from './Components/TrackOrder.jsx';
import Dashboard from './Components/Dashboard.jsx';
import UserInfo from './Components/UserInfo.jsx';
import Analytics from './Components/Analytics.jsx';
import ChatBot from './Components/ChatBot.jsx';
import axios from 'axios';

// Set global API base URL
axios.defaults.baseURL = 'https://food-delivery-website-k1e1.onrender.com';

function App() {
  const location = useLocation();

  // Routes where Header or Footer should be hidden
  const hideHeaderOnRoutes = ['/', '/LoginForm', '/RegisterForm', '/dashboard', '/admin/users', '/admin/analytics', '/admin/support', '/admin/restaurants', '/admin/orders', '/admin/menu', '/admin/settings'];
  const hideFooterOnRoutes = ['/', '/LoginForm', '/RegisterForm', '/dashboard', '/admin/users', '/admin/analytics', '/admin/support', '/admin/restaurants', '/admin/orders', '/admin/menu', '/admin/settings'];

  const shouldHideHeader = hideHeaderOnRoutes.includes(location.pathname);
  const shouldHideFooter = hideFooterOnRoutes.includes(location.pathname);

  return (
    <div>
      {/* Header */}
      {!shouldHideHeader && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/restaurant/:restaurantid" element={<RestaurantDetail />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Order" element={<MyOrders />} />
        <Route path="/SavedItems" element={<SavedItems />} />
        <Route path="/Accounts" element={<Accounts />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/RestaurantList" element={<RestaurantList />} />
        <Route path="/food/:foodId" element={<FoodDetail />} />
        <Route path="/menu/category/:categoryName" element={<MenuPage />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/searchpage" element={<Searchpage />} />

        {/* Order Success Route */}
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserInfo />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/support" element={<div className="dashboard-content"><h2>Admin Support Chat Coming Soon...</h2></div>} />
        {/* Placeholders for upcoming modules */}
        <Route path="/admin/restaurants" element={<div className="dashboard-content"><h2>Restaurants Management Coming Soon...</h2></div>} />
        <Route path="/admin/orders" element={<div className="dashboard-content"><h2>Orders Management Coming Soon...</h2></div>} />
        <Route path="/admin/menu" element={<div className="dashboard-content"><h2>Menu Management Coming Soon...</h2></div>} />
        <Route path="/admin/settings" element={<div className="dashboard-content"><h2>Settings Management Coming Soon...</h2></div>} />

        {/* Catch-all: Redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer />

      {/* Chatbot Bubble */}
      <ChatBot />

      {/* Footer */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
}

export default App;
