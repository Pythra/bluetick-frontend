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
  IoChevronUp,
  IoChatbubbleEllipses,
  IoCalendarOutline,
  IoLinkOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import Navbar from '../components/Navbar';
import { usePartnerText } from '../utils/partnerText';
import { useCurrency } from '../contexts/CurrencyContext.jsx';
import Button from '../components/Button';
import Footer from '../components/Footer';
import ClientsSection from '../components/ClientsSection';
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
import { getPublicationPlatformLogo } from '../utils/publicationPlatformLogos';
import './PublicationServicesPage.css';
import './PublicationServicesPage.editorial.css';

// Helper function to parse price strings to numeric values
const parsePriceToNumber = (priceStr) => {
  if (typeof priceStr === 'number') return priceStr;
  const cleaned = String(priceStr)
    .replace(/[^\d]/g, '')
    .replace(/,/g, '');
  return parseInt(cleaned) || 0;
};

// African News Platforms
const africanPlatforms = [
  { name: 'Punch', priceValue: 80000, logo: punchLogo },
  { name: 'BusinessDay', priceValue: 80000, logo: businessDayLogo },
  { name: 'Legit', priceValue: 300000, logo: legitLogo },
  { name: 'The Nation', priceValue: 60000, logo: theNationLogo },
  { name: 'Independent', priceValue: 20000, logo: independentLogo },
  { name: 'Vanguard', priceValue: 30000, logo: vanguardLogo },
  { name: 'ThisDay', priceValue: 30000, logo: thisDayLogo },
  { name: 'SunOnline', priceValue: 30000, logo: sunOnlineLogo },
  { name: 'Daily Telegraph', priceValue: 20000, logo: telegraphLogo },
  { name: 'Daily Trust', priceValue: 30000, logo: dailyTrustLogo },
  { name: 'Daily Post', priceValue: 30000, logo: dailyPostLogo },
  { name: 'Nairametrics', priceValue: 30000, logo: nairametricsLogo },
  { name: 'Nairaland', priceValue: 50000, logo: forbesLogo },
  { name: 'The Cable', priceValue: 300000, logo: cableLogo },
  { name: 'Guardian', priceValue: 70000, logo: guardianLogo },
  { name: 'Leadership', priceValue: 60000, logo: leadershipLogo },
  { name: 'Tribune', priceValue: 30000, logo: tribuneLogo },
  { name: 'Champion', priceValue: 20000, logo: championLogo },
  { name: "People's Daily", priceValue: 20000, logo: peoplesDailyLogo },
  { name: 'Blueprint', priceValue: 30000, logo: blueprintLogo },
  { name: 'GhanaWeb', priceValue: 100000, logo: ghanaWebLogo },
  { name: 'Pulse', priceValue: 300000, logo: pulseLogo },
  { name: 'OkayAfrican', priceValue: 2500000, logo: null },
  { name: 'PeaceFm Online', priceValue: 800000, logo: null },
  { name: 'B&FT Online', priceValue: 800000, logo: null },
  { name: 'Nollywire', priceValue: 300000, logo: null },
  { name: 'The Nollywood Reporter', priceValue: 400000, logo: null },
  { name: 'WKMup', priceValue: 300000, logo: null },
  { name: 'Nolly Critic', priceValue: 300000, logo: null },
  { name: 'Nigerian Movies Review', priceValue: 500000, logo: null },
];

// International Platforms
const internationalPlatforms = [
  { name: 'Forbes', priceValue: 9730000, logo: forbesLogo },
  { name: 'Fox News', priceValue: 5250000, logo: foxLogo },
  { name: 'BBC News', priceValue: 7950000, logo: bbcNewsLogo },
  { name: 'Bloomberg', priceValue: 3525000, logo: bloombergNewsLogo },
  { name: 'Hardcore News', priceValue: 1890000, logo: hardcoreLogo },
  { name: 'GQ', priceValue: 2500000, logo: null },
  { name: 'NewYork Weekly', priceValue: 1000000, logo: null },
  { name: 'USA Wire', priceValue: 900000, logo: null },
  { name: 'AsiaOne', priceValue: 700000, logo: null },
  { name: 'AP', priceValue: 700000, logo: null },
  { name: 'Benzinga', priceValue: 700000, logo: null },
  { name: 'Joy Online', priceValue: 700000, logo: null },
  { name: 'The Open News', priceValue: 600000, logo: null },
  { name: 'Verna Magazine', priceValue: 600000, logo: null },
  { name: 'AllNewsBuzz', priceValue: 600000, logo: null },
  { name: 'Entertainment Paper', priceValue: 600000, logo: null },
  { name: 'FabWorldToday', priceValue: 600000, logo: null },
  { name: 'Resident Weekly', priceValue: 600000, logo: null },
  { name: 'Sportz Weekly', priceValue: 600000, logo: null },
  { name: 'Data Source Hub', priceValue: 600000, logo: null },
  { name: 'GlobeStats', priceValue: 600000, logo: null },
  { name: 'Stats Globe', priceValue: 600000, logo: null },
  { name: 'Apsters Media', priceValue: 600000, logo: null },
  { name: 'Coverage Log', priceValue: 600000, logo: null },
  { name: 'Time Bulletin', priceValue: 600000, logo: null },
  { name: 'Tech News Vision', priceValue: 600000, logo: null },
  { name: 'The Nashville Post', priceValue: 600000, logo: null },
  { name: 'Industry Today', priceValue: 600000, logo: null },
  { name: 'California Times', priceValue: 600000, logo: null },
  { name: 'Feature Weekly', priceValue: 600000, logo: null },
  { name: 'Infuse News', priceValue: 600000, logo: null },
];

// Google News Platforms
const googleNewsPlatforms = [
  { name: 'The Open News', priceValue: 600000, logo: null },
  { name: 'Verna Magazine', priceValue: 600000, logo: null },
  { name: 'AllNewsBuzz', priceValue: 600000, logo: null },
  { name: 'Entertainment Paper', priceValue: 600000, logo: null },
  { name: 'FabWorldToday', priceValue: 600000, logo: null },
  { name: 'Resident Weekly', priceValue: 600000, logo: null },
  { name: 'Sportz Weekly', priceValue: 600000, logo: null },
  { name: 'Data Source Hub', priceValue: 600000, logo: null },
  { name: 'GlobeStats', priceValue: 600000, logo: null },
  { name: 'Stats Globe', priceValue: 600000, logo: null },
  { name: 'Apsters Media', priceValue: 600000, logo: null },
  { name: 'Coverage Log', priceValue: 600000, logo: null },
  { name: 'Time Bulletin', priceValue: 600000, logo: null },
  { name: 'Tech News Vision', priceValue: 600000, logo: null },
  { name: 'The Nashville Post', priceValue: 600000, logo: null },
  { name: 'Industry Today', priceValue: 600000, logo: null },
  { name: 'California Times', priceValue: 600000, logo: null },
  { name: 'Feature Weekly', priceValue: 600000, logo: null },
  { name: 'Infuse News', priceValue: 600000, logo: null },
];

// UK News Platforms
const ukPlatforms = [
  { name: 'LondonJournal', priceValue: 200000, logo: null },
  { name: 'Glasgow Report', priceValue: 200000, logo: null },
  { name: 'Manchester Times', priceValue: 200000, logo: null },
  { name: 'UkHerald', priceValue: 200000, logo: null },
  { name: 'Birmingham Times', priceValue: 200000, logo: null },
  { name: 'UkReporter', priceValue: 200000, logo: null },
  { name: 'The Bristol Press', priceValue: 200000, logo: null },
  { name: 'Uk Wire', priceValue: 200000, logo: null },
  { name: 'Influence', priceValue: 700000, logo: null },
  { name: 'Cybersecurity Insiders', priceValue: 700000, logo: null },
  { name: 'MSN', priceValue: 800000, logo: null },
  { name: 'Investing.com', priceValue: 1200000, logo: null },
  { name: 'StreetInsiders.com', priceValue: 400000, logo: null },
  { name: 'CyberNews', priceValue: 1600000, logo: null },
  { name: 'BusinessMole', priceValue: 400000, logo: null },
  { name: 'International Business Times', priceValue: 1500000, logo: null },
  { name: 'Business Cheshire', priceValue: 500000, logo: null },
  { name: 'Business Lancashire', priceValue: 400000, logo: null },
  { name: 'Business Manchester', priceValue: 400000, logo: null },
  { name: 'Business Live', priceValue: 3800000, logo: null },
  { name: 'Echo', priceValue: 3800000, logo: null },
  { name: 'Calculator UK Business News', priceValue: 500000, logo: null },
  { name: 'Talk Business', priceValue: 1100000, logo: null },
  { name: 'Investment Guide', priceValue: 600000, logo: null },
  { name: 'Manchester Evening News', priceValue: 3800000, logo: null },
  { name: 'Wales Online', priceValue: 3800000, logo: null },
  { name: 'MyLondon', priceValue: 3800000, logo: null },
  { name: 'Football.London', priceValue: 3800000, logo: null },
  { name: 'Luxury Adviser', priceValue: 500000, logo: null },
  { name: 'Financial News', priceValue: 500000, logo: null },
  { name: 'Wealth Tribune', priceValue: 500000, logo: null },
  { name: 'Trading Herald', priceValue: 500000, logo: null },
  { name: 'TechRound', priceValue: 1600000, logo: null },
  { name: 'Startup Observer', priceValue: 500000, logo: null },
  { name: 'Palm Bay Herald', priceValue: 600000, logo: null },
  { name: 'Property Development', priceValue: 600000, logo: null },
  { name: 'Online World News', priceValue: 600000, logo: null },
  { name: 'International Releases', priceValue: 600000, logo: null },
  { name: 'Coin Journal', priceValue: 1000000, logo: null },
  { name: 'Tech Bullion', priceValue: 600000, logo: null },
  { name: 'Crypto Daily', priceValue: 1800000, logo: null },
  { name: 'IGB', priceValue: 4600000, logo: null },
  { name: 'Esports News UK', priceValue: 1000000, logo: null },
  { name: 'The Sporting News', priceValue: 3100000, logo: null },
  { name: 'Casino Life', priceValue: 3100000, logo: null },
  { name: 'Economy Standard', priceValue: 600000, logo: null },
  { name: 'Funeral Notices', priceValue: 3800000, logo: null },
  { name: 'Daily Records', priceValue: 4500000, logo: null },
  { name: 'InYourArea', priceValue: 3800000, logo: null },
  { name: 'DeadLine', priceValue: 900000, logo: null },
  { name: 'Female First', priceValue: 1400000, logo: null },
  { name: 'Chronicle Live', priceValue: 3800000, logo: null },
  { name: 'Edinburgh Live', priceValue: 3800000, logo: null },
  { name: 'Galway Beo', priceValue: 3800000, logo: null },
  { name: 'Finsmes', priceValue: 1000000, logo: null },
  { name: 'Brands Journal', priceValue: 600000, logo: null },
  { name: 'Business Matters', priceValue: 1400000, logo: null },
  { name: 'Technology Dispatch', priceValue: 1000000, logo: null },
  { name: 'Finance Digest', priceValue: 600000, logo: null },
];

// Tech & Startup Platforms
const techPlatforms = [
  { name: 'Techpoint', priceValue: 300000, logo: techpointLogo },
  { name: 'TechCabal', priceValue: 300000, logo: techCabalLogo },
  { name: 'Cybersecurity Insiders', priceValue: 700000, logo: null },
  { name: 'TechRound', priceValue: 1600000, logo: null },
  { name: 'Startup Observer', priceValue: 500000, logo: null },
  { name: 'Coin Journal', priceValue: 1000000, logo: null },
  { name: 'Tech Bullion', priceValue: 600000, logo: null },
  { name: 'Crypto Daily', priceValue: 1800000, logo: null },
  { name: 'Esports News UK', priceValue: 1000000, logo: null },
  { name: 'Technology Dispatch', priceValue: 1000000, logo: null },
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
  const platformsWithLogos = category.platforms.filter(
    (platform) => getPublicationPlatformLogo(platform)
  );

  return {
    ...category,
    logos: platformsWithLogos.map((platform) => ({
      src: getPublicationPlatformLogo(platform),
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
    priceValue: 50000,
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
    priceValue: 100000,
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
    priceValue: 500000,
    unit: 'per article',
    description:
      'Request removal or suppression of a live article that is affecting your brand or public narrative.',
    icon: IoTrashOutline,
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
  const { shortBrandName } = usePartnerText();
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const { format } = useCurrency();

  const handleAddToCart = async (item) => {
    const priceValue = item.priceValue || parsePriceToNumber(item.price);
    const formattedPrice = format(priceValue);
    
    const result = await addToCart({
      itemId: item.id || `${item.title}-${Date.now()}`,
      title: item.title || item.name,
      price: formattedPrice,
      priceValue: priceValue,
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.35 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, []);

  const mastheadStats = [
    { value: '500+', label: 'Media outlets', icon: IoNewspaperOutline, iconTone: 'mint' },
    { value: '6–24 hrs', label: 'Fast placements', icon: IoTime, iconTone: 'sky' },
    { value: '98%', label: 'Success rate', icon: IoCheckmarkCircle, iconTone: 'amber' },
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
            <p className="publication-eyebrow">{shortBrandName} · Press &amp; Media Distribution</p>
            <h1 className="publication-masthead-title">
              <span className="publication-masthead-title-line">Press release distribution</span>
              <span className="publication-masthead-title-accent">across Nigeria, Africa &amp; the world</span>
            </h1>
            <p className="publication-masthead-lead">
              From Punch and Vanguard to Forbes and BBC — we place your story on trusted news platforms with
              editorial review, live links, and campaign reports you can share with clients and investors.
            </p>
            <div className="publication-masthead-stats" role="list" aria-label="Publication highlights" ref={statsRef}>
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
                      <p className="publication-stat-value">
                        <AnimatedNumber value={stat.value} isActive={statsVisible} />
                      </p>
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
            <div className="publication-masthead-actions">
              <button type="button" className="publication-btn publication-btn-primary" onClick={scrollToPackages}>
                Browse packages
              </button>
              <div className="publication-how-it-works-wrapper">
                <span className="publication-steps-badge" aria-hidden="true">
                  <span className="publication-steps-badge-num">4</span>
                  <span className="publication-steps-badge-label">steps</span>
                </span>
                <button
                  type="button"
                  className="publication-btn publication-btn-ghost"
                  onClick={scrollToHowItWorks}
                >
                  How it works
                </button>
              </div>
            </div>
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
                      <PublicationPackageLogosMarquee logos={category.logos} />
                    )}
                    <Button
                      onClick={() => navigate(`/services/publications/package/${pkg.id}`)}
                      className="publication-package-cta"
                    >
                      Place order
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="publication-how-it-works" className="publication-workflow">
        <div className="publication-workflow-bg" aria-hidden="true" />
        <div className="container publication-workflow-inner">
          <header className="publication-workflow-header">
            <div className="publication-workflow-intro">
              <p className="publication-workflow-eyebrow">From checkout to live links</p>
              <h2 className="publication-workflow-title">How it works</h2>
              <p className="publication-workflow-lead">
                Pick a package, submit your story, we handle editorial placement — then you get every live URL in one report.
              </p>
            </div>
            <div className="publication-workflow-stamp" aria-hidden="true">
              <span className="publication-workflow-stamp-num">4</span>
              <span className="publication-workflow-stamp-label">steps</span>
            </div>
          </header>

          <ol className="publication-workflow-steps">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              const isLast = index === howItWorks.length - 1;
              return (
                <li key={step.step} className="publication-workflow-step">
                  <div className="publication-workflow-rail" aria-hidden="true">
                    <span className="publication-workflow-node">
                      <IconComponent />
                    </span>
                    {!isLast && <span className="publication-workflow-connector" />}
                  </div>
                  <div className="publication-workflow-card">
                    <span className="publication-workflow-index">Step {step.step}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
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
                    <div className="publication-addon-card-pricing">
                      <span className="publication-addon-price">{service.priceValue ? format(service.priceValue) : service.price}</span>
                      <span className="publication-addon-unit">{service.unit}</span>
                    </div>
                    <Button
                      type="button"
                      className="publication-addon-order-btn"
                      onClick={() =>
                        handleAddToCart({
                          id: `publication-addon-${service.id}`,
                          title: service.title,
                          price: service.priceValue || service.price,
                          description: service.description,
                        })
                      }
                    >
                      Place order
                    </Button>
                  </footer>
                </article>
              );
            })}
          </div>
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

      <ClientsSection />
      <Footer onScrollToSection={scrollToSection} />
    </div>
  );
}

function AnimatedNumber({ value, isActive }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(value);
      return;
    }

    // Parse the value to extract number and suffix
    const match = String(value).match(/^([\d,]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, numStr, suffix] = match;
    const targetNum = parseInt(numStr.replace(/,/g, ''), 10);
    const currentNum = parseInt(String(displayValue).replace(/,/g, '').replace(/[^\d]/g, ''), 10) || 0;

    if (isNaN(targetNum) || targetNum === currentNum) {
      setDisplayValue(value);
      return;
    }

    const duration = 1800;
    const totalSteps = 60;
    const stepDuration = duration / totalSteps;
    const increment = (targetNum - currentNum) / totalSteps;
    let step = 0;
    let current = currentNum;

    const timer = setInterval(() => {
      step += 1;
      current = Math.min(Math.floor(current + increment), targetNum);
      setDisplayValue(current.toLocaleString() + suffix);

      if (step >= totalSteps || current >= targetNum) {
        setDisplayValue(targetNum.toLocaleString() + suffix);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isActive]);

  return displayValue;
}

// Per-card sliding outlet logos (no wrapper box — sits on card background)
function PublicationPackageLogosMarquee({ logos }) {
  if (!logos?.length) {
    return null;
  }

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="publication-package-logos-marquee" aria-label="Sample outlets">
      <div className="publication-package-logos-track">
        {duplicatedLogos.map((logo, index) => (
          <img key={`${logo.alt}-${index}`} src={logo.src} alt={logo.alt} loading="lazy" />
        ))}
      </div>
    </div>
  );
}

export default PublicationServicesPage;
