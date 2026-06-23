import { useNavigate } from 'react-router-dom';
import {
  IoCashOutline,
  IoInformationCircleOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoTwitter,
  IoLogoYoutube,
  IoMegaphoneOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import verificationHeroImage from '../assets/social/verification.jpg';
import {
  monetizationImportantNotice,
  monetizationPackages,
  monetizationSetupServices,
} from '../data/socialMonetizationServices';
import './ServiceDetailPage.css';

const monetizationDescriptions = {
  'Facebook Page Monetization':
    'Full Facebook Page monetization setup from eligibility through payout configuration.',
  'Facebook Profile Monetization':
    'Profile-level monetization enablement with compliance and revenue tool setup.',
  'Instagram Monetization':
    'Instagram monetization tools, bonuses, and payout readiness for creators and brands.',
  'YouTube Channel Monetization':
    'YouTube Partner Program monetization including watch hours, subs, and AdSense linkage.',
  'TikTok Account Monetization':
    'TikTok monetization program enrollment and creator fund readiness support.',
  'Snapchat Monetization':
    'Snapchat monetization features setup for Spotlight and creator revenue programs.',
  'X (Twitter) Monetization':
    'X monetization and creator revenue setup for eligible accounts.',
  'Facebook In-Stream Ads Setup': 'In-stream ads configuration and approval for Facebook video content.',
  'Facebook Stars Setup': 'Facebook Stars gifting setup so fans can support your live streams.',
  'Instagram Gifts Setup': 'Instagram Gifts activation for Reels and live monetization moments.',
  'Instagram Subscription Setup': 'Instagram Subscriptions setup for recurring fan revenue.',
  'TikTok Creativity Program Setup': 'TikTok Creativity Program Beta enrollment and eligibility support.',
  'Social Media Payout Setup Assistance':
    'Cross-platform payout account linking, tax, and banking configuration assistance.',
};

function getMonetizationIcon(title) {
  if (title.includes('Facebook')) return IoLogoFacebook;
  if (title.includes('Instagram')) return IoLogoInstagram;
  if (title.includes('YouTube')) return IoLogoYoutube;
  if (title.includes('TikTok')) return IoLogoTiktok;
  if (title.includes('Snapchat')) return IoMegaphoneOutline;
  if (title.includes('X (Twitter)') || title.includes('Twitter')) return IoLogoTwitter;
  if (title.includes('Payout')) return IoWalletOutline;
  return IoCashOutline;
}

function MonetizationServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = (service, tier) =>
    addToCart(
      buildPartnerCartItem(service, {
        description: tier === 'setup' ? 'Monetization setup service' : 'Full monetization package',
        category: 'monetization',
        tier,
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

  const renderCards = (services, tier, metaLabel) =>
    services.map((service) => (
      <PartnerPricedServiceCard
        key={`${tier}-${service.packageId || service.title}`}
        service={service}
        title={service.title}
        meta={metaLabel}
        description={
          monetizationDescriptions[service.title] ||
          'End-to-end monetization support from eligibility through approval and payout setup.'
        }
        pricePrefix=""
        icon={getMonetizationIcon(service.title)}
        onAddToCart={(resolved) => handleAddToCart(resolved, tier)}
      />
    ));

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <header className="service-detail-hero">
          <img src={verificationHeroImage} alt="" className="service-detail-hero-image" />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">SOCIAL MEDIA</span>
              <span className="services-summary-title-blue">MONETIZATION</span>
            </h1>
            <p className="service-detail-lead">
              Turn your audience into revenue across Facebook, Instagram, YouTube, TikTok, Snapchat,
              and X — we handle eligibility, setup, and approval end to end.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Platform Monetization Packages</h2>
            <div className="service-detail-grid">
              {renderCards(monetizationPackages, 'package', 'Monetization package')}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Creator Revenue Setup Services</h2>
            <div className="service-detail-grid">
              {renderCards(monetizationSetupServices, 'setup', 'Setup service')}
            </div>
          </section>

          <ServiceDetailCard
            title="Important Notice"
            meta="Before you order"
            description={`${monetizationImportantNotice.lead} ${monetizationImportantNotice.body}`}
            price="See packages above"
            icon={IoInformationCircleOutline}
            feature
          />
        </main>
      </div>

      <ClientsSection />
      <Footer />
    </div>
  );
}

export default MonetizationServicesPage;
