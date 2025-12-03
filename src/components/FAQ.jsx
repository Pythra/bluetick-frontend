import { useState } from 'react';
import '../styles/FAQ.css';

// FAQ Item Component
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

// FAQ Component
function FAQ() {
  // FAQ Data
  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment gateway."
    },
    {
      question: "How long does it take to complete a project?",
      answer: "Project timelines vary depending on the scope and complexity. A standard website typically takes 4-6 weeks, while mobile apps can take 8-12 weeks. We'll provide a detailed timeline after discussing your specific requirements."
    },
    {
      question: "Do you offer maintenance services?",
      answer: "Yes, we offer various maintenance packages to keep your website or application running smoothly. Our maintenance services include security updates, performance optimization, and content updates."
    },
    {
      question: "Can you help with domain and hosting setup?",
      answer: "Absolutely! We can assist you with domain registration, hosting setup, and email configuration. We can recommend reliable hosting providers based on your specific needs."
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee on our services. If you're not satisfied with our work within the first 30 days, we'll issue a full refund, no questions asked."
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes, we offer various support packages to meet your needs. Our support includes bug fixes, updates, and technical assistance. Contact us to learn more about our support plans."
    }
  ];

  return (
    <section className="faq-section">
      <div className="container">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-subtitle">Find answers to common questions about our services and processes</p>
        
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <FAQItem 
              key={index}
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
