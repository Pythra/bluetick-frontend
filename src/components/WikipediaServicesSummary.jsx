import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import wikipediaHeroImage from '../assets/global.jpg';
import './WikipediaServicesSummary.css';
import './ServicesSummaryHero.css';

function WikipediaServicesSummary() {
  const navigate = useNavigate();

  const wikipediaServices = [
    'Wikipedia Page for Individuals — ₦1,250,000',
    'Wikipedia Page for Organizations — ₦1,800,000',
    'Content review & quality assurance',
  ];

  return (
    <section id="wikipedia-services" className="wikipedia-services-section wikipedia-services-summary services-summary-layout">
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              eyebrow="Authority & Legacy"
              title={(
                <>
                  <span className="services-summary-title-black">WIKIPEDIA PAGE</span>{' '}
                  <span className="services-summary-title-blue">SERVICES</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Establish credibility with your own Wikipedia page. Get listed on the world&apos;s most
              trusted encyclopedia with professional content creation, comprehensive publications, and
              quality assurance for individuals and companies.
            </p>
          </>
        )}
        media={(
          <div className="services-summary-hero-shell">
            <img
              src={wikipediaHeroImage}
              alt="Wikipedia page services"
              className="services-summary-hero-image"
            />
            <div className="services-summary-hero-overlay"></div>
            <div className="services-summary-hero-content">
              <p className="services-summary-hero-kicker">What We Deliver</p>
              <h3>Trusted Wikipedia Presence for Brands</h3>
              <ul className="services-summary-hero-types">
                {wikipediaServices.map((service) => (
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
