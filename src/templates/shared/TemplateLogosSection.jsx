import PublicationLogosCarousel from '../../components/PublicationLogosCarousel';

function TemplateLogosSection({ variant = 'marquee', className = '' }) {
  const carousel = (
    <PublicationLogosCarousel
      title=""
      className="impact-logos-carousel landing-logos-carousel"
      includePlatformBadges
    />
  );

  if (variant === 'grid') {
    return (
      <div className={`tpl-logos tpl-logos--grid ${className}`.trim()} aria-label="Featured media logos">
        <p className="tpl-logos-caption">Trusted publications</p>
        <div className="tpl-logos-grid-wrap">{carousel}</div>
      </div>
    );
  }

  if (variant === 'boxed') {
    return (
      <div className={`tpl-logos tpl-logos--boxed ${className}`.trim()} aria-label="Featured media logos">
        <h3 className="tpl-logos-heading">Media coverage</h3>
        <div className="tpl-logos-boxed-wrap">{carousel}</div>
      </div>
    );
  }

  if (variant === 'press') {
    return (
      <div className={`tpl-logos tpl-logos--press ${className}`.trim()} aria-label="Featured media logos">
        <span className="tpl-logos-press-label" aria-hidden="true">PRESS</span>
        <div className="tpl-logos-press-wrap">{carousel}</div>
      </div>
    );
  }

  if (variant === 'spotlight') {
    return (
      <div className={`tpl-logos tpl-logos--spotlight ${className}`.trim()} aria-label="Featured media logos">
        <div className="tpl-logos-spotlight-glow" aria-hidden="true" />
        {carousel}
      </div>
    );
  }

  return (
    <div className={`tpl-logos tpl-logos--marquee ${className}`.trim()} aria-label="Featured media logos">
      <div className="tpl-logos-marquee-track">{carousel}</div>
    </div>
  );
}

export default TemplateLogosSection;
