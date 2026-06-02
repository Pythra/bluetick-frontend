import { CLIENT_BRANDS } from '../data/clientLogos';
import ClientLogo from './ClientLogo';
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
        <div className="clients-section-grid" role="list">
          {CLIENT_BRANDS.map((client) => (
            <div
              key={client.name}
              className="clients-section-item"
              role="listitem"
              title={client.name}
            >
              <ClientLogo client={client} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ClientsSection;
