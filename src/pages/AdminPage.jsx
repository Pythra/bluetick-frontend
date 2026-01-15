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
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

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

 an>
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
                                <span  
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    
    <style jsx>{`
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 2rem;
        z-index: 1000;
        overflow-y: auto;
      }
      
      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        width: 100%;
        max-width: 1000px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
      }
      
      .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }
      
      .orders-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .order-card {
        background: #f9f9f9;
        border-radius: 6px;
        padding: 1rem;
        border-left: 4px solid #4CAF50;
      }
      
      .order-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      .order-customer {
        margin-bottom: 0.75rem;
        color: #555;
      }
      
      .order-field {
        display: flex;
        margin-bottom: 0.25rem;
      }
      
      .field-label {
        font-weight: 500;
        min-width: 80px;
        color: #666;
      }
      
      .price-value {
        color: #2e7d32;
        font-weight: 500;
      }
      
      .submission-details-section {
        margin-top: 1rem;
        border-top: 1px solid #ddd;
        padding-top: 0.75rem;
      }
      
      .submission-toggle {
        background: none;
        border: none;
        padding: 0.5rem 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        color: #2e7d32;
        font-weight: 500;
        transition: color 0.2s;
        width: 100%;
      }
      
      .submission-toggle:hover {
        color: #1b5e20;
      }
      
      .toggle-icon {
        font-size: 0.8rem;
        display: inline-flex;
      }
      
      .toggle-label {
        flex: 1;
      }
      
      .submission-content {
        margin-top: 0.75rem;
        padding: 0.75rem;
        background: #f5f5f5;
        border-radius: 4px;
        border-left: 3px solid #2e7d32;
      }
      
      .submission-content .order-field {
        margin-bottom: 0.75rem;
      }
      
      .submission-content .order-field:last-child {
        margin-bottom: 0;
      }
      
      .clickable {
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .clickable:hover {
        transform: translateY(-2px);
      }
    `}</style>
  );
}

export default AdminPage;

