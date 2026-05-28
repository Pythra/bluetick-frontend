import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import publicationHeroImage from '../assets/news.jpg';
import './PublicationSection.css';
import './ServicesSummaryHero.css';

function PublicationServicesSummary() {
  const navigate = useNavigate();

  const publicationServices = [
    'Major platforms package',
    'International platforms',
    'National dailies & newswire',
  ];

  return (
    <section id="publication-services" className="publication-section publication-services-summary services-summary-layout">
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              title={(
                <>
                  <span className="services-summary-title-black">PUBLICATION</span>{' '}
                  <span className="services-summary-title-blue">PACKAGES</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Get your content published on major news platforms, international sites, and specialized
              publications. From quick 6-hour publications to comprehensive multi-platform packages, we
              deliver solutions that amplify your message globally.
            </p>
          </>
        )}
        media={(
          <div className="services-summary-hero-shell">
            <img
              src={publicationHeroImage}
              alt="Publication packages"
              className="services-summary-hero-image"
            />
            <div className="services-summary-hero-overlay"></div>
            <div className="services-summary-hero-content">
              <p className="services-summary-hero-kicker">What We Publish</p>
              <h3>Your Story on Major Media Platforms</h3>
              <ul className="services-summary-hero-types">
                {publicationServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <Button
                onClick={() => navigate('/services/publications')}
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

export default PublicationServicesSummary;
