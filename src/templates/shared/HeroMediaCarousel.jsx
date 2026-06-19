import { heroSlides } from './useLandingHero';

function HeroMediaCarousel({ activeSlide, mediaKicker, className = 'landing-media-carousel' }) {
  return (
    <div className={className} aria-live="polite">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={`landing-media-slide ${index === activeSlide ? 'active' : ''}`}
          aria-hidden={index !== activeSlide}
        >
          <p className="landing-media-kicker">{mediaKicker}</p>
          <h2>{slide.title}</h2>
          <p className="landing-media-description">{slide.description}</p>
        </div>
      ))}
    </div>
  );
}

export default HeroMediaCarousel;
