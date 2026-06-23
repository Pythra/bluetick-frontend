import { useNavigate } from 'react-router-dom';
import { IoCodeSlashOutline, IoGlobeOutline, IoRocketOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { websiteDevelopmentServices } from '../data/developmentServices';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import websiteHeroImage from '../assets/tech.jpg';
import { usePartnerAsset } from '../utils/partnerMedia';
import PartnerMediaFrame from '../components/PartnerMediaFrame';
import { companyWhatsappSessionUrl } from '../config/companyContact';
import { usePartnerText } from '../utils/partnerText';
import './ServiceDetailPage.css';

const websiteDescriptions = {
  'Basic Informational Website':
    'A clean, professional site for your brand with essential pages, contact flows, and mobile-friendly layouts.',
  'Standard Website':
    'Multi-page websites with stronger content structure, SEO foundations, and room to grow your online presence.',
  'Custom Web Applications':
    'Tailored web apps with dashboards, user accounts, integrations, and workflows built around your business.',
};

const websiteIcons = {
  'Basic Informational Website': IoGlobeOutline,
  'Standard Website': IoCodeSlashOutline,
  'Custom Web Applications': IoRocketOutline,
};

const websiteServices = websiteDevelopmentServices.map((service) => ({
  ...service,
  icon: websiteIcons[service.title],
  description: websiteDescriptions[service.title] || '',
}));

const startupConsultation = {
  title: 'Startup Consultation',
  meta: 'Guidance & strategy',
  description:
    'Starting a business is a bold step — we help you shape your web presence, product direction, and launch plan. Bluetickgeng Development partners with founders to turn vision into a strong digital foundation for long-term growth.',
  icon: IoRocketOutline,
};

function WebsiteServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { t } = usePartnerText();
  const { isPartnerSite } = usePartnerBranding();
  const { src: heroImageSrc } = usePartnerAsset('websiteServicesImage', websiteHeroImage);

  const handleAddToCart = (service) =>
    addToCart(
      buildPartnerCartItem(service, {
        category: 'website',
        price: service.price,
      })
    );

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <header className="service-detail-hero">
          <PartnerMediaFrame
            src={heroImageSrc}
            alt=""
            className="service-detail-hero-image-frame"
          />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">WEBSITE DEVELOPMENT</span>
              <span className="services-summary-title-blue">SERVICES</span>
            </h1>
            <p className="service-detail-lead">
              Responsive, SEO-friendly websites that are easy to manage — pick a package and add it to your cart.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <div className="service-detail-grid">
            {websiteServices.map((service) => (
              <PartnerPricedServiceCard
                key={service.packageId || service.title}
                service={service}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          <ServiceDetailCard
            title={startupConsultation.title}
            meta={startupConsultation.meta}
            description={t(startupConsultation.description)}
            price="On request"
            icon={startupConsultation.icon}
            feature
            featureCtaHref={companyWhatsappSessionUrl}
            featureCtaLabel="Book a session"
          />
        </main>
      </div>

      {!isPartnerSite ? <ClientsSection /> : null}
      <Footer />
    </div>
  );
}

export default WebsiteServicesPage;
