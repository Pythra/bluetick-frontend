import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import tiktokArtistHeroImage from '../assets/social/tiktok-artist.jpg';
import { ServiceSectionTitle, usePartnerSectionContent } from '../utils/partnerSectionContent';
import './ServicesSummaryHero.css';

function TikTokArtistServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('tiktokArtist');

  return (
    <section
      id="tiktok-artist-services"
      className="music-streaming-services-section music-streaming-services-summary services-summary-layout"
    >
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
              src={tiktokArtistHeroImage}
              alt="Person scrolling TikTok on a phone — artist promotion and sound campaigns"
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
                onClick={() => navigate('/services/tiktok-artist')}
                className="bounce-btn services-summary-hero-cta"
              >
                Order now
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default TikTokArtistServicesSummary;
