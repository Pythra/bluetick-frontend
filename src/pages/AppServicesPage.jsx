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
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { appDevelopmentServices } from '../data/developmentServices';
import { getPackagesByGroup } from '../data/partnerPackageCatalog';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import { usePartnerPackagePrice } from '../hooks/usePartnerPackagePrice';
import ServiceDetailCard from '../components/ServiceDetailCard';
import ServiceDetailVideoHero from '../components/ServiceDetailVideoHero';
import { useMainSiteServiceHero } from '../hooks/useMainSiteServiceHero';
import appHeroImage from '../assets/app.png';
import appHeroVideo from '../assets/app.mp4';
import './ServiceDetailPage.css';

const appDescriptions = {
  'Health & Fitness Apps': 'Workout tracking, wellness dashboards, and subscription-ready fitness experiences.',
  'E-commerce Apps': 'Product catalogs, secure checkout, and order management for mobile storefronts.',
  'Fintech & Banking Apps': 'Digital wallets, transfers, KYC flows, and compliant financial product interfaces.',
  'Social Media Apps': 'Feeds, messaging, profiles, and engagement features built for growing communities.',
  'Travel & Booking Apps': 'Trip planning, reservations, itineraries, and real-time booking confirmations.',
  'Productivity Apps': 'Task management, team workflows, and tools that help users stay organized on the go.',
  'Streaming & Entertainment Apps': 'Media libraries, live streams, and content discovery tuned for retention.',
  'Gaming Apps': 'Gameplay loops, leaderboards, in-app purchases, and multiplayer-ready architecture.',
  'Bill Payment Apps': 'Utility payments, receipts, reminders, and simple bill-management for end users.',
  'Cryptocurrency Apps': 'Portfolio views, trading flows, and secure wallet interactions for crypto users.',
};

const appIcons = {
  'Health & Fitness Apps': IoFitnessOutline,
  'E-commerce Apps': IoCartOutline,
  'Fintech & Banking Apps': IoWalletOutline,
  'Social Media Apps': IoPeopleOutline,
  'Travel & Booking Apps': IoAirplaneOutline,
  'Productivity Apps': IoRocketOutline,
  'Streaming & Entertainment Apps': IoPlayCircleOutline,
  'Gaming Apps': IoGameControllerOutline,
  'Bill Payment Apps': IoReceiptOutline,
  'Cryptocurrency Apps': IoGlobeOutline,
};

const appServices = appDevelopmentServices.map((service) => ({
  ...service,
  icon: appIcons[service.title],
  description: appDescriptions[service.title] || '',
}));

const appStartingPackage = getPackagesByGroup('app-packages').reduce((lowest, entry) =>
  entry.basePriceNgn < lowest.basePriceNgn ? entry : lowest
);

const customAppInfo = {
  title: 'Custom App Development',
  meta: 'Delivery: 6 to 12 Weeks',
  description:
    'For clients with new app ideas, we offer tailored solutions. Schedule a meeting with us to discuss your unique needs.',
  packageId: appStartingPackage.id,
  startingPrice: appStartingPackage.basePriceNgn,
  icon: IoRocketOutline,
};

function AppServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const customAppStartingPrice = usePartnerPackagePrice(
    customAppInfo.packageId,
    customAppInfo.startingPrice
  );
  const { videoSrc, posterSrc } = useMainSiteServiceHero({
    videoSlot: 'appDevelopmentVideo',
    imageSlot: 'appDevelopmentImage',
    fallbackVideo: appHeroVideo,
    fallbackPoster: appHeroImage,
  });

  const handleAddToCart = (service) =>
    addToCart(
      buildPartnerCartItem(service, {
        category: 'app',
        price: service.price,
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

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <ServiceDetailVideoHero
          titleBlack="APP DEVELOPMENT"
          titleBlue="SERVICES"
          lead="Popular app types and starting prices — add any package to your cart or book a custom build."
          videoSrc={videoSrc}
          posterSrc={posterSrc}
        />

        <main className="service-detail-main">
          <div className="service-detail-grid">
            {appServices.map((service) => (
              <PartnerPricedServiceCard
                key={service.packageId || service.title}
                service={service}
                title={service.title}
                description={service.description}
                icon={service.icon}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

            <ServiceDetailCard
            title={customAppInfo.title}
            meta={customAppInfo.meta}
            description={customAppInfo.description}
            price={format(customAppStartingPrice)}
            icon={customAppInfo.icon}
            feature
          />
        </main>
      </div>

      <ClientsSection />
      <Footer />
    </div>
  );
}

export default AppServicesPage;
