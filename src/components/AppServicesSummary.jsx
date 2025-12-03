import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './AppServicesSection.css';

function AppServicesSummary() {
  const navigate = useNavigate();
  const appServices = [
    { name: 'HEALTH & FITNESS APPS', icon: '💪' },
    { name: 'E-COMMERCE APPS', icon: '🛒' },
    { name: 'FINTECH & BANKING APPS', icon: '💰' },
    { name: 'SOCIAL MEDIA APPS', icon: '📱' },
    { name: 'TRAVEL & BOOKING APPS', icon: '✈️' },
    { name: 'PRODUCTIVITY APPS', icon: '📊' },
    { name: 'STREAMING & ENTERTAINMENT APPS', icon: '🎬' },
    { name: 'GAMING APPS', icon: '🎮' },
    { name: 'BILL PAYMENT APPS', icon: '💳' },
    { name: 'CRYPTO EXCHANGE APPS', icon: '₿' },
  ];

  return (
    <section id="app-services" className="app-services-section">
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
      <div className="colorful-ball ball-11"></div>
      <div className="colorful-ball ball-12"></div>
      <div className="colorful-ball ball-13"></div>
      <div className="container">
        <SectionHeader
          title="APP DEVELOPMENT SERVICES"
          subtitle="We build quality apps with cutting-edge technology, user-centric design, and seamless performance. From concept to launch, we deliver mobile solutions that drive business growth and exceed user expectations."
        />
        <div className="apps-container">
          {appServices.map((app, index) => (
            <div key={index} className="app-item">
              <span className="app-icon">{app.icon}</span>
              <span className="app-name">{app.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/apps')} className="bounce-btn">
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

export default AppServicesSummary;
