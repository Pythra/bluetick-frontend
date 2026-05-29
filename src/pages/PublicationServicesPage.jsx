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
  IoLayersOutline,
  IoChevronDown,
  IoChevronUp,
  IoStar,
  IoChatbubbleEllipses,
  IoCalendarOutline,
  IoLinkOutline,
  IoShieldCheckmarkOutline,
} from 'react-icons/io5';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer';
import EditorialGuidelinesSection from '../components/EditorialGuidelinesSection';
import PublicationFeaturedSplit from '../components/PublicationFeaturedSplit';
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
import './PublicationServicesPage.editorial.css';

// African News Platforms
const africanPlatforms = [
  { name: 'Punch', price: '\u20a680000', logo: punchLogo },
  { name: 'BusinessDay', price: '\u20a680000', logo: businessDayLogo },
  { name: 'Legit', price: 'NGN300,000', logo: legitLogo },
  { name: 'The Nation', price: '\u20a660000', logo: theNationLogo },
  { name: 'Independent', price: '\u20a620000', logo: independentLogo },
  { name: 'Vanguard', price: '\u20a630000', logo: vanguardLogo },
  { name: 'ThisDay', price: '\u20a630000', logo: thisDayLogo },
  { name: 'SunOnline', price: '\u20a630000', logo: sunOnlineLogo },
  { name: 'Daily Telegraph', price: '\u20a620000', logo: telegraphLogo },
  { name: 'Daily Trust', price: '\u20a630000', logo: dailyTrustLogo },
  { name: 'Daily Post', price: '\u20a630000', logo: dailyPostLogo },
  { name: 'Nairametrics', price: '\u20a630000', logo: nairametricsLogo },
  { name: 'Nairaland', price: '\u20a650000', logo: forbesLogo },
  { name: 'The Cable', price: '\u20a6300000', logo: cableLogo },
  { name: 'Guardian', price: '\u20a670000', logo: guardianLogo },
  { name: 'Leadership', price: '\u20a660000', logo: leadershipLogo },
  { name: 'Tribune', price: '\u20a630000', logo: tribuneLogo },
  { name: 'Champion', price: '\u20a620000', logo: championLogo },
  { name: "People's Daily", price: '\u20a620000', logo: peoplesDailyLogo },
  { name: 'Blueprint', price: '\u20a630000', logo: blueprintLogo },
  { name: 'GhanaWeb', price: 'NGN100,000', logo: ghanaWebLogo },
  { name: 'Pulse', price: '\u20a6300000', logo: pulseLogo },
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
  { name: 'Forbes', price: 'NGN 9,730,000', logo: forbesLogo },
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
  { name: 'Techpoint', price: '\u20a6300000', logo: techpointLogo },
  { name: 'TechCabal', price: '\u20a6300000', logo: techCabalLogo },
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
    id: 3,
    title: 'UK News Network',
    price: 'Contact for pricing',
    description: 'Reach UK audiences with top British publications and business outlets including BBC News, The Guardian, and more.',
    delivery: '24-48 Hours',
    popular: false,
    categoryId: 'uk',
    image: ukNewsImage,
  },
  {
    id: 4,
    title: 'Google News Verified',
    price: 'Contact for pricing',
    description: 'Get featured on Google News approved platforms for maximum visibility and search engine exposure.',
    delivery: '24-48 Hours',
    popular: false,
    categoryId: 'google-news',
    image: googleNewsImage,
  },
  {
    id: 2,
    title: 'Tech Cabal & Friends',
    price: 'Contact for pricing',
    description: 'TechCabal, Techpoint, Techeconomy, and more. Launch products, raise funding, or make ecosystem noise.',
    delivery: '6-24 Hours',
    categoryId: 'tech',
    image: techImage,
  },
  {
    id: 5,
    title: 'Global News',
    price: 'Contact for pricing',
    description: 'Forbes, BBC News, Bloomberg, Reuters. Unlock international credibility and investor-grade trust.',
    delivery: '2-7 Working Days',
    categoryId: 'international',
    image: globalImage,
  },
];

const additionalPublicationServices = [
  {
    id: 'backdate',
    title: 'Backdating an article',
    price: '₦50,000',
    unit: 'per article',
    description:
      'Request a past publication date on supported outlets when your announcement needs to align with an earlier milestone.',
    icon: IoCalendarOutline,
    accent: 'calendar',
  },
  {
    id: 'links',
    title: 'Including links in an article',
    price: '₦100,000',
    unit: 'per article',
    description:
      'Add branded or campaign URLs in the body of the piece where the outlet allows in-article hyperlinks.',
    icon: IoLinkOutline,
    accent: 'links',
  },
  {
    id: 'reputation',
    title: 'Deleting an existing article',
    subtitle: 'Reputation management',
    price: '₦500,000',
    unit: 'per article',
    description:
      'Request removal or suppression of a live article that is affecting your brand or public narrative.',
    icon: IoShieldCheckmarkOutline,
    accent: 'reputation',
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

  const scrollToPackages = () => {
    document.getElementById('publication-packages')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('publication-how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const mastheadStats = [
    { value: '20,000+', label: 'Media outlets', icon: IoNewspaperOutline, iconTone: 'mint' },
    { value: '6–24 hrs', label: 'Fast placements', icon: IoTime, iconTone: 'sky' },
    { value: '5', label: 'Curated packages', icon: IoLayersOutline, iconTone: 'amber' },
    { value: 'Global', label: 'Africa · UK · Tech', icon: IoGlobe, iconTone: 'mint' },
  ];

  return (
    <div className="publication-page">
      {showCartNotification && (
        <div className="publication-toast" role="status">
          Item added to cart!
        </div>
      )}
      <Navbar onScrollToSection={scrollToSection} />

      <section className="publication-masthead">
        <div className="publication-masthead-grid container">
          <div className="publication-masthead-copy">
            <p className="publication-eyebrow">Bluetickgeng · Press &amp; Media Distribution</p>
            <h1 className="publication-masthead-title">
              <span className="publication-masthead-title-line">Press release distribution</span>
              <span className="publication-masthead-title-accent">across Nigeria, Africa &amp; the world</span>
            </h1>
            <p className="publication-masthead-lead">
              From Punch and Vanguard to Forbes and BBC — we place your story on trusted news platforms with
              editorial review, live links, and campaign reports you can share with clients and investors.
            </p>
            <div className="publication-masthead-actions">
              <button type="button" className="publication-btn publication-btn-primary" onClick={scrollToPackages}>
                Browse packages
              </button>
              <button type="button" className="publication-btn publication-btn-ghost" onClick={scrollToHowItWorks}>
                How it works
              </button>
            </div>
            <div className="publication-masthead-stats" role="list" aria-label="Publication highlights">
              {mastheadStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <article key={stat.label} className="publication-stat" role="listitem">
                    <div className="publication-stat-top">
                      <div
                        className={`publication-stat-icon publication-stat-icon--${stat.iconTone}`}
                        aria-hidden="true"
                      >
                        <StatIcon />
                      </div>
                      <p className="publication-stat-value">{stat.value}</p>
                    </div>
                    <p className="publication-stat-label">{stat.label}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <div className="publication-masthead-visual" aria-hidden="true">
            <img src={newsImage} alt="" className="publication-masthead-image" />
            <div className="publication-masthead-visual-overlay" />
            <p className="publication-masthead-visual-tag">As seen on leading outlets</p>
          </div>
        </div>
      </section>

      <section id="publication-packages" className="publication-packages">
        <div className="container">
          <header className="publication-section-head">
            <p className="publication-section-kicker">Regional bundles</p>
            <h2 className="publication-section-title">
              Choose a publication package
            </h2>
            <p className="publication-section-lead">
              Each bundle targets a media region — African dailies, UK press, Google News, tech outlets, or global
              tier-one publications. Select a package to view outlets and per-platform pricing.
            </p>
          </header>
          <div className="publication-packages-grid">
            {packages.map((pkg) => {
              const category = publicationCategories.find((cat) => cat.id === pkg.categoryId);
              return (
                <article
                  key={pkg.id}
                  className={`publication-package-card publication-package-card--${pkg.categoryId} ${pkg.popular ? 'is-featured' : ''}`}
                >
                  {pkg.popular && <span className="publication-package-ribbon">Most popular</span>}
                  <div className="publication-package-media">
                    <img src={pkg.image} alt="" />
                    {category && (
                      <span className="publication-package-region">{category.title}</span>
                    )}
                  </div>
                  <div className="publication-package-body">
                    <p className="publication-package-delivery">
                      <IoTime aria-hidden="true" />
                      {pkg.delivery}
                    </p>
                    <h3 className="publication-package-name">{pkg.title}</h3>
                    <p className="publication-package-desc">{pkg.description}</p>
                    {category?.logos?.length > 0 && (
                      <div className="publication-package-logos" aria-label="Sample outlets">
                        {category.logos.slice(0, 6).map((logo) => (
                          <img key={logo.alt} src={logo.src} alt={logo.alt} />
                        ))}
                      </div>
                    )}
                    <Button
                      onClick={() => navigate(`/services/publications/package/${pkg.id}`)}
                      className="publication-package-cta"
                    >
                      View outlets &amp; pricing
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <PublicationFeaturedSplit />

      <section className="publication-additional-services">
        <div className="container">
          <header className="publication-section-head">
            <p className="publication-section-kicker">Extras</p>
            <h2 className="publication-section-title">Additional services &amp; fees</h2>
            <p className="publication-section-lead">
              Optional add-ons beyond standard package placement — request these when you submit your
              press release or during checkout.
            </p>
          </header>
          <div className="publication-addon-grid">
            {additionalPublicationServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <article
                  key={service.id}
                  className={`publication-addon-card publication-addon-card--${service.accent}`}
                >
                  <div className="publication-addon-card-icon" aria-hidden="true">
                    <IconComponent />
                  </div>
                  <div className="publication-addon-card-body">
                    <h3 className="publication-addon-card-title">{service.title}</h3>
                    {service.subtitle ? (
                      <p className="publication-addon-card-sub">{service.subtitle}</p>
                    ) : null}
                    <p className="publication-addon-card-desc">{service.description}</p>
                  </div>
                  <footer className="publication-addon-card-footer">
                    <span className="publication-addon-price">{service.price}</span>
                    <span className="publication-addon-unit">{service.unit}</span>
                  </footer>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="publication-how-it-works" className="publication-process">
        <div className="container">
          <header className="publication-section-head publication-section-head--center">
            <p className="publication-section-kicker">Simple workflow</p>
            <h2 className="publication-section-title">How it works</h2>
          </header>
          <ol className="publication-process-steps">
            {howItWorks.map((step) => {
              const IconComponent = step.icon;
              return (
                <li key={step.step} className="publication-process-step">
                  <span className="publication-process-step-num">{step.step}</span>
                  <div className="publication-process-step-icon">
                    <IconComponent aria-hidden="true" />
                  </div>
                  <div className="publication-process-step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="publication-goals">
        <div className="container">
          <header className="publication-section-head">
            <p className="publication-section-kicker">Campaign objectives</p>
            <h2 className="publication-section-title">What are your PR goals?</h2>
            <p className="publication-section-lead">
              Whether you need local buzz, tech credibility, or global authority — we match your story to the right
              outlets.
            </p>
          </header>
          <div className="publication-goals-grid">
            {prGoals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <article key={goal.title} className="publication-goal-card">
                  <IconComponent className="publication-goal-icon" aria-hidden="true" />
                  <h3>{goal.title}</h3>
                  <p className="publication-goal-sub">{goal.subtitle}</p>
                  <ul>
                    {goal.features.map((feature) => (
                      <li key={feature}>
                        <IoCheckmarkCircle aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <EditorialGuidelinesSection />

      <section className="publication-policies">
        <div className="container">
          <header className="publication-section-head">
            <p className="publication-section-kicker">Before you publish</p>
            <h2 className="publication-section-title">Guidelines &amp; policies</h2>
          </header>
          
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
        </div>
      </section>

      {/* Price List Section moved to individual category pages */}

      <section className="publication-testimonials">
        <div className="container">
          <header className="publication-section-head publication-section-head--center">
            <p className="publication-section-kicker">Client stories</p>
            <h2 className="publication-section-title">What our clients say</h2>
          </header>
          <div className="publication-testimonials-grid">
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
    <blockquote className="publication-quote-card">
      <div className="publication-quote-stars" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <IoStar key={i} className={i < rating ? 'is-filled' : ''} aria-hidden="true" />
        ))}
      </div>
      <p>&ldquo;{content}&rdquo;</p>
      <footer>
        <cite>{name}</cite>
        <span>{role}</span>
      </footer>
    </blockquote>
  );
}

export default PublicationServicesPage;
