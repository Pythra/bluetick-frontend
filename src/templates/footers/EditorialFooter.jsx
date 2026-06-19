import { Link } from 'react-router-dom';
import { IoMailOutline, IoCallOutline } from 'react-icons/io5';
import PlaceOrderDropdown from '../../components/PlaceOrderDropdown';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { buildWhatsappUrl, formatPhoneHref } from '../../utils/partnerMedia';
import '../styles/templateFooters.css';

function EditorialFooter({ onScrollToSection }) {
  const { brandName, shortName, contactEmail, contactPhone, contactWhatsapp, logoUrl, tagline } =
    usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="tpl-footer tpl-footer--editorial">
      <div className="tpl-footer-editorial-inner">
        <div className="tpl-footer-editorial-left">
          {logoUrl ? (
            <img src={logoUrl} alt={displayName} className="tpl-footer-editorial-logo" />
          ) : (
            <h2 className="tpl-footer-editorial-name">{displayName}</h2>
          )}
          <p className="tpl-footer-editorial-tagline">{tagline || 'Digital services with editorial precision.'}</p>
          <PlaceOrderDropdown triggerClassName="tpl-footer-editorial-cta" label="Start a Project" />
        </div>
        <div className="tpl-footer-editorial-right">
          <h4>Stay in touch</h4>
          <a href={`mailto:${contactEmail}`}><IoMailOutline /> {contactEmail}</a>
          {contactPhone ? <a href={formatPhoneHref(contactPhone)}><IoCallOutline /> {contactPhone}</a> : null}
          {contactWhatsapp ? (
            <a href={buildWhatsappUrl(contactWhatsapp)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          ) : null}
          <div className="tpl-footer-editorial-nav">
            <Link to="/about">About</Link>
            <Link to="/blog">Journal</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <p className="tpl-footer-editorial-copy">&copy; {new Date().getFullYear()} {brandName}</p>
    </footer>
  );
}

export default EditorialFooter;
