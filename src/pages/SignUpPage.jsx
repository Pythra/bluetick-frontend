import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthShell from '../components/AuthShell';
import './AuthPage.css';

function SignUpPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { isPartnerSite, brandName, subdomain: brandingSubdomain } = usePartnerBranding();
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
      showToast({ message: 'Account created successfully!', type: 'success' });
      navigate('/');
    } catch (err) {
      const message = err.message || 'Failed to sign up. Please try again.';
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
          asideTitle="Create your"
          asideHighlight="account"
          asideLead={
            isPartnerSite
              ? `Join ${brandName} to track orders and manage your projects.`
              : 'One account for orders, publications, and project updates.'
          }
          perks={[
            'Track orders and payments',
            'Message support about your projects',
            'Secure access to your history',
          ]}
          formTitle="Sign Up"
          formSub={
            isPartnerSite
              ? `Create your ${brandName} account.`
              : 'Join Bluetick and get started in under a minute.'
          }
        >
          {error ? <div className="auth-error">{error}</div> : null}

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
        </AuthShell>
      </main>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default SignUpPage;
