import { useEffect, useState } from 'react';
import { heroSlides } from './useLandingHero';

function TemplateServiceTicker({ mediaKicker, className = '' }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((previous) => (previous + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[activeSlide];

  return (
    <div className={`tpl-service-ticker ${className}`.trim()} aria-live="polite">
      <p className="tpl-service-ticker-kicker">{mediaKicker}</p>
      <p className="tpl-service-ticker-title">{slide.title}</p>
      <p className="tpl-service-ticker-desc">{slide.description}</p>
    </div>
  );
}

export default TemplateServiceTicker;
