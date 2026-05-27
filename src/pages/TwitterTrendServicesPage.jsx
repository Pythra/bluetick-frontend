import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { twitterTrendNotice, twitterTrendPackages } from '../data/twitterTrendPackages';
import './PublicationServicesPage.css';
import './TwitterTrendServicesPage.css';

function TwitterTrendServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (pkg) => {
    const result = await addToCart({
      itemId: `twitter-trend-${pkg.id}-${Date.now()}`,
      title: pkg.title,
      price: pkg.price,
      description: `Twitter (X) Trend — ${pkg.delivery}`,
      category: 'twitter-trend',
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
    <div className="publication-page twitter-trend-page">
      {showCartNotification && (
        <div className="cart-notification">Item added to cart!</div>
      )}
      <Navbar onScrollToSection={scrollToSection} />

      <section className="twitter-trend-hero">
        <div className="twitter-trend-hero-inner">
          <p className="twitter-trend-eyebrow">BLUETICKGENG · X (Twitter)</p>
          <h1 className="twitter-trend-hero-title">Trend Package Services</h1>
          <p className="twitter-trend-hero-text">
            Professional trend campaigns built like premium PR packages — clear tiers, fast delivery,
            and measurable visibility on X.
          </p>
        </div>
      </section>

      <section className="publication-packages twitter-trend-packages-section">
        <div className="container">
          <SectionHeader
            title="CHOOSE YOUR TREND PACKAGE"
            subtitle="Select the visibility tier that matches your campaign goals"
          />
          <div className="packages-grid">
            {twitterTrendPackages.map((pkg) => (
              <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                {pkg.popular && <div className="popular-badge">Most Popular</div>}
                <div className="package-card-media twitter-trend-card-media">
                  <div className="twitter-trend-card-badge">X Trend</div>
                  <span className="package-category-pill">{pkg.delivery}</span>
                </div>
                <h3 className="package-title">{pkg.title}</h3>
                <div className="package-delivery">Delivery: {pkg.delivery}</div>
                <p className="package-description">{pkg.description}</p>
                <ul className="twitter-trend-package-list">
                  {pkg.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="twitter-trend-package-price">
                  <span className="price-amount">{formatPrice(pkg.price, '₦')}</span>
                </div>
                <Button onClick={() => handleAddToCart(pkg)} className="package-button">
                  Select Package
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="twitter-trend-notice-section">
        <div className="container">
          <div className="twitter-trend-notice">
            <h3>Important Notice</h3>
            <p className="twitter-trend-notice-lead">{twitterTrendNotice.lead}</p>
            <p>{twitterTrendNotice.body}</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default TwitterTrendServicesPage;
