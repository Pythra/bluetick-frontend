import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoCheckmarkCircleOutline,
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoSnapchat,
  IoLogoTiktok,
  IoLogoTwitter,
  IoLogoWhatsapp,
  IoLogoYoutube,
  IoPaperPlaneOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import verificationHeroImage from '../assets/social/verification.jpg';
import {
  metaSubscriptionService,
  nonNotableVerificationServices,
  notableVerificationServices,
  verificationTierNotes,
} from '../data/socialVerificationServices';
import './ServiceDetailPage.css';

const verificationDescriptions = {
  'Instagram Verification':
    'Blue-badge verification for Instagram profiles with eligibility review and submission support.',
  'Facebook Verification':
    'Facebook profile or page verification with documentation and compliance guidance.',
  'Snapchat Verification':
    'Snapchat verified account support for creators and brands building official presence.',
  'TikTok Verification':
    'TikTok verified badge support for creators, brands, and public figures.',
  'Twitter Verification':
    'X (Twitter) verification support with eligibility review and profile readiness guidance.',
  'YouTube Verification':
    'YouTube channel verification to establish authenticity and trust with your audience.',
  'Telegram Verification':
    'Telegram channel or profile verification for official brand presence.',
  'WhatsApp Channel Verification':
    'WhatsApp Channel verification for broadcast and community updates.',
};

function getVerificationIcon(title) {
  if (title.includes('Instagram')) return IoLogoInstagram;
  if (title.includes('Facebook')) return IoLogoFacebook;
  if (title.includes('Snapchat')) return IoLogoSnapchat;
  if (title.includes('TikTok')) return IoLogoTiktok;
  if (title.includes('Twitter')) return IoLogoTwitter;
  if (title.includes('YouTube')) return IoLogoYoutube;
  if (title.includes('Telegram')) return IoPaperPlaneOutline;
  if (title.includes('WhatsApp')) return IoLogoWhatsapp;
  return IoCheckmarkCircleOutline;
}

function VerificationServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (service, tier) => {
    const result = await addToCart(buildPartnerCartItem(service, {
      title: `${service.title} (${tier})`,
      description: tier === 'notable' ? 'Notable account' : tier === 'meta' ? 'Meta subscription' : 'Non-notable account',
      category: 'verification',
      tier,
      price: service.price,
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

  const renderTierCards = (services, tier, metaLabel) =>
    services.map((service) => (
      <PartnerPricedServiceCard
        key={`${tier}-${service.packageId || service.title}`}
        service={service}
        title={service.title}
        meta={metaLabel}
        description={
          verificationDescriptions[service.title] ||
          'Full verification workflow from eligibility review through platform approval.'
        }
        pricePrefix=""
        icon={getVerificationIcon(service.title)}
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
              <span className="services-summary-title-blue">VERIFICATION</span>
            </h1>
            <p className="service-detail-lead">
              Establish credibility with permanent verification for notable and non-notable accounts
              across every major platform we support.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Non-Notable Individuals</h2>
            <p className="service-detail-section-lead">
              {verificationTierNotes.nonNotable.lead} {verificationTierNotes.nonNotable.permanent}
            </p>
            <div className="service-detail-grid">
              {renderTierCards(nonNotableVerificationServices, 'non-notable', 'Non-notable account')}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Notable Individuals</h2>
            <p className="service-detail-section-lead">
              {verificationTierNotes.notable.lead} {verificationTierNotes.notable.permanent}
            </p>
            <div className="service-detail-grid">
              {renderTierCards(notableVerificationServices, 'notable', 'Notable account')}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Meta Subscription</h2>
            <PartnerPricedServiceCard
              service={metaSubscriptionService}
              title={metaSubscriptionService.title}
              meta="Monthly subscription"
              description={metaSubscriptionService.description}
              priceSuffix="/month"
              pricePrefix=""
              icon={IoShieldCheckmarkOutline}
              onAddToCart={(resolved) =>
                handleAddToCart(
                  { ...resolved, title: 'Meta Subscription' },
                  'meta',
                )
              }
            />
          </section>
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

export default VerificationServicesPage;
