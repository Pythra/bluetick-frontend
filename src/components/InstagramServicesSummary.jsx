import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import instagramHeroImage from '../assets/online.jpg';
import './InstagramServicesSummary.css';
import './ServicesSummaryHero.css';

function InstagramServicesSummary() {
  const navigate = useNavigate();

  const instagramServices = [
    'Instagram blogs promotions',
    'Entertainment & celebrity pages',
    'Music & lifestyle promotion',
  ];

  return (
    <section id="instagram-services" className="instagram-services-section instagram-services-summary services-summary-layout">
      <ServicesSummaryLayout
        reverse
        copy={(
          <>
            <SectionHeader
              title={(
                <>
                  <span className="services-summary-title-black">INSTAGRAM BLOG</span>{' '}
                  <span className="services-summary-title-blue">PROMOTION</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Get your content featured on top Instagram pages and reach millions of followers. Promote
              your brand, music, or content on Nigeria&apos;s most popular Instagram pages — from
              entertainment blogs to celebrity news platforms.
            </p>
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
              <p className="services-summary-hero-kicker">What We Promote</p>
              <h3>Reach Millions on Top Instagram Pages</h3>
              <ul className="services-summary-hero-types">
                {instagramServices.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
              <Button
                onClick={() => navigate('/services/instagram')}
                className="bounce-btn services-summary-hero-cta"
              >
                Explore Instagram Promotion
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default InstagramServicesSummary;
