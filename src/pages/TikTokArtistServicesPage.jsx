import { useNavigate } from 'react-router-dom';
import { IoLogoTiktok, IoMusicalNoteOutline, IoPeopleOutline } from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import ServiceDetailVideoHero from '../components/ServiceDetailVideoHero';
import { useMainSiteServiceHero } from '../hooks/useMainSiteServiceHero';
import tiktokArtistHeroImage from '../assets/social/tiktok-artist.jpg';
import {
  tiktokArtistTermsFooter,
  tiktokArtistTermsSections,
  tiktokInfluencerPackages,
  tiktokInfluencerSectionIntro,
  tiktokSongClaimService,
} from '../data/tiktokArtistServices';
import { usePartnerText } from '../utils/partnerText';
import './ServiceDetailPage.css';
import './TikTokArtistServicesPage.css';

function buildSongClaimDescription(service) {
  const included = service.included.map((item) => item).join(' · ');
  return `${service.description} Includes: ${included}. ${service.note}`;
}

function TikTokArtistServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { format } = useCurrency();
  const { t, brandName, shortBrandName } = usePartnerText();
  const { videoSrc, posterSrc } = useMainSiteServiceHero({
    videoSlot: 'tiktokArtistVideo',
    imageSlot: 'tiktokArtistImage',
    fallbackPoster: tiktokArtistHeroImage,
  });

  const handleAddToCart = (service) =>
    addToCart(
      buildPartnerCartItem(service, {
        description: service.meta || 'TikTok for Artist service',
        category: 'tiktok-artist',
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
    <div className="service-detail-page tiktok-artist-page">
      <Navbar onScrollToSection={scrollToSection} />

      <div className="service-detail-shell">
        <ServiceDetailVideoHero
          titleBlack="TIKTOK FOR ARTIST"
          titleBlue="SERVICES & PACKAGES"
          lead={`Song claiming, micro influencer sound campaigns, and full terms for ${shortBrandName.toUpperCase()} DISTRIBUTION & MARKETING — powered by ${brandName}.`}
          videoSrc={videoSrc}
          posterSrc={posterSrc}
        />

        <main className="service-detail-main">
          <section className="service-detail-section">
            <h2 className="service-detail-section-title">1. TikTok Song Claim Under Profile</h2>
            <p className="service-detail-section-lead">
              Minimal setup pricing for track recognition and analytics access via distributor services.
            </p>
            <div className="service-detail-grid service-detail-grid--single">
              <PartnerPricedServiceCard
                service={tiktokSongClaimService}
                title={tiktokSongClaimService.title}
                description={buildSongClaimDescription(tiktokSongClaimService)}
                pricePrefix=""
                icon={IoMusicalNoteOutline}
                ctaLabel="Order now"
                onAddToCart={handleAddToCart}
              />
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">
              2. {tiktokInfluencerSectionIntro.title}
            </h2>
            <p className="service-detail-section-lead">{tiktokInfluencerSectionIntro.lead}</p>
            <p className="service-detail-section-lead tiktok-artist-industry-note">
              {tiktokInfluencerSectionIntro.industryNote}
            </p>
            <h3 className="tiktok-artist-packages-heading">Our Micro Influencer Pricing Packages</h3>
            <div className="service-detail-grid">
              {tiktokInfluencerPackages.map((pkg) => (
                <PartnerPricedServiceCard
                  key={pkg.packageId || pkg.id}
                  service={pkg}
                  title={pkg.title}
                  description={pkg.description}
                  pricePrefix=""
                  icon={IoPeopleOutline}
                  ctaLabel="Order now"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
            <ul className="tiktok-artist-included-list">
              <li>All influencers will create authentic TikTok videos using your sound.</li>
              <li>Guaranteed engagement and wider audience reach.</li>
              <li>Flexible packages to suit both upcoming and established artists/brands.</li>
            </ul>
          </section>

          <section className="service-detail-section tiktok-artist-terms">
            <h2 className="service-detail-section-title">Terms of Service</h2>
            <p className="service-detail-section-lead">
              {shortBrandName.toUpperCase()} DISTRIBUTION &amp; MARKETING — TikTok Influencer Sound
              Promotion Packages. By purchasing or using our TikTok promotion services, you agree to
              the following:
            </p>
            <div className="tiktok-artist-terms-body">
              {tiktokArtistTermsSections.map((section) => (
                <article key={section.title} className="tiktok-artist-terms-block">
                  <h3>{t(section.title)}</h3>
                  <p>{t(section.body)}</p>
                </article>
              ))}
              <p className="tiktok-artist-terms-footer">{t(tiktokArtistTermsFooter)}</p>
            </div>
          </section>
        </main>
      </div>

      <ClientsSection />
      <Footer />
    </div>
  );
}

export default TikTokArtistServicesPage;
