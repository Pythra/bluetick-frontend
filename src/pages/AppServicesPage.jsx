import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import './ServicesPage.css';

const appServices = [
  { title: 'Health & Fitness Apps', price: 3300000 },
  { title: 'E-commerce Apps', price: 2250000 },
  { title: 'Fintech & Banking Apps', price: 9000000 },
  { title: 'Social Media Apps', price: 5250000 },
  { title: 'Travel & Booking Apps', price: 3750000 },
  { title: 'Productivity Apps', price: 6000000 },
  { title: 'Streaming & Entertainment Apps', price: 5700000 },
  { title: 'Gaming Apps', price: 7500000 },
  { title: 'Bill Payment Apps', price: 4800000 },
  { title: 'Cryptocurrency Apps', price: 3450000 },
];

const customAppInfo = {
  title: 'Custom App Development',
  description: 'For clients with new app ideas, we offer tailored solutions. Schedule a meeting with us to discuss your unique needs.',
  startingPrice: 3750000
};

function AppServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service) => {
    const result = await addToCart({
      itemId: `${service.title}-${Date.now()}`,
      title: service.title,
      price: service.price,
      description: '',
      category: 'app',
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
          title="APP DEVELOPMENT SERVICES"
          subtitle="Popular App Types & Pricing"
        />
      </div>
      <div className="container">
        <div className="services-grid">
          {appServices.map((service, index) => (
            <div key={index} className="service-card-detailed">
              <h3 className="service-card-title">{service.title}</h3>
              <div className="service-card-price">
                Starting from <span className="price-amount">{formatPrice(service.price, '₦')}</span>
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
        <div className="custom-app-section">
          <h3 className="custom-app-title">{customAppInfo.title}</h3>
          <p className="custom-app-description">{customAppInfo.description}</p>
          <div className="custom-app-price">
            Starting from <span className="price-amount">{formatPrice(customAppInfo.startingPrice, '₦')}</span>
          </div>
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

export default AppServicesPage;

