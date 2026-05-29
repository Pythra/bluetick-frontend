import { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import './TestimonialsSection.css';

const testimonials = [
  {
    name: 'Michael Adebayo',
    role: 'Founder, FinTech startup',
    content: 'Our release went live on Punch and Vanguard the next day. Simple checkout and no back-and-forth.',
  },
  {
    name: 'Chiamaka Okafor',
    role: 'Marketing lead',
    content: 'They sent every publication link in one report. Made it easy to share proof with our client.',
  },
  {
    name: 'David Thompson',
    role: 'Brand manager',
    content: 'Second campaign with them. Same quick turnaround and the outlets matched what we picked.',
  },
  {
    name: 'Amina Hassan',
    role: 'PR consultant',
    content: 'Responsive on WhatsApp and clear about timelines. Placements landed as promised.',
  },
];

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    if (!mediaQuery.matches) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="testimonials-section" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeader
          title={(
            <>
              <span id="testimonials-title" className="services-summary-title-black">HEAR FROM OUR</span>
              <span className="services-summary-title-blue">CLIENTS</span>
            </>
          )}
        />

        <div className="testimonials-desktop" aria-label="Client testimonials">
          {testimonials.map((item) => (
            <TestimonialCard key={item.name} {...item} />
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
                <div key={item.name} className="testimonials-mobile-slide">
                  <TestimonialCard {...item} />
                </div>
              ))}
            </div>
          </div>
          <div className="testimonials-dots" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                className={`testimonials-dot ${index === activeIndex ? 'is-active' : ''}`}
                aria-selected={index === activeIndex}
                aria-label={`Testimonial ${index + 1}: ${item.name}`}
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
