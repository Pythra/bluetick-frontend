import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import partnerImage from '../assets/partner.png';
import portraitPartnerImage from '../assets/potraitpartner.png';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import './PartnerWithUsSection.css';

const partnerHighlights = [
  'Set your own prices above our base rate — you keep the profit on every sale',
  'Launch a white-label website and sell Bluetick services under your brand',
  'Earn referral commissions with flexible payouts via bank, Wise, PayPal, or USDT',
];

function PartnerWithUsSection() {
  const navigate = useNavigate();
  const { getPartnerWithUsImage, getPartnerWithUsMobileImage } = useMainSiteMedia();
  const desktopBackground = getPartnerWithUsImage(partnerImage);
  const mobileBackground = getPartnerWithUsMobileImage(portraitPartnerImage);

  return (
    <section className="partner-section" aria-label="Partner with us">
      <div className="partner-bg-overlay" aria-hidden="true">
        <picture className="partner-bg-picture">
          <source media="(max-width: 640px)" srcSet={mobileBackground} />
          <img
            src={desktopBackground}
            alt=""
            className="partner-bg-image"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div className="partner-bg-tint" />
      </div>
      <div className="partner-content-wrapper">
        <div className="partner-content">
          <h2 className="partner-title">
            <span className="partner-title-white">Partner With</span>
            <span className="partner-title-gradient">Industry Leaders</span>
          </h2>
          
          <p className="partner-description">
            Join forces with Bluetick to unlock exclusive benefits, co-branded opportunities, 
            and access to our elite network of celebrities, brands, and media platforms.
          </p>

          <ul className="partner-mobile-highlights" aria-label="Partner program benefits">
            {partnerHighlights.map((highlight) => (
              <li key={highlight}>
                <FaCheckCircle className="partner-mobile-highlights-icon" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          
          <button
            type="button"
            className="partner-cta-btn"
            onClick={() => navigate('/partner')}
          >
            <span>Partner with Us</span>
            <FaArrowRight className="partner-cta-icon" />
          </button>
        </div>
      </div>
      
      <div className="partner-grid-pattern" />
    </section>
  );
}

export default PartnerWithUsSection;
