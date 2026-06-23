import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import wikipediaHeroImage from '../assets/global.jpg';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteServiceImage } from '../contexts/MainSiteMediaContext';
import { ServiceSectionTitle } from './ServiceSectionTitle';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './WikipediaServicesSummary.css';
import './ServicesSummaryHero.css';

function WikipediaServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('wikipedia');
  const { isPartnerSite } = usePartnerBranding();
  const wikipediaImageSrc = useMainSiteServiceImage('wikipediaImage', wikipediaHeroImage);
  const heroImageSrc = isPartnerSite ? wikipediaHeroImage : wikipediaImageSrc;

  return (
    <section id="wikipedia-services" className="wikipedia-services-section wikipedia-services-summary services-summary-layout">
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
          <div className="services-summary-hero-shell">
            <img
              src={heroImageSrc}
              alt="Wikipedia page services"
              className="services-summary-hero-image"
            />
            <div className="services-summary-hero-overlay"></div>
            <div className="services-summary-hero-content">
              <p className="services-summary-hero-kicker">{section.heroKicker}</p>
              <h3>{section.heroTitle}</h3>
              <ul className="services-summary-hero-types">
                {(section.bullets || []).map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <Button
                onClick={() => navigate('/services/wikipedia')}
                className="bounce-btn services-summary-hero-cta"
              >
                Order Now
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default WikipediaServicesSummary;
