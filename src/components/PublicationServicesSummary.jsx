import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './PublicationSection.css';

function PublicationServicesSummary() {
  const navigate = useNavigate();

  const publicationTypes = [
    { name: 'MAJOR PLATFORMS PACKAGE', icon: '📰' },
    { name: 'USA NEWSWIRE', icon: '🇺🇸' },
    { name: 'NATIONAL DAILIES', icon: '📄' },
    { name: 'INTERNATIONAL PLATFORMS', icon: '🌍' },
    { name: 'TECH & ENTERTAINMENT', icon: '💻' },
    { name: 'TELEVISION FEATURES', icon: '📺' },
  ];

  return (
    <section id="publication-services" className="publication-section">
      <div className="colorful-ball ball-1"></div>
      <div className="colorful-ball ball-2"></div>
      <div className="colorful-ball ball-3"></div>
      <div className="colorful-ball ball-4"></div>
      <div className="colorful-ball ball-5"></div>
      <div className="colorful-ball ball-6"></div>
      <div className="colorful-ball ball-7"></div>
      <div className="colorful-ball ball-8"></div>
      <div className="colorful-ball ball-9"></div>
      <div className="colorful-ball ball-10"></div>
      <div className="container">
        <SectionHeader
          title="PUBLICATION PACKAGES"
          subtitle="Get your content published on major news platforms, international sites, and specialized publications. From quick 6-hour publications to comprehensive multi-platform packages, we deliver solutions that amplify your message globally."
        />
        <div className="publication-container">
          {publicationTypes.map((type, index) => (
            <div key={index} className="publication-item">
              <span className="publication-icon">{type.icon}</span>
              <span className="publication-name">{type.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/publications')} className="bounce-btn">
              <span className="button-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/>
                </svg>
              </span>
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationServicesSummary;

