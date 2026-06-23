import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import PublicationLogosCarousel from './PublicationLogosCarousel';
import publicationHeroImage from '../assets/news.jpg';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteServiceImage } from '../contexts/MainSiteMediaContext';
import { ServiceSectionTitle } from './ServiceSectionTitle';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './PublicationSection.css';
import './ServicesSummaryHero.css';

function PublicationServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('publication');
  const { isPartnerSite } = usePartnerBranding();
  const mainPublicationImage = useMainSiteServiceImage('publicationImage', publicationHeroImage);
  const publicationImageSrc = isPartnerSite ? publicationHeroImage : mainPublicationImage;

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
              src={publicationImageSrc}
              alt="Publication packages"
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
                onClick={() => navigate('/services/publications')}
                className="bounce-btn services-summary-hero-cta"
              >
                Order Now
              </Button>
            </div>
          </div>
        )}
        below={(
          <>
            <PublicationLogosCarousel title="" className="publication-logos-carousel--summary" />
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
          </>
        )}
      />
    </section>
  );
}

export default PublicationServicesSummary;
