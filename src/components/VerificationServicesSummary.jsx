import { useNavigate } from 'react-router-dom';
import {
  IoCheckmarkCircleOutline,
  IoPeopleOutline,
  IoRocketOutline,
} from 'react-icons/io5';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import socialVerificationImage from '../assets/social/verification.jpg';
import { usePartnerAsset } from '../utils/partnerMedia';
import { ServiceSectionTitle } from './ServiceSectionTitle';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteServiceImage } from '../contexts/MainSiteMediaContext';
import './VerificationSection.css';

const socialServiceCategories = [
  {
    title: 'Verification Services',
    icon: IoCheckmarkCircleOutline,
    iconTone: 'mint',
    services: [
      'Instagram, Facebook, TikTok, and YouTube verification',
      'Telegram and WhatsApp verification support',
      'Eligibility guidance and profile readiness review',
    ],
    ctaPath: '/services/verification',
  },
  {
    title: 'Monetization Services',
    icon: IoPeopleOutline,
    iconTone: 'sky',
    services: [
      'Facebook and Instagram monetization setup',
      'YouTube, TikTok, Snapchat, and X monetization',
      'End-to-end payout configuration assistance',
    ],
    ctaPath: '/services/monetization',
  },
  {
    title: 'Twitter Trend Services',
    icon: IoRocketOutline,
    iconTone: 'amber',
    services: [
      'Nigeria, Ghana, Kenya, Uganda & South Africa X trends',
      '24–48 hour delivery on country trend packages',
      'Hashtag strategy, timing, and performance reporting',
    ],
    ctaPath: '/services/twitter-trends',
  },
];

function VerificationServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('socialMedia');
  const { isPartnerSite } = usePartnerBranding();
  const socialImageSrc = useMainSiteServiceImage('socialMediaImage', socialVerificationImage);
  const heroImageSrc = isPartnerSite ? socialVerificationImage : socialImageSrc;

  return (
    <section
      id="verification-services"
      className="verification-section verification-services-summary services-summary-layout"
    >
      <div className="verification-services-summary-bg-decoration">
        <div className="dot-pattern"></div>
      </div>
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
          <div className="verification-overview-media">
            <div className="verification-carousel-shell verification-overview-shell">
              <div className="verification-carousel-slide verification-overview-slide">
                <img
                  src={heroImageSrc}
                  alt="Social media services overview"
                  className="verification-carousel-image"
                />
                <div className="verification-carousel-overlay"></div>
                <div className="verification-carousel-content verification-overview-content">
                  <p className="verification-carousel-kicker">{section.heroKicker}</p>
                  <h3>{section.heroTitle}</h3>
                  <ul className="verification-carousel-types verification-carousel-types--bulleted">
                    <li>Social Media Verification</li>
                    <li>Social Media Monetization</li>
                    <li>Twitter Trend Services</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        below={(
          <div className="social-services-category-grid">
            {socialServiceCategories.map((category) => (
              <article key={category.title} className="social-services-category-card">
                <div className="social-services-card-head">
                  <span
                    className={`social-services-category-icon social-services-category-icon--${category.iconTone}`}
                    aria-hidden="true"
                  >
                    <category.icon />
                  </span>
                  <h4>{category.title}</h4>
                </div>
                <ul className="social-services-category-list">
                  {category.services.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate(category.ctaPath)}
                  className="social-services-category-cta"
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

export default VerificationServicesSummary;
