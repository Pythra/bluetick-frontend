import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMailOutline, IoCallOutline, IoLogoWhatsapp } from 'react-icons/io5';
import PlaceOrderDropdown from '../../components/PlaceOrderDropdown';
import { legalDocuments } from '../../data/legalDocuments';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { buildWhatsappUrl, formatPhoneHref } from '../../utils/partnerMedia';
import '../styles/templateFooters.css';

const legalLinks = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refund-policy', label: 'Refunds' },
  ...legalDocuments.slice(0, 2).map((d) => ({ to: `/legal/${d.slug}`, label: d.shortTitle })),
];

function AuroraFooter({ onScrollToSection }) {
  const [logoError, setLogoError] = useState(false);
  const { brandName, shortName, contactEmail, contactPhone, contactWhatsapp, content, logoUrl, tagline } =
    usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="tpl-footer tpl-footer--aurora">
      <div className="tpl-footer-aurora-glow" aria-hidden="true" />
      <div className="tpl-footer-aurora-inner">
        <div className="tpl-footer-aurora-brand">
          {!logoError && logoUrl ? (
            <img src={logoUrl} alt={displayName} className="tpl-footer-logo" onError={() => setLogoError(true)} />
          ) : (
            <h2 className="tpl-footer-wordmark">{displayName}</h2>
          )}
          <p className="tpl-footer-tagline">
            {content?.footerTagline || `${displayName} — digital growth across top media platforms.`}
          </p>
        </div>
        <div className="tpl-footer-aurora-col">
          <h4>Company</h4>
          <Link to="/about">About</Link>
          <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection?.('website-services'); }}>Services</a>
          <Link to="/blog">Blog</Link>
        </div>
        <div className="tpl-footer-aurora-col">
          <h4>Support</h4>
          <a href="#faq" onClick={(e) => { e.preventDefault(); onScrollToSection?.('faq'); }}>FAQs</a>
          <Link to="/refund-policy">Refund Policy</Link>
          <Link to="/account">My Account</Link>
        </div>
        <div className="tpl-footer-aurora-contact">
          <h4>Contact</h4>
          <a href={`mailto:${contactEmail}`}><IoMailOutline /> {contactEmail}</a>
          {contactPhone ? <a href={formatPhoneHref(contactPhone)}><IoCallOutline /> {contactPhone}</a> : null}
          {contactWhatsapp ? (
            <a href={buildWhatsappUrl(contactWhatsapp)} target="_blank" rel="noopener noreferrer">
              <IoLogoWhatsapp /> WhatsApp
            </a>
          ) : null}
          <PlaceOrderDropdown triggerClassName="tpl-footer-aurora-cta" label="Choose Package" />
        </div>
      </div>
      <div className="tpl-footer-aurora-bottom">
        <div className="tpl-footer-legal">
          {legalLinks.map((link, i) => (
            <Fragment key={link.to}>
              {i > 0 ? <span>|</span> : null}
              <Link to={link.to}>{link.label}</Link>
            </Fragment>
          ))}
        </div>
        <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default AuroraFooter;
