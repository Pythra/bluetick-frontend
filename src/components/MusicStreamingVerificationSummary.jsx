import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import musicHeroImage from '../assets/mayorkun.jpg';
import './ServicesSummaryHero.css';

function MusicStreamingVerificationSummary() {
  const navigate = useNavigate();

  const highlightServices = [
    'Spotify & Apple Music verification',
    'Boomplay, Audiomack & Deezer verification',
    'YouTube Official Artist Channel (OAC)',
  ];

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
              eyebrow="For Artists"
              title={(
                <>
                  <span className="services-summary-title-black">MUSIC ARTIST</span>
                  <span className="services-summary-title-row">
                    <span className="services-summary-title-black">STREAMING </span>
                    <span className="services-summary-title-blue">VERIFICATION</span>
                  </span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Get verified artist profiles on Spotify, Apple Music, Boomplay, YouTube OAC, and every
              major streaming platform. We handle eligibility, profile setup, and platform approval from
              start to finish.
            </p>
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
              <p className="services-summary-hero-kicker">What We Verify</p>
              <h3>Official Artist Profiles on Top Platforms</h3>
              <ul className="services-summary-hero-types">
                {highlightServices.map((service) => (
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
