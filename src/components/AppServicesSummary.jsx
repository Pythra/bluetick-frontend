import { useNavigate } from 'react-router-dom';
import Button from './Button';
import SectionHeader from './SectionHeader';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import appHeroImage from '../assets/app.png';
import './AppServicesSection.css';

function AppServicesSummary() {
  const navigate = useNavigate();

  const appServices = [
    { name: 'IOS AND ANDROID APPS' },
    { name: 'FINTECH AND COMMERCE APPS' },
    { name: 'CUSTOM PRODUCT APPS' },
  ];

  return (
    <section id="app-services" className="app-services-section app-services-summary services-summary-layout">
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              eyebrow="Build & Launch"
              title={(
                <>
                  <span className="services-summary-title-black">APP DEVELOPMENT</span>{' '}
                  <span className="services-summary-title-blue">SERVICES</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              We craft fast, scalable, and{' '}
              <span>user-focused apps</span> with one streamlined{' '}
              <span>product strategy</span> from{' '}
              <span>planning to launch</span>.
            </p>
          </>
        )}
        media={(
          <div className="app-hero-shell">
            <img
              src={appHeroImage}
              alt="App development services"
              className="app-hero-image"
            />
            <div className="app-hero-overlay"></div>
            <div className="app-hero-content">
              <p className="app-hero-kicker">What We Build</p>
              <h3>Modern Mobile Apps That Perform</h3>
              <ul className="app-hero-types">
                {appServices.map((app) => (
                  <li key={app.name}>{app.name}</li>
                ))}
              </ul>
              <Button onClick={() => navigate('/services/apps')} className="bounce-btn app-hero-cta">
                Order Now
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default AppServicesSummary;
