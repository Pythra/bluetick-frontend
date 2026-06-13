import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoMailOutline, 
  IoCallOutline, 
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoDocumentTextOutline
} from 'react-icons/io5';
import bluegoLogo from '../assets/bluego.png';
import { companyWhatsappDemoDisplay, companyWhatsappDemoUrl } from '../config/companyContact';
import PlaceOrderDropdown from './PlaceOrderDropdown';
import { legalDocuments } from '../data/legalDocuments';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import './Footer.css';

const footerLegalLinks = [
  { to: '/terms', label: 'Terms & Conditions' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/refund-policy', label: 'Refund Policy' },
  ...legalDocuments.map((document) => ({
    to: `/legal/${document.slug}`,
    label: document.shortTitle,
  })),
];

function Footer({ onScrollToSection }) {
  const [logoError, setLogoError] = useState(false);
  const { isPartnerSite, brandName, shortName, contactEmail, tagline } = usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="logo-container">
            {!logoError && !isPartnerSite ? (
              <img
                src={bluegoLogo}
                alt="Bluetickgeng"
                className="footer-logo"
                onError={() => setLogoError(true)}
              />
            ) : (
              <h2 className="logo-text">{displayName}</h2>
            )}
          </div>
          <p className="footer-top-title">
            {isPartnerSite
              ? `${displayName} — Your Brand Across Top Local and International Media Platforms`
              : 'Your Brand Across Top Local and International Media Platforms'}
          </p>
          <p className="footer-top-subtitle">
            {isPartnerSite
              ? tagline
              : 'Web, app, social verification, monetization, and digital publication support from one team.'}
          </p>
          <PlaceOrderDropdown
            label="Choose Package"
            triggerClassName="footer-top-cta place-order-dropdown-trigger"
            menuId="footer-choose-package-menu"
          />
        </div>

        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Company</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection('website-services'); }}>
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/services/publications">Pricing</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
              <li>
                <Link to="/signup">Affiliate Program</Link>
              </li>
              <li>
                <Link to="/account">My Account</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Services</h3>
            <ul className="footer-links">
              <li>
                <a href="#publication-services" onClick={(e) => { e.preventDefault(); onScrollToSection('publication-services'); }}>
                  PR and Media Placements
                </a>
              </li>
              <li>
                <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection('website-services'); }}>
                  Website Development
                </a>
              </li>
              <li>
                <a href="#app-services" onClick={(e) => { e.preventDefault(); onScrollToSection('app-services'); }}>
                  Mobile App Development
                </a>
              </li>
              <li>
                <a href="#verification-services" onClick={(e) => { e.preventDefault(); onScrollToSection('verification-services'); }}>
                  Social Media Services
                </a>
              </li>
              <li>
                <Link to="/services/publications">Digital Publication Packages</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Support</h3>
            <ul className="footer-links">
              <li>
                <a href="#faq" onClick={(e) => { e.preventDefault(); onScrollToSection('faq'); }}>
                  FAQs
                </a>
              </li>
              <li>
                <a href="#testimonials" onClick={(e) => { e.preventDefault(); onScrollToSection('testimonials'); }}>
                  Testimonials
                </a>
              </li>
              <li>
                <a href={`mailto:${contactEmail}`}>Contact Support</a>
              </li>
              <li>
                <Link to="/refund-policy">Refund Policy</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <div className="contact-info">
              <a href={`mailto:${contactEmail}`} className="contact-link">
                <IoMailOutline className="contact-icon" />
                <span>{contactEmail}</span>
              </a>
              <a href="tel:+2349069431949" className="contact-link">
                <IoCallOutline className="contact-icon" />
                <span>+234 906 943 1949</span>
              </a>
              <a
                href={companyWhatsappDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                <IoLogoWhatsapp className="contact-icon" />
                <span>{companyWhatsappDemoDisplay}</span>
              </a>
              <div className="social-links">
                <a
                  href="https://www.instagram.com/bluetickgengs?igsh=OGY2dWU3a3lsZzR5&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Instagram"
                >
                  <IoLogoInstagram className="social-icon" />
                </a>
                <a
                  href="https://www.tiktok.com/@bluetickgeng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="TikTok"
                >
                  <IoLogoTiktok className="social-icon" />
                </a>
                <a
                  href="https://www.facebook.com/bluetickgeng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Facebook"
                >
                  <IoLogoFacebook className="social-icon" />
                </a>
                <a
                  href="https://x.com/bluetickgeng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="Twitter"
                >
                  <IoLogoTwitter className="social-icon" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-legal-links">
            {footerLegalLinks.map((link, index) => (
              <Fragment key={link.to}>
                {index > 0 ? <span className="divider">|</span> : null}
                <Link to={link.to} className="legal-link">
                  <IoDocumentTextOutline className="legal-icon" />
                  {link.label}
                </Link>
              </Fragment>
            ))}
          </div>
          <p>&copy; {new Date().getFullYear()} Bluetickgeng Development. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
