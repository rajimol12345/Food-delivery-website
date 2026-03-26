import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaThLarge, FaChartLine, FaUtensils, FaListUl, FaBoxOpen, 
  FaCog, FaUserAlt, FaSignOutAlt, FaHeadset 
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Implement logout logic or navigate to logout
    navigate('/Logout');
  };

  const menuItems = [
    { path: '/dashboard', icon: <FaThLarge />, label: 'Dashboard' },
    { path: '/admin/analytics', icon: <FaChartLine />, label: 'Analytics' },
    { path: '/admin/restaurants', icon: <FaUtensils />, label: 'Restaurants' },
    { path: '/admin/menu', icon: <FaListUl />, label: 'Menu' },
    { path: '/admin/orders', icon: <FaBoxOpen />, label: 'Orders' },
    { path: '/admin/settings', icon: <FaCog />, label: 'Settings' },
    { path: '/admin/users', icon: <FaUserAlt />, label: 'User Info' },
    { path: '/admin/support', icon: <FaHeadset />, label: 'Support' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <h1>EatYoWay</h1>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li 
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''} 
              onClick={() => navigate(item.path)}
            >
              {item.icon} <span>{item.label}</span>
            </li>
          ))}
          <li className="logout-nav" onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
