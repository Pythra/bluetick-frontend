import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCodeSlashOutline, IoGlobeOutline, IoRocketOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import websiteHeroImage from '../assets/tech.jpg';
import { companyWhatsappSessionUrl } from '../config/companyContact';
import './ServiceDetailPage.css';

const websiteServices = [
  {
    title: 'Basic Informational Website',
    price: 525000,
    icon: IoGlobeOutline,
    description:
      'A clean, professional site for your brand with essential pages, contact flows, and mobile-friendly layouts.',
  },
  {
    title: 'Standard Website',
    price: 1500000,
    icon: IoCodeSlashOutline,
    description:
      'Multi-page websites with stronger content structure, SEO foundations, and room to grow your online presence.',
  },
  {
    title: 'Custom Web Applications',
    price: 3750000,
    icon: IoRocketOutline,
    description:
      'Tailored web apps with dashboards, user accounts, integrations, and workflows built around your business.',
  },
];

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
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service) => {
    const result = await addToCart({
      itemId: `${service.title}-${Date.now()}`,
      title: service.title,
      price: service.price,
      description: '',
      category: 'website',
      quantity: 1,
    });

    if (result.success) {
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
    }
  };

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
          <img src={websiteHeroImage} alt="" className="service-detail-hero-image" />
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
              <ServiceDetailCard
                key={service.title}
                title={service.title}
                meta="Website package"
                description={service.description}
                price={formatPrice(service.price, '₦')}
                icon={service.icon}
                onAddToCart={() => handleAddToCart(service)}
              />
            ))}
          </div>

          <ServiceDetailCard
            title={startupConsultation.title}
            meta={startupConsultation.meta}
            description={startupConsultation.description}
            price="On request"
            icon={startupConsultation.icon}
            feature
            featureCtaHref={companyWhatsappSessionUrl}
            featureCtaLabel="Book a session"
          />
        </main>
      </div>

      {showCartNotification && (
        <div className="service-detail-cart-notification" role="status">
          Item added to cart!
        </div>
      )}

      <Footer />
    </div>
  );
}

export default WebsiteServicesPage;
