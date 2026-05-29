import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import tiktokArtistHeroImage from '../assets/social/tiktok-artist.jpg';
import './ServicesSummaryHero.css';

function TikTokArtistServicesSummary() {
  const navigate = useNavigate();

  const highlightServices = [
    'TikTok song claim under your artist profile',
    'Micro influencer campaigns using your sound',
    'Packages from 25 to 1,000 influencers',
  ];

  return (
    <section
      id="tiktok-artist-services"
      className="music-streaming-services-section music-streaming-services-summary services-summary-layout"
    >
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              title={(
                <>
                  <span className="services-summary-title-black">TIKTOK FOR</span>
                  <span className="services-summary-title-row">
                    <span className="services-summary-title-black">ARTIST </span>
                    <span className="services-summary-title-blue">SERVICES</span>
                  </span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Promotional packages for artists and labels — from song claiming and analytics setup to
              influencer sound campaigns that drive reach on TikTok.
            </p>
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
              <p className="services-summary-hero-kicker">THE BOSS MUSIC · TikTok</p>
              <h3>Services &amp; Promotional Packages</h3>
              <ul className="services-summary-hero-types">
                {highlightServices.map((service) => (
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
