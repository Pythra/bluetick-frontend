import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import AppServicesSummary from './components/AppServicesSummary';
import WebsiteServicesSummary from './components/WebsiteServicesSummary';
import VerificationServicesSummary from './components/VerificationServicesSummary';
import PublicationServicesSummary from './components/PublicationServicesSummary';
import InstagramServicesSummary from './components/InstagramServicesSummary';
import CelebritiesSection from './components/CelebritiesSection';
import CartIcon from './components/CartIcon';
import AppServicesPage from './pages/AppServicesPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import VerificationServicesPage from './pages/VerificationServicesPage';
import PublicationServicesPage from './pages/PublicationServicesPage';
import InstagramServicesPage from './pages/InstagramServicesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import TermsAndConditions from './pages/legal/TermsAndConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import FAQ from './components/FAQ';
import './App.css';

function HomePage() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <LandingPage onScrollToSection={scrollToSection} />
      <AppServicesSummary />
      <WebsiteServicesSummary />
      <VerificationServicesSummary />
      <PublicationServicesSummary />
      <InstagramServicesSummary />
      <CelebritiesSection />
      <FAQ />
      <Footer onScrollToSection={scrollToSection} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/services/apps" element={<AppServicesPage />} />
              <Route path="/services/websites" element={<WebsiteServicesPage />} />
              <Route path="/services/verification" element={<VerificationServicesPage />} />
            <Route path="/services/publications" element={<PublicationServicesPage />} />
            <Route path="/services/publications/package/:id" element={<PackageDetailPage />} />
            <Route path="/services/instagram" element={<InstagramServicesPage />} />
            <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminPage />} />
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
