import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import {
  musicProfilePlacements,
  musicStreamingVerificationNotice,
  streamingPlatformVerifications,
} from '../data/musicStreamingVerificationServices';
import './ServicesPage.css';
import './MusicStreamingVerificationPage.css';

function MusicStreamingVerificationPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service, tier) => {
    const result = await addToCart({
      itemId: `music-streaming-${service.title}-${tier}-${Date.now()}`,
      title: service.title,
      price: service.price,
      description:
        tier === 'placement' ? 'Music profile placement' : 'Streaming platform verification',
      category: 'music-streaming-verification',
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
    <div className="services-page music-streaming-page">
      {showCartNotification && (
        <div className="cart-notification music-streaming-cart-notification">
          Item added to cart!
        </div>
      )}
      <Navbar onScrollToSection={scrollToSection} />
      <div className="page-header">
        <Button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </Button>
        <SectionHeader
          title="MUSIC ARTIST STREAMING PLATFORM PROFILE VERIFICATION"
          subtitle="Official verified artist profiles on every major streaming platform"
        />
      </div>

      <div className="container">
        <div className="music-streaming-intro">
          <p className="intro-text">
            Get the blue check and official artist status on Spotify, Apple Music, Boomplay,
            YouTube OAC, and more. We manage the full verification workflow so your music career
            looks credible everywhere fans discover you.
          </p>
        </div>

        <div className="music-streaming-tier">
          <h3 className="music-streaming-tier-title">Streaming Platform Verifications</h3>
          {renderServiceGrid(streamingPlatformVerifications, 'verification')}
        </div>

        <div className="music-streaming-tier">
          <h3 className="music-streaming-tier-title">Music Profile Placement</h3>
          {renderServiceGrid(musicProfilePlacements, 'placement')}
        </div>

        <div className="music-streaming-notice">
          <h3 className="music-streaming-notice-title">Important Notice</h3>
          <p className="music-streaming-notice-lead">{musicStreamingVerificationNotice.lead}</p>
          <p className="music-streaming-notice-body">{musicStreamingVerificationNotice.body}</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MusicStreamingVerificationPage;
