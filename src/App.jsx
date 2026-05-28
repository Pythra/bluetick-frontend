import { BrowserRouter as Router, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { createBrowserHistory } from 'history';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import AppServicesSummary from './components/AppServicesSummary';
import WebsiteServicesSummary from './components/WebsiteServicesSummary';
import VerificationServicesSummary from './components/VerificationServicesSummary';
import MusicStreamingVerificationSummary from './components/MusicStreamingVerificationSummary';
import PublicationServicesSummary from './components/PublicationServicesSummary';
import InstagramServicesSummary from './components/InstagramServicesSummary';
import WikipediaServicesSummary from './components/WikipediaServicesSummary';
import CelebritiesSection from './components/CelebritiesSection';
import CartIcon from './components/CartIcon';
import AppServicesPage from './pages/AppServicesPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import VerificationServicesPage from './pages/VerificationServicesPage';
import MonetizationServicesPage from './pages/MonetizationServicesPage';
import TwitterTrendServicesPage from './pages/TwitterTrendServicesPage';
import MusicStreamingVerificationPage from './pages/MusicStreamingVerificationPage';
import PublicationServicesPage from './pages/PublicationServicesPage';
import InstagramServicesPage from './pages/InstagramServicesPage';
import WikipediaServicesPage from './pages/WikipediaServicesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import ArticleSubmissionPage from './pages/ArticleSubmissionPage';
import AdminPage from './pages/AdminPage';
import AdminApp from './admin/AdminApp';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import FAQ from './components/FAQ';
import './App.css';

function HomePage() {
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
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <LandingPage onScrollToSection={scrollToSection} />
      <div className="scroll-pop"><AppServicesSummary /></div>
      <div className="scroll-pop"><WebsiteServicesSummary /></div>
      <div className="scroll-pop"><VerificationServicesSummary /></div>
      <div className="scroll-pop"><MusicStreamingVerificationSummary /></div>
      <div className="scroll-pop"><PublicationServicesSummary /></div>
      <div className="scroll-pop"><InstagramServicesSummary /></div>
      <div className="scroll-pop"><WikipediaServicesSummary /></div>
      <div className="scroll-pop"><CelebritiesSection /></div>
      <div className="scroll-pop"><FAQ /></div>
      <Footer onScrollToSection={scrollToSection} />
    </>
  );
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
      <CartProvider>
        <Router history={history}>
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
              <Route path="/services/publications">
                <Route index element={<PublicationServicesPage />} />
                <Route path="package/:id" element={<PackageDetailPage />} />
              </Route>
              <Route path="/services/instagram" element={<InstagramServicesPage />} />
              <Route path="/services/wikipedia" element={<WikipediaServicesPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/article-submission" element={<ArticleSubmissionPage />} />
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/admin-dashboard" element={<AdminApp />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />
            </Routes>
            <CartIconWrapper />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

function CartIconWrapper() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <CartIcon /> : null;
}

export default App;
