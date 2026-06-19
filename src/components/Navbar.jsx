import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getFirstVisibleServiceSectionId } from '../config/partnerSiteConfig';
import CurrencySelector from './CurrencySelector';
import blueLogo from '../assets/bluelogo.png';
import './Navbar.css';

function Navbar({ onScrollToSection }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const branding = usePartnerBranding();
  const { isPartnerSite, brandName, logoUrl, features, templateId } = branding;
  const templateNavClass =
    isPartnerSite && templateId ? `navbar--tpl-${templateId}` : '';
  const navigate = useNavigate();
  const servicesSectionId = getFirstVisibleServiceSectionId(branding);

  const handleAction = (callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    setIsMenuOpen(false);
  };

  const scrollTarget = (sectionId) => () => onScrollToSection?.(sectionId);

  return (
    <nav className={`navbar ${templateNavClass}`.trim()}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            {isPartnerSite && logoUrl ? (
              <img src={logoUrl} alt={brandName} className="logo-img logo-img--partner" />
            ) : isPartnerSite ? (
              <span className="navbar-brand-text">{brandName}</span>
            ) : (
              <img src={blueLogo} alt="Bluetickgeng Development" className="logo-img" />
            )}
          </Link>
        </div>
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <button type="button" className="navbar-link" onClick={() => handleAction(() => navigate('/about'))}>
            About Us
          </button>
          <button type="button" className="navbar-link" onClick={() => handleAction(scrollTarget(servicesSectionId))}>
            Services
          </button>
          {!isPartnerSite ? (
            <button type="button" className="navbar-link" onClick={() => handleAction(() => navigate('/partner'))}>
              Partner with us
            </button>
          ) : null}
          {(!isPartnerSite || features?.showBlog) ? (
          <button type="button" className="navbar-link" onClick={() => handleAction(() => navigate('/blog'))}>
            Blog
          </button>
          ) : null}
          <button
            type="button"
            className={`navbar-link navbar-account-auth${isAuthenticated ? '' : ' navbar-account-auth--guest'}`}
            onClick={() => handleAction(() => navigate(isAuthenticated ? '/account' : '/login'))}
            title={isAuthenticated ? user?.email || 'My Account' : 'My Account'}
          >
            My Account
          </button>
          <div className="navbar-currency-selector">
            <CurrencySelector />
          </div>
          {!isAuthenticated ? (
            <>
              <div className="navbar-mobile-auth">
                <button
                  type="button"
                  className="navbar-login"
                  onClick={() => handleAction(() => navigate('/login'))}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="navbar-signup"
                  onClick={() => handleAction(() => navigate('/signup'))}
                >
                  Sign Up
                </button>
              </div>
              <button
                type="button"
                className="navbar-signup navbar-signup-desktop"
                onClick={() => handleAction(() => navigate('/signup'))}
              >
                Sign Up
              </button>
            </>
          ) : null}
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

