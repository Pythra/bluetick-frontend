import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import CountryFlag from '../components/CountryFlag';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import verificationHeroImage from '../assets/social/verification.jpg';
import { twitterTrendNotice, twitterTrendPackages } from '../data/twitterTrendPackages';
import './ServiceDetailPage.css';

function buildTrendDescription(pkg) {
  const highlights = pkg.highlights.join(' · ');
  return `${pkg.description} ${highlights}`;
}

function TwitterTrendServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (pkg) => {
    const result = await addToCart(buildPartnerCartItem(pkg, {
      description: `Twitter (X) Trend — ${pkg.delivery}`,
      category: 'twitter-trend',
      price: pkg.price,
    }));

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
          <img src={verificationHeroImage} alt="" className="service-detail-hero-image" />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">TWITTER (X)</span>
              <span className="services-summary-title-blue">TREND SERVICES</span>
            </h1>
            <p className="service-detail-lead">
              Premium trend promotion packages for brands, artists, campaigns, and announcements across
              Nigeria, Uganda, South Africa, Kenya, and Ghana.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Twitter (X) Trend Packages</h2>
            <p className="service-detail-section-lead">
              Premium trend promotion packages for brands, artists, campaigns &amp; announcements.
            </p>
            <div className="service-detail-grid">
              {twitterTrendPackages.map((pkg) => (
                <PartnerPricedServiceCard
                  key={pkg.packageId || pkg.id}
                  service={pkg}
                  title={pkg.title}
                  meta={`Delivery: ${pkg.delivery}`}
                  description={buildTrendDescription(pkg)}
                  pricePrefix=""
                  iconNode={<CountryFlag code={pkg.countryCode} alt={`${pkg.title} flag`} />}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>

          <ServiceDetailCard
            title="Important Notice"
            meta="Campaign details"
            description={`${twitterTrendNotice.lead} ${twitterTrendNotice.body}`}
            price="See packages above"
            icon={IoInformationCircleOutline}
            feature
          />
        </main>
      </div>

      {showCartNotification && (
        <div className="service-detail-cart-notification" role="status">
          Item added to cart!
        </div>
      )}

      <ClientsSection />
      <Footer />
    </div>
  );
}

export default TwitterTrendServicesPage;
