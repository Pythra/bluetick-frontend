import clientsImage from '../assets/ourclients.JPEG';
import './ClientsSection.css';

function ClientsSection({ className = '' }) {
  return (
    <section className={`clients-section ${className}`.trim()} aria-label="Our clients">
      <div className="clients-section-inner">
        <div className="clients-section-visual">
          <img
            src={clientsImage}
            alt="Some of our clients"
            className="clients-section-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}

export default ClientsSection;
