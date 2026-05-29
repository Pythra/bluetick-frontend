import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import { getStreamingPlatformLogo } from '../utils/streamingPlatformSlug';
import Navbar from '../components/Navbar';
import StreamingPlatformLogo from '../components/StreamingPlatformLogo';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import musicHeroImage from '../assets/mayorkun.jpg';
import {
  musicProfilePlacements,
  musicStreamingVerificationNotice,
  streamingPlatformVerifications,
} from '../data/musicStreamingVerificationServices';
import './ServiceDetailPage.css';

const verificationMeta = {
  'Boomplay Verification': 'Streaming verification',
  'Spotify Verification': 'Streaming verification',
  'Audiomack Verification': 'Streaming verification',
  'Apple Music Verification': 'Streaming verification',
  'YouTube Official Artist Channel (OAC) Verification': 'YouTube OAC',
  'Deezer Verification': 'Streaming verification',
  'TIDAL Artist Verification': 'Streaming verification',
  'Amazon Music Artist Verification': 'Streaming verification',
  'Pandora AMP Verification': 'Streaming verification',
  'SoundCloud Verification': 'Streaming verification',
  'Shazam Artist Profile Verification': 'Streaming verification',
};

const verificationDescriptions = {
  'Boomplay Verification':
    'Official artist profile setup and verification on Boomplay for African and global audiences.',
  'Spotify Verification':
    'Blue-check artist profile verification on Spotify with distributor and metadata support.',
  'Audiomack Verification':
    'Verified artist status on Audiomack so fans see you as an established creator.',
  'Apple Music Verification':
    'Apple Music for Artists verification and profile optimization for releases.',
  'YouTube Official Artist Channel (OAC) Verification':
    'YouTube OAC verification linking your music, videos, and channel under one official identity.',
  'Deezer Verification':
    'Verified artist profile on Deezer with correct credits and catalog alignment.',
  'TIDAL Artist Verification':
    'TIDAL artist verification for premium streaming visibility and profile trust.',
  'Amazon Music Artist Verification':
    'Amazon Music for Artists verification across Alexa and Amazon streaming surfaces.',
  'Pandora AMP Verification':
    'Pandora AMP artist verification for US listener discovery and radio features.',
  'SoundCloud Verification':
    'SoundCloud artist verification badge and profile readiness review.',
  'Shazam Artist Profile Verification':
    'Shazam artist profile verification so listeners can follow you after discovering tracks.',
};

function renderPlatformIcon(title) {
  const platform = getStreamingPlatformLogo(title);
  if (!platform) return null;

  return (
    <StreamingPlatformLogo
      slug={platform.slug}
      color={platform.color}
      src={platform.src}
      alt={`${title} logo`}
    />
  );
}

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

  const renderCards = (services, tier, defaultMeta) =>
    services.map((service) => (
      <ServiceDetailCard
        key={service.title}
        title={service.title}
        meta={verificationMeta[service.title] || defaultMeta}
        description={
          verificationDescriptions[service.title] ||
          'Full verification workflow from eligibility review through platform approval.'
        }
        price={formatPrice(service.price, '₦')}
        pricePrefix=""
        iconNode={renderPlatformIcon(service.title)}
        iconVariant="platform"
        onAddToCart={() => handleAddToCart(service, tier)}
      />
    ));

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <header className="service-detail-hero">
          <img src={musicHeroImage} alt="" className="service-detail-hero-image" />
          <div className="service-detail-hero-overlay" aria-hidden="true" />
          <div className="service-detail-hero-content">
            <h1 className="service-detail-title">
              <span className="services-summary-title-black">MUSIC ARTIST STREAMING</span>
              <span className="services-summary-title-blue">VERIFICATION</span>
            </h1>
            <p className="service-detail-lead">
              Official verified artist profiles on Spotify, Apple Music, Boomplay, YouTube OAC, and
              every major streaming platform we support.
            </p>
          </div>
        </header>

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Streaming Platform Verifications</h2>
            <div className="service-detail-grid">
              {renderCards(streamingPlatformVerifications, 'verification', 'Streaming verification')}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Music Profile Placement</h2>
            <div className="service-detail-grid">
              {musicProfilePlacements.map((service) => (
                <ServiceDetailCard
                  key={service.title}
                  title={service.title}
                  meta="Profile placement"
                  description="Strategic placement and optimization so your music profile reaches the right audience on platform discovery surfaces."
                  price={formatPrice(service.price, '₦')}
                  pricePrefix=""
                  iconNode={renderPlatformIcon(service.title)}
                  iconVariant="platform"
                  onAddToCart={() => handleAddToCart(service, 'placement')}
                />
              ))}
            </div>
          </section>

          <ServiceDetailCard
            title="Important Notice"
            meta="Before you order"
            description={`${musicStreamingVerificationNotice.lead} ${musicStreamingVerificationNotice.body}`}
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

      <Footer />
    </div>
  );
}

export default MusicStreamingVerificationPage;
