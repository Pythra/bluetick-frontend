import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoNewspaperOutline,
  IoPeopleOutline,
  IoRocketOutline,
} from 'react-icons/io5';
import Navbar from './Navbar';
import { useAuth } from '../contexts/AuthContext';
import PublicationLogosCarousel from './PublicationLogosCarousel';
import heroVideo from '../assets/vid.mp4';
import { companyWhatsappDemoUrl } from '../config/companyContact';
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
  const [activeSlide, setActiveSlide] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
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

  return (
    <section id="landing" className="landing-page">
      <Navbar onScrollToSection={onScrollToSection} />

      <div className="landing-hero-shell">
        <div className="landing-hero-grid">
          <div className="landing-copy">
            <p className="landing-kicker">Digital Growth Services for Brands</p>
            <h1 className="landing-title">
              Build, Verify, Monetize, and Feature Your Brand Across Top Platforms
            </h1>
            <p className="landing-description">
              From websites and mobile apps to social verification, monetization, PR distribution,
              Instagram promotions, and Wikipedia pages, we deliver end-to-end services designed
              for business growth and credibility.
            </p>

            <div
              className={`landing-actions${isAuthenticated ? ' landing-actions--auth' : ''}`}
            >
              <button
                type="button"
                className="landing-btn landing-btn-primary"
                onClick={() => navigate('/services/publications')}
              >
                Place Order
              </button>
              {!isAuthenticated && (
                <button
                  type="button"
                  className="landing-btn landing-btn-secondary"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </button>
              )}
              <a
                href={companyWhatsappDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="landing-btn landing-btn-tertiary"
              >
                Book a Demo
              </a>
            </div>
          </div>

          <div className="landing-media-card">
            <video
              className="landing-media-video"
              src={heroVideo}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="landing-media-overlay"></div>
            <div className="landing-media-content">
              <div className="landing-media-carousel" aria-live="polite">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.title}
                    className={`landing-media-slide ${index === activeSlide ? 'active' : ''}`}
                    aria-hidden={index !== activeSlide}
                  >
                    <p className="landing-media-kicker">Bluetick Services</p>
                    <h2>{slide.title}</h2>
                    <p className="landing-media-description">{slide.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="landing-logos-strip" aria-label="Featured media logos">
          <PublicationLogosCarousel
            title=""
            className="impact-logos-carousel landing-logos-carousel"
            includePlatformBadges
          />
        </div>

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
