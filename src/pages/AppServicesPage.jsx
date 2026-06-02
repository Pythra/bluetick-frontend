import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoAirplaneOutline,
  IoCartOutline,
  IoFitnessOutline,
  IoGameControllerOutline,
  IoGlobeOutline,
  IoPeopleOutline,
  IoPlayCircleOutline,
  IoReceiptOutline,
  IoRocketOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import appHeroImage from '../assets/app.png';
import appHeroVideo from '../assets/app.mp4';
import './ServiceDetailPage.css';

const appServices = [
  {
    title: 'Health & Fitness Apps',
    price: 3300000,
    icon: IoFitnessOutline,
    description: 'Workout tracking, wellness dashboards, and subscription-ready fitness experiences.',
  },
  {
    title: 'E-commerce Apps',
    price: 2250000,
    icon: IoCartOutline,
    description: 'Product catalogs, secure checkout, and order management for mobile storefronts.',
  },
  {
    title: 'Fintech & Banking Apps',
    price: 9000000,
    icon: IoWalletOutline,
    description: 'Digital wallets, transfers, KYC flows, and compliant financial product interfaces.',
  },
  {
    title: 'Social Media Apps',
    price: 5250000,
    icon: IoPeopleOutline,
    description: 'Feeds, messaging, profiles, and engagement features built for growing communities.',
  },
  {
    title: 'Travel & Booking Apps',
    price: 3750000,
    icon: IoAirplaneOutline,
    description: 'Trip planning, reservations, itineraries, and real-time booking confirmations.',
  },
  {
    title: 'Productivity Apps',
    price: 6000000,
    icon: IoRocketOutline,
    description: 'Task management, team workflows, and tools that help users stay organized on the go.',
  },
  {
    title: 'Streaming & Entertainment Apps',
    price: 5700000,
    icon: IoPlayCircleOutline,
    description: 'Media libraries, live streams, and content discovery tuned for retention.',
  },
  {
    title: 'Gaming Apps',
    price: 7500000,
    icon: IoGameControllerOutline,
    description: 'Gameplay loops, leaderboards, in-app purchases, and multiplayer-ready architecture.',
  },
  {
    title: 'Bill Payment Apps',
    price: 4800000,
    icon: IoReceiptOutline,
    description: 'Utility payments, receipts, reminders, and simple bill-management for end users.',
  },
  {
    title: 'Cryptocurrency Apps',
    price: 3450000,
    icon: IoGlobeOutline,
    description: 'Portfolio views, trading flows, and secure wallet interactions for crypto users.',
  },
];

const customAppInfo = {
  title: 'Custom App Development',
  meta: 'Custom build',
  description:
    'For clients with new app ideas, we offer tailored solutions. Schedule a meeting with us to discuss your unique needs.',
  startingPrice: 3750000,
  icon: IoRocketOutline,
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
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <header className="service-detail-hero service-detail-hero--app">
          <video
            className="service-detail-hero-image"
            src={appHeroVideo}
            poster={appHeroImage}
            autoPlay
            loop
            playsInline
            controls
            preload="metadata"
          />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">APP DEVELOPMENT</span>
              <span className="services-summary-title-blue">SERVICES</span>
            </h1>
            <p className="service-detail-lead">
              Popular app types and starting prices — add any package to your cart or book a custom build.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <div className="service-detail-grid">
            {appServices.map((service) => (
              <ServiceDetailCard
                key={service.title}
                title={service.title}
                meta="Mobile app"
                description={service.description}
                price={formatPrice(service.price, '₦')}
                icon={service.icon}
                onAddToCart={() => handleAddToCart(service)}
              />
            ))}
          </div>

          <ServiceDetailCard
            title={customAppInfo.title}
            meta={customAppInfo.meta}
            description={customAppInfo.description}
            price={formatPrice(customAppInfo.startingPrice, '₦')}
            icon={customAppInfo.icon}
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

export default AppServicesPage;
