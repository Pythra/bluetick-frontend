import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './WebsiteServicesSection.css';

function WebsiteServicesSummary() {
  const navigate = useNavigate();

  const websiteServices = [
    { name: 'BASIC INFORMATIONAL WEBSITE', icon: '🌐' },
    { name: 'CUSTOM WEB APPLICATIONS', icon: '💻' },
    { name: 'E-COMMERCE WEBSITES', icon: '🛍️' },
  ];

  return (
    <section id="website-services" className="website-services-section">
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
          title="WEBSITE DEVELOPMENT SERVICES"
          subtitle="We craft responsive, modern websites that captivate your audience and drive conversions. From elegant informational sites to powerful web applications, we transform your vision into a stunning digital experience that stands out."
        />
        <div className="websites-container">
          {websiteServices.map((website, index) => (
            <div key={index} className="website-item">
              <span className="website-icon">{website.icon}</span>
              <span className="website-name">{website.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/websites')} className="bounce-btn">
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

export default WebsiteServicesSummary;

