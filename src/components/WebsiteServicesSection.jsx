import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import './WebsiteServicesSection.css';

const websiteServices = [
  { title: 'Basic Informational Website', price: '$350' },
  { title: 'Standard Website', price: '$1,000' },
  { title: 'Custom Web Applications', price: '$2,500' },
];

function WebsiteServicesSection() {
  return (
    <section id="website-services" className="website-services-section">
      <div className="container">
        <SectionHeader
          title="WEBSITE DEVELOPMENT SERVICES"
          subtitle="Website Types & Pricing"
        />
        <div className="services-grid">
          {websiteServices.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              price={service.price}
            />
          ))}
        </div>
        <div className="startup-consultation">
          <h3 className="consultation-title">Startup Consultation</h3>
          <p className="consultation-description">
            Starting a new business? We provide expert guidance to help you navigate the digital landscape. 
            Our startup consultation services offer strategic advice on web presence, app development, and 
            digital marketing to give your business the best foundation for success. Let us help you make 
            informed decisions and build a strong digital presence from day one.
          </p>
        </div>
      </div>
    </section>
  );
}

export default WebsiteServicesSection;






