import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import FAQ from '../components/FAQ';
import { 
  IoCheckmarkCircle, 
  IoCard, 
  IoDocumentText, 
  IoRocket, 
  IoNewspaper,
  IoGlobe,
  IoMusicalNotes,
  IoSearch,
  IoLocation,
  IoNewspaperOutline,
  IoPeople,
  IoEye,
  IoTime,
  IoChevronDown,
  IoChevronUp,
  IoStar,
  IoChatbubbleEllipses
} from 'react-icons/io5';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer';
import newsImage from '../assets/news.jpg';
import techImage from '../assets/tech.jpg';
import globalImage from '../assets/global.jpg';
import googleNewsImage from '../assets/Google_News.png';
import ukNewsImage from '../assets/uknews.jpeg';
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
import './PublicationServicesPage.css';

// African News Platforms
const africanPlatforms = [
  { name: 'Punch', price: '\u20a680000', logo: punchLogo },
  { name: 'BusinessDay', price: '\u20a680000', logo: businessDayLogo },
  { name: 'Legit', price: '\u20a610000', logo: legitLogo },
  { name: 'The Nation', price: '\u20a630000', logo: theNationLogo },
  { name: 'Independent', price: '\u20a620000', logo: independentLogo },
  { name: 'Vanguard', price: '\u20a620000', logo: vanguardLogo },
  { name: 'ThisDay', price: '\u20a620000', logo: thisDayLogo },
  { name: 'SunOnline', price: '\u20a620000', logo: sunOnlineLogo },
  { name: 'Daily Telegraph', price: '\u20a620000', logo: telegraphLogo },
  { name: 'Daily Trust', price: '\u20a620000', logo: dailyTrustLogo },
  { name: 'Daily Post', price: '\u20a620000', logo: dailyPostLogo },
  { name: 'Nairametrics', price: '\u20a630000', logo: nairametricsLogo },
  { name: 'Nairaland', price: '\u20a650000', logo: forbesLogo },
  { name: 'The Cable', price: '\u20a625000', logo: cableLogo },
  { name: 'Guardian', price: '\u20a630000', logo: guardianLogo },
  { name: 'Leadership', price: '\u20a630000', logo: leadershipLogo },
  { name: 'Tribune', price: '\u20a630000', logo: tribuneLogo },
  { name: 'Champion', price: '\u20a620000', logo: championLogo },
  { name: "People's Daily", price: '\u20a620000', logo: peoplesDailyLogo },
  { name: 'Blueprint', price: '\u20a620000', logo: blueprintLogo },
  { name: 'GhanaWeb', price: '\u20a610000', logo: ghanaWebLogo },
  { name: 'Pulse', price: '\u20a620000', logo: pulseLogo },
  { name: 'OkayAfrican', price: '\u20a62500000', logo: null },
  { name: 'PeaceFm Online', price: '\u20a6800000', logo: null },
  { name: 'B&FT Online', price: '\u20a6800000', logo: null },
  { name: 'Nollywire', price: '\u20a6300000', logo: null },
  { name: 'The Nollywood Reporter', price: '\u20a6400000', logo: null },
  { name: 'WKMup', price: '\u20a6300000', logo: null },
  { name: 'Nolly Critic', price: '\u20a6300000', logo: null },
  { name: 'Nigerian Movies Review', price: '\u20a6500000', logo: null },
];

// International Platforms
const internationalPlatforms = [
  { name: 'Forbes', price: 'NGN 4,500,000', logo: forbesLogo },
  { name: 'Fox News', price: 'NGN 5,250,000', logo: foxLogo },
  { name: 'BBC News', price: 'NGN 7,950,000', logo: bbcNewsLogo },
  { name: 'Bloomberg', price: 'NGN 3,525,000', logo: bloombergNewsLogo },
  { name: 'Hardcore News', price: 'NGN 1,890,000', logo: hardcoreLogo },
  { name: 'GQ', price: 'NGN 2,500,000', logo: null },
  { name: 'NewYork Weekly', price: 'NGN 1,000,000', logo: null },
  { name: 'USA Wire', price: 'NGN 900,000', logo: null },
  { name: 'AsiaOne', price: 'NGN 700,000', logo: null },
  { name: 'AP', price: 'NGN 700,000', logo: null },
  { name: 'Benzinga', price: 'NGN 700,000', logo: null },
  { name: 'Joy Online', price: 'NGN 700,000', logo: null },
  { name: 'The Open News', price: 'NGN 600,000', logo: null },
  { name: 'Verna Magazine', price: 'NGN 600,000', logo: null },
  { name: 'AllNewsBuzz', price: 'NGN 600,000', logo: null },
  { name: 'Entertainment Paper', price: 'NGN 600,000', logo: null },
  { name: 'FabWorldToday', price: 'NGN 600,000', logo: null },
  { name: 'Resident Weekly', price: 'NGN 600,000', logo: null },
  { name: 'Sportz Weekly', price: 'NGN 600,000', logo: null },
  { name: 'Data Source Hub', price: 'NGN 600,000', logo: null },
  { name: 'GlobeStats', price: 'NGN 600,000', logo: null },
  { name: 'Stats Globe', price: 'NGN 600,000', logo: null },
  { name: 'Apsters Media', price: 'NGN 600,000', logo: null },
  { name: 'Coverage Log', price: 'NGN 600,000', logo: null },
  { name: 'Time Bulletin', price: 'NGN 600,000', logo: null },
  { name: 'Tech News Vision', price: 'NGN 600,000', logo: null },
  { name: 'The Nashville Post', price: 'NGN 600,000', logo: null },
  { name: 'Industry Today', price: 'NGN 600,000', logo: null },
  { name: 'California Times', price: 'NGN 600,000', logo: null },
  { name: 'Feature Weekly', price: 'NGN 600,000', logo: null },
  { name: 'Infuse News', price: 'NGN 600,000', logo: null },
];

// Google News Platforms
const googleNewsPlatforms = [
  { name: 'The Open News', price: '\u20a6600000', logo: null },
  { name: 'Verna Magazine', price: '\u20a6600000', logo: null },
  { name: 'AllNewsBuzz', price: '\u20a6600000', logo: null },
  { name: 'Entertainment Paper', price: '\u20a6600000', logo: null },
  { name: 'FabWorldToday', price: '\u20a6600000', logo: null },
  { name: 'Resident Weekly', price: '\u20a6600000', logo: null },
  { name: 'Sportz Weekly', price: '\u20a6600000', logo: null },
  { name: 'Data Source Hub', price: '\u20a6600000', logo: null },
  { name: 'GlobeStats', price: '\u20a6600000', logo: null },
  { name: 'Stats Globe', price: '\u20a6600000', logo: null },
  { name: 'Apsters Media', price: '\u20a6600000', logo: null },
  { name: 'Coverage Log', price: '\u20a6600000', logo: null },
  { name: 'Time Bulletin', price: '\u20a6600000', logo: null },
  { name: 'Tech News Vision', price: '\u20a6600000', logo: null },
  { name: 'The Nashville Post', price: '\u20a6600000', logo: null },
  { name: 'Industry Today', price: '\u20a6600000', logo: null },
  { name: 'California Times', price: '\u20a6600000', logo: null },
  { name: 'Feature Weekly', price: '\u20a6600000', logo: null },
  { name: 'Infuse News', price: '\u20a6600000', logo: null },
];

// UK News Platforms
const ukPlatforms = [
  { name: 'LondonJournal', price: '\u20a6200000', logo: null },
  { name: 'Glasgow Report', price: '\u20a6200000', logo: null },
  { name: 'Manchester Times', price: '\u20a6200000', logo: null },
  { name: 'UkHerald', price: '\u20a6200000', logo: null },
  { name: 'Birmingham Times', price: '\u20a6200000', logo: null },
  { name: 'UkReporter', price: '\u20a6200000', logo: null },
  { name: 'The Bristol Press', price: '\u20a6200000', logo: null },
  { name: 'Uk Wire', price: '\u20a6200000', logo: null },
  { name: 'Influence', price: '\u20a6700000', logo: null },
  { name: 'Cybersecurity Insiders', price: '\u20a6700000', logo: null },
  { name: 'MSN', price: '\u20a6800000', logo: null },
  { name: 'Investing.com', price: '\u20a61200000', logo: null },
  { name: 'StreetInsiders.com', price: '\u20a6400000', logo: null },
  { name: 'CyberNews', price: '\u20a61600000', logo: null },
  { name: 'BusinessMole', price: '\u20a6400000', logo: null },
  { name: 'International Business Times', price: '\u20a61500000', logo: null },
  { name: 'Business Cheshire', price: '\u20a6500000', logo: null },
  { name: 'Business Lancashire', price: '\u20a6400000', logo: null },
  { name: 'Business Manchester', price: '\u20a6400000', logo: null },
  { name: 'Business Live', price: '\u20a63800000', logo: null },
  { name: 'Echo', price: '\u20a63800000', logo: null },
  { name: 'Calculator UK Business News', price: '\u20a6500000', logo: null },
  { name: 'Talk Business', price: '\u20a61100000', logo: null },
  { name: 'Investment Guide', price: '\u20a6600000', logo: null },
  { name: 'Manchester Evening News', price: '\u20a63800000', logo: null },
  { name: 'Wales Online', price: '\u20a63800000', logo: null },
  { name: 'MyLondon', price: '\u20a63800000', logo: null },
  { name: 'Football.London', price: '\u20a63800000', logo: null },
  { name: 'Luxury Adviser', price: '\u20a6500000', logo: null },
  { name: 'Financial News', price: '\u20a6500000', logo: null },
  { name: 'Wealth Tribune', price: '\u20a6500000', logo: null },
  { name: 'Trading Herald', price: '\u20a6500000', logo: null },
  { name: 'TechRound', price: '\u20a61600000', logo: null },
  { name: 'Startup Observer', price: '\u20a6500000', logo: null },
  { name: 'Palm Bay Herald', price: '\u20a6600000', logo: null },
  { name: 'Property Development', price: '\u20a6600000', logo: null },
  { name: 'Online World News', price: '\u20a6600000', logo: null },
  { name: 'International Releases', price: '\u20a6600000', logo: null },
  { name: 'Coin Journal', price: '\u20a61000000', logo: null },
  { name: 'Tech Bullion', price: '\u20a6600000', logo: null },
  { name: 'Crypto Daily', price: '\u20a61800000', logo: null },
  { name: 'IGB', price: '\u20a64600000', logo: null },
  { name: 'Esports News UK', price: '\u20a61000000', logo: null },
  { name: 'The Sporting News', price: '\u20a63100000', logo: null },
  { name: 'Casino Life', price: '\u20a63100000', logo: null },
  { name: 'Economy Standard', price: '\u20a6600000', logo: null },
  { name: 'Funeral Notices', price: '\u20a63800000', logo: null },
  { name: 'Daily Records', price: '\u20a64500000', logo: null },
  { name: 'InYourArea', price: '\u20a63800000', logo: null },
  { name: 'DeadLine', price: '\u20a6900000', logo: null },
  { name: 'Female First', price: '\u20a61400000', logo: null },
  { name: 'Chronicle Live', price: '\u20a63800000', logo: null },
  { name: 'Edinburgh Live', price: '\u20a63800000', logo: null },
  { name: 'Galway Beo', price: '\u20a63800000', logo: null },
  { name: 'Finsmes', price: '\u20a61000000', logo: null },
  { name: 'Brands Journal', price: '\u20a6600000', logo: null },
  { name: 'Business Matters', price: '\u20a61400000', logo: null },
  { name: 'Technology Dispatch', price: '\u20a61000000', logo: null },
  { name: 'Finance Digest', price: '\u20a6600000', logo: null },
];

// Tech & Startup Platforms
const techPlatforms = [
  { name: 'Techpoint', price: '\u20a620000', logo: techpointLogo },
  { name: 'TechCabal', price: '\u20a625000', logo: techCabalLogo },
  { name: 'Cybersecurity Insiders', price: '\u20a6700000', logo: null },
  { name: 'TechRound', price: '\u20a61600000', logo: null },
  { name: 'Startup Observer', price: '\u20a6500000', logo: null },
  { name: 'Coin Journal', price: '\u20a61000000', logo: null },
  { name: 'Tech Bullion', price: '\u20a6600000', logo: null },
  { name: 'Crypto Daily', price: '\u20a61800000', logo: null },
  { name: 'Esports News UK', price: '\u20a61000000', logo: null },
  { name: 'Technology Dispatch', price: '\u20a61000000', logo: null },
];

// Global/International Platforms (to be added to internationalPlatforms)
const additionalInternationalPlatforms = [
  { name: 'MSN', price: 'NGN 800,000', logo: null },
  { name: 'Investing.com', price: 'NGN 1,200,000', logo: null },
  { name: 'StreetInsiders.com', price: 'NGN 400,000', logo: null },
  { name: 'CyberNews', price: 'NGN 1,600,000', logo: null },
  { name: 'International Business Times', price: 'NGN 1,500,000', logo: null },
  { name: 'Talk Business', price: 'NGN 1,100,000', logo: null },
  { name: 'Investment Guide', price: 'NGN 600,000', logo: null },
  { name: 'The Sporting News', price: 'NGN 3,100,000', logo: null },
  { name: 'Casino Life', price: 'NGN 3,100,000', logo: null },
  { name: 'DeadLine', price: 'NGN 900,000', logo: null },
  { name: 'Finsmes', price: 'NGN 1,000,000', logo: null },
];

// Add additional international platforms to the existing array
const allInternationalPlatforms = [...internationalPlatforms, ...additionalInternationalPlatforms];

const baseCategories = [
  {
    id: 'african',
    title: 'African News',
    subtitle: 'Dominate top African publications like Punch, Guardian, Vanguard, and more.',
    platforms: africanPlatforms,
  },
  {
    id: 'uk',
    title: 'UK News',
    subtitle: 'Reach UK audiences with top British publications and business outlets.',
    platforms: ukPlatforms,
  },
  {
    id: 'google-news',
    title: 'Google News',
    subtitle: 'Get featured on Google News approved platforms for maximum visibility.',
    platforms: googleNewsPlatforms,
  },
  {
    id: 'international',
    title: 'Global News',
    subtitle: 'Break into BBC News, Bloomberg, Forbes, and other global heavyweights.',
    platforms: allInternationalPlatforms,
  },
  {
    id: 'tech',
    title: 'Tech & Startups',
    subtitle: 'Get featured in leading tech publications and crypto news platforms.',
    platforms: techPlatforms,
  },
];

const publicationCategories = baseCategories.map((category) => {
  // Filter platforms to only include those with a logo
  const platformsWithLogos = category.platforms.filter(platform => platform.logo);
  
  return {
    ...category,
    // Only include up to 10 platforms with logos
    logos: platformsWithLogos.slice(0, 10).map((platform) => ({
      src: platform.logo,
      alt: platform.name,
    })),
  };
});

const packages = [
  {
    id: 1,
    title: 'African News Spotlight',
    price: 'Contact for pricing',
    description: 'Punch, Vanguard, Guardian Nigeria + 15 outlets. Perfect for African market dominance with guaranteed placements.',
    delivery: '6-24 Hours',
    popular: true,
    categoryId: 'african',
    image: newsImage,
  },
  {
    id: 2,
    title: 'UK News Network',
    price: 'Contact for pricing',
    description: 'Reach UK audiences with top British publications and business outlets including BBC News, The Guardian, and more.',
    delivery: '24-48 Hours',
    popular: false,
    categoryId: 'uk',
    image: ukNewsImage,
  },
  {
    id: 3,
    title: 'Google News Verified',
    price: 'Contact for pricing',
    description: 'Get featured on Google News approved platforms for maximum visibility and search engine exposure.',
    delivery: '24-48 Hours',
    popular: false,
    categoryId: 'google-news',
    image: googleNewsImage,
  },
  {
    id: 4,
    title: 'Tech Cabal & Friends',
    price: 'Contact for pricing',
    description: 'TechCabal, Techpoint, Techeconomy, and more. Launch products, raise funding, or make ecosystem noise.',
    delivery: '6-24 Hours',
    categoryId: 'tech',
    image: techImage,
  },
  {
    id: 3,
    title: 'Global News',
    price: 'Contact for pricing',
    description: 'Forbes, BBC News, Bloomberg, Reuters. Unlock international credibility and investor-grade trust.',
    delivery: '2-7 Working Days',
    categoryId: 'international',
    image: globalImage,
  },
];

// FAQ Data
// FAQ data has been moved to the FAQ component

const prGoals = [
  { 
    title: 'Your Brand in Punch & Forbes in 24hrs',
    subtitle: 'Get Local Buzz in Nigeria',
    description: 'Perfect for businesses wanting to dominate the Nigerian market',
    icon: IoNewspaperOutline,
    features: [
      'Featured on Punch, Vanguard, Guardian Nigeria',
      'Reach 80M+ monthly Nigerian readers',
      'Build local authority and trust'
    ]
  },
  {
    title: 'Launch a Product in Tech or Startup',
    subtitle: 'Ideal for tech companies and startups making waves',
    icon: IoRocket,
    features: [
      'Featured on Techpoint, TechCabal, Techeconomy',
      'Reach tech-savvy audiences and investors',
      'Build startup credibility fast'
    ]
  },
  {
    title: 'Build Global Authority',
    subtitle: 'For brands seeking international recognition',
    icon: IoGlobe,
    features: [
      'Featured on Forbes, Reuters, Entrepreneur, CNBC',
      'Establish worldwide credibility',
      'Attract global partnerships and opportunities'
    ]
  },
  {
    title: 'Reach the African Music Scene',
    subtitle: 'Perfect for artists, labels, and music businesses',
    icon: IoMusicalNotes,
    features: [
      'Featured on Naijaloaded, Tooxclusive, NotJustOk',
      'Connect with African music fans',
      'Build your fanbase across the continent'
    ]
  },
  {
    title: 'Improve SEO',
    subtitle: 'For SEO Specialists looking to build backlinks',
    icon: IoSearch,
    features: [
      'Featured on Google News sites',
      'Indexed by search engines for long-term SEO value',
      'Drive consistent traffic from high-authority media outlets'
    ]
  },
  {
    title: 'Get Featured in the USA or UK',
    subtitle: 'Expand your reach to Western markets',
    icon: IoLocation,
    features: [
      'Featured on Business Insider, London Journal',
      'Access US and UK media networks',
      'Build international market presence'
    ]
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Pick and Pay for Your Package',
    description: 'Browse our media bundles, select the one that fits your goal, and check out. Need help choosing? Contact us.',
    icon: IoCard
  },
  {
    step: 2,
    title: 'Submit Your Press Release',
    description: 'After payment, you\'ll be asked to upload your press release (Google Doc or Word format). If you don\'t have one, we can help you write it.',
    icon: IoDocumentText
  },
  {
    step: 3,
    title: 'We Review and Distribute',
    description: 'Our editorial team reviews and schedules your release. Most go live within 6–24 hours, depending on your selected platforms.',
    icon: IoRocket
  },
  {
    step: 4,
    title: 'Get Your Report',
    description: 'Once published, you\'ll receive a detailed report with all the official links — perfect for sharing, saving, or pitching.',
    icon: IoNewspaper
  },
];

function PublicationServicesPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);

  const handleAddToCart = async (item) => {
    const result = await addToCart({
      itemId: item.id || `${item.title}-${Date.now()}`,
      title: item.title || item.name,
      price: item.price,
      description: item.description || item.delivery || '',
      category: 'publication',
      quantity: 1,
    });
    
    if (result.success) {
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 3000);
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
    <div className="publication-page">
      {showCartNotification && (
        <div className="cart-notification">
          Item added to cart!
        </div>
      )}
      <Navbar onScrollToSection={scrollToSection} />
      
      {/* Hero Section */}
      <section
        className="publication-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.55), rgba(30, 64, 175, 0.5)), url(${newsImage})`
        }}
      >
        <div className="hero-container">
          <h1 className="hero-title">Press Release Distribution Services in Nigeria</h1>
          <p className="hero-subtitle">
            Get Your Brand Featured on 20,000+ News Platforms Across Nigeria, Africa, and the Globe - Fast
          </p>
          <p className="hero-description">
            From Punch to Forbes, our press release distribution service gets your brand story guaranteed placements 
            on top African and international platforms in 24 hours
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How it works</h2>
          <div className="steps-grid">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="step-card">
                  <div className="step-icon-wrapper">
                    <IconComponent className="step-icon" />
                    <div className="step-number">Step {step.step}</div>
                  </div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PR Goals Section */}
      <section className="pr-goals">
        <div className="container">
          <h2 className="section-title">What Are Your PR Goals?</h2>
          <div className="goals-grid">
            {prGoals.map((goal, index) => {
              const IconComponent = goal.icon;
              return (
                <div key={index} className="goal-card">
                  <IconComponent className="goal-icon" />
                  <h3 className="goal-title">{goal.title}</h3>
                  <p className="goal-subtitle">{goal.subtitle}</p>
                  <ul className="goal-features">
                    {goal.features.map((feature, idx) => (
                      <li key={idx}>
                        <IoCheckmarkCircle className="feature-check" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="publication-packages">
        <div className="container">
          <h2 className="section-title">Choose PR Packages That Fit Your Needs</h2>
          <div className="packages-grid">
            {packages.map((pkg) => {
              const category = publicationCategories.find((cat) => cat.id === pkg.categoryId);
              return (
                <div key={pkg.id} className={`package-card ${pkg.popular ? 'popular' : ''}`}>
                  {pkg.popular && <div className="popular-badge">MOST POPULAR</div>}
                  <div className="package-card-media">
                    <img src={pkg.image} alt={`${pkg.title} visual`} />
                    {category && <span className="package-category-pill">{category.title}</span>}
                  </div>
                  <h3 className="package-title">{pkg.title}</h3>
                  <div className="package-delivery">Delivery: {pkg.delivery}</div>
                  <p className="package-description">{pkg.description}</p>
                  {category && category.logos && category.logos.length > 0 && (
                    <div className="package-logo-strip">
                      <div className="package-logo-track">
                        {[...category.logos, ...category.logos].map((logo, index) => (
                          <div
                            key={`${pkg.id}-${logo.alt}-${index}`}
                            className="package-logo-chip"
                          >
                            <img src={logo.src} alt={logo.alt} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button 
                    onClick={() => navigate(`/services/publications/package/${pkg.id}`)} 
                    className="package-button"
                  >
                    Select Package
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Price List Section moved to individual category pages */}

      {/* Guidelines & Policies Section */}
      <section className="guidelines-section">
        <div className="container">
          <h2 className="section-title">Publication Guidelines & Policies</h2>
          
          <div className="guidelines-warning">
            <p className="warning-text">
              <strong>Important:</strong> Once an article is published, it becomes increasingly challenging to remove or make substantial edits.
            </p>
            <p className="warning-text">
              To maintain the accuracy and integrity of our content, we kindly ask that you adhere to the following guidelines:
            </p>
          </div>

          <div className="guidelines-content">
            <div className="guideline-item">
              <div className="guideline-number">1</div>
              <div className="guideline-text">
                <h3 className="guideline-title">Thorough Review</h3>
                <p>Please read through each article carefully before giving approval for publication. Ensure the information is accurate, aligns with your intended messaging, and is completely error-free.</p>
              </div>
            </div>

            <div className="guideline-item">
              <div className="guideline-number">2</div>
              <div className="guideline-text">
                <h3 className="guideline-title">Accurate Submission</h3>
                <p>Double-check all details for correctness and completeness before sending them to our team.</p>
              </div>
            </div>

            <div className="guideline-item">
              <div className="guideline-number">3</div>
              <div className="guideline-text">
                <h3 className="guideline-title">Potential Editing</h3>
                <p>Editors may adjust or refine submitted articles to meet platform requirements. If you prefer a verbatim version or need contact details included, kindly request this in advance, as it may attract an additional fee.</p>
              </div>
            </div>

            <div className="guideline-item">
              <div className="guideline-number">4</div>
              <div className="guideline-text">
                <h3 className="guideline-title">Refund Policy</h3>
              </div>
            </div>
          </div>

          <div className="additional-services">
            <h3 className="additional-services-title">Additional Services & Fees</h3>
            <div className="services-list">
              <div className="service-fee-item">
                <span className="service-name">Backdating an article</span>
                <span className="service-price">₦10,000 per article</span>
              </div>
              <div className="service-fee-item">
                <span className="service-name">Including links in an article</span>
                <span className="service-price">₦30,000 per article</span>
              </div>
              <div className="service-fee-item">
                <span className="service-name">Deleting an article from a platform after publication</span>
                <span className="service-price">₦60,000 per article</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price List Section moved to individual category pages */}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <div className="testimonial-grid">
            <TestimonialCard
              name="Michael Adebayo"
              role="Founder, FinTech Solutions"
              content="The team at Bluetickgeng made our product launch a huge success. Our press release appeared on Punch, Guardian, and Vanguard, giving us the credibility we needed in the Nigerian market."
              rating={5}
            />
            <TestimonialCard
              name="Chiamaka Okafor"
              role="Marketing Director, E-commerce Platform"
              content="Outstanding service! They wrote our press release, got it published on multiple platforms, and provided detailed reports. The SEO benefits were noticeable within weeks. Worth every naira!"
              rating={5}
            />
            <TestimonialCard
              name="David Thompson"
              role="Brand Manager, Entertainment Company"
              content="We've used Bluetickgeng for multiple press releases. Their network is impressive, turnaround is fast, and the quality is consistently excellent. They're now our go-to for all publication needs."
              rating={5}
            />
            <TestimonialCard
              name="Amina Hassan"
              role="Public Relations Manager"
              content="The 'As Seen On' badges we received helped boost our brand credibility significantly. The team is responsive, professional, and delivers exactly what they promise. Highly recommended!"
              rating={5}
            />
            <TestimonialCard
              name="James Okonkwo"
              role="Startup Founder"
              content="As a new startup, getting featured on reputable platforms was crucial. Bluetickgeng made it happen quickly and affordably. The exposure helped us secure our first major client. Thank you!"
              rating={5}
            />
          </div>
        </div>
      </section>

      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

// Testimonial Card Component
function TestimonialCard({ name, role, content, rating }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-content">
        <p className="testimonial-text">"{content}"</p>
        <div className="testimonial-rating">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'star filled' : 'star'}>
              {i < rating ? '★' : '☆'}
            </span>
          ))}
        </div>
      </div>
      <div className="testimonial-author">
        <h4 className="author-name">{name}</h4>
        <p className="author-role">{role}</p>
      </div>
    </div>
  );
}

export default PublicationServicesPage;
