import { useEffect, useMemo, useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './TestimonialsSection.css';

const READ_MORE_LIMIT = 140;

function GoogleMark() {
  return (
    <svg className="testimonial-google-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <span className="testimonial-verified-badge" aria-label="Verified review">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="8" fill="#1a73e8" />
        <path d="M6.8 10.9 4.7 8.8l.9-.9 1.2 1.2 3.5-3.5.9.9-4.4 4.4z" fill="#fff" />
      </svg>
    </span>
  );
}

function StarRating({ rating = 5 }) {
  return (
    <div className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" aria-hidden="true">
          <path
            d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.9l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.5z"
            fill={index < rating ? '#fbbc04' : '#e5e7eb'}
          />
        </svg>
      ))}
    </div>
  );
}

function getAvatarUrl(item) {
  if (item.avatarUrl) return item.avatarUrl;
  const name = encodeURIComponent(item.name || 'Client');
  return `https://ui-avatars.com/api/?name=${name}&background=e2e8f0&color=334155&size=96`;
}

function TestimonialGoogleCard({ name, content, timeAgo, role, avatarUrl, rating = 5 }) {
  const [expanded, setExpanded] = useState(false);
  const displayTime = timeAgo || role || 'Recently';
  const isLong = content.length > READ_MORE_LIMIT;
  const visibleText = expanded || !isLong ? content : `${content.slice(0, READ_MORE_LIMIT).trim()}…`;

  return (
    <article className="testimonial-google-card">
      <header className="testimonial-google-card-head">
        <div className="testimonial-google-user">
          <img src={getAvatarUrl({ name, avatarUrl })} alt="" className="testimonial-google-avatar" />
          <div className="testimonial-google-user-meta">
            <p className="testimonial-google-name">{name}</p>
            <p className="testimonial-google-time">{displayTime}</p>
          </div>
        </div>
        <GoogleMark />
      </header>

      <div className="testimonial-google-rating-row">
        <StarRating rating={rating} />
        <VerifiedBadge />
      </div>

      <p className="testimonial-google-text">
        {visibleText}
        {isLong && !expanded ? (
          <button type="button" className="testimonial-read-more" onClick={() => setExpanded(true)}>
            Read more
          </button>
        ) : null}
      </p>
    </article>
  );
}

function useCardsPerView() {
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setCardsPerView(1);
      else if (width < 1024) setCardsPerView(2);
      else setCardsPerView(3);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return cardsPerView;
}

function TestimonialsSection() {
  const section = usePartnerSectionContent('testimonials');
  const testimonials = section.items || [];
  const [activePage, setActivePage] = useState(0);
  const cardsPerView = useCardsPerView();

  const heading = section.title || section.titleBlack || 'Testimonials';
  const subtitle = section.subtitle || 'Real Clients. Real Results. Google Verified.';
  const sideTagline = section.sideTagline || 'Hear It Directly From Our Clients';

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(testimonials.length / cardsPerView)),
    [testimonials.length, cardsPerView]
  );

  useEffect(() => {
    setActivePage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  useEffect(() => {
    if (testimonials.length <= cardsPerView) return undefined;

    const timer = window.setInterval(() => {
      setActivePage((current) => (current + 1) % pageCount);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [testimonials.length, cardsPerView, pageCount]);

  if (!testimonials.length) {
    return null;
  }

  const goPrev = () => setActivePage((current) => (current - 1 + pageCount) % pageCount);
  const goNext = () => setActivePage((current) => (current + 1) % pageCount);
  const offsetPercent = (activePage * cardsPerView * 100) / testimonials.length;

  return (
    <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="testimonials-shell">
        <header className="testimonials-header">
          <h2 id="testimonials-title" className="testimonials-heading">
            {heading}
          </h2>
          <p className="testimonials-subheading">{subtitle}</p>
        </header>

        <div className="testimonials-carousel-wrap">
          <button
            type="button"
            className="testimonials-nav testimonials-nav--prev"
            onClick={goPrev}
            aria-label="Previous testimonials"
          >
            <IoChevronBack />
          </button>

          <div className="testimonials-carousel" aria-live="polite">
            <div
              className="testimonials-carousel-track"
              style={{
                width: `${(testimonials.length / cardsPerView) * 100}%`,
                transform: `translateX(-${offsetPercent}%)`,
              }}
            >
              {testimonials.map((item) => (
                <div
                  key={`${item.name}-${item.content}`}
                  className="testimonials-carousel-slide"
                  style={{ flex: `0 0 ${100 / testimonials.length}%` }}
                >
                  <TestimonialGoogleCard {...item} />
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="testimonials-nav testimonials-nav--next"
            onClick={goNext}
            aria-label="Next testimonials"
          >
            <IoChevronForward />
          </button>
        </div>

        <p className="testimonials-side-tagline testimonials-side-tagline--desktop" aria-hidden="true">
          {sideTagline}
        </p>
        <p className="testimonials-side-tagline testimonials-side-tagline--mobile">{sideTagline}</p>
      </div>
    </section>
  );
}

export default TestimonialsSection;
