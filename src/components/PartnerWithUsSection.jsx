import { useNavigate } from 'react-router-dom';
import { FaHandshake, FaArrowRight } from 'react-icons/fa';
import './PartnerWithUsSection.css';

function PartnerWithUsSection() {
  const navigate = useNavigate();

  return (
    <section className="partner-section" aria-label="Partner with us">
      <div className="partner-bg-overlay" />
      <div className="partner-content-wrapper">
        <div className="partner-content">
          <div className="partner-badge">
            <FaHandshake className="partner-badge-icon" />
            <span>Strategic Partnerships</span>
          </div>
          
          <h2 className="partner-title">
            <span className="partner-title-white">Partner With</span>
            <span className="partner-title-gradient">Industry Leaders</span>
          </h2>
          
          <p className="partner-description">
            Join forces with Bluetick to unlock exclusive benefits, co-branded opportunities, 
            and access to our elite network of celebrities, brands, and media platforms.
          </p>
          
          <div className="partner-stats">
            <div className="partner-stat">
              <span className="partner-stat-value">500+</span>
              <span className="partner-stat-label">Brand Partners</span>
            </div>
            <div className="partner-stat-divider" />
            <div className="partner-stat">
              <span className="partner-stat-value">50+</span>
              <span className="partner-stat-label">Celebrities</span>
            </div>
            <div className="partner-stat-divider" />
            <div className="partner-stat">
              <span className="partner-stat-value">20+</span>
              <span className="partner-stat-label">Countries</span>
            </div>
          </div>
          
          <button
            type="button"
            className="partner-cta-btn"
            onClick={() => navigate('/partner')}
          >
            <span>Partner with Us</span>
            <FaArrowRight className="partner-cta-icon" />
          </button>
        </div>
        
        <div className="partner-visual">
          <div className="partner-card partner-card-1">
            <div className="partner-card-icon">🤝</div>
            <div className="partner-card-text">
              <strong>Collaborate</strong>
              <span>Co-branding opportunities</span>
            </div>
          </div>
          <div className="partner-card partner-card-2">
            <div className="partner-card-icon">🚀</div>
            <div className="partner-card-text">
              <strong>Grow</strong>
              <span>Expand your reach</span>
            </div>
          </div>
          <div className="partner-card partner-card-3">
            <div className="partner-card-icon">💼</div>
            <div className="partner-card-text">
              <strong>Succeed</strong>
              <span>Shared success stories</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="partner-grid-pattern" />
    </section>
  );
}

export default PartnerWithUsSection;
