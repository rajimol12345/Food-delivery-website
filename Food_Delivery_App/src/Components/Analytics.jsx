import React from 'react';
import { 
  FaSearch, FaBell, FaShoppingBag, FaUserAlt
} from 'react-icons/fa';
import AdminSidebar from './AdminSidebar';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import './Analytics.css';

const Analytics = () => {


  const pieData = [
    { name: 'Pending', value: 55, color: '#3182CE' },
    { name: 'Cancelled', value: 15, color: '#F56565' },
    { name: 'Delivered', value: 30, color: '#ECC94B' },
  ];

  const barData = [
    { name: '2026-03-18', orders: 0 },
    { name: '2026-03-19', orders: 0 },
    { name: '2026-03-20', orders: 0 },
    { name: '2026-03-21', orders: 0 },
    { name: '2026-03-22', orders: 0 },
    { name: '2026-03-23', orders: 1 },
    { name: '2026-03-24', orders: 5 },
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
              <span className="badge">10</span>
            </div>
            <div className="user-profile-mini">
              <FaUserAlt />
            </div>
          </div>
        </header>

        <section className="dashboard-content">
          <h2 className="admin-page-title">Analytics Dashboard</h2>

          {/* Top KPI Metrics */}
          <div className="analytics-metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Total Orders</span>
              <div className="metric-value">10</div>
            </div>
            <div className="metric-card">
              <span className="metric-label">Total Revenue</span>
              <div className="metric-value">₹0.00</div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-grid-analytics">
            {/* Pie Chart Card */}
            <div className="analytics-chart-card">
              <h3>Order Status Distribution</h3>
              <div className="chart-holder-analytics">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="top" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bar Chart Card */}
            <div className="analytics-chart-card">
              <h3>Orders in Last 7 Days</h3>
              <div className="chart-holder-analytics">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis 
                      dataKey="name" 
                      angle={-25} 
                      textAnchor="end" 
                      interval={0}
                      tick={{ fill: '#888', fontSize: 11 }}
                      height={60}
                    />
                    <YAxis tick={{ fill: '#888', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(252, 128, 25, 0.05)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="orders" fill="#3182CE" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Analytics;
