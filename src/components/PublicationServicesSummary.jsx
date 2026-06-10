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

  const publicationCategories = [
    {
      title: 'African News',
      icon: 'IoNewspaper',
      services: [
        'Punch, Guardian, Vanguard & more',
        'BusinessDay, ThisDay, Leadership',
        '20+ top African publications',
      ],
      ctaPath: '/services/publications',
    },
    {
      title: 'Global News',
      icon: 'IoGlobe',
      services: [
        'BBC News, Bloomberg, Forbes',
        'International Business Times',
        '50+ global media platforms',
      ],
      ctaPath: '/services/publications',
    },
    {
      title: 'Tech & Startups',
      icon: 'IoRocket',
      services: [
        'Techpoint, TechCabal, Coin Journal',
        'Crypto Daily, Tech Bullion',
        'Specialized tech publications',
      ],
      ctaPath: '/services/publications',
    },
  ];

  const getIcon = (iconName) => {
    const icons = {
      IoNewspaper: () => <span className="publication-category-icon publication-category-icon--newspaper">📰</span>,
      IoGlobe: () => <span className="publication-category-icon publication-category-icon--globe">🌍</span>,
      IoRocket: () => <span className="publication-category-icon publication-category-icon--rocket">🚀</span>,
    };
    const IconComponent = icons[iconName];
    return IconComponent ? IconComponent() : null;
  };

  return (
    <section id="publication-services" className="publication-section publication-services-summary services-summary-layout">
      <div className="publication-services-summary-bg-decoration">
        <div className="dot-pattern"></div>
      </div>
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
        below={(
          <div className="publication-category-grid">
            {publicationCategories.map((category) => (
              <article key={category.title} className="publication-category-card">
                <div className="publication-card-head">
                  {getIcon(category.icon)}
                  <h4>{category.title}</h4>
                </div>
                <ul className="publication-category-list">
                  {category.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate(category.ctaPath)}
                  className="publication-category-cta"
                >
                  Order now
                </Button>
              </article>
            ))}
          </div>
        )}
      />
    </section>
  );
}

export default PublicationServicesSummary;
