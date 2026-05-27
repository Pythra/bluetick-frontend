import { useNavigate } from 'react-router-dom';
import Button from './Button';
import SectionHeader from './SectionHeader';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import websiteHeroImage from '../assets/tech.jpg';
import './WebsiteServicesSection.css';

function WebsiteServicesSummary() {
  const navigate = useNavigate();

  const websiteServices = [
    { name: 'BASIC INFORMATIONAL WEBSITES' },
    { name: 'CUSTOM WEB APPLICATIONS' },
    { name: 'E-COMMERCE WEBSITES' },
  ];

  return (
    <section id="website-services" className="website-services-section website-services-summary services-summary-layout">
      <ServicesSummaryLayout
        reverse
        copy={(
          <>
            <SectionHeader
              title={(
                <>
                  <span className="services-summary-title-black">WEBSITE DEVELOPMENT</span>{' '}
                  <span className="services-summary-title-blue">SERVICES</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              We design <span>responsive, conversion-focused websites</span> that combine{' '}
              <span>premium visuals</span> with a <span>seamless user experience</span>.
            </p>
          </>
        )}
        media={(
          <div className="website-hero-shell">
            <img
              src={websiteHeroImage}
              alt="Website development services"
              className="website-hero-image"
            />
            <div className="website-hero-overlay"></div>
            <div className="website-hero-content">
              <p className="website-hero-kicker">What We Build</p>
              <h3>Modern Websites That Perform</h3>
              <ul className="website-hero-types">
                {websiteServices.map((website) => (
                  <li key={website.name}>{website.name}</li>
                ))}
              </ul>
              <Button onClick={() => navigate('/services/websites')} className="bounce-btn website-hero-cta">
                Explore Website Services
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default WebsiteServicesSummary;
