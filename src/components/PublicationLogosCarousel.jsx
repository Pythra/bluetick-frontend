import {
  IoLogoInstagram,
  IoLogoFacebook,
  IoLogoTwitter,
} from 'react-icons/io5';
import punchLogo from '../assets/punch.png';
import playStoreBadge from '../assets/play.png';
import appStoreBadge from '../assets/appstore.png';
import guardianLogo from '../assets/guardian.png';
import businessDayLogo from '../assets/platforms/buisnessday.png';
import cableLogo from '../assets/platforms/cable.jpg';
import dailyPostLogo from '../assets/platforms/dailypost.jpg';
import nairametricsLogo from '../assets/platforms/nairametrics.png';
import techCabalLogo from '../assets/platforms/techcabal.png';
import vanguardLogo from '../assets/platforms/Vanguard.png';
import { amazonMusicLogo, boomplayLogo } from '../assets/streamingBrandLogos';
import './PublicationLogosCarousel.css';

const platformCarouselItems = [
  {
    type: 'image',
    name: 'Boomplay',
    image: boomplayLogo,
    brand: 'boomplay',
  },
  {
    type: 'image',
    name: 'Amazon Music',
    image: amazonMusicLogo,
    brand: 'amazon-music',
  },
  {
    type: 'social',
    brand: 'instagram',
    name: 'Instagram',
    href: 'https://www.instagram.com/bluetickgengs?igsh=OGY2dWU3a3lsZzR5&utm_source=qr',
    Icon: IoLogoInstagram,
  },
  {
    type: 'social',
    brand: 'facebook',
    name: 'Facebook',
    href: 'https://www.facebook.com/bluetickgeng',
    Icon: IoLogoFacebook,
  },
  {
    type: 'social',
    brand: 'twitter',
    name: 'X (Twitter)',
    href: 'https://x.com/bluetickgeng',
    Icon: IoLogoTwitter,
  },
  {
    type: 'store',
    brand: 'appstore',
    name: 'App Store',
    image: appStoreBadge,
  },
  {
    type: 'store',
    brand: 'googleplay',
    name: 'Google Play',
    image: playStoreBadge,
  },
];

function mergeCarouselItems(publications, platforms) {
  if (!platforms.length) return publications;

  const merged = [];
  const interval = Math.max(1, Math.floor(publications.length / platforms.length));
  let pubIndex = 0;
  let platformIndex = 0;

  while (pubIndex < publications.length || platformIndex < platforms.length) {
    for (let i = 0; i < interval && pubIndex < publications.length; i += 1) {
      merged.push(publications[pubIndex]);
      pubIndex += 1;
    }
    if (platformIndex < platforms.length) {
      merged.push(platforms[platformIndex]);
      platformIndex += 1;
    }
  }

  return merged;
}

function PublicationLogosCarousel({
  title = 'Our Partners',
  className = '',
  includePlatformBadges = false,
}) {
  const publicationLogos = [
    { type: 'image', name: 'Punch', image: punchLogo },
    { type: 'image', name: 'Guardian', image: guardianLogo },
    { type: 'image', name: 'BusinessDay', image: businessDayLogo },
    { type: 'image', name: 'The Cable', image: cableLogo },
    { type: 'image', name: 'Daily Post', image: dailyPostLogo },
    { type: 'image', name: 'Nairametrics', image: nairametricsLogo },
    { type: 'image', name: 'TechCabal', image: techCabalLogo },
    { type: 'image', name: 'Vanguard', image: vanguardLogo },
  ];

  const carouselItems = includePlatformBadges
    ? mergeCarouselItems(publicationLogos, platformCarouselItems)
    : publicationLogos;

  const duplicatedItems = [...carouselItems, ...carouselItems];

  return (
    <section className={`publication-logos-section ${className}`.trim()}>
      <div className="publication-logos-container">
        {title && <h2 className="publication-logos-title">{title}</h2>}
        <div className="logos-carousel-wrapper">
          <div className="logos-carousel">
            {duplicatedItems.map((item, index) => (
              <div
                key={`${item.name}-${index}`}
                className={`logo-item ${item.type !== 'image' ? 'logo-item--platform' : ''}`}
              >
                {item.type === 'image' && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className={`logo-image${item.brand ? ` logo-image--${item.brand}` : ''}`}
                  />
                )}
                {item.type === 'social' && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`logo-platform logo-platform--social logo-platform--${item.brand}`}
                    aria-label={item.name}
                  >
                    <item.Icon className="logo-platform-icon" aria-hidden="true" />
                  </a>
                )}
                {item.type === 'store' && (
                  item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`logo-store-bare logo-store-bare--${item.brand}`}
                    />
                  ) : (
                    <div
                      className={`logo-platform logo-platform--store logo-platform--${item.brand}`}
                      aria-label={item.name}
                    >
                      <item.Icon className="logo-platform-icon logo-platform-icon--store" aria-hidden="true" />
                      <span className="logo-platform-store-text">
                        <span className="logo-platform-store-kicker">{item.kicker}</span>
                        <span className="logo-platform-store-name">{item.storeName}</span>
                      </span>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationLogosCarousel;
