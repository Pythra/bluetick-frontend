import { useEffect } from 'react';
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

function MyAccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { cartItemCount, fetchCart } = useCart();

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
            <p className="my-account-lead">Your profile details and quick links for orders and services.</p>
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
                  Orders &amp; services
                </h2>
              </div>
              <p className="my-account-card-text">
                {cartItemCount > 0
                  ? `You have ${cartItemCount} item${cartItemCount === 1 ? '' : 's'} in your cart.`
                  : 'Your cart is empty. Browse services to place an order.'}
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
