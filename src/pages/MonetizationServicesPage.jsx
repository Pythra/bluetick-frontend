import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import {
  monetizationImportantNotice,
  monetizationPackages,
  monetizationSetupServices,
} from '../data/socialMonetizationServices';
import './ServicesPage.css';
import './MonetizationServicesPage.css';

function MonetizationServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service, tier) => {
    const result = await addToCart({
      itemId: `${service.title}-${tier}-${Date.now()}`,
      title: service.title,
      price: service.price,
      description: tier === 'setup' ? 'Monetization setup service' : 'Full monetization package',
      category: 'monetization',
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

  const renderServiceGrid = (services, tier) => (
    <div className="services-grid">
      {services.map((service) => (
        <div key={service.title} className="service-card-detailed">
          <h3 className="service-card-title">{service.title}</h3>
          <div className="service-card-price">
            <span className="price-amount">{formatPrice(service.price, '₦')}</span>
          </div>
          <Button onClick={() => handleAddToCart(service, tier)} className="order-button">
            Add to Cart
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="services-page monetization-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="page-header">
        <Button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </Button>
        <SectionHeader
          title="SOCIAL MEDIA MONETIZATION SERVICES"
          subtitle="Turn your audience into revenue across every major platform"
        />
      </div>

      <div className="container">
        <div className="monetization-intro">
          <p className="intro-text">
            From full platform monetization to creator tools and payout setup, we manage eligibility,
            growth, and approval end to end so you can focus on creating content.
          </p>
        </div>

        <div className="monetization-tier">
          <h3 className="monetization-tier-title">Platform Monetization Packages</h3>
          {renderServiceGrid(monetizationPackages, 'package')}
        </div>

        <div className="monetization-tier">
          <h3 className="monetization-tier-title">Creator Revenue Setup Services</h3>
          {renderServiceGrid(monetizationSetupServices, 'setup')}
        </div>

        <div className="monetization-notice">
          <h3 className="monetization-notice-title">Important Notice</h3>
          <p className="monetization-notice-lead">{monetizationImportantNotice.lead}</p>
          <p className="monetization-notice-body">{monetizationImportantNotice.body}</p>
        </div>
      </div>

      {showCartNotification && (
        <div className="cart-notification monetization-cart-notification">
          Item added to cart!
        </div>
      )}
      <Footer />
    </div>
  );
}

export default MonetizationServicesPage;
