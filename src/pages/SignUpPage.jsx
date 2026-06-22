import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import bluego from '../assets/bluego.png';
import './AuthPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { isPartnerSite, brandName, logoUrl, primaryColor, subdomain: brandingSubdomain } = usePartnerBranding();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirmation: '',
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

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !formData.email ||
      !formData.password ||
      !formData.passwordConfirmation
    ) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
    await signup(
      formData.email,
      formData.password,
      formData.passwordConfirmation,
      formData.firstName,
      formData.lastName,
      formData.phone,
      brandingSubdomain
    );
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
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
                Create your<span> account</span>
              </h1>
              <p>
                {isPartnerSite
                  ? `Create your ${brandName} account to manage orders and track your projects.`
                  : 'Manage orders, submit publication content, and track updates from one professional dashboard.'}
              </p>
              <ul className="auth-perks">
                <li>Checkout and service progress in one place</li>
                <li>Faster support and publication coordination</li>
                <li>Secure access to your account and order history</li>
              </ul>
            </div>
          </aside>
          <section className="auth-form-panel">
            <h1>Sign Up</h1>
            <p className="auth-form-sub">{isPartnerSite ? `Create your ${brandName} account and get started.` : 'Join Bluetick and get started in less than a minute.'}</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>

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
              <label htmlFor="phone">Phone number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
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
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirmation">Confirm Password</label>
              <input
                type="password"
                id="passwordConfirmation"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                minLength={6}
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
          </section>
        </div>
      </main>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default SignUpPage;





