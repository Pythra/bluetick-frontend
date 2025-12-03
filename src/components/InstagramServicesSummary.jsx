import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './InstagramServicesSummary.css';

function InstagramServicesSummary() {
  const navigate = useNavigate();

  const instagramServices = [
    { name: 'INSTAGRAM BLOGS PROMOTIONS', icon: '📸' },
    { name: 'ENTERTAINMENT PAGES', icon: '🎬' },
    { name: 'CELEBRITY NEWS', icon: '⭐' },
    { name: 'GOSSIP PAGES', icon: '💬' },
    { name: 'MUSIC PROMOTION', icon: '🎵' },
    { name: 'LIFESTYLE BLOGS', icon: '✨' },
  ];

  return (
    <section id="instagram-services" className="instagram-services-section">
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
          title="INSTAGRAM BLOG PROMOTION"
          subtitle="Get your content featured on top Instagram pages and reach millions of followers. Promote your brand, music, or content on Nigeria's most popular Instagram pages - from entertainment blogs to celebrity news platforms."
        />
        <div className="instagram-container">
          {instagramServices.map((service, index) => (
            <div key={index} className="instagram-item">
              <span className="instagram-icon">{service.icon}</span>
              <span className="instagram-name">{service.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/instagram')} className="bounce-btn">
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

export default InstagramServicesSummary;

