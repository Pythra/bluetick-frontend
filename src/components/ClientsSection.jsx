import clientsImage from '../assets/clients.png';
import './ClientsSection.css';

function ClientsSection({ className = '', title = 'Some of our Clients' }) {
  return (
    <section
      className={`clients-section ${className}`.trim()}
      aria-labelledby="clients-section-title"
    >
      <div className="clients-section-inner">
        <h2 id="clients-section-title" className="clients-section-title">
          {title}
        </h2>
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
