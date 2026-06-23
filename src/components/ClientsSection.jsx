import clientsFallbackImage from '../assets/ourclients.JPEG';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import './ClientsSection.css';

function ClientsSection({ className = '' }) {
  const { isPartnerSite } = usePartnerBranding();
  const { getClientLogos } = useMainSiteMedia();
  const clientLogos = isPartnerSite ? [] : getClientLogos();
  const hasUploadedLogos = clientLogos.length > 0;

  return (
    <section className={`clients-section ${className}`.trim()} aria-label="Our clients">
      <div className="clients-section-inner">
        {hasUploadedLogos ? (
          <div className="clients-section-layout">
            <header className="clients-section-header section-header">
              <h2 className="section-title clients-section-title">
                <span className="services-summary-title-black">SOME OF OUR</span>
                <span className="services-summary-title-blue">CLIENTS</span>
              </h2>
            </header>
            <ul className="clients-section-logos" aria-label="Client logos">
              {clientLogos.map((logo) => (
                <li key={logo.id || logo.name} className="clients-section-logo">
                  <img src={logo.imageUrl} alt={logo.name || 'Client logo'} loading="lazy" decoding="async" />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="clients-section-layout clients-section-layout--legacy">
            <header className="clients-section-header section-header">
              <h2 className="section-title clients-section-title">
                <span className="services-summary-title-black">SOME OF OUR</span>
                <span className="services-summary-title-blue">CLIENTS</span>
              </h2>
            </header>
            <div className="clients-section-visual">
              <img
                src={clientsFallbackImage}
                alt="Some of our clients"
                className="clients-section-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ClientsSection;
