import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import teamMain from '../assets/about/team-main.jpg';
import teamCrew from '../assets/about/team-crew.jpg';
import connectDm from '../assets/about/connect-dm.jpg';
import punchLogo from '../assets/punch.png';
import businessDayLogo from '../assets/platforms/buisnessday.png';
import vanguardLogo from '../assets/platforms/Vanguard.png';
import PlatformLogo from '../components/PlatformLogo';
import { usePartnerText } from '../utils/partnerText';
import './AboutPage.css';

const serviceGroups = [
  {
    title: 'Technology Solutions',
    items: [
      'Mobile App Development (iOS & Android)',
      'Custom Software Development',
      'Website Design & Development',
      'Fintech & Digital Banking Solutions',
      'E-commerce Platforms',
      'Business Automation Systems',
      'UI/UX Design',
    ],
  },
  {
    title: 'Digital Visibility & Authority',
    items: [
      'Social Media Verification Services',
      'Wikipedia Page Creation & Management',
      'Google Knowledge Panel Development',
      'Online Reputation Management',
      'Digital Identity Solutions',
    ],
  },
  {
    title: 'Branding & Marketing',
    items: [
      'Brand Strategy Development',
      'Corporate Branding',
      'Logo & Identity Design',
      'Social Media Growth',
      'Digital Marketing Campaigns',
      'Content Marketing',
    ],
  },
  {
    title: 'Public Relations & Media',
    items: [
      'Press Release Distribution',
      'Digital Newspaper Publications',
      'Media Visibility Campaigns',
      'Public Relations Consulting',
      'Strategic Brand Positioning',
    ],
  },
];

/** Local bundled logos where available; others resolve via publicationPlatformLogos. */
const aboutMediaPlatforms = [
  { name: 'BusinessDay', logo: businessDayLogo },
  { name: 'The Punch', logo: punchLogo },
  { name: 'Vanguard', logo: vanguardLogo },
  { name: 'ThisDay' },
  { name: 'Independent' },
  { name: 'Tribune' },
  { name: 'PM News' },
  { name: 'GhanaWeb' },
  { name: 'New Telegraph' },
];

const whyChoose = [
  'We build brands.',
  'We create visibility.',
  'We establish credibility.',
  'We develop technology that solves real-world problems.',
];

function AboutPage() {
  const navigate = useNavigate();
  const { branding, brandName, supportEmail } = usePartnerText();
  const isPartnerSite = branding.isPartnerSite;

  return (
    <div className="about-page">
      <Navbar />

      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <span className="about-eyebrow">About Us</span>
            <h1>{brandName}</h1>
            <p>
              {brandName} is a technology and digital solutions company
              providing end-to-end services in mobile application development for iOS and Android,
              website and web application development, e-commerce solutions, digital marketing,
              branding, and online reputation management. With operations spanning Africa and the
              United States, the company serves a diverse global client base across multiple
              industries.
            </p>
            <p>
              We combine software engineering with digital visibility and media strategies to enable
              businesses, entrepreneurs, creators, and public figures to build scalable digital
              products while strengthening their online credibility, authority, and search presence.
            </p>
          </div>
          <div className="about-hero-image">
            <img src={teamMain} alt={`The ${brandName} team`} />
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="about-section-inner">
          {!isPartnerSite && (
          <p>
            Founded in 2023 by entrepreneur and technology innovator Praise Davis, BluetickGeng
            Development was established with a vision to bridge the gap between technology, branding,
            media exposure, and digital credibility. Since its inception, the company has grown from a
            software development startup into a multidisciplinary digital solutions provider serving
            clients across multiple industries and international markets.
          </p>
          )}
          <p>
            We believe that modern businesses need more than just a website or social media presence.
            They need powerful technology, strategic branding, media visibility, digital authority, and
            scalable growth systems. This philosophy has enabled us to become a trusted partner for
            startups, established businesses, public figures, influencers, and organizations seeking
            sustainable digital growth.
          </p>
        </div>
      </section>

      <section className="about-services">
        <div className="about-section-inner">
          <div className="about-section-head">
            <h2>What We Do</h2>
            <p>
              A comprehensive suite of technology and digital growth services designed to help clients
              launch, grow, and scale successfully.
            </p>
          </div>
          <div className="about-services-grid">
            {serviceGroups.map((group) => (
              <div key={group.title} className="about-service-card">
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-innovation">
        <div className="about-section-inner about-split">
          <div className="about-split-text">
            <h2>Innovation Beyond Technology</h2>
            <p>
              At {brandName}, we understand that visibility and credibility are just as
              important as technology. This understanding inspired our approach to combining software
              development with public relations, media exposure, and digital branding services.
            </p>
            <p>
              Through innovative digital solutions, we have helped businesses, startups, creators, and
              organizations gain access to media visibility opportunities that were traditionally
              difficult or expensive to obtain. Our integrated model combines technology, branding, and
              media to create measurable business impact.
            </p>
          </div>
          <div className="about-split-image">
            <img src={teamCrew} alt={`${brandName} crew`} />
          </div>
        </div>
      </section>

      {!isPartnerSite && (
      <section className="about-recognition">
        <div className="about-section-inner">
          <div className="about-section-head">
            <h2>Industry Recognition</h2>
            <p>
              Our commitment to innovation and digital transformation has earned recognition across the
              technology industry. BluetickGeng Development was recognized as Tech Innovator of the Year
              at the Yessiey Awards for its contributions to digital transformation and
              technology-driven business solutions.
            </p>
          </div>
          <p className="about-features-label">Featured by major media platforms including</p>
          <div className="about-features" role="list" aria-label="Media platform logos">
            {aboutMediaPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="about-media-logo-item"
                role="listitem"
                title={platform.name}
              >
                {platform.logo ? (
                  <img
                    src={platform.logo}
                    alt={platform.name}
                    className="about-media-logo"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <PlatformLogo platform={{ name: platform.name }} className="about-media-logo" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {!isPartnerSite && (
      <section className="about-expansion">
        <div className="about-section-inner">
          <h2>Global Expansion</h2>
          <p>
            In 2025, BluetickGeng Development expanded its operations into the United States, marking a
            significant milestone in the company&apos;s growth journey. The expansion was designed to
            strengthen international service delivery, support global clients, and create new
            opportunities for businesses seeking technology and digital growth solutions beyond
            geographical boundaries.
          </p>
          <p>
            Today, the company operates with a growing international outlook while maintaining its
            commitment to delivering world-class solutions from its Nigerian roots.
          </p>
        </div>
      </section>
      )}

      <section className="about-mv">
        <div className="about-section-inner about-mv-grid">
          <div className="about-mv-card">
            <h3>Our Mission</h3>
            <p>
              To empower businesses, brands, and individuals with innovative technology, strategic media
              visibility, and digital growth solutions that create lasting impact and measurable
              success.
            </p>
          </div>
          <div className="about-mv-card">
            <h3>Our Vision</h3>
            <p>
              To become one of Africa&apos;s most influential technology and digital growth companies,
              helping businesses and individuals compete successfully on a global scale through
              innovation, visibility, and digital transformation.
            </p>
          </div>
        </div>
      </section>

      <section className="about-why">
        <div className="about-section-inner">
          <h2>Why Choose {brandName}?</h2>
          <p className="about-why-lead">We don&apos;t simply build websites or mobile apps.</p>
          <ul className="about-why-list">
            {whyChoose.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Whether you&apos;re launching a startup, growing an established business, building a personal
            brand, seeking media exposure, obtaining social media verification, creating a Wikipedia
            page, or developing a custom software solution, {brandName} provides the
            expertise, innovation, and strategic support needed to achieve your goals.
          </p>
          <p>
            As we continue expanding globally, our focus remains unchanged: helping businesses and
            individuals leverage technology, branding, and media to unlock their full potential.
          </p>
        </div>
      </section>

      <section className="about-contact" style={{ backgroundImage: `url(${connectDm})` }}>
        <div className="about-contact-overlay">
          <div className="about-section-inner">
            <h2>Connect With Us Today</h2>
            <p>Let&apos;s build, grow, and scale your digital presence together.</p>
            <div className="about-contact-details">
              {!isPartnerSite && (
                <a href="https://www.bluetickgeng.com" target="_blank" rel="noopener noreferrer">
                  www.bluetickgeng.com
                </a>
              )}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
              {!isPartnerSite && (
                <a href="https://wa.me/2349138832111" target="_blank" rel="noopener noreferrer">
                  WhatsApp: +234 913 883 2111
                </a>
              )}
            </div>
            <button type="button" className="about-cta-button" onClick={() => navigate('/signup')}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default AboutPage;
