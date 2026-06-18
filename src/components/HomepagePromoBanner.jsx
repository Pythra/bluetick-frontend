import { normalizeMediaUrl } from '../utils/partnerMedia';
import './HomepagePromoBanner.css';

function HomepagePromoBanner({ promo }) {
  const imageSrc = normalizeMediaUrl(promo?.imageUrl);
  if (!imageSrc || promo?.enabled === false) {
    return null;
  }

  const content = (
    <img
      src={imageSrc}
      alt={promo.alt || 'Promotional banner'}
      className="homepage-promo-image"
      loading="lazy"
      decoding="async"
    />
  );

  return (
    <section className="homepage-promo-banner" aria-label={promo.alt || 'Promotional banner'}>
      <div className="homepage-promo-inner">
        {promo.linkUrl ? (
          <a
            href={promo.linkUrl}
            className="homepage-promo-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </section>
  );
}

export default HomepagePromoBanner;
