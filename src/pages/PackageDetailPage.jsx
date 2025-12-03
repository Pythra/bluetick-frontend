 import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import SectionHeader from '../components/SectionHeader';
import { IoCheckmarkCircle, IoArrowBack } from 'react-icons/io5';
import punchLogo from '../assets/punch.png';
import guardianLogo from '../assets/guardian.png';
import pulseLogo from '../assets/pulse.png';
import forbesLogo from '../assets/forbes.png';
import foxLogo from '../assets/fox.png';
import bbcNewsLogo from '../assets/platforms/bbc news.png';
import bloombergNewsLogo from '../assets/platforms/bloomberg.png';
import hardcoreLogo from '../assets/platforms/hardcore.png';
import blueprintLogo from '../assets/platforms/blueprint.jpeg';
import businessDayLogo from '../assets/platforms/buisnessday.png';
import cableLogo from '../assets/platforms/cable.jpg';
import championLogo from '../assets/platforms/champion.png';
import dailyPostLogo from '../assets/platforms/dailypost.jpg';
import dailyTrustLogo from '../assets/platforms/dailytrust.png';
import ghanaWebLogo from '../assets/platforms/ghanaweb.png';
import independentLogo from '../assets/platforms/independent.jpg';
import leadershipLogo from '../assets/platforms/leadership.png';
import legitLogo from '../assets/platforms/legit.jpeg';
import nairametricsLogo from '../assets/platforms/nairametrics.png';
import peoplesDailyLogo from '../assets/platforms/PEOPLES-DAILY.png';
import sunOnlineLogo from '../assets/platforms/sun.webp';
import techCabalLogo from '../assets/platforms/techcabal.png';
import techpointLogo from '../assets/platforms/Techpoint-logo.jpg';
import telegraphLogo from '../assets/platforms/telegraph.png';
import theNationLogo from '../assets/platforms/thenation.png';
import thisDayLogo from '../assets/platforms/thisday.jpg';
import tribuneLogo from '../assets/platforms/tribune.png';
import vanguardLogo from '../assets/platforms/Vanguard.png';
import './PackageDetailPage.css';

const logoMap = {
  Punch: punchLogo,
  Vanguard: vanguardLogo,
  Guardian: guardianLogo,
  'The Nation': theNationLogo,
  ThisDay: thisDayLogo,
  BusinessDay: businessDayLogo,
  'Daily Trust': dailyTrustLogo,
  Leadership: leadershipLogo,
  Tribune: tribuneLogo,
  SunOnline: sunOnlineLogo,
  'Daily Telegraph': telegraphLogo,
  Independent: independentLogo,
  Champion: championLogo,
  "People's Daily": peoplesDailyLogo,
  Blueprint: blueprintLogo,
  Legit: legitLogo,
  GhanaWeb: ghanaWebLogo,
  Nairametrics: nairametricsLogo,
  Techpoint: techpointLogo,
  Techcabal: techCabalLogo,
  Forbes: forbesLogo,
  'Fox News': foxLogo,
  'BBC News': bbcNewsLogo,
  Bloomberg: bloombergNewsLogo,
  'Hardcore News': hardcoreLogo,
};

const packageDetails = {
  1: {
    title: 'African News Platforms',
    description: 'Punch, Vanguard, Guardian Nigeria + multiple African authority sites and movie platforms. Perfect for local and regional market penetration with guaranteed publication.',
    platforms: [
      // News Platforms
      { name: 'Punch', price: '₦80,000', logo: punchLogo },
      { name: 'BusinessDay', price: '₦80,000', logo: businessDayLogo },
      { name: 'Legit', price: '₦10,000', logo: legitLogo },
      { name: 'The Nation', price: '₦30,000', logo: theNationLogo },
      { name: 'Vanguard', price: '₦20,000', logo: vanguardLogo },
      { name: 'ThisDay', price: '₦20,000', logo: thisDayLogo },
      { name: 'The Guardian', price: '₦30,000', logo: guardianLogo },
      { name: 'The Cable', price: '₦25,000', logo: cableLogo },
      { name: 'Leadership', price: '₦30,000', logo: leadershipLogo },
      { name: 'Daily Trust', price: '₦20,000', logo: dailyTrustLogo },
      { name: 'Daily Post', price: '₦20,000', logo: dailyPostLogo },
      { name: 'The Sun', price: '₦20,000', logo: sunOnlineLogo },
      { name: 'The Telegraph', price: '₦20,000', logo: telegraphLogo },
      { name: 'Tribune', price: '₦30,000', logo: tribuneLogo },
      { name: 'Champion', price: '₦20,000', logo: championLogo },
      { name: 'Blueprint', price: '₦20,000', logo: blueprintLogo },
      { name: 'Peoples Daily', price: '₦20,000', logo: peoplesDailyLogo },
      { name: 'GhanaWeb', price: '₦10,000', logo: ghanaWebLogo },
      { name: 'Pulse', price: '₦20,000', logo: pulseLogo },
      
      // Tech & Business
      { name: 'Techpoint', price: '₦20,000', logo: techpointLogo },
      { name: 'TechCabal', price: '₦25,000', logo: techCabalLogo },
      
      // Movie Platforms
      { name: 'Nollywire', price: '₦300,000', logo: null },
      { name: 'The Nollywood Reporter', price: '₦400,000', logo: null },
      { name: 'WKMup', price: '₦300,000', logo: null },
      { name: 'Nolly Critic', price: '₦300,000', logo: null },
      { name: 'Nigerian Movies Review', price: '₦500,000', logo: null },
       
      // Africa & Global Platforms
      { name: 'OkayAfrican', price: '₦2,500,000', logo: null },
      { name: 'GQ', price: '₦2,500,000', logo: null },
      { name: 'AP', price: '₦700,000', logo: null },
      { name: 'Benzinga', price: '₦700,000', logo: null },
      { name: 'Joy Online', price: '₦700,000', logo: null },
      { name: 'PeaceFm Online', price: '₦800,000', logo: null },
      { name: 'B&FT Online', price: '₦800,000', logo: null },
    ],
    note: 'These platforms accept 2–3 images, branded graphics, backlinks, and other promotional materials to enhance your story placement.'
  },
  2: {
    title: 'Tech & Startups',
    description: 'Focused tech PR on leading African and international tech platforms.',
    platforms: [
      // African Tech
      { name: 'Techpoint', price: '₦200,000', logo: techpointLogo },
      { name: 'TechCabal', price: '₦250,000', logo: techCabalLogo },
      
      // Cybersecurity
      { name: 'Cybersecurity Insiders', price: '₦700,000', logo: null },
      { name: 'CyberNews', price: '₦1,600,000', logo: null },
      { name: 'Influence', price: '₦700,000', logo: null },
      
      // Tech News & Analysis
      { name: 'TechRound', price: '₦1,600,000', logo: null },
      { name: 'Startup Observer', price: '₦500,000', logo: null },
      { name: 'Technology Dispatch', price: '₦1,000,000', logo: null },
      { name: 'Tech News Vision', price: '₦600,000', logo: null },
      { name: 'Esports News UK', price: '₦1,000,000', logo: null },
      
      // Crypto & Blockchain
      { name: 'Coin Journal', price: '₦1,000,000', logo: null },
      { name: 'Tech Bullion', price: '₦600,000', logo: null },
      { name: 'Crypto Daily', price: '₦1,800,000', logo: null },
      { name: 'The Crypto Week', price: 'Contact for pricing', logo: null },
      { name: 'The Coins Herald', price: 'Contact for pricing', logo: null },
      { name: 'The Coins Wire', price: 'Contact for pricing', logo: null },
      
      // Business & Finance Tech
      { name: 'Finsmes', price: '₦1,000,000', logo: null },
      { name: 'Brands Journal', price: '₦600,000', logo: null },
      { name: 'Business Matters', price: '₦1,400,000', logo: null },
      { name: 'Finance Digest', price: '₦600,000', logo: null },
      { name: 'Financial News', price: '₦500,000', logo: null },
      { name: 'Wealth Tribune', price: '₦500,000', logo: null },
      { name: 'Trading Herald', price: '₦500,000', logo: null },
      { name: 'Investment Guide', price: '₦600,000', logo: null },
      { name: 'Investing.com', price: '₦1,200,000', logo: null },
      { name: 'StreetInsiders.com', price: '₦400,000', logo: null },
      
      // Additional Platforms
      { name: 'Palm Bay Herald', price: '₦600,000', logo: null },
      { name: 'Property Development', price: '₦600,000', logo: null },
      { name: 'Online World News', price: '₦600,000', logo: null },
      { name: 'International Releases', price: '₦600,000', logo: null },
    ],
    note: 'Ideal for product launches, funding announcements, and startup thought leadership in the tech ecosystem.'
  },
  3: {
    title: 'UK News Platforms',
    description: 'Comprehensive coverage across UK media outlets, business publications, and regional news platforms for maximum UK market penetration.',
    platforms: [
      // UK Regional News
      { name: 'London Journal', price: '₦200,000', logo: null },
      { name: 'Glasgow Report', price: '₦200,000', logo: null },
      { name: 'Manchester Times', price: '₦200,000', logo: null },
      { name: 'UkHerald', price: '₦200,000', logo: null },
      { name: 'Birmingham Times', price: '₦200,000', logo: null },
      { name: 'UkReporter', price: '₦200,000', logo: null },
      { name: 'The Bristol Press', price: '₦200,000', logo: null },
      { name: 'Uk Wire', price: '₦200,000', logo: null },
      
      // Major UK News Outlets
      { name: 'Manchester Evening News', price: '₦3,800,000', logo: null },
      { name: 'Wales Online', price: '₦3,800,000', logo: null },
      { name: 'MyLondon', price: '₦3,800,000', logo: null },
      { name: 'Chronicle Live', price: '₦3,800,000', logo: null },
      { name: 'Edinburgh Live', price: '₦3,800,000', logo: null },
      { name: 'Galway Beo', price: '₦3,800,000', logo: null },
      { name: 'InYourArea', price: '₦3,800,000', logo: null },
      { name: 'Daily Records', price: '₦4,500,000', logo: null },
      { name: 'Echo', price: '₦3,800,000', logo: null },
      
      // UK Business & Finance
      { name: 'Business Live', price: '₦3,800,000', logo: null },
      { name: 'Business Cheshire', price: '₦500,000', logo: null },
      { name: 'Business Lancashire', price: '₦400,000', logo: null },
      { name: 'Business Manchester', price: '₦400,000', logo: null },
      { name: 'Calculator UK Business News', price: '₦500,000', logo: null },
      { name: 'Talk Business', price: '₦1,100,000', logo: null },
      
      // Sports & Entertainment
      { name: 'The Sporting News', price: '₦3,100,000', logo: null },
      { name: 'Football.London', price: '₦3,800,000', logo: null },
      { name: 'Female First', price: '₦1,400,000', logo: null },
      { name: 'Funeral Notices', price: '₦3,800,000', logo: null },
      
      // Lifestyle & Luxury
      { name: 'Luxury Adviser', price: '₦500,000', logo: null },
      
      // Finance & Investment
      { name: 'Financial News', price: '₦500,000', logo: null },
      { name: 'Wealth Tribune', price: '₦500,000', logo: null },
      { name: 'Trading Herald', price: '₦500,000', logo: null },
      { name: 'Investment Guide', price: '₦600,000', logo: null },
      
      // Technology & Crypto
      { name: 'TechRound', price: '₦1,600,000', logo: null },
      { name: 'Startup Observer', price: '₦500,000', logo: null },
      { name: 'Coin Journal', price: '₦1,000,000', logo: null },
      { name: 'Tech Bullion', price: '₦600,000', logo: null },
      { name: 'Crypto Daily', price: '₦1,800,000', logo: null },
      
      // Other Platforms
      { name: 'BusinessMole', price: '₦400,000', logo: null },
      { name: 'Economy Standard', price: '₦600,000', logo: null },
      { name: 'DeadLine', price: '₦900,000', logo: null },
      { name: 'Finsmes', price: '₦1,000,000', logo: null },
      { name: 'Brands Journal', price: '₦600,000', logo: null },
      { name: 'Business Matters', price: '₦1,400,000', logo: null },
      { name: 'Technology Dispatch', price: '₦1,000,000', logo: null },
      { name: 'Finance Digest', price: '₦600,000', logo: null },
    ],
    note: 'Extensive UK media coverage across news, business, sports, and lifestyle publications for comprehensive market reach.'
  },
  4: {
    title: 'Google News Platforms',
    description: 'Get featured on Google News approved platforms for maximum visibility and SEO benefits with our network of trusted news sources.',
    platforms: [
      { name: 'The Open News', price: '₦600,000', logo: null },
      { name: 'Verna Magazine', price: '₦600,000', logo: null },
      { name: 'AllNewsBuzz', price: '₦600,000', logo: null },
      { name: 'Entertainment Paper', price: '₦600,000', logo: null },
      { name: 'FabWorldToday', price: '₦600,000', logo: null },
      { name: 'Resident Weekly', price: '₦600,000', logo: null },
      { name: 'Sportz Weekly', price: '₦600,000', logo: null },
      { name: 'Data Source Hub', price: '₦600,000', logo: null },
      { name: 'GlobeStats', price: '₦600,000', logo: null },
      { name: 'Stats Globe', price: '₦600,000', logo: null },
      { name: 'Apsters Media', price: '₦600,000', logo: null },
      { name: 'Coverage Log', price: '₦600,000', logo: null },
      { name: 'Time Bulletin', price: '₦600,000', logo: null },
      { name: 'Tech News Vision', price: '₦600,000', logo: null },
      { name: 'The Nashville Post', price: '₦600,000', logo: null },
      { name: 'Industry Today', price: '₦600,000', logo: null },
      { name: 'California Times', price: '₦600,000', logo: null },
      { name: 'Feature Weekly', price: '₦600,000', logo: null },
      { name: 'Infuse News', price: '₦600,000', logo: null },
    ],
    note: 'All platforms are Google News approved, ensuring maximum visibility and SEO benefits for your content.'
  },
  5: {
    title: 'Global Premium Authority',
    description: 'Forbes, Fox News, BBC News, Bloomberg, Business Insider, Yahoo Finance and premium international platforms. Maximum authority and credibility with international market access.',
    platforms: [
      // Premium News Outlets
      { name: 'Forbes', price: '₦4,500,000', logo: forbesLogo },
      { name: 'Fox News', price: '₦5,250,000', logo: foxLogo },
      { name: 'BBC News', price: '₦7,950,000', logo: bbcNewsLogo },
      { name: 'Bloomberg', price: '₦3,525,000', logo: bloombergNewsLogo },
      { name: 'Business Insider', price: 'Contact for pricing', logo: null },
      { name: 'Yahoo Finance', price: 'Contact for pricing', logo: null },
      { name: 'Hardcore News', price: '₦1,890,000', logo: hardcoreLogo },
      
      // Other International Platforms
      { name: 'NewYork Weekly', price: '₦1,000,000', logo: null },
      { name: 'USA Wire', price: '₦900,000', logo: null },
      { name: 'AsiaOne', price: '₦700,000', logo: null },
      { name: 'MSN', price: '₦800,000', logo: null },
      { name: 'International Business Times', price: '₦1,500,000', logo: null },
      { name: 'IGB', price: '₦4,600,000', logo: null },
      { name: 'Casino Life', price: '₦3,100,000', logo: null },
    ],
    note: 'Premium international platforms that provide maximum credibility and global reach for your brand story.'
  },
};

function PackageDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const packageId = parseInt(id);
  const packageData = packageDetails[packageId];

  if (!packageData) {
    return (
      <div className="package-detail-page">
        <Navbar onScrollToSection={() => {}} />
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Package Not Found</h1>
          <Button onClick={() => navigate('/services/publications')}>Back to Publications</Button>
        </div>
        <Footer onScrollToSection={() => {}} />
      </div>
    );
  }

  const handleAddToCart = async (platform) => {
    const result = await addToCart({
      itemId: `${packageData.title}-${platform.name}-${Date.now()}`,
      title: `${platform.name} - ${packageData.title}`,
      price: platform.price,
      description: packageData.description,
      category: 'publication',
      quantity: 1,
    });
    
    if (result.success) {
      alert(`${platform.name} added to cart!`);
    }
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
    <div className="package-detail-page">
      <Navbar onScrollToSection={scrollToSection} />
      <div className="package-detail-container">
        <div className="package-header">
          <Button 
            onClick={() => navigate('/services/publications')} 
            className="back-button"
          >
            <IoArrowBack /> Back to Packages
          </Button>
          <h1 className="package-detail-title">{packageData.title}</h1>
          <p className="package-detail-description">{packageData.description}</p>
        </div>

        <div className="platforms-section">
          <h2 className="platforms-section-title">View Platforms</h2>
          <div className="platforms-grid">
            {packageData.platforms.map((platform, index) => (
              <div key={index} className="platform-card">
                <div className="platform-info">
                  {logoMap[platform.name] ? (
                    <div className="platform-logo-wrapper" data-name={platform.name}>
                      <img
                        src={logoMap[platform.name]}
                        alt={platform.name}
                        className="platform-logo-image"
                        onError={(e) => {
                          // If image fails to load, show the name instead
                          e.target.style.display = 'none';
                          e.target.parentElement.style.background = 'transparent';
                        }}
                      />
                    </div>
                  ) : (
                    <h3 className="platform-name">{platform.name}</h3>
                  )}
                  <div className="platform-price">{platform.price}</div>
                </div>
                <Button
                  onClick={() => handleAddToCart(platform)}
                  className="platform-add-btn"
                >
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </div>

        {packageData.note && (
          <div className="package-note">
            <IoCheckmarkCircle className="note-icon" />
            <p>{packageData.note}</p>
          </div>
        )}
      </div>
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

export default PackageDetailPage;