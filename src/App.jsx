import { BrowserRouter as Router, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './components/LandingPage';
import AppServicesSummary from './components/AppServicesSummary';
import WebsiteServicesSummary from './components/WebsiteServicesSummary';
import VerificationServicesSummary from './components/VerificationServicesSummary';
import PublicationServicesSummary from './components/PublicationServicesSummary';
import InstagramServicesSummary from './components/InstagramServicesSummary';
import WikipediaServicesSummary from './components/WikipediaServicesSummary';
import CelebritiesSection from './components/CelebritiesSection';
import CartIcon from './components/CartIcon';
import AppServicesPage from './pages/AppServicesPage';
import WebsiteServicesPage from './pages/WebsiteServicesPage';
import VerificationServicesPage from './pages/VerificationServicesPage';
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
      <WikipediaServicesSummary />
      <CelebritiesSection />
      <FAQ />
      <div className="editorial-guidelines-section" style={{ padding: '60px 20px', backgroundColor: '#f9fafb', marginBottom: '40px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center', color: '#1f2937' }}>Editorial Guidelines</h2>
          
          <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#374151' }}>
            At Bluetickgeng, we prioritize legitimate news and timely announcements. All press releases must be newsworthy, covering company events, expansions, milestones, financial reports, competitions, or other significant developments.
          </p>
          
          <p style={{ marginBottom: '30px', lineHeight: '1.6', color: '#374151', fontStyle: 'italic' }}>
            We do not accept general articles, opinion pieces, or purely promotional content.
          </p>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Content Requirements</h3>
          <ul style={{ marginBottom: '30px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>Press releases must be between 500 and 1,500 words.</li>
            <li>Content should read like a professional news announcement.</li>
            <li>All information must be accurate and free of aggressive language, slander, or unverified claims.</li>
            <li>Submissions containing strong religious or political opinions are not accepted.</li>
            <li>Press releases must be written in the third person, with first-person references allowed only in direct quotes.</li>
            <li>Each press release must follow a logical structure, including:
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                <li>Headline (concise, under 10 words)</li>
                <li>Summary</li>
                <li>Main content</li>
                <li>Closing comment</li>
                <li>Editor's comment (if applicable)</li>
              </ul>
            </li>
            <li>Subheadings are generally not included in news announcements.</li>
            <li>All press releases must originate from a specific city and country.</li>
          </ul>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Formatting and Submission Guidelines</h3>
          <ul style={{ marginBottom: '30px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>Press releases must be properly formatted, with each paragraph separated by a line break.</li>
            <li>All submissions must be free of spelling and grammatical errors. Bluetickgeng does not proofread or edit content submitted for publication.</li>
            <li>Each press release must include valid media contact details, including a contact name and email address, where applicable.</li>
            <li>Hyperlinks must be relevant and direct readers to supporting information such as graphics, documents, or official sources.</li>
            <li>Links used solely for promotional purposes will be removed.</li>
          </ul>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Image Requirements</h3>
          <ul style={{ marginBottom: '30px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>Each submission must include one main image in .jpg or .png format.</li>
            <li>Company logos are not permitted within press releases.</li>
            <li>For additional media files, we recommend sharing a Google Drive or Dropbox link in the Notes to the Editor section.</li>
            <li>Embedded images within the press release body will result in a request for revisions.</li>
          </ul>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Editorial and Compliance Policies</h3>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#374151' }}>
            Bluetickgeng reserves the right to reject, modify, or delete any content deemed offensive, slanderous, racist, inflammatory, sexually explicit, or promoting violence or terrorism.
          </p>
          <ul style={{ marginBottom: '30px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>If a press release contains grandiose claims (e.g., endorsements, partnerships, or extraordinary achievements), Bluetickgeng may request additional proof before publication.</li>
            <li>All submissions must be sent from a valid business email address. If authenticity is uncertain, additional verification may be required.</li>
            <li>If a press release does not meet our editorial standards, clients may opt for Bluetickgeng's Editorial Service, starting at ₦20,000 (+VAT), to refine and optimize the content.</li>
          </ul>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Reasons for Refusal of Distribution</h3>
          <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#374151' }}>
            Bluetickgeng may refuse to distribute a press release for the following reasons:
          </p>
          <ul style={{ marginBottom: '20px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>Poor headline — The headline lacks a clear news angle and/or attribution to the issuer.</li>
            <li>Advertisement or SPAM — The content reads like an advertisement or spam. Examples include words or phrases such as FREE, "Make Money", "Don't miss this opportunity!", SALE!!!!.</li>
            <li>Poor newsworthiness — The press release lacks sufficient news value.</li>
            <li>Poor writing quality — The content is poorly written or unclear.</li>
            <li>Lack of credible contact information — Missing or unreliable contact details.</li>
            <li>Keyword spamming — Excessive or manipulative use of keywords or phrases.</li>
          </ul>

          <p style={{ marginTop: '20px', marginBottom: '15px', fontWeight: 'bold', color: '#1f2937' }}>Prohibited Content Includes:</p>
          <ul style={{ marginBottom: '30px', paddingLeft: '20px', color: '#374151', lineHeight: '1.8' }}>
            <li>Personal opinions intended to harm or seek revenge against an individual or group.</li>
            <li>Blog posts or open letters that lack attribution or news value.</li>
            <li>Defamatory or harmful content, including material that incites hatred, bigotry, racism, or violence; promotes personal attacks; defames or victimizes individuals or organizations.</li>
            <li>Sexually explicit content, including references or links to explicit, illegal, or profane material.</li>
            <li>Health supplements or sexual enhancement pharmaceuticals.</li>
            <li>Get-rich schemes, networking marketing, or MLM-related content.</li>
            <li>Piggybacking, defined as unauthorized use of another issuer's name or identity.</li>
            <li>Unauthorized celebrity mentions without verified consent or documentation from a legal representative or management team.</li>
            <li>Unsubstantiated medical claims, including claims related to COVID-19 prevention or treatment.</li>
            <li>Inappropriate associations implying false government or official endorsements.</li>
            <li>Unapproved home testing kits for medical conditions without regulatory clearance.</li>
          </ul>

          <hr style={{ margin: '30px 0', borderColor: '#e5e7eb' }} />

          <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Agreement</h3>
          <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#374151' }}>
            By submitting a press release to Bluetickgeng, you acknowledge and agree to comply with these editorial guidelines. Failure to meet these standards may result in rejection or removal of the submission.
          </p>
        </div>
      </div>
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
