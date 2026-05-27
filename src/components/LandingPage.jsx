import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PublicationLogosCarousel from './PublicationLogosCarousel';
import heroVideo from '../assets/vid.mp4';
import clientsImage from '../assets/clients.jpg';
import newsImage from '../assets/news.jpg';
import onlineImage from '../assets/online.jpg';
import './LandingPage.css';
import './SectionHeader.css';

const impactStats = [
  { value: 100, suffix: '+', label: 'Different publication platforms', bg: newsImage },
  { value: 500, suffix: '+', label: 'Satisfied customers', bg: clientsImage },
  { value: 250, suffix: '+', label: 'High-impact launches delivered', bg: onlineImage },
];

function LandingPage({ onScrollToSection }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [impactCounts, setImpactCounts] = useState(impactStats.map(() => 0));

  const slides = [
    {
      title: 'We Build Apps & Websites',
      description: 'Modern web and mobile products built for speed, growth, and results.',
      buttonText: 'Get Started',
      buttonAction: () => onScrollToSection('website-services')
    },
    {
      title: 'We Handle Social Media Verification',
      description: 'Get trusted badges and strengthen your brand credibility online.',
      buttonText: 'Get Verified',
      buttonAction: () => onScrollToSection('verification-services')
    },
    {
      title: 'We Do Media Publications',
      description: 'Publish your story on major media platforms and reach real audiences.',
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

  useEffect(() => {
    const duration = 900; // fast count-up
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out

      setImpactCounts(
        impactStats.map((stat) => Math.floor(stat.value * eased))
      );

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setImpactCounts(impactStats.map((stat) => stat.value));
      }
    };

    requestAnimationFrame(step);
  }, []);

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
      </div>

      <div className="home-impact-section">
        <div className="home-impact-inner">
          <div className="impact-text">
            <div className="impact-logos impact-logos--inline">
              <PublicationLogosCarousel
                title=""
                className="impact-logos-carousel"
                includePlatformBadges
              />
            </div>
            <h2 className="section-title impact-section-title">
              <span className="services-summary-title-black">Tell your </span>
              <span className="impact-title-story-to-the">
                <span className="services-summary-title-black">Story to the</span>
              </span>{' '}
              <span className="impact-title-worldline">
                <span className="impact-title-world-blue">WORLD</span>
              </span>
            </h2>
            <p className="services-summary-intro">
              We help brands, creators, and businesses grow through website development,
              mobile app solutions, social media verification, and strategic media visibility.
            </p>
            <div className="impact-stats-grid">
              {impactStats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="impact-stat-card"
                  style={{
                    backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.78), rgba(15, 23, 42, 0.7)), url(${stat.bg})`,
                  }}
                >
                  <div className="impact-stat-number">
                    {impactCounts[index].toLocaleString()}
                    {stat.suffix}
                  </div>
                  <div className="impact-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPage;
