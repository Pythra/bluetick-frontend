import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import './AdminPage.css';

function AdminPage() {
  const { apiUrl } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));

  // Check if admin is already logged in
  useEffect(() => {
    if (adminToken) {
      setIsLoggedIn(true);
      fetchUsers();
    }
  }, [adminToken]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      if (data.success) {
        const token = data.token;
        localStorage.setItem('adminToken', token);
        setAdminToken(token);
        setIsLoggedIn(true);
        fetchUsers();
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setIsLoggedIn(false);
    setUsers([]);
  };

  const fetchUsers = useCallback(async () => {
    if (!adminToken) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          handleLogout();
          return;
        }
        throw new Error(data.error || 'Failed to fetch users');
      }

      if (data.success) {
        // Sort orders by creation date (newest first) for each user
        const usersWithSortedOrders = (data.users || []).map(user => ({
          ...user,
          orders: user.orders?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []
        }));
        setUsers(usersWithSortedOrders);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, adminToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'status-badge status-completed';
      case 'in_progress':
        return 'status-badge status-in-progress';
      case 'cancelled':
        return 'status-badge status-cancelled';
      default:
        return 'status-badge status-pending';
    }
  };

  const getOrderStatusLabel = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Login Form Component
  if (!isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="login-form-container">
            <div className="login-header">
              <Button onClick={() => navigate('/')} className="back-button">
                ← Back to Home
              </Button>
              <h1 className="admin-title">Admin Login</h1>
              <p className="admin-subtitle">Enter your admin credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  placeholder="Enter admin username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  placeholder="Enter admin password"
                />
              </div>

              {loginError && (
                <div className="error-message">
                  <p>⚠️ {loginError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="login-button"
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-header-top">
            <Button onClick={() => navigate('/')} className="back-button">
              ← Back to Home
            </Button>
            <Button onClick={fetchUsers} className="refresh-button">
              🔄 Refresh
            </Button>
            <Button onClick={handleLogout} className="logout-button">
              Logout
            </Button>
          </div>
          <h1 className="admin-title">User Management Dashboard</h1>
          <p className="admin-subtitle">View all users, their cart items, and order history</p>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-number">{users.length}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {users.reduce((total, user) => total + (user.cart?.items?.length || 0), 0)}
              </div>
              <div className="stat-label">Cart Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {users.reduce((total, user) => total + (user.orders?.length || 0), 0)}
              </div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <Button onClick={fetchUsers} className="retry-button">
              Try Again
            </Button>
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>No users found</h2>
            <p>Users will appear here once they register on the platform.</p>
          </div>
        ) : (
          <div className="users-grid">
            {users.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-header">
                  <div className="user-info">
                    <h3 className="user-name">{user.firstName} {user.lastName}</h3>
                    <p className="user-email">{user.email}</p>
                    <p className="user-phone">{user.phone}</p>
                    <p className="user-joined">Joined: {formatDate(user.createdAt)}</p>
                  </div>
                </div>

                {/* Cart Items Section */}
                <div className="user-cart-section">
                  <h4 className="section-title">
                    Cart Items ({user.cart?.items?.length || 0})
                    {user.cart?.updatedAt && (
                      <span className="section-date">
                        Updated: {formatDate(user.cart.updatedAt)}
                      </span>
                    )}
                  </h4>
                  {user.cart?.items && user.cart.items.length > 0 ? (
                    <div className="cart-items-list">
                      {user.cart.items.map((item, index) => (
                        <div key={index} className="cart-item">
                          <div className="cart-item-info">
                            <span className="item-title">{item.title}</span>
                            <span className="item-price">{item.price}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                          <div className="item-category">{item.category}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-section">No items in cart</p>
                  )}
                </div>

                {/* Orders Section */}
                <div className="user-orders-section">
                  <h4 className="section-title">
                    Orders ({user.orders?.length || 0})
                  </h4>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="orders-list">
                      {user.orders.map((order) => (
                        <div key={order.id} className="order-item">
                          <div className="order-header">
                            <span className="order-id">#{order.id.slice(-8)}</span>
                            <span className={getOrderStatusBadgeClass(order.status)}>
                              {getOrderStatusLabel(order.status)}
                            </span>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                          <div className="order-details">
                            <div className="order-field">
                              <span className="field-label">Product:</span>
                              <span className="field-value">{order.productName}</span>
                            </div>
                            <div className="order-field">
                              <span className="field-label">Price:</span>
                              <span className="field-value price-value">{order.productPrice}</span>
                            </div>
                            {order.totalAmount && (
                              <div className="order-field">
                                <span className="field-label">Total:</span>
                                <span className="field-value">
                                  {order.currency === 'USD' ? '$' : '₦'}{order.totalAmount.toLocaleString()}
                                </span>
                              </div>
                            )}
                            {order.message && (
                              <div className="order-field message-field">
                                <span className="field-label">Message:</span>
                                <div className="field-value message-text">{order.message}</div>
                              </div>
                            )}
                            {order.metadata?.postDetails && (
                              <div className="order-field">
                                <span className="field-label">Post Details:</span>
                                <div className="field-value">{order.metadata.postDetails}</div>
                              </div>
                            )}
                            {order.metadata?.comments && (
                              <div className="order-field">
                                <span className="field-label">Comments:</span>
                                <div className="field-value">{order.metadata.comments}</div>
                              </div>
                            )}
                            {order.metadata?.instructions && (
                              <div className="order-field">
                                <span className="field-label">Special Instructions:</span>
                                <div className="field-value">{order.metadata.instructions}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="empty-section">No orders yet</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;

