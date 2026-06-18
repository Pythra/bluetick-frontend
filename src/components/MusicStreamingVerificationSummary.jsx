import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import musicHeroImage from '../assets/mayorkun.jpg';
import { ServiceSectionTitle, usePartnerSectionContent } from '../utils/partnerSectionContent';
import './ServicesSummaryHero.css';

function MusicStreamingVerificationSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('musicStreaming');

  return (
    <section
      id="music-streaming-services"
      className="music-streaming-services-section music-streaming-services-summary services-summary-layout"
    >
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
              src={musicHeroImage}
              alt="Music artist streaming platform verification"
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
                onClick={() => navigate('/services/music-streaming')}
                className="bounce-btn services-summary-hero-cta"
              >
                View Streaming Verification Prices
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default MusicStreamingVerificationSummary;
