import React, { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import logo from '../Components/img/logo.png';

const Header = () => {
  const { cartCount } = useCart();
  const [animateCart, setAnimateCart] = useState(false);
  const location = useLocation();

  const navItems = [
    { Icon: FaHome, to: '/Home', label: 'Home' },
    { Icon: FaShoppingCart, to: '/Cart', label: 'Cart' },
    {
      Icon: FaUser,
      label: 'Account',
      dropdown: [
        { to: '/Accounts', label: 'Profile' },
        { to: '/Order', label: 'My Orders' },
        { to: '/SavedItems', label: 'Wishlist' },
      ],
    },
    { Icon: FaSignOutAlt, to: '/Logout', label: 'Logout' },
  ];

  //  Animate cart badge each time cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setAnimateCart(true);
      const timer = setTimeout(() => setAnimateCart(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm header-animate">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/Home">
          <img
            src={logo}
            alt="EatYoWay Logo"
            className="nav-logo"
            height={60}
            width={150}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav ms-auto">
            {navItems.map(({ Icon, to, label, dropdown }) =>
              dropdown ? (
                <li className="nav-item dropdown" key={label}>
                  <a
                    className={`nav-link dropdown-toggle ${
                      dropdown.some(d => location.pathname === d.to) ? 'active' : ''
                    }`}
                    href="#!"
                    id={`${label}-dropdown`}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Icon className="nav-icon" /> {label}
                  </a>
                  <ul
                    className="dropdown-menu shadow-lg border-0"
                    aria-labelledby={`${label}-dropdown`}
                  >
                    {dropdown.map(({ to: dt, label: dl }) => (
                      <li key={dt}>
                        <NavLink 
                          className={({ isActive }) => `dropdown-item ${isActive ? 'active' : ''}`}
                          to={dt}
                        >
                          {dl}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li className="nav-item" key={to}>
                  <NavLink
                    className={({ isActive }) => `nav-link position-relative ${isActive ? 'active' : ''}`}
                    to={to}
                  >
                    <Icon className="nav-icon" /> {label}
                    {label === 'Cart' && cartCount > 0 && (
                      <span
                        className={`position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge ${
                          animateCart ? 'bounce' : ''
                        }`}
                      >
                        {cartCount}
                        <span className="visually-hidden">items in cart</span>
                      </span>
                    )}
                  </NavLink>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
