import { PARTNER_PACKAGE_CATALOG } from '../data/partnerPackageCatalog';
import { PUBLICATION_CATEGORIES } from '../data/publicationPackageCatalog';
import { resolvePartnerPackagePrice } from '../hooks/usePartnerPackagePrice';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeName(name) {
  return String(name || '').trim().toLowerCase();
}

export function getPublicationPlatformPackageId(categoryId, platformName) {
  const groupId = `publication-${categoryId}`;
  const normalized = normalizeName(platformName);
  const match = PARTNER_PACKAGE_CATALOG.find(
    (entry) => entry.groupId === groupId && normalizeName(entry.label) === normalized
  );
  if (match) return match.id;
  return `publication.${categoryId}.${slugify(platformName)}`;
}

export function getPublicationCategoryPlatforms(categoryId) {
  return PUBLICATION_CATEGORIES.find((category) => category.id === categoryId)?.platforms || [];
}

export function resolvePublicationPlatformPrice({
  categoryId,
  platformName,
  priceValue,
  packageId,
  packagePricing,
  isPartnerSite,
}) {
  const resolvedPackageId =
    packageId || (categoryId ? getPublicationPlatformPackageId(categoryId, platformName) : null);
  const base = Number(priceValue) || 0;
  if (!isPartnerSite || !resolvedPackageId) {
    return { packageId: resolvedPackageId, priceValue: base };
  }
  return {
    packageId: resolvedPackageId,
    priceValue: resolvePartnerPackagePrice(resolvedPackageId, base, packagePricing),
  };
}

export const PUBLICATION_PACKAGE_DETAILS = {
  1: {
    title: 'African News Platforms',
    description:
      'Punch, Vanguard, Guardian Nigeria + multiple African authority sites and movie platforms. Perfect for local and regional market penetration with guaranteed publication.',
    categoryId: 'african',
    delivery: '6–24 Hours',
    listTitle: 'African outlets',
    note: 'These platforms accept 2–3 images, branded graphics, backlinks, and other promotional materials to enhance your story placement.',
  },
  2: {
    title: 'Tech & Startups',
    description: 'Focused tech PR on leading African and international tech platforms.',
    categoryId: 'tech',
    delivery: '6–24 Hours',
    listTitle: 'Tech & startup outlets',
    note: 'Ideal for product launches, funding announcements, and startup thought leadership in the tech ecosystem.',
  },
  3: {
    title: 'UK News Platforms',
    description:
      'Comprehensive coverage across UK media outlets, business publications, and regional news platforms for maximum UK market penetration.',
    categoryId: 'uk',
    delivery: '24–48 Hours',
    listTitle: 'UK outlets',
    note: 'Extensive UK media coverage across news, business, sports, and lifestyle publications for comprehensive market reach.',
  },
  4: {
    title: 'Google News Platforms',
    description:
      'Get featured on Google News approved platforms for maximum visibility and SEO benefits with our network of trusted news sources.',
    categoryId: 'google-news',
    delivery: '24–48 Hours',
    listTitle: 'Google News outlets',
    note: 'All platforms are Google News approved, ensuring maximum visibility and SEO benefits for your content.',
  },
  5: {
    title: 'Global Premium Authority',
    description:
      'Forbes, Fox News, BBC News, Bloomberg, Business Insider, Yahoo Finance and premium international platforms. Maximum authority and credibility with international market access.',
    categoryId: 'international',
    delivery: '2–7 Working Days',
    listTitle: 'Global outlets',
    note: 'Premium international platforms that provide maximum credibility and global reach for your brand story.',
  },
};
