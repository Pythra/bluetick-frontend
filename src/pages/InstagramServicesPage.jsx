import { useNavigate } from 'react-router-dom';
import { IoLogoInstagram } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
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
  const { format } = useCurrency();

  const handleAddToCart = (item, section) =>
    addToCart(
      buildPartnerCartItem(item, {
        title: getInstagramCartTitle(item),
        description: section,
        category: 'instagram',
        price: item.price,
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

  const renderCards = (items, sectionLabel, description) =>
    items.map((item) => (
      <PartnerPricedServiceCard
        key={item.packageId || item.id}
        service={item}
        title={item.title}
        description={description}
        pricePrefix=""
        icon={IoLogoInstagram}
        onAddToCart={(resolved) => handleAddToCart(resolved, sectionLabel)}
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

      <ClientsSection />
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default InstagramServicesPage;
