import { buildDuckDuckGoIconUrl, buildFaviconUrl } from '../utils/publicationPlatformLogos';

/**
 * Brands from the reference client grid (standard logos via CDN / favicon fallbacks).
 * Optional `logo` URL overrides Clearbit when a brand needs a known-good asset.
 */
export const CLIENT_BRANDS = [
  { name: 'MTN', domain: 'mtn.ng' },
  { name: 'Gulder', domain: 'gulder.com' },
  { name: 'Axon', domain: 'axon.com' },
  { name: 'Light Up Lagos', domain: 'lightuplagos.com' },
  { name: 'Veritasi Homes', domain: 'veritasi.com' },
  {
    name: 'Coca-Cola',
    domain: 'coca-cola.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg',
  },
  { name: 'African Alliance', domain: 'africanallianceplc.com' },
  { name: 'Big Sister Naija', domain: 'bigsisternaija.com' },
  { name: 'Providus Bank', domain: 'providusbank.com' },
  { name: 'Keystone Bank', domain: 'keystonebankng.com' },
  { name: 'Legend', domain: 'legendextra.com.ng' },
  { name: 'Leatherback', domain: 'leatherback.co' },
  { name: 'Mavin Records', domain: 'mavinrecords.com' },
  { name: 'Circo', domain: 'getcirco.com' },
  { name: 'Zenith Bank', domain: 'zenithbank.com' },
  { name: 'inDrive', domain: 'indrive.com' },
  { name: 'wumbrella', domain: 'wumbrella.co' },
  { name: 'SendMore', domain: 'sendmoremoney.com' },
];

export const getClientLogoPrimaryUrl = (client) => {
  if (client?.logo) {
    return client.logo;
  }
  if (client?.domain) {
    return `https://logo.clearbit.com/${client.domain}`;
  }
  return null;
};

export const getClientLogoFallbackUrl = (client, currentSrc) => {
  const domain = client?.domain;
  if (!domain || !currentSrc) {
    return null;
  }
  if (currentSrc.includes('clearbit.com')) {
    return buildFaviconUrl(domain);
  }
  if (currentSrc.includes('gstatic.com')) {
    return buildDuckDuckGoIconUrl(domain);
  }
  if (currentSrc.includes('duckduckgo.com')) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }
  return null;
};
