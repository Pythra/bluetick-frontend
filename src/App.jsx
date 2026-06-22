import { BrowserRouter as Router, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { createBrowserHistory } from 'history';
import { AuthProvider } from './contexts/AuthContext';
import { PartnerBrandingProvider, usePartnerBranding } from './contexts/PartnerBrandingContext';
import { CartProvider } from './contexts/CartContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useAuth } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import PartnerLandingPage from './templates/PartnerLandingPage';
import Navbar from './components/Navbar';
import AppServicesSummary from './components/AppServicesSummary';
import WebsiteServicesSummary from './components/WebsiteServicesSummary';
import VerificationServicesSummary from './components/VerificationServicesSummary';
import MusicStreamingVerificationSummary from './components/MusicStreamingVerificationSummary';
import TikTokArtistServicesSummary from './components/TikTokArtistServicesSummary';
import PublicationServicesSummary from './components/PublicationServicesSummary';
import InstagramServicesSummary from './components/InstagramServicesSummary';
import WikipediaServicesSummary from './components/WikipediaServicesSummary';
import CelebritiesSection from './components/CelebritiesSection';
import PartnerWithUsSection from './components/PartnerWithUsSection';
import TestimonialsSection from './components/TestimonialsSection';
import CartIcon from './components/CartIcon';
import AppServicesPage from './pages/AppServicesPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import VerificationServicesPage from './pages/VerificationServicesPage';
import MonetizationServicesPage from './pages/MonetizationServicesPage';
import TwitterTrendServicesPage from './pages/TwitterTrendServicesPage';
import MusicStreamingVerificationPage from './pages/MusicStreamingVerificationPage';
import TikTokArtistServicesPage from './pages/TikTokArtistServicesPage';
import PublicationServicesPage from './pages/PublicationServicesPage';
import InstagramServicesPage from './pages/InstagramServicesPage';
import WikipediaServicesPage from './pages/WikipediaServicesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import CheckoutPage from './pages/CheckoutPage';
import ArticleSubmissionPage from './pages/ArticleSubmissionPage';
import ProjectOnboardingPage from './pages/ProjectOnboardingPage';
import AdminPage from './pages/AdminPage';
import AdminApp from './admin/AdminApp';
import Footer from './components/Footer';
import PartnerTemplateFooter from './templates/shared/PartnerTemplateFooter';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import LegalDocumentPage from './pages/legal/LegalDocumentPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import AboutPage from './pages/AboutPage';
import PartnerPage from './pages/PartnerPage';
import PartnerApplicationPage from './pages/PartnerApplicationPage';
import PartnerVerifyEmailPage from './pages/PartnerVerifyEmailPage';
import FAQ from './components/FAQ';
import ClientsSection from './components/ClientsSection';
import PartnerBrandingGate from './components/PartnerBrandingGate';
import HomepagePromoBanner from './components/HomepagePromoBanner';
import CustomRequestsSection from './components/CustomRequestsSection';
import CustomServiceSection from './components/CustomServiceSection';
import PartnerVideoServiceSection from './components/PartnerVideoServiceSection';
import { isPartnerHomepageServiceEnabled, PARTNER_HOMEPAGE_SERVICES, getCustomServiceDefinitions, isVideoFirstPartnerSite, getServiceVideoUrl } from './config/partnerSiteConfig';
import { subscribeToPushNotifications } from './utils/pushNotifications';
import ClientMessagesFab from './components/ClientMessagesFab';
import RegisterPartnerSiteUser from './components/RegisterPartnerSiteUser';
import './App.css';
import './styles/partnerTemplates.css';
import './styles/brandTheme.css';

const HOMEPAGE_SERVICE_COMPONENTS = [
  ['appDevelopment', AppServicesSummary],
  ['websiteDevelopment', WebsiteServicesSummary],
  ['socialMedia', VerificationServicesSummary],
  ['musicStreaming', MusicStreamingVerificationSummary],
  ['tiktokArtist', TikTokArtistServicesSummary],
  ['publication', PublicationServicesSummary],
  ['instagram', InstagramServicesSummary],
  ['wikipedia', WikipediaServicesSummary],
];

function HomePage() {
  const branding = usePartnerBranding();
  const { isPartnerSite, features, templateId } = branding;
  const videoFirstHomepage = isPartnerSite && isVideoFirstPartnerSite(branding);

  useEffect(() => {
    const sections = document.querySelectorAll('.scroll-pop');
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [branding.enabledServices, features]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showLanding =
    !isPartnerSite ||
    features?.showHero !== false ||
    features?.showPublicationLogos ||
    features?.showImpactStats !== false;

  const promoItems = branding.sectionContent?.homepagePromos?.items || [];

  const renderPromosAfter = (serviceId) => {
    if (!isPartnerSite) {
      return null;
    }

    return promoItems
      .filter((promo) => promo?.enabled !== false && promo.afterService === serviceId && promo.imageUrl)
      .map((promo) => (
        <div className="scroll-pop" key={`promo-${promo.id}`}>
          <HomepagePromoBanner promo={promo} />
        </div>
      ));
  };

  const renderVideoService = (serviceId, sectionId, label) => {
    if (!isPartnerHomepageServiceEnabled(branding, serviceId)) {
      return null;
    }
    return (
      <div className="scroll-pop" key={`video-${serviceId}`}>
        <PartnerVideoServiceSection
          serviceId={serviceId}
          sectionId={sectionId}
          videoUrl={getServiceVideoUrl(branding, serviceId)}
          label={label}
        />
      </div>
    );
  };

  const renderService = (serviceId, Component) => {
    if (!isPartnerHomepageServiceEnabled(branding, serviceId)) {
      return null;
    }
    return (
      <div className="scroll-pop" key={serviceId}>
        <Component />
      </div>
    );
  };

  return (
    <>
      {showLanding ? (
        isPartnerSite ? (
          <PartnerLandingPage onScrollToSection={scrollToSection} />
        ) : (
          <LandingPage onScrollToSection={scrollToSection} />
        )
      ) : (
        <section className="landing-page landing-page--navbar-only">
          <Navbar onScrollToSection={scrollToSection} />
        </section>
      )}
      {!isPartnerSite ? (
        <div className="scroll-pop"><PartnerWithUsSection /></div>
      ) : null}
      {videoFirstHomepage ? (
        <>
          {HOMEPAGE_SERVICE_COMPONENTS.map(([serviceId]) => {
            const meta = PARTNER_HOMEPAGE_SERVICES.find((service) => service.id === serviceId);
            return (
              <div key={serviceId}>
                {renderVideoService(serviceId, meta?.sectionId, meta?.label)}
                {renderPromosAfter(serviceId)}
              </div>
            );
          })}
          {getCustomServiceDefinitions(branding)
            .filter((service) => isPartnerHomepageServiceEnabled(branding, service.id))
            .map((service) => (
              <div key={service.id}>
                {renderVideoService(service.id, service.sectionId || service.id, service.label)}
                {renderPromosAfter(service.id)}
              </div>
            ))}
        </>
      ) : (
        <>
          {HOMEPAGE_SERVICE_COMPONENTS.map(([serviceId, Component]) => (
            <div key={serviceId}>
              {renderService(serviceId, Component)}
              {renderPromosAfter(serviceId)}
            </div>
          ))}
          {isPartnerSite
            ? getCustomServiceDefinitions(branding)
                .filter((service) => isPartnerHomepageServiceEnabled(branding, service.id))
                .map((service) => (
                  <div key={service.id}>
                    <div className="scroll-pop">
                      <CustomServiceSection service={service} />
                    </div>
                    {renderPromosAfter(service.id)}
                  </div>
                ))
            : null}
        </>
      )}
      {(!isPartnerSite || features?.showCelebrities) ? (
        <div className="scroll-pop"><CelebritiesSection /></div>
      ) : null}
      {(!isPartnerSite || features?.showTestimonials) ? (
        <div className="scroll-pop"><TestimonialsSection /></div>
      ) : null}
      {(!isPartnerSite || features?.showFaq !== false) ? (
        <div className="scroll-pop"><FAQ /></div>
      ) : null}
      {(!isPartnerSite || features?.showCustomRequests !== false) ? (
        <div className="scroll-pop"><CustomRequestsSection /></div>
      ) : null}
      {!isPartnerSite ? <ClientsSection className="landing-page" /> : null}
      {isPartnerSite ? (
        <PartnerTemplateFooter templateId={templateId} onScrollToSection={scrollToSection} />
      ) : (
        <Footer onScrollToSection={scrollToSection} />
      )}
    </>
  );
}

function PushSubscriptionBootstrap() {
  const { apiUrl } = useAuth();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    subscribeToPushNotifications(apiUrl).catch((error) => {
      console.error('Silent push subscription sync failed:', error);
    });
  }, [apiUrl]);

  return null;
}

function App() {
  // Create a custom history object with the future flags
  const history = createBrowserHistory({
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  });

  return (
    <AuthProvider>
      <PartnerBrandingProvider>
      <PartnerBrandingGate>
      <CurrencyProvider>
        <CartProvider>
          <Router history={history}>
          <PushSubscriptionBootstrap />
          <ScrollToTop />
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/apps" element={<AppServicesPage />} />
              <Route path="/services/websites" element={<WebsiteServicesPage />} />
              <Route path="/services/verification" element={<VerificationServicesPage />} />
              <Route path="/services/monetization" element={<MonetizationServicesPage />} />
              <Route path="/services/twitter-trends" element={<TwitterTrendServicesPage />} />
              <Route path="/services/music-streaming" element={<MusicStreamingVerificationPage />} />
              <Route path="/services/tiktok-artist" element={<TikTokArtistServicesPage />} />
              <Route path="/services/publications">
                <Route index element={<PublicationServicesPage />} />
                <Route path="package/:id" element={<PackageDetailPage />} />
              </Route>
              <Route path="/services/instagram" element={<InstagramServicesPage />} />
              <Route path="/services/wikipedia" element={<WikipediaServicesPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/article-submission" element={<ArticleSubmissionPage />} />
              <Route path="/project-onboarding" element={<ProjectOnboardingPage />} />
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/admin-dashboard" element={<AdminApp />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
              <Route path="/legal/:slug" element={<LegalDocumentPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/partner" element={<PartnerPage />} />
              <Route path="/partner/apply" element={<PartnerApplicationPage />} />
              <Route path="/partner/verify-email" element={<PartnerVerifyEmailPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
            </Routes>
            <CartIcon />
            <RegisterPartnerSiteUser />
            <ClientMessagesFab />
          </div>
          </Router>
        </CartProvider>
      </CurrencyProvider>
      </PartnerBrandingGate>
      </PartnerBrandingProvider>
    </AuthProvider>
  );
}

export default App;
