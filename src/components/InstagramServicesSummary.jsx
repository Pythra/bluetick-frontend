import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import instagramHeroImage from '../assets/online.jpg';
import ServiceSectionTitle from './ServiceSectionTitle';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './InstagramServicesSummary.css';
import './ServicesSummaryHero.css';

function InstagramServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('instagram');

  return (
    <section id="instagram-services" className="instagram-services-section instagram-services-summary services-summary-layout">
      <ServicesSummaryLayout
        reverse
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
              src={instagramHeroImage}
              alt="Instagram blog promotion"
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
                onClick={() => navigate('/services/instagram')}
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

export default InstagramServicesSummary;
