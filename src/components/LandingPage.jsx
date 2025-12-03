import { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Navbar from './Navbar';
import PublicationLogosCarousel from './PublicationLogosCarousel';
import {
  IoNewspaperOutline,
  IoEyeOutline,
  IoPeopleOutline,
  IoTimeOutline,
} from 'react-icons/io5';
import heroVideo from '../assets/vid.mp4';
import './LandingPage.css';

const HERO_STATS = [
  {
    label: 'News Platforms',
    value: 100,
    suffix: '+',
    duration: 2200,
    icon: IoNewspaperOutline,
  },
  {
    label: 'Monthly Readers',
    value: 10,
    suffix: 'M',
    duration: 2000,
    icon: IoEyeOutline,
  },
  {
    label: 'Satisfied Clients',
    value: 1000,
    suffix: '+',
    duration: 1800,
    icon: IoPeopleOutline,
  },
  {
    label: 'Average Delivery',
    value: 24,
    suffix: 'hrs',
    duration: 1600,
    icon: IoTimeOutline,
  },
];

function LandingPage({ onScrollToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [statValues, setStatValues] = useState(HERO_STATS.map(() => 0));
  const statsSectionRef = useRef(null);
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);

  const slides = [
    {
      title: 'Websites & Apps',
      description: 'Transform your business with stunning websites and powerful mobile applications. From concept to launch, we deliver solutions that drive growth.',
      buttonText: 'Get Started',
      buttonAction: () => onScrollToSection('website-services')
    },
    {
      title: 'Social Media Verification',
      description: 'Get verified on major platforms and boost your digital credibility. Establish your online presence with permanent verification badges.',
      buttonText: 'Get Verified',
      buttonAction: () => onScrollToSection('verification-services')
    },
    {
      title: 'Digital Publications',
      description: 'Amplify your message with publications on major news platforms and international sites. Reach global audiences with our comprehensive packages.',
      buttonText: 'Get Published',
      buttonAction: () => onScrollToSection('publication-services')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasAnimatedStats(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    if (statsSectionRef.current) {
      observer.observe(statsSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasAnimatedStats) return;

    let animationFrame;
    const start = performance.now();
    const maxDuration = Math.max(...HERO_STATS.map((stat) => stat.duration));

    const animate = (time) => {
      const elapsed = time - start;
      setStatValues((prevValues) =>
        HERO_STATS.map((stat, index) => {
          if (prevValues[index] === stat.value) {
            return stat.value;
          }

          const progress = Math.min(elapsed / stat.duration, 1);
          return Math.floor(stat.value * progress);
        })
      );

      if (elapsed < maxDuration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [hasAnimatedStats]);

  const formatStatValue = (value, stat) => {
    const safeValue = Number.isFinite(value) ? value : 0;

    if (stat.suffix === 'M') {
      return `${safeValue}${stat.suffix}`;
    }

    if (stat.suffix === 'hrs') {
      return `${safeValue}${stat.suffix}`;
    }

    if (stat.suffix === '+') {
      return `${safeValue.toLocaleString()}${stat.suffix}`;
    }

    return safeValue.toLocaleString();
  };

  return (
    <section id="landing" className="landing-page">
      <Navbar onScrollToSection={onScrollToSection} />
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <video
            className="carousel-video"
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h2 className="carousel-title">{slide.title}</h2>
                <p className="carousel-description">{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="home-impact-section" ref={statsSectionRef}>
        <div className="home-impact-inner">
          <div className="impact-text">
            <h3 className="impact-title">Global PR campaigns that actually scale</h3>
            <div className="impact-logos impact-logos--inline">
              <PublicationLogosCarousel title="" className="impact-logos-carousel" />
            </div>
            <p className="impact-subtitle">
              From founders and creators to the biggest African labels, Bluetickgeng keeps
              stories in front of the world's most engaged news audiences.
            </p>
          </div>

          <div className="impact-stats-grid">
            {HERO_STATS.map((stat, index) => {
              const Icon = stat.icon;
              const displayValue = formatStatValue(statValues[index], stat);

              return (
                <div key={stat.label} className="impact-stat-card">
                  <div className="impact-stat-icon">
                    <Icon />
                  </div>
                  <div className="impact-stat-number">{displayValue}</div>
                  <div className="impact-stat-label">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
