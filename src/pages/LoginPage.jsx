import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bluego from '../assets/bluego.png';
import './AuthPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { isPartnerSite, brandName, logoUrl, primaryColor, subdomain: brandingSubdomain } = usePartnerBranding();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      await login(formData.email, formData.password, brandingSubdomain);
      const redirectTo = location.state?.from || '/account';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="auth-page">
      <Navbar onScrollToSection={scrollToSection} />
      <main className="auth-main">
        <div className="auth-shell">
          <aside className="auth-aside" style={isPartnerSite && primaryColor ? { background: `linear-gradient(135deg, ${primaryColor}22 0%, ${primaryColor}11 100%)` } : undefined}>
            <div className="auth-aside-inner">
              {isPartnerSite ? (
                logoUrl
                  ? <img src={logoUrl} alt={brandName} className="auth-aside-logo" style={{ maxHeight: 64, objectFit: 'contain' }} />
                  : <div style={{ fontSize: 28, fontWeight: 800, color: primaryColor || '#2563eb', marginBottom: 8 }}>{brandName}</div>
              ) : (
                <img src={bluego} alt="Bluetick" className="auth-aside-logo" />
              )}
              <h1>
                Welcome<span> back</span>
              </h1>
              <p>
                {isPartnerSite
                  ? `Sign in to access your ${brandName} account and manage your orders.`
                  : 'Continue from where you stopped. Access your active services, monitor order progress, and keep your brand projects moving quickly.'}
              </p>
              <ul className="auth-perks">
                <li>See your latest orders and account updates</li>
                <li>Manage article and publication submissions</li>
                <li>Get a smooth, secure sign-in experience</li>
              </ul>
            </div>
          </aside>
          <section className="auth-form-panel">
            <h1>Login</h1>
            <p className="auth-form-sub">{isPartnerSite ? `Sign in to your ${brandName} account.` : 'Sign in to continue with your Bluetick account.'}</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          </section>
        </div>
      </main>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default LoginPage;





