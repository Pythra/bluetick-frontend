import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLocationOutline,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoFacebook,
  IoGlobeOutline,
  IoPhonePortraitOutline,
  IoCheckmarkCircleOutline,
  IoNewspaperOutline,
  IoDocumentTextOutline
} from 'react-icons/io5';
import './Footer.css';

function Footer({ onScrollToSection }) {
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <div className="logo-container">
              {!logoError ? (
                <img 
                  src="/logo.png" 
                  alt="Bluetickgeng Development" 
                  className="footer-logo"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <h2 className="logo-text">Bluetickgeng</h2>
              )}
            </div>
            <p className="company-tagline">
              We are a creative team specializing in web development, mobile app creation, 
              social media verification, and digital publication services. Innovation, Delivered.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li>
                <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection('website-services'); }}>
                  <IoGlobeOutline className="link-icon" />
                  Website Development
                </a>
              </li>
              <li>
                <a href="#app-services" onClick={(e) => { e.preventDefault(); onScrollToSection('app-services'); }}>
                  <IoPhonePortraitOutline className="link-icon" />
                  Mobile App Development
                </a>
              </li>
              <li>
                <a href="#verification-services" onClick={(e) => { e.preventDefault(); onScrollToSection('verification-services'); }}>
                  <IoCheckmarkCircleOutline className="link-icon" />
                  Social Media Verification
                </a>
              </li>
              <li>
                <a href="#publication-services" onClick={(e) => { e.preventDefault(); onScrollToSection('publication-services'); }}>
                  <IoNewspaperOutline className="link-icon" />
                  Digital Publications
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <a href="mailto:info@bluetickgeng.com" className="contact-link">
                <IoMailOutline className="contact-icon" />
                <span>info@bluetickgeng.com</span>
              </a>
              <a href="tel:+2349069431949" className="contact-link">
                <IoCallOutline className="contact-icon" />
                <span>+234 906 943 1949</span>
              </a>
              <div className="contact-link address-link">
                <IoLocationOutline className="contact-icon" />
                <span>NO 6A GOODNEWS STREET, SANGOTEDO, LAGOS STATE, NIGERIA</span>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Follow Us</h3>
            <div className="social-links">
              <a 
                href="https://www.instagram.com/bluetickgenq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Instagram"
              >
                <IoLogoInstagram className="social-icon" />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.tiktok.com/@bluetickgeng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="TikTok"
              >
                <IoLogoTiktok className="social-icon" />
                <span>TikTok</span>
              </a>
              <a 
                href="https://www.facebook.com/bluetickgeng" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Facebook"
              >
                <IoLogoFacebook className="social-icon" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal-links">
            <Link to="/terms" className="legal-link">
              <IoDocumentTextOutline className="legal-icon" />
              Terms & Conditions
            </Link>
            <span className="divider">|</span>
            <Link to="/privacy" className="legal-link">
              <IoDocumentTextOutline className="legal-icon" />
              Privacy Policy
            </Link>
            <span className="divider">|</span>
            <Link to="/refund-policy" className="legal-link">
              <IoDocumentTextOutline className="legal-icon" />
              Refund Policy
            </Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Bluetickgeng Development. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
