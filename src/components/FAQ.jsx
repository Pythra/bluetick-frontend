import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import '../styles/FAQ.css';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className={`faq-question ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {question}
        <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="faq-answer">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const section = usePartnerSectionContent('faq');
  const faqs = section.items || [];

  if (!faqs.length) {
    return null;
  }

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <SectionHeader
          title={(
            <>
              <span className="services-summary-title-black">{section.titleBlack}</span>
              <span className="services-summary-title-blue">{section.titleBlue}</span>
            </>
          )}
        />

        <div className="faq-container">
          {faqs.map((faq) => (
            <FAQItem
              key={`${faq.question}-${faq.answer}`}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
