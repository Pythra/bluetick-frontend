 import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoBookOutline,
  IoBusinessOutline,
  IoInformationCircleOutline,
  IoNewspaperOutline,
  IoSearchOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import PartnerPricedServiceCard from '../components/PartnerPricedServiceCard';
import ServiceDetailCard from '../components/ServiceDetailCard';
import Footer from '../components/Footer';
import { buildPartnerCartItem } from '../utils/partnerCartItem';
import ClientsSection from '../components/ClientsSection';
import wikipediaHeroVideo from '../assets/wiki.mp4';
import {
  googleKnowledgePanelPackages,
  wikipediaPagePackages,
  wikipediaScopeItems,
  wikipediaServiceNotice,
} from '../data/wikipediaPageServices';
import './ServiceDetailPage.css';
import './WikipediaServicesPage.css';

function buildPackageDescription(pkg) {
  const features = pkg.features.join(' · ');
  return `${pkg.description} Includes: ${features}`;
}

function WikipediaServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const wikiVideoRef = useRef(null);

  useEffect(() => {
    const video = wikiVideoRef.current;
    if (!video) return undefined;

    const showFirstFrame = () => {
      try {
        if (video.readyState >= 1 && video.currentTime < 0.05) {
          video.currentTime = 0.01;
        }
      } catch {
        // Some browsers block seek until enough data is loaded
      }
    };

    video.addEventListener('loadeddata', showFirstFrame);
    video.addEventListener('loadedmetadata', showFirstFrame);

    if (video.readyState >= 1) {
      showFirstFrame();
    }

    return () => {
      video.removeEventListener('loadeddata', showFirstFrame);
      video.removeEventListener('loadedmetadata', showFirstFrame);
    };
  }, []);

  const handleAddToCart = (item, category) =>
    addToCart(
      buildPartnerCartItem(item, {
        description: item.description || item.deliveryTime || '',
        category: 'wikipedia',
        tier: category,
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

  const scopeIcons = [IoNewspaperOutline, IoSearchOutline, IoShieldCheckmarkOutline];

  return (
    <div className="service-detail-page">
      <Navbar onScrollToSection={scrollToSection} />

      <main className="service-detail-main wikipedia-page-main" aria-label="Wikipedia Page Services">
        <div className="wikipedia-page-shell">
          <div className="wikipedia-page-split">
            <aside className="wikipedia-page-video" aria-label="Wikipedia services overview video">
              <video
                ref={wikiVideoRef}
                className="wikipedia-page-video-player"
                src={wikipediaHeroVideo}
                controls
                playsInline
                preload="auto"
              />
            </aside>

            <div className="wikipedia-page-content">
              <header className="wikipedia-page-intro">
                <h1 className="wikipedia-page-title">
                  <span className="services-summary-title-black">WIKIPEDIA PAGE</span>
                  <span className="services-summary-title-blue">SERVICES</span>
                </h1>
                <p className="wikipedia-page-lead">
                  Establish credibility on the world&apos;s most trusted encyclopedia — professional
                  content creation, publications, and quality assurance for individuals and companies.
                </p>
              </header>

              <div className="wikipedia-page-packages-intro">
                <h2 className="service-detail-section-title">Wikipedia Page Packages</h2>
                <p className="service-detail-section-lead">
                  Professional Wikipedia page creation for individuals and companies — comprehensive
                  content development, quality assurance, and compliance with Wikipedia standards.
                  Company pages include stricter notability assessment, media sourcing, and detailed
                  business coverage.
                </p>
              </div>
            </div>
          </div>

          <section className="service-detail-section wikipedia-page-packages" aria-label="Wikipedia package options">
            <div className="service-detail-grid wikipedia-page-packages-grid">
              {wikipediaPagePackages.map((pkg) => (
                <PartnerPricedServiceCard
                  key={pkg.packageId || pkg.id}
                  service={pkg}
                  title={pkg.title}
                  description={buildPackageDescription(pkg)}
                  pricePrefix=""
                  icon={pkg.packageId === 'wikipedia.company' ? IoBusinessOutline : IoBookOutline}
                  onAddToCart={(resolved) => handleAddToCart(resolved, 'wikipedia-package')}
                />
              ))}
            </div>
          </section>

          <div className="wikipedia-page-full">
            <section className="service-detail-section">
            <h2 className="service-detail-section-title">Scope of Services</h2>
            <p className="service-detail-section-lead">
              What we handle as part of every Wikipedia engagement.
            </p>
            <div className="service-detail-grid wikipedia-page-scope-grid">
              {wikipediaScopeItems.map((item, index) => {
                const Icon = scopeIcons[index] ?? IoInformationCircleOutline;
                return (
                  <ServiceDetailCard
                    key={item.title}
                    title={item.title}
                    meta={item.meta}
                    description={item.description}
                    price="Included in packages"
                    pricePrefix=""
                    icon={Icon}
                  />
                );
              })}
            </div>
          </section>

          <section className="service-detail-section">
            <h2 className="service-detail-section-title">Google Knowledge Panel</h2>
            <p className="service-detail-section-lead">
              Optional add-on services to strengthen your search presence alongside Wikipedia.
            </p>
            <div className="service-detail-grid service-detail-grid--pair">
              {googleKnowledgePanelPackages.map((pkg) => (
                <PartnerPricedServiceCard
                  key={pkg.packageId || pkg.id}
                  service={pkg}
                  title={pkg.title}
                  description={pkg.description}
                  pricePrefix=""
                  icon={pkg.packageId === 'google-knowledge.company' ? IoBusinessOutline : IoBookOutline}
                  onAddToCart={(resolved) => handleAddToCart(resolved, 'google-knowledge-panel')}
                />
              ))}
            </div>
          </section>

          <ServiceDetailCard
            title="Important Notice"
            meta="Before you order"
            description={`${wikipediaServiceNotice.lead} ${wikipediaServiceNotice.body}`}
            price="See packages above"
            icon={IoInformationCircleOutline}
            feature
          />
          </div>
        </div>
      </main>

      <ClientsSection />
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default WikipediaServicesPage;