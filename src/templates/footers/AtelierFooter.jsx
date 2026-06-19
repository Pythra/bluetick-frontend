import { Link } from 'react-router-dom';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { buildWhatsappUrl, formatPhoneHref } from '../../utils/partnerMedia';
import '../styles/templateFooters.css';

function AtelierFooter({ onScrollToSection }) {
  const { brandName, shortName, contactEmail, contactPhone, contactWhatsapp, logoUrl } = usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="tpl-footer tpl-footer--atelier">
      <div className="tpl-footer-atelier-inner">
        <div className="tpl-footer-atelier-left">
          {logoUrl ? (
            <img src={logoUrl} alt={displayName} className="tpl-footer-atelier-logo" />
          ) : (
            <span className="tpl-footer-atelier-name">{displayName}</span>
          )}
          <p className="tpl-footer-atelier-tagline">Refined digital services for ambitious brands.</p>
        </div>
        <div className="tpl-footer-atelier-contact">
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          {contactPhone ? <a href={formatPhoneHref(contactPhone)}>{contactPhone}</a> : null}
          {contactWhatsapp ? (
            <a href={buildWhatsappUrl(contactWhatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          ) : null}
        </div>
        <div className="tpl-footer-atelier-legal">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/refund-policy">Refunds</Link>
          <Link to="/about">About</Link>
        </div>
      </div>
      <p className="tpl-footer-atelier-copy">&copy; {new Date().getFullYear()} {brandName}</p>
    </footer>
  );
}

export default AtelierFooter;
