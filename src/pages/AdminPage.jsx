import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import './AdminPage.css';

function AdminPage() {
  const { apiUrl } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${apiUrl}/api/orders`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const getStatusBadgeClass = (status) => {
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

  const getStatusLabel = (status) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-header-top">
            <Button onClick={() => navigate('/')} className="back-button">
              ← Back to Home
            </Button>
            <Button onClick={fetchOrders} className="refresh-button">
              🔄 Refresh
            </Button>
          </div>
          <h1 className="admin-title">Order Management</h1>
          <p className="admin-subtitle">View and manage all submitted orders</p>
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-number">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {orders.filter(o => o.status === 'in_progress').length}
              </div>
              <div className="stat-label">In Progress</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {orders.filter(o => o.status === 'completed').length}
              </div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <p>⚠️ {error}</p>
            <Button onClick={fetchOrders} className="retry-button">
              Try Again
            </Button>
          </div>
        )}

        {orders.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h2>No orders yet</h2>
            <p>Orders will appear here once customers submit them.</p>
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id">
                    <span className="order-id-label">Order ID:</span>
                    <span className="order-id-value">{order._id.slice(-8)}</span>
                  </div>
                  <span className={getStatusBadgeClass(order.status)}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="order-card-body">
                  <div className="order-field">
                    <span className="field-label">Product:</span>
                    <span className="field-value">{order.productName}</span>
                  </div>

                  <div className="order-field">
                    <span className="field-label">Price:</span>
                    <span className="field-value price-value">{order.productPrice}</span>
                  </div>

                  <div className="order-field">
                    <span className="field-label">Email:</span>
                    <a href={`mailto:${order.email}`} className="field-value email-link">
                      {order.email}
                    </a>
                  </div>

                  <div className="order-field message-field">
                    <span className="field-label">Message:</span>
                    <div className="field-value message-text">{order.message}</div>
                  </div>

                  <div className="order-field">
                    <span className="field-label">Submitted:</span>
                    <span className="field-value date-value">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
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

