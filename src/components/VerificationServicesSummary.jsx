import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import Button from './Button';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import socialVerificationImage from '../assets/social/verification.jpg';
import socialMonetizationImage from '../assets/social/monetization.jpg';
import socialTwitterTrendsImage from '../assets/social/twitter-trends.jpg';
import './VerificationSection.css';

const socialServicesSlides = [
  {
    kicker: 'What We Verify',
    title: 'Social Media Verification',
    subtitle: 'Secure official verified badges and strengthen trust across major platforms.',
    services: [
      'Instagram verification',
      'Facebook verification',
      'TikTok & YouTube verification',
      'Telegram & WhatsApp verification',
    ],
    ctaLabel: 'Order Now',
    ctaPath: '/services/verification',
    image: socialVerificationImage,
    hideOverlaySubtitle: false,
  },
  {
    kicker: 'What We Monetize',
    title: 'Social Media Monetization',
    subtitle: 'Unlock revenue on Facebook, Instagram, YouTube, TikTok, Snapchat, and X.',
    services: [
      'Facebook page & profile monetization',
      'Instagram & YouTube monetization',
      'TikTok & Snapchat monetization',
      'X (Twitter) monetization',
    ],
    ctaLabel: 'Order Now',
    ctaPath: '/services/monetization',
    image: socialMonetizationImage,
    hideOverlaySubtitle: false,
  },
  {
    kicker: 'Trend Packages',
    title: 'Twitter (X) Trend Packages',
    services: [
      'Nigeria local & national trend campaigns',
      'Africa regional visibility packages',
      'Global trend visibility for major launches',
      'Strategy, execution & performance reporting',
    ],
    ctaLabel: 'Order Now',
    ctaPath: '/services/twitter-trends',
    image: socialTwitterTrendsImage,
    hideOverlaySubtitle: true,
  },
];

function VerificationServicesSummary() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % socialServicesSlides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="verification-services"
      className="verification-section verification-services-summary services-summary-layout"
    >
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              title={(
                <>
                  <span className="services-summary-title-black">SOCIAL MEDIA</span>{' '}
                  <span className="services-summary-title-blue">SERVICES</span>
                </>
              )}
            />
            <p className="services-summary-intro">
              Verification badges, full-platform monetization, and Twitter (X) trend packages — we handle{' '}
              <span>eligibility</span>, <span>growth</span>, and{' '}
              <span>approval from start to finish</span>.
            </p>
          </>
        )}
        media={(
          <div className="verification-carousel-shell">
            <div
              className="verification-carousel-track"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {socialServicesSlides.map((slide) => (
                <div key={slide.title} className="verification-carousel-slide">
                  <img src={slide.image} alt={slide.title} className="verification-carousel-image" />
                  <div className="verification-carousel-overlay"></div>
                  <div className="verification-carousel-content">
                    <p className="verification-carousel-kicker">{slide.kicker}</p>
                    <h3>{slide.title}</h3>
                    {!slide.hideOverlaySubtitle && slide.subtitle && (
                      <p className="verification-carousel-subtitle">{slide.subtitle}</p>
                    )}
                    <ul className="verification-carousel-types verification-carousel-types--bulleted">
                      {slide.services.map((service) => (
                        <li key={service}>{service}</li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => navigate(slide.ctaPath)}
                      className="bounce-btn verification-carousel-cta"
                    >
                      {slide.ctaLabel}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="verification-carousel-controls">
              {socialServicesSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`verification-carousel-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to ${slide.title}`}
                />
              ))}
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default VerificationServicesSummary;
