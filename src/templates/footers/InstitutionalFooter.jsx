import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMailOutline, IoCallOutline } from 'react-icons/io5';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { formatPhoneHref } from '../../utils/partnerMedia';
import '../styles/templateFooters.css';

function InstitutionalFooter({ onScrollToSection }) {
  const [logoError, setLogoError] = useState(false);
  const { brandName, shortName, contactEmail, contactPhone, logoUrl, content, tagline } = usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="tpl-footer tpl-footer--institutional">
      <div className="tpl-footer-inst-accent" aria-hidden="true" />
      <div className="tpl-footer-inst-inner">
        <div className="tpl-footer-inst-brand">
          {!logoError && logoUrl ? (
            <img src={logoUrl} alt={displayName} className="tpl-footer-logo" onError={() => setLogoError(true)} />
          ) : (
            <h2 className="tpl-footer-wordmark">{displayName}</h2>
          )}
          <p>{content?.footerSubtitle || tagline}</p>
        </div>
        {['Company', 'Services', 'Support', 'Legal'].map((heading, colIdx) => (
          <div key={heading} className="tpl-footer-inst-col">
            <h4>{heading}</h4>
            {colIdx === 0 && (
              <>
                <Link to="/about">About Us</Link>
                <Link to="/blog">Insights</Link>
                <Link to="/account">My Account</Link>
              </>
            )}
            {colIdx === 1 && (
              <>
                <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection?.('website-services'); }}>Web Development</a>
                <a href="#publication-services" onClick={(e) => { e.preventDefault(); onScrollToSection?.('publication-services'); }}>Publications</a>
                <a href="#verification-services" onClick={(e) => { e.preventDefault(); onScrollToSection?.('verification-services'); }}>Verification</a>
              </>
            )}
            {colIdx === 2 && (
              <>
                <a href="#faq" onClick={(e) => { e.preventDefault(); onScrollToSection?.('faq'); }}>FAQs</a>
                <a href={`mailto:${contactEmail}`}>Contact</a>
                <Link to="/refund-policy">Refunds</Link>
              </>
            )}
            {colIdx === 3 && (
              <>
                <Link to="/terms">Terms</Link>
                <Link to="/privacy">Privacy</Link>
                <Link to="/refund-policy">Refund Policy</Link>
              </>
            )}
          </div>
        ))}
        <div className="tpl-footer-inst-contact">
          <a href={`mailto:${contactEmail}`}><IoMailOutline /> {contactEmail}</a>
          {contactPhone ? <a href={formatPhoneHref(contactPhone)}><IoCallOutline /> {contactPhone}</a> : null}
        </div>
      </div>
      <p className="tpl-footer-inst-copy">&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
    </footer>
  );
}

export default InstitutionalFooter;
