import { 
  FaSearch, FaBell, FaShoppingBag, FaUserAlt
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import './Dashboard.css';

const Dashboard = () => {


  // Mock data for the chart
  const data = [
    { name: 'Wed', orders: 0 },
    { name: 'Thu', orders: 0 },
    { name: 'Fri', orders: 0 },
    { name: 'Sat', orders: 0 },
    { name: 'Sun', orders: 0.2 },
    { name: 'Mon', orders: 1.5 },
    { name: 'Tue', orders: 5 },
  ];

  const activities = [
    { id: 1, text: 'User Ramesh placed an order worth ₹1,200', time: '2 mins ago' },
    { id: 2, text: 'New restaurant "Spice Club" registered', time: '1 hour ago' },
    { id: 3, text: 'User Priya wrote a review for "Curry Point"', time: '3 hours ago' },
    { id: 4, text: '5 new users signed up', time: '5 hours ago' },
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
          <h1 className="page-title">Dashboard</h1>

          {/* KPI Stat Cards */}
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-label">Users</span>
              <div className="stat-value">4</div>
              <span className="stat-trend positive text-success">+5.2% this month</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Restaurants</span>
              <div className="stat-value">10</div>
              <span className="stat-trend neutral">+3 added</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Orders</span>
              <div className="stat-value">10</div>
              <span className="stat-trend positive text-success">+8.7% this month</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Revenue</span>
              <div className="stat-value">₹0</div>
              <span className="stat-trend positive text-success">+10.4% from last month</span>
            </div>
          </div>

          {/* Chart Section */}
          <div className="chart-section-card">
            <h3>Order Trends This Week</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#fc8019" 
                    strokeWidth={3} 
                    dot={{ fill: '#fc8019', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity-card">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-mark"></div>
                  <div className="activity-info">
                    <p className="activity-text">{activity.text}</p>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
