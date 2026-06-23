import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthShell from '../components/AuthShell';
import './AuthPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();
  const { isPartnerSite, brandName, subdomain: brandingSubdomain } = usePartnerBranding();
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
      showToast({ message: 'Logged in successfully', type: 'success' });
      const redirectTo = location.state?.from || '/account';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const message = err.message || 'Failed to login. Please check your credentials.';
      setError(message);
      showToast({ message, type: 'error' });
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
        <AuthShell
          asideTitle="Welcome"
          asideHighlight="back"
          asideLead={
            isPartnerSite
              ? `Sign in to your ${brandName} account.`
              : 'Pick up where you left off with your orders and projects.'
          }
          perks={[
            'View order status and history',
            'Download invoices and receipts',
            'Message support in one place',
          ]}
          formTitle="Login"
          formSub={
            isPartnerSite
              ? `Sign in to your ${brandName} account.`
              : 'Sign in to continue with your Bluetick account.'
          }
        >
          {error ? <div className="auth-error">{error}</div> : null}

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
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </AuthShell>
      </main>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default LoginPage;
