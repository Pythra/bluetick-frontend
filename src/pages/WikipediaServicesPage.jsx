import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/priceFormatter';
import Navbar from '../components/Navbar';
import SectionHeader from '../components/SectionHeader';
import Button from '../components/Button';
import Footer from '../components/Footer';
import {
  IoCheckmarkCircle,
  IoDocumentText,
  IoNewspaper,
  IoRocket,
  IoTime,
  IoChevronDown,
  IoChevronUp,
} from 'react-icons/io5';
import './WikipediaServicesPage.css';

const wikipediaPackages = [
  {
    id: 'individual-wiki',
    title: 'Individual Wikipedia Page Creation',
    price: 1000000,
    deliveryTime: '48 hours',
    description: 'Professional Wikipedia page creation for individuals with comprehensive content development and quality assurance.',
    features: [
      'Content creation and publication',
      'Up to 12 news publications',
      'Content review and compliance',
      'Quality assurance',
      'Wikipedia standards compliance',
      'Professional page layout'
    ]
  },
  {
    id: 'company-wiki',
    title: 'Company Wikipedia Page Creation',
    price: 1500000,
    deliveryTime: '72 hours',
    description: 'Specialized Wikipedia page creation for businesses and organizations with stricter notability and sourcing requirements.',
    features: [
      'Comprehensive content creation',
      'Up to 12 high-quality publications',
      'Detailed business coverage',
      'Company achievement highlights',
      'Advanced content review',
      'Wikipedia compliance verification',
      'Media sourcing support',
      'Notability assessment'
    ]
  }
];

function WikipediaServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});

  const handleAddToCart = async (package_) => {
    const result = await addToCart({
      itemId: `${package_.id}-${Date.now()}`,
      title: package_.title,
      price: package_.price,
      description: package_.description,
      category: 'wikipedia',
      quantity: 1,
    });

    if (result.success) {
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
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

  return (
    <div className="wikipedia-services-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="page-header">
        <Button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </Button>
        <SectionHeader
          title="WIKIPEDIA PAGE SERVICES"
          subtitle="Establish Your Presence on the World's Most Trusted Encyclopedia"
        />
      </div>

      <div className="container">
        {/* Scope of Services */}
        <section className="services-section">
          <h2 className="section-title">Scope of Services</h2>
          
          <div className="service-detail-item">
            <div className="service-detail-header" onClick={() => toggleSection('news-pub')}>
              <div className="service-detail-title">
                <span className="number">01</span>
                <h3>News Publications</h3>
              </div>
              <span className="toggle-icon">
                {expandedSections['news-pub'] ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </div>
            {expandedSections['news-pub'] && (
              <div className="service-detail-content">
                <p>
                  The service includes the creation and publication of up to 12 news publications tailored to meet Wikipedia's stringent requirements. This is crucial because Wikipedia requires content to be notable and supported by reliable sources.
                </p>
              </div>
            )}
          </div>

          <div className="service-detail-item">
            <div className="service-detail-header" onClick={() => toggleSection('content-review')}>
              <div className="service-detail-title">
                <span className="number">02</span>
                <h3>Content Review</h3>
              </div>
              <span className="toggle-icon">
                {expandedSections['content-review'] ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </div>
            {expandedSections['content-review'] && (
              <div className="service-detail-content">
                <p>
                  If you have existing publications, these will be reviewed by our team to ensure they align with Wikipedia's guidelines, significantly enhancing the chances of your page's acceptance.
                </p>
              </div>
            )}
          </div>

          <div className="service-detail-item">
            <div className="service-detail-header" onClick={() => toggleSection('quality-assurance')}>
              <div className="service-detail-title">
                <span className="number">03</span>
                <h3>Quality Assurance</h3>
              </div>
              <span className="toggle-icon">
                {expandedSections['quality-assurance'] ? <IoChevronUp /> : <IoChevronDown />}
              </span>
            </div>
            {expandedSections['quality-assurance'] && (
              <div className="service-detail-content">
                <p>
                  Any additional articles required will be created with high editorial standards, ensuring the content meets Wikipedia's quality and notability requirements.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="pricing-section">
          <h2 className="section-title">Investment Details</h2>
          <div className="packages-grid">
            {wikipediaPackages.map((package_) => (
              <div key={package_.id} className="package-card">
                <div className="package-header">
                  <h3 className="package-title">{package_.title}</h3>
                  <p className="package-description">{package_.description}</p>
                </div>

                <div className="package-pricing">
                  <span className="price">{formatPrice(package_.price, '₦')}</span>
                  <span className="delivery-time">
                    <IoTime style={{ marginRight: '8px' }} />
                    {package_.deliveryTime}
                  </span>
                </div>

                <div className="package-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {package_.features.map((feature, index) => (
                      <li key={index}>
                        <IoCheckmarkCircle className="check-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleAddToCart(package_)}
                  className="order-button"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Summary Section */}
        <section className="summary-section">
          <h2 className="section-title">Summary</h2>
          <div className="summary-content">
            <p>
              Our Wikipedia services provide a comprehensive and professional approach to building and establishing credible Wikipedia pages.
            </p>
            <div className="summary-list">
              {wikipediaPackages.map((pkg) => (
                <div key={pkg.id} className="summary-item">
                  <span className="summary-item-title">{pkg.title}</span>
                  <span className="summary-item-details">
                    {formatPrice(pkg.price, '₦')} | {pkg.deliveryTime}
                  </span>
                </div>
              ))}
            </div>
            <p className="summary-footer">
              Each service includes content development, publication strategy, review, and quality assurance to maximize approval success.
            </p>
          </div>
        </section>

        {/* Google Knowledge Panel Preview */}
        <section className="bonus-section">
          <h2 className="section-title">Bonus: Google Knowledge Panel Services</h2>
          <div className="bonus-content">
            <p>
              Looking to enhance your online credibility further? Our Google Knowledge Panel services work in conjunction with Wikipedia pages to establish strong digital presence.
            </p>
            <div className="knowledge-panel-preview">
              <div className="kp-item">
                <h4>Individual Google Knowledge Panel</h4>
                <p className="kp-price">{formatPrice(500000, '₦')}</p>
                <p className="kp-time">72 hours delivery</p>
              </div>
              <div className="kp-item">
                <h4>Company Google Knowledge Panel</h4>
                <p className="kp-price">{formatPrice(800000, '₦')}</p>
                <p className="kp-time">72 hours delivery</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {showCartNotification && (
        <div className="cart-notification" style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: '#ffffff',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease'
        }}>
          Item added to cart!
        </div>
      )}
      <Footer />
    </div>
  );
}

export default WikipediaServicesPage;
