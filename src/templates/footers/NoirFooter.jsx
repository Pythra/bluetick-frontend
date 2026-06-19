import { Link } from 'react-router-dom';
import { IoLogoInstagram, IoLogoWhatsapp } from 'react-icons/io5';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { buildWhatsappUrl } from '../../utils/partnerMedia';
import '../styles/templateFooters.css';

function NoirFooter({ onScrollToSection }) {
  const { brandName, shortName, contactEmail, contactWhatsapp, logoUrl } = usePartnerBranding();
  const displayName = shortName || brandName;

  return (
    <footer className="tpl-footer tpl-footer--noir">
      <div className="tpl-footer-noir-inner">
        {logoUrl ? (
          <img src={logoUrl} alt={displayName} className="tpl-footer-noir-logo" />
        ) : (
          <h2 className="tpl-footer-noir-wordmark">{displayName}</h2>
        )}
        <div className="tpl-footer-noir-links">
          <Link to="/about">About</Link>
          <a href="#website-services" onClick={(e) => { e.preventDefault(); onScrollToSection?.('website-services'); }}>Services</a>
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <a href={`mailto:${contactEmail}`}>Contact</a>
        </div>
        <div className="tpl-footer-noir-social">
          {contactWhatsapp ? (
            <a href={buildWhatsappUrl(contactWhatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <IoLogoWhatsapp />
            </a>
          ) : null}
        </div>
      </div>
      <p className="tpl-footer-noir-copy">&copy; {new Date().getFullYear()} {brandName}</p>
    </footer>
  );
}

export default NoirFooter;
