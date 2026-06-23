import { useNavigate } from 'react-router-dom';
import { IoInformationCircleOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { getStreamingPlatformLogo } from '../utils/streamingPlatformSlug';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import ServiceDetailCard from '../components/ServiceDetailCard';
import StreamingPlatformLogo from '../components/StreamingPlatformLogo';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import ServiceDetailVideoHero from '../components/ServiceDetailVideoHero';
import { useMainSiteServiceHero } from '../hooks/useMainSiteServiceHero';
import musicHeroImage from '../assets/mayorkun.jpg';
import {
  musicProfilePlacements,
  musicStreamingVerificationNotice,
  streamingPlatformVerifications,
} from '../data/musicStreamingVerificationServices';
import './ServiceDetailPage.css';

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
  const { videoSrc, posterSrc } = useMainSiteServiceHero({
    videoSlot: 'musicStreamingVideo',
    imageSlot: 'musicStreamingImage',
    fallbackPoster: musicHeroImage,
  });

  const handleAddToCart = (service, tier) =>
    addToCart(
      buildPartnerCartItem(service, {
        description:
          tier === 'placement' ? 'Music profile placement' : 'Streaming platform verification',
        category: 'music-streaming-verification',
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

  const renderCards = (services, tier) =>
    services.map((service) => (
      <PartnerPricedServiceCard
        key={service.packageId || service.title}
        service={service}
        title={service.title}
        description={
          verificationDescriptions[service.title] ||
          'Full verification workflow from eligibility review through platform approval.'
        }
        pricePrefix=""
        iconNode={renderPlatformIcon(service.title)}
        iconVariant="platform"
        onAddToCart={(resolved) => handleAddToCart(resolved, tier)}
      />
    ));

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <ServiceDetailVideoHero
          titleBlack="MUSIC ARTIST STREAMING"
          titleBlue="VERIFICATION"
          lead="Official verified artist profiles on Spotify, Apple Music, Boomplay, YouTube OAC, and every major streaming platform we support."
          videoSrc={videoSrc}
          posterSrc={posterSrc}
        />

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Streaming Platform Verifications</h2>
            <div className="service-detail-grid">
              {renderCards(streamingPlatformVerifications, 'verification')}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Music Profile Placement</h2>
            <div className="service-detail-grid">
              {musicProfilePlacements.map((service) => (
                <PartnerPricedServiceCard
                  key={service.packageId || service.title}
                  service={service}
                  title={service.title}
                  description="Strategic placement and optimization so your music profile reaches the right audience on platform discovery surfaces."
                  pricePrefix=""
                  iconNode={renderPlatformIcon(service.title)}
                  iconVariant="platform"
                  onAddToCart={(resolved) => handleAddToCart(resolved, 'placement')}
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

      <ClientsSection />
      <Footer />
    </div>
  );
}

export default MusicStreamingVerificationPage;
