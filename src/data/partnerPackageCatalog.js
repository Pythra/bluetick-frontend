/** Individual sellable packages — partners set selling prices per package. */

import { PUBLICATION_CATEGORIES } from './publicationPackageCatalog.js';

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pkg(id, serviceId, groupId, groupLabel, serviceLabel, label, basePriceNgn) {
  return { id, serviceId, groupId, groupLabel, serviceLabel, label, basePriceNgn };
}

function titlePkg(prefix, serviceId, groupId, groupLabel, serviceLabel, title, basePriceNgn) {
  return pkg(`${prefix}.${slugify(title)}`, serviceId, groupId, groupLabel, serviceLabel, title, basePriceNgn);
}

const SOCIAL = 'Verification & Social Media Services';

const verificationNonNotable = [
  ['Instagram Verification', 800000],
  ['Facebook Verification', 850000],
  ['Snapchat Verification', 1000000],
  ['TikTok Verification', 900000],
  ['Twitter Verification', 200000],
  ['YouTube Verification', 950000],
  ['Telegram Verification', 650000],
  ['WhatsApp Channel Verification', 500000],
].map(([title, price]) =>
  titlePkg('verification.non-notable', 'socialMedia', 'verification-non-notable', 'Verification — Non-notable accounts', SOCIAL, title, price)
);

const verificationNotable = [
  ['Instagram Verification', 200000],
  ['Facebook Verification', 350000],
  ['TikTok Verification', 250000],
  ['YouTube Verification', 400000],
  ['Telegram Verification', 100000],
  ['WhatsApp Business Verification', 180000],
  ['WhatsApp Channel Verification', 150000],
].map(([title, price]) =>
  titlePkg('verification.notable', 'socialMedia', 'verification-notable', 'Verification — Notable accounts', SOCIAL, title, price)
);

const verificationMeta = [
  pkg(
    'verification.meta-subscription',
    'socialMedia',
    'verification-meta',
    'Meta subscription',
    SOCIAL,
    'Meta Subscription Services',
    100000
  ),
];

const monetizationPackages = [
  ['Facebook Page Monetization', 600000],
  ['Facebook Profile Monetization', 500000],
  ['Instagram Monetization', 450000],
  ['YouTube Channel Monetization', 550000],
  ['TikTok Account Monetization', 300000],
  ['Snapchat Monetization', 400000],
  ['X (Twitter) Monetization', 350000],
].map(([title, price]) =>
  titlePkg('monetization', 'socialMedia', 'monetization-packages', 'Monetization packages', SOCIAL, title, price)
);

const monetizationSetup = [
  ['Facebook In-Stream Ads Setup', 100000],
  ['Facebook Stars Setup', 120000],
  ['Instagram Gifts Setup', 120000],
  ['Instagram Subscription Setup', 100000],
  ['TikTok Creativity Program Setup', 130000],
  ['Social Media Payout Setup Assistance', 100000],
].map(([title, price]) =>
  titlePkg('monetization-setup', 'socialMedia', 'monetization-setup', 'Monetization setup add-ons', SOCIAL, title, price)
);

const twitterTrends = [
  ['Nigeria Trend', 150000],
  ['Uganda Trend', 925000],
  ['South Africa Trend', 899000],
  ['Kenya Trend', 899000],
  ['Ghana Trend', 599900],
].map(([title, price]) =>
  titlePkg('twitter-trend', 'socialMedia', 'twitter-trends', 'Twitter / X trend packages', SOCIAL, title, price)
);

const MUSIC = 'Music Streaming Verification';
const musicStreaming = [
  ['Boomplay Verification', 100000],
  ['Spotify Verification', 150000],
  ['Audiomack Verification', 200000],
  ['Apple Music Verification', 100000],
  ['YouTube Official Artist Channel (OAC) Verification', 200000],
  ['Deezer Verification', 100000],
  ['TIDAL Artist Verification', 150000],
  ['Amazon Music Artist Verification', 200000],
  ['Pandora AMP Verification', 100000],
  ['SoundCloud Verification', 100000],
  ['Shazam Artist Profile Verification', 150000],
].map(([title, price]) =>
  titlePkg('music-streaming', 'musicStreaming', 'music-streaming', 'Streaming platform verification', MUSIC, title, price)
);

const musicProfile = [
  pkg(
    'music-streaming.tiktok-music-profile',
    'musicStreaming',
    'music-profile',
    'Music profile placement',
    MUSIC,
    'TikTok Music Profile Placement',
    200000
  ),
];

const TIKTOK = 'TikTok Artist Services';
const tiktokPackages = [
  pkg('tiktok.song-claim', 'tiktokArtist', 'tiktok-song', 'Song claiming', TIKTOK, 'TikTok Song Claim Under Profile', 7000),
  pkg('tiktok.25-micro', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '25 Micro Influencers', 25000),
  pkg('tiktok.50-micro', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '50 Micro Influencers', 49000),
  pkg('tiktok.100-micro', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '100 Micro Influencers', 98000),
  pkg('tiktok.250-influencers', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '250 TikTok Influencers', 220000),
  pkg('tiktok.500-influencers', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '500 TikTok Influencers', 410000),
  pkg('tiktok.1000-influencers', 'tiktokArtist', 'tiktok-influencer', 'Influencer sound campaigns', TIKTOK, '1,000 TikTok Influencers', 700000),
];

const INSTAGRAM = 'Instagram Blog Promotion';
const instagramBlog = [
  ['Alabareports', 70000],
  ['Gossipmill (Account 1)', 750000],
  ['Gossipmill (Account 2)', 400000],
  ['WahalaNetwork', 300000],
  ['Instablog', 900000],
  ['Themixhq', 750000],
  ['Gossiploaded', 200000],
  ['Thecontentlovers', 300000],
  ['Olofofonija', 200000],
  ['Notjustok', 800000],
  ['Gistloverblog', 700000],
  ['Samklef', 750000],
  ['FunnyAfrica', 500000],
  ['Tundeednut', 1000000],
  ['NaijaEverything', 350000],
  ['Yabaleftonline', 650000],
  ['GoldmyneTV', 250000],
  ['Lindaikejisblog', 650000],
  ['Shallipopi News', 200000],
  ['Officialbisloded', 500000],
].map(([title, price]) =>
  titlePkg('instagram.blog', 'instagram', 'instagram-blog', 'Instagram blog promotions', INSTAGRAM, title, price)
);

const instagramWizkid = [
  ['24 Hours Post', 180000],
  ['1 Day Post', 250000],
  ['3 Days Post', 500000],
  ['Collaboration Post (3 Days)', 800000],
  ['Collaboration Post (6 Days)', 2300000],
].map(([title, price]) =>
  titlePkg('instagram.wizkid', 'instagram', 'instagram-wizkid', 'Wizkid News packages', INSTAGRAM, title, price)
);

const WIKI = 'Wikipedia Page Services';
const wikipediaPackages = [
  pkg('wikipedia.individual', 'wikipedia', 'wikipedia-pages', 'Wikipedia pages', WIKI, 'Wikipedia Page for Individuals', 1250000),
  pkg('wikipedia.company', 'wikipedia', 'wikipedia-pages', 'Wikipedia pages', WIKI, 'Wikipedia Page for Organizations', 1800000),
  pkg('google-knowledge.individual', 'wikipedia', 'google-knowledge', 'Google Knowledge Panel', WIKI, 'Individual Google Knowledge Panel', 500000),
  pkg('google-knowledge.company', 'wikipedia', 'google-knowledge', 'Google Knowledge Panel', WIKI, 'Company Google Knowledge Panel', 800000),
];

const APP = 'Mobile App Development';
const appPackages = [
  ['Health & Fitness Apps', 3300000],
  ['E-commerce Apps', 2250000],
  ['Fintech & Banking Apps', 9000000],
  ['Social Media Apps', 5250000],
  ['Travel & Booking Apps', 3750000],
  ['Productivity Apps', 6000000],
  ['Streaming & Entertainment Apps', 5700000],
  ['Gaming Apps', 7500000],
  ['Bill Payment Apps', 4800000],
  ['Cryptocurrency Apps', 3450000],
].map(([title, price]) =>
  titlePkg('app', 'appDevelopment', 'app-packages', 'App development packages', APP, title, price)
);

const WEB = 'Website Development';
const websitePackages = [
  ['Basic Informational Website', 525000],
  ['Standard Website', 1500000],
  ['Custom Web Applications', 3750000],
].map(([title, price]) =>
  titlePkg('website', 'websiteDevelopment', 'website-packages', 'Website packages', WEB, title, price)
);

const PUB = 'PR & Media Publications';
const publicationAddons = [
  pkg('publication.content-formats', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Article content formats', 100000),
  pkg('publication.full-enhancement', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Full article enhancement', 250000),
  pkg('publication.copywriting', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Professional copywriting', 40000),
  pkg('publication.backdate', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Backdating an article', 50000),
  pkg('publication.links', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Including links in an article', 100000),
  pkg('publication.reputation', 'publication', 'publication-addons', 'Publication add-ons', PUB, 'Deleting an existing article', 500000),
];

const publicationPlatformPackages = PUBLICATION_CATEGORIES.flatMap((category) =>
  category.platforms.map((platform) =>
    titlePkg(
      `publication.${category.id}`,
      'publication',
      `publication-${category.id}`,
      category.title,
      PUB,
      platform.name,
      platform.priceValue
    )
  )
);

export const PARTNER_PACKAGE_CATALOG = [
  ...verificationNonNotable,
  ...verificationNotable,
  ...verificationMeta,
  ...monetizationPackages,
  ...monetizationSetup,
  ...twitterTrends,
  ...musicStreaming,
  ...musicProfile,
  ...tiktokPackages,
  ...instagramBlog,
  ...instagramWizkid,
  ...wikipediaPackages,
  ...appPackages,
  ...websitePackages,
  ...publicationPlatformPackages,
  ...publicationAddons,
];

const packageMap = new Map(PARTNER_PACKAGE_CATALOG.map((entry) => [entry.id, entry]));

export function getPackageCatalogEntry(packageId) {
  return packageMap.get(packageId) || null;
}

export function getPackageBasePriceNgn(packageId) {
  return packageMap.get(packageId)?.basePriceNgn ?? 0;
}

export function buildDefaultPackagePricing() {
  return Object.fromEntries(
    PARTNER_PACKAGE_CATALOG.map((entry) => [
      entry.id,
      {
        basePriceNgn: entry.basePriceNgn,
        sellingPriceNgn: entry.basePriceNgn,
        enabled: true,
      },
    ])
  );
}

export function resolveGlobalPackagePrice(packageId, globalStoredPricing = {}) {
  const entry = getPackageCatalogEntry(packageId);
  if (!entry) return 0;

  const extracted = extractPackagePricingFromServicePricing(globalStoredPricing);
  const stored = extracted[packageId] || globalStoredPricing[packageId];
  const saved = Number(stored?.sellingPriceNgn ?? stored?.currentPriceNgn ?? stored?.priceNgn);
  if (Number.isFinite(saved) && saved > 0) {
    return saved;
  }
  return entry.basePriceNgn;
}

export function resolvePartnerMarkupNgn(packageId, partnerStoredPricing = {}) {
  const partnerEntry = partnerStoredPricing[packageId];
  if (!partnerEntry || typeof partnerEntry !== 'object') {
    return 0;
  }

  const explicitMarkup = Number(partnerEntry.markupNgn);
  if (Number.isFinite(explicitMarkup)) {
    return Math.max(0, explicitMarkup);
  }

  const legacySelling = Number(partnerEntry.sellingPriceNgn ?? partnerEntry.currentPriceNgn);
  if (!Number.isFinite(legacySelling) || legacySelling <= 0) {
    return 0;
  }

  const catalogBase = getPackageCatalogEntry(packageId)?.basePriceNgn ?? 0;
  return Math.max(0, legacySelling - catalogBase);
}

export function resolvePartnerPackageEffectivePrice(
  packageId,
  globalStoredPricing = {},
  partnerStoredPricing = {}
) {
  const globalPrice = resolveGlobalPackagePrice(packageId, globalStoredPricing);
  const markup = resolvePartnerMarkupNgn(packageId, partnerStoredPricing);
  return globalPrice + markup;
}

/** @deprecated Use resolveGlobalPackagePrice for main-site stored pricing. */
export function resolvePackageCurrentPrice(packageId, storedPricing = {}) {
  return resolveGlobalPackagePrice(packageId, storedPricing);
}

export function mergePackagePricing(stored = {}) {
  const defaults = buildDefaultPackagePricing();
  const merged = { ...defaults };
  Object.entries(stored).forEach(([id, value]) => {
    if (!defaults[id] || !value || typeof value !== 'object') return;
    const catalogBase = defaults[id].basePriceNgn;
    const current = resolvePackageCurrentPrice(id, { [id]: value });
    merged[id] = {
      ...defaults[id],
      ...value,
      basePriceNgn: catalogBase,
      sellingPriceNgn: current,
      currentPriceNgn: current,
    };
  });
  return merged;
}

export function buildMainPackagePricingRows(globalStoredPricing = {}) {
  return PARTNER_PACKAGE_CATALOG.map((entry) => {
    const current = resolveGlobalPackagePrice(entry.id, globalStoredPricing);
    return {
      ...entry,
      basePriceNgn: entry.basePriceNgn,
      currentPriceNgn: current,
      markupNgn: 0,
    };
  });
}

export function buildPartnerPackagePricingRows(globalStoredPricing = {}, partnerStoredPricing = {}) {
  const extractedPartner = extractPackagePricingFromServicePricing(partnerStoredPricing);
  return PARTNER_PACKAGE_CATALOG.map((entry) => {
    const globalPrice = resolveGlobalPackagePrice(entry.id, globalStoredPricing);
    const markupNgn = resolvePartnerMarkupNgn(entry.id, extractedPartner);
    const current = globalPrice + markupNgn;
    const value = extractedPartner[entry.id] || {};
    return {
      ...entry,
      basePriceNgn: globalPrice,
      currentPriceNgn: current,
      markupNgn,
      enabled: value.enabled !== false,
    };
  });
}

export function buildPublicPackagePricing(globalStoredPricing = {}, partnerStoredPricing = {}) {
  const extractedPartner = extractPackagePricingFromServicePricing(partnerStoredPricing);
  return Object.fromEntries(
    PARTNER_PACKAGE_CATALOG.map((entry) => {
      const current = resolvePartnerPackageEffectivePrice(
        entry.id,
        globalStoredPricing,
        extractedPartner
      );
      return [
        entry.id,
        {
          priceNgn: current,
          currentPriceNgn: current,
          sellingPriceNgn: current,
        },
      ];
    })
  );
}

export function resolvePackageSellingPrice(
  packageId,
  globalStoredPricing = {},
  partnerStoredPricing = {}
) {
  return (
    resolvePartnerPackageEffectivePrice(packageId, globalStoredPricing, partnerStoredPricing) || null
  );
}

export function extractPackagePricingFromServicePricing(servicePricing = {}) {
  const packageIds = new Set(PARTNER_PACKAGE_CATALOG.map((entry) => entry.id));
  return Object.fromEntries(
    Object.entries(servicePricing).filter(([id]) => packageIds.has(id))
  );
}

export function isPackagePricingKey(key) {
  return packageMap.has(key);
}

export function findMainPackagePricingBelowMinimum(pricingEntries = []) {
  const entries = Array.isArray(pricingEntries)
    ? pricingEntries
    : Object.entries(pricingEntries).map(([id, value]) => ({ id, ...value }));

  return entries
    .map(({ id, sellingPriceNgn, currentPriceNgn, basePriceNgn: attemptedBase }) => {
      const entry = getPackageCatalogEntry(id);
      if (!entry) return null;
      const attempted = Number(sellingPriceNgn ?? currentPriceNgn ?? attemptedBase);
      if (!Number.isFinite(attempted) || attempted <= 0 || attempted >= entry.basePriceNgn) {
        return null;
      }
      return {
        id,
        label: entry.label,
        minimumPriceNgn: entry.basePriceNgn,
        attemptedPriceNgn: attempted,
      };
    })
    .filter(Boolean);
}

export function findPartnerPackagePricingBelowMinimum(pricingEntries = [], globalStoredPricing = {}) {
  const entries = Array.isArray(pricingEntries)
    ? pricingEntries
    : Object.entries(pricingEntries).map(([id, value]) => ({ id, ...value }));

  return entries
    .map(({ id, sellingPriceNgn, currentPriceNgn, basePriceNgn: attemptedBase }) => {
      const entry = getPackageCatalogEntry(id);
      if (!entry) return null;
      const minimumPriceNgn = resolveGlobalPackagePrice(id, globalStoredPricing);
      const attempted = Number(sellingPriceNgn ?? currentPriceNgn ?? attemptedBase);
      if (!Number.isFinite(attempted) || attempted <= 0 || attempted >= minimumPriceNgn) {
        return null;
      }
      return {
        id,
        label: entry.label,
        minimumPriceNgn,
        attemptedPriceNgn: attempted,
      };
    })
    .filter(Boolean);
}

/** @deprecated Use findPartnerPackagePricingBelowMinimum or findMainPackagePricingBelowMinimum. */
export function findPackagePricingBelowMinimum(pricingEntries = [], globalStoredPricing = {}) {
  if (globalStoredPricing && Object.keys(globalStoredPricing).length > 0) {
    return findPartnerPackagePricingBelowMinimum(pricingEntries, globalStoredPricing);
  }
  return findMainPackagePricingBelowMinimum(pricingEntries);
}

export function buildPackagePricingMinimumError(violations = []) {
  if (!violations.length) return '';
  const preview = violations
    .slice(0, 4)
    .map(
      (item) =>
        `${item.label} (minimum ₦${Number(item.minimumPriceNgn).toLocaleString('en-NG')}, you entered ₦${Number(item.attemptedPriceNgn).toLocaleString('en-NG')})`
    )
    .join('; ');
  const suffix =
    violations.length > 4 ? `; and ${violations.length - 4} more package${violations.length - 4 === 1 ? '' : 's'}` : '';
  return `Some prices are below the original minimum. ${preview}${suffix}. Set each price to at least the original amount, then save again.`;
}

export function getPackagesByGroup(groupId) {
  return PARTNER_PACKAGE_CATALOG.filter((entry) => entry.groupId === groupId);
}

export function getPackagesByServiceId(serviceId) {
  return PARTNER_PACKAGE_CATALOG.filter((entry) => entry.serviceId === serviceId);
}

export function toServiceListEntries(packages) {
  return packages.map((entry) => ({
    id: entry.id,
    packageId: entry.id,
    title: entry.label,
    price: entry.basePriceNgn,
  }));
}
