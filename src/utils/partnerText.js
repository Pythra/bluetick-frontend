import { usePartnerBranding } from '../contexts/PartnerBrandingContext';

const BRAND_NAME_PATTERN = /(BLUETICKGENG DEVELOPMENT|Bluetickgeng Development|BluetickGeng Development|BLUETICKGENG|BluetickGeng|Bluetickgeng|Bluetick Geng)/g;
const BRAND_EMAIL_PATTERN = /info@bluetickgeng\.com/gi;

export function rebrandText(text, branding) {
  if (!branding?.isPartnerSite || typeof text !== 'string') {
    return text;
  }

  return text
    .replace(BRAND_NAME_PATTERN, (match) =>
      match === match.toUpperCase() ? branding.brandName.toUpperCase() : branding.brandName
    )
    .replace(BRAND_EMAIL_PATTERN, branding.contactEmail || 'support@bluetickgeng.com');
}

/**
 * Returns a function that swaps Bluetickgeng brand mentions (and the support
 * email) for the partner's brand when rendering on a partner subdomain.
 * On the main site, text is returned unchanged.
 */
export function usePartnerText() {
  const branding = usePartnerBranding();
  return {
    branding,
    t: (text) => rebrandText(text, branding),
    brandName: branding.isPartnerSite ? branding.brandName : 'Bluetickgeng Development',
    shortBrandName: branding.isPartnerSite ? (branding.shortName || branding.brandName) : 'Bluetickgeng',
    supportEmail: branding.isPartnerSite
      ? branding.contactEmail || 'info@bluetickgeng.com'
      : 'info@bluetickgeng.com',
  };
}
