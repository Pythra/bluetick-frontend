import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import './VerificationSection.css';

function VerificationServicesSummary() {
  const navigate = useNavigate();

  const verificationServices = [
    { name: 'INSTAGRAM VERIFICATION', icon: '📷' },
    { name: 'FACEBOOK VERIFICATION', icon: '👥' },
    { name: 'TIKTOK VERIFICATION', icon: '🎵' },
    { name: 'YOUTUBE VERIFICATION', icon: '📺' },
    { name: 'TELEGRAM VERIFICATION', icon: '✈️' },
    { name: 'WHATSAPP VERIFICATION', icon: '💬' },
  ];

  return (
    <section id="verification-services" className="verification-section">
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
          title="SOCIAL MEDIA VERIFICATION RATE CARD"
          subtitle="Establish your online presence with credibility and authenticity. Get verified on major platforms with permanent verification badges that boost your digital reputation and secure the recognition you deserve."
        />
        <div className="verification-container">
          {verificationServices.map((service, index) => (
            <div key={index} className="verification-item">
              <span className="verification-icon">{service.icon}</span>
              <span className="verification-name">{service.name}</span>
            </div>
          ))}
          <div className="learn-more-section">
            <Button onClick={() => navigate('/services/verification')} className="bounce-btn">
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

export default VerificationServicesSummary;

