import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import './ServicesPage.css';

const websiteServices = [
  { title: 'Basic Informational Website', price: 350 },
  { title: 'Standard Website', price: 1000 },
  { title: 'Custom Web Applications', price: 2500 },
];

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
    <div className="services-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="page-header">
        <Button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </Button>
        <SectionHeader
          title="WEBSITE DEVELOPMENT SERVICES"
          subtitle="Website Types & Pricing"
        />
      </div>
      <div className="container">
        <div className="services-grid">
          {websiteServices.map((service, index) => (
            <div key={index} className="service-card-detailed">
              <h3 className="service-card-title">{service.title}</h3>
              <div className="service-card-price">
                Starting from <span className="price-amount">{formatPrice(service.price, '$')}</span>
              </div>
              <Button 
                onClick={() => handleAddToCart(service)} 
                className="order-button"
              >
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
        <div className="website-description">
          <p>Our websites are designed to be responsive, SEO-friendly, and easy to manage.</p>
        </div>
        <div className="startup-consultation">
          <h3 className="consultation-title">Startup Consultation</h3>
          <p className="consultation-description">
            Starting a business is a <strong>BOLD STEP</strong>, but with our expert guidance, you don't have to tackle this alone - 
            let's team up and make it easier. At <strong>BLUETICKGENG DEVELOPMENT</strong>, we're your partners in bringing your vision to life.
          </p>
          <p className="consultation-description">
            We will provide the tools and guidance you need to bring your startup dreams to life. Let's work together 
            to build a strong foundation for your success - because when you succeed, we succeed.
          </p>
        </div>
      </div>
      {showCartNotification && (
        <div className="cart-notification" style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease'
        }}>
          Item added to cart!
        </div>
      )}
      <Footer />
    </div>
  );
}

export default WebsiteServicesPage;

