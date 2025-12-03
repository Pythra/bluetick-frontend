import SectionHeader from './SectionHeader';
import ServiceCard from './ServiceCard';
import './VerificationSection.css';

const nonNotablePrices = [
  { title: 'Instagram Verification', price: '₦800,000' },
  { title: 'Facebook Verification', price: '₦850,000' },
  { title: 'TikTok Verification', price: '₦900,000' },
  { title: 'YouTube Verification', price: '₦950,000' },
  { title: 'Telegram Verification', price: '₦150,000' },
  { title: 'WhatsApp Business Verification', price: '₦400,000' },
  { title: 'WhatsApp Channel Verification', price: '₦300,000' },
];

const notablePrices = [
  { title: 'Instagram Verification', price: '₦200,000' },
  { title: 'Facebook Verification', price: '₦350,000' },
  { title: 'TikTok Verification', price: '₦250,000' },
  { title: 'YouTube Verification', price: '₦400,000' },
  { title: 'Telegram Verification', price: '₦100,000' },
  { title: 'WhatsApp Business Verification', price: '₦180,000' },
  { title: 'WhatsApp Channel Verification', price: '₦150,000' },
];

function VerificationSection() {
  return (
    <section id="verification-services" className="verification-section">
      <div className="container">
        <SectionHeader
          title="SOCIAL MEDIA VERIFICATION RATE CARD"
          subtitle="Establish your online presence with credibility and authenticity"
        />
        
        <div className="verification-intro">
          <p className="intro-text">
            Whether you're a public figure, entrepreneur, business owner, or influencer, we help you secure your 
            verification badge seamlessly. Our services cater to both notable individuals (with existing online media 
            coverage) and non-notable individuals (without prior publications).
          </p>
          <p className="intro-text">
            For non-notable clients, we enhance your digital footprint by publishing five reputable online newspaper 
            articles to establish your notability before proceeding with the verification process.
          </p>
          <p className="intro-text">
            For notable clients with existing publications, we offer a faster and more affordable verification process. 
            By working with us, you can ensure that your online presence is not only credible but also strategically 
            positioned for long-term success. Let us help you boost your digital reputation and secure the recognition 
            you deserve.
          </p>
        </div>

        <div className="pricing-tiers">
          <div className="pricing-tier">
            <div className="tier-header">
              <h3 className="tier-title">VERIFICATION PRICE LIST FOR NON-NOTABLE INDIVIDUALS</h3>
              <p className="tier-subtitle">(WITHOUT EXISTING PUBLICATIONS)</p>
              <div className="tier-note">
                <span className="note-icon">📰</span>
                Includes 5 online newspaper publications to establish notability
              </div>
              <p className="permanent-note">Permanent verification (not a Meta subscription)</p>
            </div>
            <div className="services-grid">
              {nonNotablePrices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  price={service.price}
                />
              ))}
            </div>
          </div>

          <div className="pricing-tier">
            <div className="tier-header">
              <h3 className="tier-title">VERIFICATION PRICE LIST FOR NOTABLE INDIVIDUALS</h3>
              <p className="tier-subtitle">(WITH EXISTING PUBLICATIONS)</p>
              <p className="permanent-note">Permanent verification (not a Meta subscription)</p>
            </div>
            <div className="services-grid">
              {notablePrices.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  price={service.price}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="meta-subscription">
          <h3 className="meta-title">META SUBSCRIPTION SERVICES</h3>
          <div className="meta-content">
            <div className="meta-pricing">
              <p className="meta-description">
                Includes monthly subscription and a valid ID for verification purposes only
              </p>
              <div className="meta-price-card">
                <p className="meta-platforms">Facebook, Instagram, X (Twitter), WhatsApp Business</p>
                <p className="meta-price">₦100,000/month (Each)</p>
              </div>
              <p className="meta-note">
                This package includes the Meta Verified subscription and a valid driver's license 
                (customizable with any name and photo) for the verification process only.
              </p>
              <p className="meta-warning">
                <strong>Note:</strong> The provided ID is strictly for verification and not for official 
                identification purposes. (Perfect for business owners, public figures, and high-engagement accounts.)
              </p>
            </div>
          </div>
        </div>

        <div className="requirements-section">
          <div className="requirements-tier">
            <h3 className="requirements-title">VERIFICATION REQUIREMENTS FOR NON-NOTABLE INDIVIDUALS</h3>
            <p className="requirements-subtitle">(WITHOUT EXISTING PUBLICATIONS)</p>
            <p className="requirements-intro">
              If you don't have any prior online media coverage, we will first help you build your notability 
              through 5 online newspaper publications before proceeding with the verification process.
            </p>
            <div className="requirements-list">
              <div className="requirement-item">
                <span className="req-number">1</span>
                <span>Full Name (as it appears on your social media profile)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">2</span>
                <span>Username/Handle of the account you want to verify</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">3</span>
                <span>Profile Link to the social media account</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">4</span>
                <span>High-quality Profile Picture (must be the same as on your profile)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">5</span>
                <span>Bio Description (brief information about who you are or your brand)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">6</span>
                <span>Professional Achievements or Relevant Information (if available)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">7</span>
                <span>Valid Means of Identification (if applicable for certain platforms)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">8</span>
                <span>Five (5) Online Newspaper Articles (which we will handle for you)</span>
              </div>
            </div>
          </div>

          <div className="requirements-tier">
            <h3 className="requirements-title">VERIFICATION REQUIREMENTS FOR NOTABLE INDIVIDUALS</h3>
            <p className="requirements-subtitle">(WITH EXISTING PUBLICATIONS)</p>
            <p className="requirements-intro">
              For individuals who already have at least 5 credible online publications that establish their notability, 
              the process is faster and comes at a lower cost.
            </p>
            <div className="requirements-list">
              <div className="requirement-item">
                <span className="req-number">1</span>
                <span>Full Name (as it appears on your social media profile)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">2</span>
                <span>Username/Handle of the account you want to verify</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">3</span>
                <span>Profile Link to the social media account</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">4</span>
                <span>High-quality Profile Picture (must be the same as on your profile)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">5</span>
                <span>Bio Description (brief information about who you are or your brand)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">6</span>
                <span>Links to at least 5 existing online newspaper publications mentioning your name or brand</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">7</span>
                <span>Professional Achievements or Relevant Information (optional but helpful)</span>
              </div>
              <div className="requirement-item">
                <span className="req-number">8</span>
                <span>Valid Means of Identification (if required by the platform)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VerificationSection;






