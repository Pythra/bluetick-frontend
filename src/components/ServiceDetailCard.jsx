import Button from './Button';

function ServiceDetailCard({
  title,
  meta,
  description,
  price,
  pricePrefix = 'From',
  icon: Icon,
  iconNode,
  iconVariant = 'flag',
  feature = false,
  onAddToCart,
  ctaLabel = 'Add to Cart',
  featureCtaHref,
  featureCtaLabel,
}) {
  return (
    <article className={`service-detail-card${feature ? ' service-detail-card--feature' : ''}`}>
      <div className="service-detail-card-head">
        <span
          className={`service-detail-card-icon${
            iconNode
              ? ` service-detail-card-icon--${iconVariant || 'flag'}`
              : ''
          }`}
          aria-hidden={iconNode ? undefined : true}
        >
          {iconNode ?? (Icon ? <Icon /> : null)}
        </span>
        <div className="service-detail-card-heading">
          <h2 className="service-detail-card-title">{title}</h2>
          <p className="service-detail-card-meta">{meta}</p>
        </div>
      </div>
      <p className="service-detail-card-desc">{description}</p>
      <p className="service-detail-card-price-line">
        {pricePrefix ? `${pricePrefix} ` : null}
        <span className="price-amount">{price}</span>
      </p>
      {!feature && onAddToCart ? (
        <div className="service-detail-card-actions">
          <Button onClick={onAddToCart} className="service-detail-card-cta">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
      {feature && featureCtaHref && featureCtaLabel ? (
        <div className="service-detail-card-actions">
          <a
            href={featureCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="service-detail-card-cta service-detail-card-cta-link"
          >
            {featureCtaLabel}
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default ServiceDetailCard;
