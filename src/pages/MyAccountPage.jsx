import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoBagOutline, IoLogOutOutline, IoPersonOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import './MyAccountPage.css';

function formatField(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return '—';
  }
  return String(value).trim();
}

function formatOrderDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatOrderAmount(order) {
  if (order.totalAmount != null) {
    const symbol = order.currency === 'USD' ? '$' : '₦';
    return `${symbol}${Number(order.totalAmount).toLocaleString()}`;
  }
  return order.productPrice || '—';
}

function getPaymentStatusLabel(order) {
  if (order.paymentStatus === 'paid') {
    return { text: 'Paid', tone: 'paid' };
  }
  if (order.paymentStatus === 'failed') {
    return { text: 'Failed', tone: 'failed' };
  }
  if (order.paymentGateway === 'bank_transfer') {
    return { text: 'Pending verification', tone: 'pending' };
  }
  if (order.paymentStatus === 'pending') {
    return { text: 'Pending', tone: 'pending' };
  }
  return { text: order.paymentStatus || 'Pending', tone: 'pending' };
}

function orderHasPublicationItems(order) {
  return Array.isArray(order.cartItems) && order.cartItems.some((item) => item.category === 'publication');
}

function MyAccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, apiUrl, authFetch } = useAuth();
  const { cartItemCount, fetchCart } = useCart();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true, state: { from: '/account' } });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated || !apiUrl) {
      return undefined;
    }

    let cancelled = false;

    const loadOrders = async () => {
      setOrdersLoading(true);
      setOrdersError('');
      try {
        const response = await authFetch(`${apiUrl}/api/orders/me`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Unable to load your orders');
        }
        if (!cancelled) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (!cancelled) {
          setOrdersError(err.message || 'Unable to load your orders');
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, apiUrl, authFetch]);

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="my-account-page">
        <Navbar onScrollToSection={scrollToSection} />
        <div className="my-account-loading">Loading your account…</div>
        <Footer onScrollToSection={scrollToSection} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  const profileRows = [
    { label: 'Full name', value: formatField(fullName) },
    { label: 'Email', value: formatField(user.email) },
    { label: 'Phone', value: formatField(user.phone) },
    { label: 'Account ID', value: formatField(user.id) },
  ];

  return (
    <div className="my-account-page">
      <Navbar onScrollToSection={scrollToSection} />

      <main className="my-account-main">
        <div className="my-account-container">
          <header className="my-account-header">
            <p className="my-account-kicker">Account</p>
            <h1 className="my-account-title">My Account</h1>
            <p className="my-account-lead">Your profile details, orders, and quick links for services.</p>
          </header>

          <div className="my-account-grid">
            <section className="my-account-card" aria-labelledby="my-account-profile-heading">
              <div className="my-account-card-head">
                <span className="my-account-card-icon" aria-hidden="true">
                  <IoPersonOutline />
                </span>
                <h2 id="my-account-profile-heading" className="my-account-card-title">
                  Profile details
                </h2>
              </div>
              <dl className="my-account-details">
                {profileRows.map((row) => (
                  <div key={row.label} className="my-account-detail-row">
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="my-account-card" aria-labelledby="my-account-actions-heading">
              <div className="my-account-card-head">
                <span className="my-account-card-icon" aria-hidden="true">
                  <IoBagOutline />
                </span>
                <h2 id="my-account-actions-heading" className="my-account-card-title">
                  Quick actions
                </h2>
              </div>
              <p className="my-account-card-text">
                {cartItemCount > 0
                  ? `You have ${cartItemCount} item${cartItemCount === 1 ? '' : 's'} in your cart.`
                  : 'Your cart is empty. Browse services to place a new order.'}
              </p>
              <div className="my-account-actions">
                <Button onClick={() => navigate('/checkout')} className="my-account-btn-primary">
                  {cartItemCount > 0 ? 'Go to checkout' : 'View checkout'}
                </Button>
                <Button onClick={() => navigate('/services/publications')} className="my-account-btn-secondary">
                  Browse services
                </Button>
                <button type="button" className="my-account-logout" onClick={handleLogout}>
                  <IoLogOutOutline aria-hidden="true" />
                  Log out
                </button>
              </div>
              <p className="my-account-help">
                Need to update your details? Contact us at{' '}
                <a href="mailto:Info@bluetickgeng.com">Info@bluetickgeng.com</a>.
              </p>
            </section>
          </div>

          <section className="my-account-orders" aria-labelledby="my-account-orders-heading">
            <div className="my-account-orders-head">
              <h2 id="my-account-orders-heading" className="my-account-orders-title">
                Your orders
              </h2>
              <p className="my-account-orders-lead">
                Services you have paid for or claimed via bank transfer appear here.
              </p>
            </div>

            {ordersLoading ? (
              <p className="my-account-orders-empty">Loading your orders…</p>
            ) : ordersError ? (
              <p className="my-account-orders-error" role="alert">{ordersError}</p>
            ) : orders.length === 0 ? (
              <p className="my-account-orders-empty">You have no orders yet.</p>
            ) : (
              <ul className="my-account-order-list">
                {orders.map((order) => {
                  const paymentStatus = getPaymentStatusLabel(order);
                  const orderId = order._id;
                  const showPublicationLink =
                    order.paymentStatus === 'paid' && orderHasPublicationItems(order);

                  return (
                    <li key={orderId} className="my-account-order-card">
                      <div className="my-account-order-top">
                        <div>
                          <h3 className="my-account-order-name">{order.productName}</h3>
                          <p className="my-account-order-date">
                            Placed {formatOrderDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="my-account-order-meta">
                          <span className="my-account-order-amount">{formatOrderAmount(order)}</span>
                          <span className={`my-account-order-badge my-account-order-badge--${paymentStatus.tone}`}>
                            {paymentStatus.text}
                          </span>
                        </div>
                      </div>

                      {order.cartItems?.length > 0 && (
                        <ul className="my-account-order-items">
                          {order.cartItems.map((item, index) => (
                            <li key={`${item.itemId || item.title}-${index}`}>
                              <span>{item.title}</span>
                              {item.price ? <strong>{item.price}</strong> : null}
                            </li>
                          ))}
                        </ul>
                      )}

                      {order.paymentGateway === 'bank_transfer' && order.paymentStatus === 'pending' && (
                        <p className="my-account-order-note">
                          We received your payment claim and are verifying your bank transfer. You will get an email once it is confirmed.
                        </p>
                      )}

                      {showPublicationLink && (
                        <Button
                          type="button"
                          className="my-account-order-action"
                          onClick={() => navigate(`/article-submission?orderId=${orderId}`)}
                        >
                          Submit your article
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <p className="my-account-back">
            <Link to="/">← Back to home</Link>
          </p>
        </div>
      </main>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default MyAccountPage;
