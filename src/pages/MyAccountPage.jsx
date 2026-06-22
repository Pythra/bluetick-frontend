import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoBagOutline,
  IoCartOutline,
  IoChatbubbleOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoPersonOutline,
  IoReceiptOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import AccountMessagesPanel from '../components/account/AccountMessagesPanel';
import UserInvoiceModal, { orderToInvoice } from '../components/account/UserInvoiceModal';
import OrderTrackingTimeline from '../components/OrderTrackingTimeline';
import { usePartnerText } from '../utils/partnerText';
import './MyAccountPage.css';

const SECTIONS = {
  dashboard: 'dashboard',
  orders: 'orders',
  invoices: 'invoices',
  account: 'account',
  messages: 'messages',
};

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

function getUserInitials(user) {
  const first = user.firstName?.trim()?.[0] || '';
  const last = user.lastName?.trim()?.[0] || '';
  if (first || last) {
    return `${first}${last}`.toUpperCase();
  }
  return user.email?.trim()?.[0]?.toUpperCase() || '?';
}

function getDisplayName(user) {
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
  if (fullName) {
    return fullName;
  }
  return user.email?.split('@')[0] || 'Account';
}

function MyAccountPage() {
  const navigate = useNavigate();
  const { shortBrandName, supportEmail } = usePartnerText();
  const { brandName, subdomain: brandingSubdomain, contactEmail, isPartnerSite } = usePartnerBranding();
  const hostSubdomain = getPartnerSubdomainFromHost();
  const messageSubdomain = (brandingSubdomain || hostSubdomain || '').trim().toLowerCase();
  const { user, isAuthenticated, loading, logout, apiUrl, authFetch, token } = useAuth();
  const { cartItemCount, fetchCart } = useCart();
  const [activeSection, setActiveSection] = useState(SECTIONS.dashboard);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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

  useEffect(() => {
    if (!isAuthenticated || !token || !apiUrl || !messageSubdomain) {
      return undefined;
    }

    let cancelled = false;

    const loadUnread = async () => {
      try {
        const siteSlug = encodeURIComponent(messageSubdomain);
        const response = await fetch(`${apiUrl}/api/partner-site/${siteSlug}/client-messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!cancelled && response.ok && data.success) {
          setUnreadMessages(data.unreadCount || 0);
        }
      } catch {
        /* silent */
      }
    };

    loadUnread();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, token, apiUrl, messageSubdomain]);

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) {
      return;
    }
    logout();
    navigate('/');
  };

  const requiresPasswordToDelete = Boolean(user?.phone?.trim());

  const resetDeleteForm = () => {
    setShowDeleteForm(false);
    setDeleteConfirmEmail('');
    setDeletePassword('');
    setDeleteError('');
  };

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    setDeleteError('');

    const confirmed = window.confirm(
      'This will permanently delete your account and sign you out. Your order history will be kept for our records, but you will lose access to it. This cannot be undone.'
    );
    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await authFetch(`${apiUrl}/api/auth/account`, {
        method: 'DELETE',
        body: JSON.stringify({
          confirmEmail: deleteConfirmEmail.trim(),
          password: deletePassword,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to delete your account');
      }

      logout();
      navigate('/', { replace: true });
    } catch (err) {
      setDeleteError(err.message || 'Unable to delete your account');
    } finally {
      setDeleteLoading(false);
    }
  };

  const goToSection = (sectionId) => {
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const displayName = getDisplayName(user);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ');

  const profileRows = [
    { label: 'Full name', value: formatField(fullName) },
    { label: 'Email', value: formatField(user.email) },
    { label: 'Phone', value: formatField(user.phone) },
    { label: 'Account ID', value: formatField(user.id) },
  ];

  const navItems = [
    { id: SECTIONS.dashboard, label: 'Dashboard', icon: IoGridOutline },
    { id: SECTIONS.orders, label: 'Orders', icon: IoBagOutline },
    { id: SECTIONS.invoices, label: 'Invoices', icon: IoReceiptOutline },
    { id: SECTIONS.messages, label: 'Messages', icon: IoChatbubbleOutline, badge: unreadMessages },
    { id: SECTIONS.account, label: 'Account info', icon: IoPersonOutline },
  ];

  const invoiceBrandName = isPartnerSite ? brandName : shortBrandName;

  const dashboardCards = [
    {
      key: 'account',
      title: 'Account info',
      description: 'View your name, email, phone, and account details',
      icon: IoPersonOutline,
      onClick: () => goToSection(SECTIONS.account),
    },
    {
      key: 'orders',
      title: 'Orders',
      description: 'Check your order history, payment status, and progress tracking',
      icon: IoBagOutline,
      onClick: () => goToSection(SECTIONS.orders),
    },
    {
      key: 'invoices',
      title: 'Invoices',
      description: 'Download receipts and invoices for your paid orders',
      icon: IoReceiptOutline,
      onClick: () => goToSection(SECTIONS.invoices),
    },
    {
      key: 'messages',
      title: 'Messages',
      description: messageSubdomain
        ? `Chat with ${brandName || shortBrandName} about your orders`
        : `Contact ${shortBrandName} support about your account`,
      icon: IoChatbubbleOutline,
      onClick: () => goToSection(SECTIONS.messages),
    },
    {
      key: 'checkout',
      title: 'Checkout',
      description:
        cartItemCount > 0
          ? `${cartItemCount} item${cartItemCount === 1 ? '' : 's'} waiting in your cart`
          : 'Review your cart and complete your next purchase',
      icon: IoCartOutline,
      onClick: () => navigate('/checkout'),
    },
    {
      key: 'verification',
      title: 'Verification services',
      description: 'Explore Instagram, music, and platform verification options',
      icon: IoShieldCheckmarkOutline,
      onClick: () => navigate('/services/verification'),
    },
  ];

  const renderOrdersPanel = () => (
    <section className="my-account-panel" aria-labelledby="my-account-orders-heading">
      <header className="my-account-panel-head">
        <h2 id="my-account-orders-heading" className="my-account-panel-title">
          Your orders
        </h2>
        <p className="my-account-panel-lead">
          Services you have paid for or claimed via bank transfer appear here, with live progress tracking.
        </p>
      </header>

      {ordersLoading ? (
        <p className="my-account-orders-empty">Loading your orders…</p>
      ) : ordersError ? (
        <p className="my-account-orders-error" role="alert">
          {ordersError}
        </p>
      ) : orders.length === 0 ? (
        <p className="my-account-orders-empty">You have no orders yet.</p>
      ) : (
        <ul className="my-account-order-list">
          {orders.map((order) => {
            const paymentStatus = getPaymentStatusLabel(order);
            const orderId = order._id;
            const showOnboardingLink =
              order.paymentStatus === 'paid' && !order.onboardingComplete;

            return (
              <li key={orderId} className="my-account-order-card">
                <div className="my-account-order-top">
                  <div>
                    <h3 className="my-account-order-name">{order.productName}</h3>
                    <p className="my-account-order-date">Placed {formatOrderDate(order.createdAt)}</p>
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
                    We received your payment claim and are verifying your bank transfer. You will get an email once
                    it is confirmed.
                  </p>
                )}

                {showOnboardingLink && (
                  <Button
                    type="button"
                    className="my-account-order-action"
                    onClick={() => navigate(`/project-onboarding?orderId=${orderId}`)}
                  >
                    {order.onboardingPendingCount > 0
                      ? `Submit project details (${order.onboardingPendingCount} remaining)`
                      : 'Submit project details'}
                  </Button>
                )}

                {(order.paymentStatus === 'paid' || order.tracking) && (
                  <OrderTrackingTimeline
                    tracking={order.tracking}
                    paymentStatus={order.paymentStatus}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');

  const renderInvoicesPanel = () => (
    <section className="my-account-panel" aria-labelledby="my-account-invoices-heading">
      <header className="my-account-panel-head">
        <h2 id="my-account-invoices-heading" className="my-account-panel-title">
          Invoices & receipts
        </h2>
        <p className="my-account-panel-lead">
          Download printable receipts and invoices for orders that have been paid or confirmed.
        </p>
      </header>

      {ordersLoading ? (
        <p className="my-account-orders-empty">Loading your invoices…</p>
      ) : ordersError ? (
        <p className="my-account-orders-error" role="alert">
          {ordersError}
        </p>
      ) : paidOrders.length === 0 ? (
        <p className="my-account-orders-empty">No paid orders yet. Invoices appear here after payment is confirmed.</p>
      ) : (
        <ul className="my-account-invoice-list">
          {paidOrders.map((order) => {
            const orderId = order._id;
            return (
              <li key={orderId} className="my-account-invoice-card">
                <div>
                  <h3 className="my-account-order-name">{order.productName}</h3>
                  <p className="my-account-order-date">Paid {formatOrderDate(order.createdAt)}</p>
                  <p className="my-account-invoice-amount">{formatOrderAmount(order)}</p>
                </div>
                <button
                  type="button"
                  className="my-account-invoice-link"
                  onClick={() => setSelectedInvoice(orderToInvoice(order, invoiceBrandName, user.email))}
                >
                  <IoReceiptOutline aria-hidden="true" />
                  Download invoice
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const renderMessagesPanel = () => (
    <section className="my-account-panel my-account-panel-messages" aria-labelledby="my-account-messages-heading">
      <header className="my-account-panel-head">
        <h2 id="my-account-messages-heading" className="my-account-panel-title">
          Messages
        </h2>
        <p className="my-account-panel-lead">
          {messageSubdomain
            ? `Send and receive messages with ${brandName || shortBrandName} about your orders.`
            : `Send a message to the ${shortBrandName} team about your account or orders.`}
        </p>
      </header>

      <AccountMessagesPanel
        apiUrl={apiUrl}
        token={token}
        subdomain={messageSubdomain}
        brandName={brandName || shortBrandName}
        accountEmail={user.email}
        supportEmail={contactEmail || supportEmail}
        variant="inline"
        onUnreadChange={setUnreadMessages}
      />
    </section>
  );

  const renderAccountPanel = () => (
    <section className="my-account-panel" aria-labelledby="my-account-profile-heading">
      <header className="my-account-panel-head">
        <h2 id="my-account-profile-heading" className="my-account-panel-title">
          Account info
        </h2>
        <p className="my-account-panel-lead">Your profile details on file with {shortBrandName}.</p>
      </header>
      <dl className="my-account-details">
        {profileRows.map((row) => (
          <div key={row.label} className="my-account-detail-row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="my-account-help">
        Need to update your details? Contact us at{' '}
        <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
      </p>

      <section className="my-account-danger-zone" aria-labelledby="my-account-delete-heading">
        <h3 id="my-account-delete-heading" className="my-account-danger-title">
          Delete account
        </h3>
        <p className="my-account-danger-lead">
          Permanently remove your account and sign out. Your cart and saved profile details will be
          deleted. Order records may be retained for business and legal purposes.
        </p>

        {!showDeleteForm ? (
          <button
            type="button"
            className="my-account-delete-toggle"
            onClick={() => setShowDeleteForm(true)}
          >
            Delete my account
          </button>
        ) : (
          <form className="my-account-delete-form" onSubmit={handleDeleteAccount}>
            <label className="my-account-delete-label" htmlFor="delete-confirm-email">
              Type your email to confirm
            </label>
            <input
              id="delete-confirm-email"
              type="email"
              className="my-account-delete-input"
              value={deleteConfirmEmail}
              onChange={(event) => setDeleteConfirmEmail(event.target.value)}
              placeholder={user.email}
              autoComplete="off"
              required
            />

            {requiresPasswordToDelete ? (
              <>
                <label className="my-account-delete-label" htmlFor="delete-password">
                  Password
                </label>
                <input
                  id="delete-password"
                  type="password"
                  className="my-account-delete-input"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
              </>
            ) : null}

            {deleteError ? (
              <p className="my-account-delete-error" role="alert">
                {deleteError}
              </p>
            ) : null}

            <div className="my-account-delete-actions">
              <button
                type="button"
                className="my-account-delete-cancel"
                onClick={resetDeleteForm}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button type="submit" className="my-account-delete-submit" disabled={deleteLoading}>
                {deleteLoading ? 'Deleting…' : 'Permanently delete account'}
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  );

  const renderDashboard = () => (
    <div className="my-account-dashboard">
      <header className="my-account-dashboard-head">
        <h2 className="my-account-dashboard-title">Dashboard</h2>
        <p className="my-account-dashboard-lead">Choose a section to manage your account and services.</p>
      </header>
      <div className="my-account-dashboard-grid">
        {dashboardCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.key}
              type="button"
              className="my-account-dash-card"
              onClick={card.onClick}
            >
              <span className="my-account-dash-card-icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="my-account-dash-card-title">{card.title}</span>
              <span className="my-account-dash-card-desc">{card.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="my-account-page">
      <Navbar onScrollToSection={scrollToSection} />

      <main className="my-account-main">
        <div className="my-account-shell">
          <aside className="my-account-sidebar" aria-label="Account navigation">
            <div className="my-account-profile">
              <span className="my-account-avatar" aria-hidden="true">
                {getUserInitials(user)}
              </span>
              <div className="my-account-profile-text">
                <p className="my-account-greeting">Hi, {displayName}</p>
                <p className="my-account-email">{formatField(user.email)}</p>
              </div>
            </div>

            <button type="button" className="my-account-sidebar-logout" onClick={handleLogout}>
              <IoLogOutOutline aria-hidden="true" />
              Log out
            </button>

            <nav className="my-account-nav">
              <ul className="my-account-nav-list">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`my-account-nav-link${isActive ? ' is-active' : ''}`}
                        onClick={() => goToSection(item.id)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon aria-hidden="true" />
                        {item.label}
                        {item.badge > 0 ? (
                          <span className="my-account-nav-badge">{item.badge > 99 ? '99+' : item.badge}</span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button type="button" className="my-account-nav-link" onClick={() => navigate('/checkout')}>
                    <IoCartOutline aria-hidden="true" />
                    Checkout
                    {cartItemCount > 0 ? (
                      <span className="my-account-nav-badge">{cartItemCount}</span>
                    ) : null}
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="my-account-content">
            {activeSection === SECTIONS.dashboard && renderDashboard()}
            {activeSection === SECTIONS.orders && renderOrdersPanel()}
            {activeSection === SECTIONS.invoices && renderInvoicesPanel()}
            {activeSection === SECTIONS.account && renderAccountPanel()}
            {activeSection === SECTIONS.messages && renderMessagesPanel()}
          </div>
        </div>

        {selectedInvoice ? (
          <UserInvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        ) : null}

        <p className="my-account-back">
          <Link to="/">← Back to home</Link>
        </p>
      </main>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default MyAccountPage;
