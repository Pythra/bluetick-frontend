import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './WikipediaServicesSummary.css';

function WikipediaServicesSummary() {
  const navigate = useNavigate();

  const wikipediaServices = [
    { name: 'INDIVIDUAL WIKIPEDIA PAGE', icon: '👤' },
    { name: 'COMPANY WIKIPEDIA PAGE', icon: '🏢' },
    { name: 'CONTENT REVIEW', icon: '✅' },
    { name: 'NEWS PUBLICATIONS', icon: '📰' },
    { name: 'QUALITY ASSURANCE', icon: '⭐' },
    { name: 'KNOWLEDGE PANEL', icon: '🔍' },
  ];

  return (
    <section id="wikipedia-services" className="wikipedia-services-section">
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
          title="WIKIPEDIA PAGE SERVICES"
          subtitle="Establish credibility with your own Wikipedia page. Get listed on the world's most trusted encyclopedia with professional content creation, comprehensive publications, and quality assurance for individuals and companies."
        />
        <div className="wikipedia-container">
          {wikipediaServices.map((service, index) => (
            <div key={index} className="wikipedia-item">
              <span className="wikipedia-icon">{service.icon}</span>
              <span className="wikipedia-name">{service.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/wikipedia')} className="bounce-btn">
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

export default WikipediaServicesSummary;
