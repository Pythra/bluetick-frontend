import { useMemo } from 'react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { resolvePublicationPlatformPrice } from '../utils/publicationPricing';
import { PUBLICATION_ARTICLE_ADDONS } from '../data/publicationAddons';
import './PublicationArticleAddons.css';

function resolveAddonPrice(addon, { isPartnerSite, packagePricing }) {
  const base = addon.priceValue;
  if (!isPartnerSite) return base;
  return resolvePublicationPlatformPrice({
    categoryId: 'addons',
    platformName: addon.title,
    priceValue: base,
    packageId: addon.packageId,
    packagePricing,
    isPartnerSite,
  }).priceValue;
}

export default function PublicationArticleAddons({
  packageId = null,
  packageTitle = null,
  className = '',
  showHeading = true,
}) {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const { format } = useCurrency();
  const { isPartnerSite, packagePricing } = usePartnerBranding();

  const getAddonCartItemId = (addon) =>
    `publication-addon-${addon.id}${packageId ? `-${packageId}` : ''}`;

  const isAddonSelected = (addon) =>
    (cartItems || []).some((item) => item.itemId === getAddonCartItemId(addon));

  const toggleAddon = (addon, priceValue) => {
    const cartItemId = getAddonCartItemId(addon);
    const isSelected = isAddonSelected(addon);

    if (isSelected) {
      removeFromCart(cartItemId);
      return;
    }

    addToCart({
      itemId: cartItemId,
      packageId: addon.packageId,
      title: packageTitle ? `${addon.title} — ${packageTitle}` : addon.title,
      price: format(priceValue),
      priceValue,
      description: addon.description,
      category: 'publication',
      quantity: 1,
      metadata: {
        isPublicationAddon: true,
        publicationPackageId: packageId,
        addonLayout: addon.layout,
      },
    });
  };

  return (
    <section className={`publication-article-addons ${className}`.trim()}>
      {showHeading ? (
        <header className="publication-section-head publication-article-addons-head">
          <p className="publication-section-kicker">Optional extras</p>
          <h2 className="publication-section-title">Add to your article publication</h2>
          <p className="publication-section-lead">
            Add backlinks, contact details, images, copywriting, and more to enhance your press coverage.
            Select any add-ons you want included with this order.
          </p>
        </header>
      ) : null}

      <div className="publication-article-addons-grid">
        {PUBLICATION_ARTICLE_ADDONS.map((addon) => {
          const priceValue = resolveAddonPrice(addon, { isPartnerSite, packagePricing });
          const isSelected = isAddonSelected(addon);
          const IconComponent = addon.icon;

          return (
            <article
              key={addon.id}
              className={`publication-article-addon publication-article-addon--${addon.layout} publication-article-addon--${addon.accent}${isSelected ? ' is-selected' : ''}`}
            >
              {addon.layout === 'feature' ? (
                <div className="publication-article-addon-feature">
                  <div className="publication-article-addon-feature-copy">
                    <h3 className="publication-article-addon-title">{addon.headline || addon.title}</h3>
                    <div className="publication-article-addon-tags">
                      {(addon.featureTags || []).map((tag) => (
                        <span key={tag} className="publication-article-addon-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  {addon.image ? (
                    <img src={addon.image} alt="" className="publication-article-addon-feature-image" />
                  ) : null}
                </div>
              ) : (
                <>
                  {IconComponent ? (
                    <div className="publication-article-addon-icon" aria-hidden="true">
                      <IconComponent />
                    </div>
                  ) : null}
                  <div className="publication-article-addon-body">
                    <h3 className="publication-article-addon-title">{addon.title}</h3>
                    {addon.subtitle ? (
                      <p className="publication-article-addon-sub">{addon.subtitle}</p>
                    ) : null}
                    {addon.layout === 'tags' && addon.tags?.length ? (
                      <div className="publication-article-addon-tags">
                        {addon.tags.map((tag) => (
                          <span key={tag} className="publication-article-addon-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {addon.layout === 'list' && addon.features?.length ? (
                      <ul className="publication-article-addon-list">
                        {addon.features.map((feature) => (
                          <li key={feature}>{feature}</li>
                        ))}
                      </ul>
                    ) : null}
                    {addon.layout === 'simple' ? (
                      <p className="publication-article-addon-desc">{addon.description}</p>
                    ) : null}
                  </div>
                </>
              )}

              <footer className="publication-article-addon-footer">
                <div className="publication-article-addon-price">
                  <span>+ {format(priceValue)}</span>
                  {addon.unit ? <small>{addon.unit}</small> : null}
                </div>
                <button
                  type="button"
                  className={`publication-article-addon-select${isSelected ? ' is-active' : ''}`}
                  onClick={() => toggleAddon(addon, priceValue)}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </section>
  );
}
