const PARTNER_BASE_DOMAIN =
  import.meta.env.VITE_PARTNER_BASE_DOMAIN || 'bluetickgeng.com';

const RESERVED_SUBDOMAINS = new Set([
  'www',
  'api',
  'admin',
  'app',
  'mail',
  'partner',
  'partners',
  'blog',
  'shop',
  'store',
  'support',
  'help',
  'status',
  'cdn',
  'static',
  'assets',
]);

export function getPartnerSubdomainFromHost(hostname = window.location.hostname) {
  const normalizedHost = hostname.trim().toLowerCase();
  const baseDomain = PARTNER_BASE_DOMAIN.toLowerCase();

  if (normalizedHost === baseDomain || normalizedHost === `www.${baseDomain}`) {
    return null;
  }

  const suffix = `.${baseDomain}`;
  if (!normalizedHost.endsWith(suffix)) {
    return null;
  }

  const subdomain = normalizedHost.slice(0, -suffix.length);
  if (!subdomain || subdomain.includes('.') || RESERVED_SUBDOMAINS.has(subdomain)) {
    return null;
  }

  return subdomain;
}

export function previewPartnerSiteUrl(brandName) {
  const slug = String(brandName || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  if (!slug) {
    return '';
  }

  return `https://${slug}.${PARTNER_BASE_DOMAIN}`;
}
