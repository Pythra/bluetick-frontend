import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
import PublicationArticleAddons from '../components/PublicationArticleAddons';
import Button from '../components/Button';
import PlatformLogo from '../components/PlatformLogo';
import { IoCheckmarkCircle, IoTime } from 'react-icons/io5';
import {
  getPublicationCategoryPlatforms,
  PUBLICATION_PACKAGE_DETAILS,
  resolvePublicationPlatformPrice,
} from '../utils/publicationPricing';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import { getPublicationPlatformLogo } from '../utils/publicationPlatformLogos';
import './PublicationServicesPage.editorial.css';
import './PackageDetailPage.css';

function PublicationPlatformCard({ categoryId, platform, onAddToCart }) {
  const { isPartnerSite, packagePricing } = usePartnerBranding();
  const { getPublicationCategoryPlatformLogo } = useMainSiteMedia();
  const { format } = useCurrency();
  const { packageId, priceValue } = resolvePublicationPlatformPrice({
    categoryId,
    platformName: platform.name,
    priceValue: platform.priceValue,
    packagePricing,
    isPartnerSite,
  });
  const adminLogo = !isPartnerSite ? getPublicationCategoryPlatformLogo(categoryId, platform.name) : null;
  const hasLogo = Boolean(adminLogo || getPublicationPlatformLogo({ name: platform.name }));

  return (
    <article className="package-platform-card">
      <div className="package-platform-media">
        {hasLogo ? <PlatformLogo platform={{ name: platform.name }} categoryId={categoryId} /> : null}
        <h3 className="package-platform-name">{platform.name}</h3>
      </div>
      <footer className="package-platform-footer">
        <span className="package-platform-price">{format(priceValue)}</span>
        <Button
          type="button"
          className="package-platform-order-btn"
          onClick={() =>
            onAddToCart({
              name: platform.name,
              packageId,
              priceValue,
              formattedPrice: format(priceValue),
            })
          }
        >
          Place order
        </Button>
      </footer>
    </article>
  );
}

function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const packageId = parseInt(id, 10);
  const packageData = PUBLICATION_PACKAGE_DETAILS[packageId];
  const platforms = packageData ? getPublicationCategoryPlatforms(packageData.categoryId) : [];

  if (!packageData) {
    return (
      <div className="publication-page package-detail-page">
        <Navbar onScrollToSection={() => {}} />
        <div className="package-detail-empty container">
          <h1>Package not found</h1>
          <Button onClick={() => navigate('/services/publications')}>Back to publications</Button>
        </div>
        <ClientsSection />
        <Footer onScrollToSection={() => {}} />
      </div>
    );
  }

  const handleAddToCart = (platform) =>
    addToCart({
      itemId: platform.packageId || `${packageData.title}-${platform.name}`,
      packageId: platform.packageId,
      title: `${platform.name} — ${packageData.title}`,
      price: platform.formattedPrice,
      priceValue: platform.priceValue,
      description: packageData.description,
      category: 'publication',
      quantity: 1,
    });

  const scrollToSection = (sectionId) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="publication-page package-detail-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="package-detail-shell">
        <header className="package-detail-header">
          <p className="publication-section-kicker">Publication package</p>
          {packageData.delivery ? (
            <p className="package-detail-delivery">
              <IoTime aria-hidden="true" />
              Typical delivery: {packageData.delivery}
            </p>
          ) : null}
          <h1 className="package-detail-title">{packageData.title}</h1>
          <p className="package-detail-description">{packageData.description}</p>
        </header>

        <section className="package-platforms-panel">
          <h2 className="publication-section-title">{packageData.listTitle ?? 'Select outlets'}</h2>
          <div className="package-platforms-grid">
            {platforms.map((platform) => (
              <PublicationPlatformCard
                key={platform.name}
                categoryId={packageData.categoryId}
                platform={platform}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        {packageData.note ? (
          <div className="package-detail-note">
            <IoCheckmarkCircle aria-hidden="true" />
            <p>{packageData.note}</p>
          </div>
        ) : null}
      </div>

      <section className="package-detail-addons container">
        <PublicationArticleAddons packageId={packageId} packageTitle={packageData.title} />
      </section>

      <ClientsSection />
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default PackageDetailPage;
