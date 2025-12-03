import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import './VerificationServicesPage.css';

// Base prices without formatting
const nonNotablePrices = [
  { title: 'Instagram Verification', price: 800000 },
  { title: 'Facebook Verification', price: 850000 },
  { title: 'TikTok Verification', price: 900000 },
  { title: 'YouTube Verification', price: 950000 },
  { title: 'Telegram Verification', price: 150000 },
  { title: 'WhatsApp Business Verification', price: 400000 },
  { title: 'WhatsApp Channel Verification', price: 300000 },
];

const notablePrices = [
  { title: 'Instagram Verification', price: 200000 },
  { title: 'Facebook Verification', price: 350000 },
  { title: 'TikTok Verification', price: 250000 },
  { title: 'YouTube Verification', price: 400000 },
  { title: 'Telegram Verification', price: 100000 },
  { title: 'WhatsApp Business Verification', price: 180000 },
  { title: 'WhatsApp Channel Verification', price: 150000 },
];

function VerificationServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service, tier) => {
    const result = await addToCart({
      itemId: `${service.title}-${tier}-${Date.now()}`,
      title: `${service.title} (${tier})`,
      price: service.price,
      description: tier === 'notable' ? 'Notable Account' : 'Non-Notable Account',
      category: 'verification',
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
    <div className="verification-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="page-header">
        <Button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </Button>
        <SectionHeader
          title="SOCIAL MEDIA VERIFICATION RATE CARD"
          subtitle="Establish your online presence with credibility and authenticity"
        />
      </div>
      <div className="container">
        <div className="verification-intro">
          <p className="intro-text">
            Whether you're a public figure, entrepreneur, business owner, or influencer, we help you secure your 
            verification badge seamlessly. Our services cater to both notable individuals (with existing online media 
            coverage) and non-notable individuals (without prior publications).
          </p>
        </div>

        <div className="pricing-tiers">
          <div className="pricing-tier">
            <div className="tier-header">
              <h3 className="tier-title">VERIFICATION PRICE LIST FOR NON-NOTABLE INDIVIDUALS</h3>
              <p className="tier-subtitle">(WITHOUT EXISTING PUBLICATIONS)</p>
              <div className="tier-note">
                <span className="note-icon">📰</span>
                Includes 5 online newspaper publications to establish notability
              </div>
              <p className="permanent-note">Permanent verification (not a Meta subscription)</p>
            </div>
            <div className="services-grid">
              {nonNotablePrices.map((service, index) => (
                <div key={index} className="service-card-detailed">
                  <h3 className="service-card-title">{service.title}</h3>
                  <div className="service-card-price">
                    <span className="price-amount">{formatPrice(service.price)}</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(service, 'non-notable')} 
                    className="order-button"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pricing-tier">
            <div className="tier-header">
              <h3 className="tier-title">VERIFICATION PRICE LIST FOR NOTABLE INDIVIDUALS</h3>
              <p className="tier-subtitle">(WITH EXISTING PUBLICATIONS)</p>
              <p className="permanent-note">Permanent verification (not a Meta subscription)</p>
            </div>
            <div className="services-grid">
              {notablePrices.map((service, index) => (
                <div key={index} className="service-card-detailed">
                  <h3 className="service-card-title">{service.title}</h3>
                  <div className="service-card-price">
                    <span className="price-amount">{formatPrice(service.price)}</span>
                  </div>
                  <Button 
                    onClick={() => handleAddToCart(service, 'notable')} 
                    className="order-button"
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="meta-subscription">
          <h3 className="meta-title">META SUBSCRIPTION SERVICES</h3>
          <div className="meta-content">
            <div className="meta-pricing">
              <p className="meta-description">
                Includes monthly subscription and a valid ID for verification purposes only
              </p>
              <div className="meta-price-card">
                <p className="meta-platforms">Facebook, Instagram, X (Twitter), WhatsApp Business</p>
                <p className="meta-price">{formatPrice(100000)}/month (Each)</p>
              </div>
              <Button 
                onClick={() => handleAddToCart({ title: 'Meta Subscription', price: '100000/month' }, 'meta')} 
                className="order-button"
              >
                Order Meta Subscription
              </Button>
            </div>
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

export default VerificationServicesPage;

