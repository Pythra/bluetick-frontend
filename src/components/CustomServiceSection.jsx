import Button from './Button';
import SectionHeader from './SectionHeader';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import PartnerMediaFrame from './PartnerMediaFrame';
import { ServiceSectionTitle } from './ServiceSectionTitle';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import { normalizeMediaUrl } from '../utils/partnerMedia';
import './AppServicesSection.css';

function CustomServiceSection({ service }) {
  const section = usePartnerSectionContent(service.id);
  const imageSrc = normalizeMediaUrl(service.imageUrl);
  const sectionId = service.sectionId || service.id;
  const ctaLabel = service.ctaLabel || 'Get Started';
  const ctaLink = service.ctaLink || '#custom-requests';

  const handleCtaClick = () => {
    if (!ctaLink) {
      return;
    }
    if (ctaLink.startsWith('#')) {
      const target = document.getElementById(ctaLink.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    window.open(ctaLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id={sectionId} className="app-services-section app-services-summary services-summary-layout">
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              eyebrow={section.eyebrow}
              title={<ServiceSectionTitle section={section} />}
            />
            <p className="services-summary-intro">{section.intro}</p>
          </>
        )}
        media={(
          <div className="app-hero-shell">
            <PartnerMediaFrame
              src={imageSrc}
              alt={service.label || 'Custom service'}
              className="app-hero-image-frame"
            />
            <div className="app-hero-overlay"></div>
            <div className="app-hero-content">
              <p className="app-hero-kicker">{section.heroKicker}</p>
              <h3>{section.heroTitle}</h3>
              <ul className="app-hero-types">
                {(section.bullets || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button onClick={handleCtaClick} className="bounce-btn app-hero-cta">
                {ctaLabel}
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default CustomServiceSection;
