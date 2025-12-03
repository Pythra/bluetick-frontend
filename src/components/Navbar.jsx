import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoImage from '../assets/bluego.png';
import './Navbar.css';

function Navbar({ onScrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src={logoImage} alt="Bluetickgeng" className="logo-img" />
          </Link>
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="#website-services" onClick={() => { onScrollToSection('website-services'); setIsMenuOpen(false); }}>Websites</a>
          <a href="#app-services" onClick={() => { onScrollToSection('app-services'); setIsMenuOpen(false); }}>Apps</a>
          <a href="#verification-services" onClick={() => { onScrollToSection('verification-services'); setIsMenuOpen(false); }}>Verification</a>
          <a href="#publication-services" onClick={() => { onScrollToSection('publication-services'); setIsMenuOpen(false); }}>Publications</a>
          {isAuthenticated ? (
            <>
              <span className="navbar-user">{user?.email}</span>
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/signup" className="navbar-signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
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

