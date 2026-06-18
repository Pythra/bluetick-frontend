import { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './TestimonialsSection.css';

function TestimonialCard({ name, role, content }) {
  return (
    <blockquote className="testimonial-card">
      <span className="testimonial-quote-mark" aria-hidden="true">&ldquo;</span>
      <p>{content}</p>
      <footer>
        <cite>{name}</cite>
        <span>{role}</span>
      </footer>
    </blockquote>
  );
}

function TestimonialsSection() {
  const section = usePartnerSectionContent('testimonials');
  const testimonials = section.items || [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (!mediaQuery.matches || !testimonials.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  if (!testimonials.length) {
    return null;
  }

  return (
    <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeader
          title={(
            <>
              <span id="testimonials-title" className="services-summary-title-black">{section.titleBlack}</span>
              <span className="services-summary-title-blue">{section.titleBlue}</span>
            </>
          )}
        />

        <div className="testimonials-desktop" aria-label="Client testimonials">
          {testimonials.map((item) => (
            <TestimonialCard key={`${item.name}-${item.content}`} {...item} />
          ))}
        </div>

        <div className="testimonials-mobile">
          <div
            className="testimonials-mobile-viewport"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className="testimonials-mobile-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((item) => (
                <div key={`${item.name}-mobile`} className="testimonials-mobile-slide">
                  <TestimonialCard {...item} />
                </div>
              ))}
            </div>
          </div>
          <div className="testimonials-dots" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((item, index) => (
              <button
                key={`${item.name}-dot`}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                className={`testimonials-dot ${index === activeIndex ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
