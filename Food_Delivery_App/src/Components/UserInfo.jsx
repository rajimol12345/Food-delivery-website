import React, { useState } from 'react';
import { 
  FaSearch, FaBell, FaShoppingBag, FaUserAlt, FaEye, FaEdit, FaTrash,
  FaEnvelope, FaPhone, FaUserTag, FaCalendarAlt, FaCheckCircle
} from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import './UserInfo.css';

const UserInfo = () => {

  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: 'Test T', email: 'test123@gmail.com', phone: '89562344558', role: 'User', status: 'Active', joined: 'Invalid Date' },
    { id: 2, name: 'Raji JC', email: 'raji123@gmail.com', phone: '9876543210', role: 'User', status: 'Active', joined: 'Invalid Date' },
    { id: 3, name: 'Test User', email: 'test@example.com', phone: '1234567890', role: 'User', status: 'Active', joined: 'Invalid Date' },
    { id: 4, name: 'Test User', email: 'testuser123@example.com', phone: '1122334455', role: 'User', status: 'Active', joined: 'Invalid Date' },
  ];



  return (
    <div className="admin-dashboard-container">
      {/* Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="admin-main">
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-search">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search orders, users..." />
          </div>
          <div className="header-actions">
            <div className="action-icon"><FaShoppingBag /></div>
            <div className="action-icon notification">
              <FaBell />
              <span className="badge"></span>
            </div>
            <div className="user-profile-mini">
              <FaUserAlt />
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <h2 className="admin-page-title">Users Info</h2>

          {/* User Table Card */}
          <div className="table-card">
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td><span className="status-badge active">{user.status}</span></td>
                    <td>{user.joined}</td>
                    <td className="action-btns">
                      <button className="btn-view" onClick={() => setSelectedUser(user)}>
                        <FaEye /> View
                      </button>
                      <button className="btn-edit"><FaEdit /> Edit</button>
                      <button className="btn-delete"><FaTrash /> Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Details Sector (Conditional Rendering) */}
          {selectedUser && (
            <div className="user-details-card animate-in">
              <div className="details-header">
                <h3>User Details</h3>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <FaUserAlt className="detail-icon" />
                  <div><strong>Name</strong> <p>{selectedUser.name}</p></div>
                </div>
                <div className="detail-item">
                  <FaEnvelope className="detail-icon" />
                  <div><strong>Email</strong> <p>{selectedUser.email}</p></div>
                </div>
                <div className="detail-item">
                  <FaPhone className="detail-icon" />
                  <div><strong>Phone</strong> <p>{selectedUser.phone}</p></div>
                </div>
                <div className="detail-item">
                  <FaUserTag className="detail-icon" />
                  <div><strong>Role</strong> <p>{selectedUser.role}</p></div>
                </div>
                <div className="detail-item">
                  <FaCheckCircle className="detail-icon" />
                  <div><strong>Status</strong> <p>{selectedUser.status}</p></div>
                </div>
                <div className="detail-item">
                  <FaCalendarAlt className="detail-icon" />
                  <div><strong>Joined</strong> <p>{selectedUser.joined}</p></div>
                </div>
              </div>
              <button className="close-details-btn" onClick={() => setSelectedUser(null)}>
                Close
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default UserInfo;
