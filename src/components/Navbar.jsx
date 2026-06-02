import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import blueLogo from '../assets/bluelogo.png';
import './Navbar.css';

function Navbar({ onScrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to log out?');
    if (!shouldLogout) {
      return;
    }
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleAction = (callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    setIsMenuOpen(false);
  };

  const scrollTarget = (sectionId) => () => onScrollToSection?.(sectionId);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={blueLogo} alt="Bluetickgeng Development" className="logo-img" />
          </Link>
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <button type="button" className="navbar-link" onClick={() => handleAction(() => navigate('/about'))}>
            About Us
          </button>
          <button type="button" className="navbar-link" onClick={() => handleAction(scrollTarget('publication-services'))}>
            PR Agencies
          </button>
          <button type="button" className="navbar-link" onClick={() => handleAction(scrollTarget('website-services'))}>
            Services
          </button>
          <button type="button" className="navbar-link" onClick={() => handleAction(() => navigate('/blog'))}>
            Blog
          </button>
          <button
            type="button"
            className="navbar-link"
            onClick={() => handleAction(() => navigate(isAuthenticated ? '/account' : '/login'))}
            title={isAuthenticated ? user?.email || 'My Account' : 'My Account'}
          >
            My Account
          </button>
          {isAuthenticated ? (
            <button type="button" className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button
              type="button"
              className="navbar-signup"
              onClick={() => handleAction(() => navigate('/signup'))}
            >
              Sign Up
            </button>
          )}
        </div>
        <button className="navbar-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

