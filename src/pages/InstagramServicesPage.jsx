import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogoInstagram } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import instagramHeroImage from '../assets/online.jpg';
import {
  getInstagramCartTitle,
  instagramBlogPromotions,
  instagramWizkidnewsPackages,
} from '../data/instagramPromotionServices';
import './ServiceDetailPage.css';

const blogPromotionDescription =
  'Feature your brand, music, or content on a top Nigerian Instagram blog and reach engaged entertainment audiences.';

const wizkidDescription =
  'Premium placement on Wizkidnews — choose post duration or collaboration packages for sustained visibility.';

function InstagramServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (item, section) => {
    const result = await addToCart({
      itemId: `instagram-${item.id}-${Date.now()}`,
      title: getInstagramCartTitle(item),
      price: item.price,
      description: section,
      category: 'instagram',
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

  const renderCards = (items, sectionLabel, description) =>
    items.map((item) => (
      <ServiceDetailCard
        key={item.id}
        title={item.title}
        meta={item.note ? `${sectionLabel} · ${item.note}` : sectionLabel}
        description={description}
        price={formatPrice(item.price, '₦')}
        pricePrefix=""
        icon={IoLogoInstagram}
        onAddToCart={() => handleAddToCart(item, sectionLabel)}
      />
    ));

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <header className="service-detail-hero">
          <img src={instagramHeroImage} alt="" className="service-detail-hero-image" />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">INSTAGRAM BLOG</span>
              <span className="services-summary-title-blue">PROMOTION</span>
            </h1>
            <p className="service-detail-lead">
              Get your content featured on Nigeria&apos;s most popular Instagram pages — from
              entertainment blogs to celebrity news platforms with millions of followers.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Instagram Blogs Promotions</h2>
            <p className="service-detail-section-lead">
              Per-page pricing for top Instagram blogs and entertainment accounts.
            </p>
            <div className="service-detail-grid">
              {renderCards(instagramBlogPromotions, 'Instagram blog', blogPromotionDescription)}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Wizkidnews</h2>
            <p className="service-detail-section-lead">
              Dedicated packages for posts and collaborations on Wizkidnews.
            </p>
            <div className="service-detail-grid">
              {renderCards(instagramWizkidnewsPackages, 'Wizkidnews', wizkidDescription)}
            </div>
          </section>
        </main>
      </div>

      {showCartNotification && (
        <div className="service-detail-cart-notification" role="status">
          Item added to cart!
        </div>
      )}

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default InstagramServicesPage;
