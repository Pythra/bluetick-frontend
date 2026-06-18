import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoNewspaperOutline,
  IoPeopleOutline,
  IoRocketOutline,
} from 'react-icons/io5';
import Navbar from './Navbar';
import PlaceOrderDropdown from './PlaceOrderDropdown';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import PublicationLogosCarousel from './PublicationLogosCarousel';
import PartnerMediaFrame from './PartnerMediaFrame';
import CountryFlag from './CountryFlag';
import { useCurrency } from '../contexts/CurrencyContext';
import { getCurrencyByCode } from '../data/flutterwaveCurrencies';
import heroVideo from '../assets/vid.mp4';
import { usePartnerAsset } from '../utils/partnerMedia';
import './LandingPage.css';

const heroSlides = [
  {
    title: 'We Build Apps & Websites',
    description: 'Modern web and mobile products built for speed, growth, and measurable business outcomes.',
  },
  {
    title: 'We Handle Social Media Verification',
    description: 'Get trusted badges and monetization readiness across major platforms with guided execution.',
  },
  {
    title: 'We Deliver Media Publications',
    description: 'Publish your story on leading platforms in Nigeria, Africa, and international markets.',
  },
];

const impactStats = [
  {
    value: 100,
    suffix: '+',
    label: 'Different Publication Platforms',
    icon: IoNewspaperOutline,
    iconTone: 'mint',
  },
  {
    value: 500,
    suffix: '+',
    label: 'Satisfied Customers',
    icon: IoPeopleOutline,
    iconTone: 'sky',
  },
  {
    value: 250,
    suffix: '+',
    label: 'High-Impact Launches Delivered',
    icon: IoRocketOutline,
    iconTone: 'amber',
  },
];

function LandingPage({ onScrollToSection }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isPartnerSite, brandName, shortName, tagline, heroTitle, heroDescription, features } = usePartnerBranding();
  const { src: partnerHeroVideo, isPartnerSite: onPartnerSite } = usePartnerAsset('heroVideo', heroVideo);
  const { src: heroPoster } = usePartnerAsset('heroPoster', null);
  const displayName = shortName || brandName;
  const { currency, setCurrency, currencies } = useCurrency();
  const selectedCurrency = getCurrencyByCode(currency);
  const [activeSlide, setActiveSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isCurrencyDropdownOpen) return undefined;

    const handlePointerDown = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCurrencyDropdownOpen]);

  return (
    <section id="landing" className="landing-page">
      <Navbar onScrollToSection={onScrollToSection} />

      <div className="landing-hero-shell">
        <div className="landing-hero-grid">
          <div className="landing-copy">
            <p className="landing-kicker">
              {isPartnerSite ? `${displayName} — Digital Growth Services` : 'Digital Growth Services for Brands'}
            </p>
            <h1 className="landing-title">
              {isPartnerSite && heroTitle
                ? heroTitle
                : 'Build, Verify, Monetize, and Feature Your Brand Across Top Platforms'}
            </h1>
            <p className="landing-description">
              {isPartnerSite
                ? heroDescription || tagline
                : 'From websites and mobile apps to social verification, monetization, PR distribution, Instagram promotions, and Wikipedia pages, we deliver end-to-end services designed for business growth and credibility.'}
            </p>

            <div
              className={`landing-actions${isAuthenticated ? ' landing-actions--auth' : ''}`}
            >
              <PlaceOrderDropdown />
              {!isAuthenticated && (
                <button
                  type="button"
                  className="landing-btn landing-btn-secondary"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              )}
              <div className="landing-currency-selector" ref={currencyDropdownRef}>
                <button
                  type="button"
                  className="landing-btn landing-btn-secondary landing-currency-btn"
                  onClick={() => setIsCurrencyDropdownOpen((open) => !open)}
                >
                  <span className="landing-currency-btn-flag">
                    <CountryFlag code={selectedCurrency.countryCode} size="sm" />
                  </span>
                  <span>Change Currency</span>
                  <span className="landing-currency-btn-symbol">{selectedCurrency.symbol}</span>
                </button>
                {isCurrencyDropdownOpen && (
                  <div className="landing-currency-dropdown">
                    <ul className="landing-currency-list">
                      {currencies.map((item) => {
                        const isActive = item.code === currency;
                        return (
                          <li key={item.code}>
                            <button
                              type="button"
                              className={`landing-currency-option${isActive ? ' is-active' : ''}`}
                              onClick={() => {
                                setCurrency(item.code);
                                setIsCurrencyDropdownOpen(false);
                              }}
                            >
                              <span className="landing-currency-option-flag">
                                <CountryFlag code={item.countryCode} size="sm" />
                              </span>
                              <span className="landing-currency-option-name">{item.name}</span>
                              <span className="landing-currency-option-code">{item.code}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="landing-media-card">
            <PartnerMediaFrame
              src={onPartnerSite ? partnerHeroVideo : heroVideo}
              type="video"
              poster={heroPoster}
              className="landing-media-video-wrap"
              overlayClassName="landing-media-overlay"
            />
            <div className="landing-media-content">
              <div className="landing-media-carousel" aria-live="polite">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.title}
                    className={`landing-media-slide ${index === activeSlide ? 'active' : ''}`}
                    aria-hidden={index !== activeSlide}
                  >
                    <p className="landing-media-kicker">
                      {isPartnerSite ? `${displayName} Services` : 'Bluetick Services'}
                    </p>
                    <h2>{slide.title}</h2>
                    <p className="landing-media-description">{slide.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {(!isPartnerSite || features?.showPublicationLogos) ? (
        <div className="landing-logos-strip" aria-label="Featured media logos">
          <PublicationLogosCarousel
            title=""
            className="impact-logos-carousel landing-logos-carousel"
            includePlatformBadges
          />
        </div>
        ) : null}

        <section ref={statsRef} className="landing-impact-strip" aria-label="Business impact metrics">
          <div className="landing-impact-inner">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <article
                  key={stat.label}
                  className="landing-impact-item landing-impact-item--card"
                >
                  <div className="landing-impact-top">
                    <div
                      className={`landing-impact-icon landing-impact-icon--${stat.iconTone}`}
                      aria-hidden="true"
                    >
                      <Icon />
                    </div>
                    <p className="landing-impact-value">
                      <AnimatedNumber
                        value={stat.value}
                        suffix={stat.suffix}
                        isActive={statsVisible}
                      />
                    </p>
                  </div>
                  <p className="landing-impact-label">{stat.label}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

function AnimatedNumber({ value, suffix = '', isActive }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const duration = 1800;
    const totalSteps = 60;
    const stepDuration = duration / totalSteps;
    const increment = value / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      const nextValue = Math.min(Math.floor(increment * step), value);
      setCount(nextValue);

      if (step >= totalSteps) {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isActive, value]);

  if (!isActive) {
    return `0${suffix}`;
  }

  return `${count.toLocaleString()}${suffix}`;
}

export default LandingPage;
