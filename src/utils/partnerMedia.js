import { usePartnerBranding } from '../contexts/PartnerBrandingContext';

export function normalizeMediaUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('data:') || /^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (
    trimmed.includes('.cloudfront.net/') ||
    trimmed.includes('amazonaws.com/') ||
    /^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(trimmed)
  ) {
    return `https://${trimmed.replace(/^\/+/, '')}`;
  }

  return trimmed;
}

/**
 * Resolves partner-owned media for a slot. On partner sites, never falls back
 * to Bluetick bundled assets — returns null so callers can show a placeholder.
 */
export function usePartnerAsset(slot, mainSiteAsset = null) {
  const branding = usePartnerBranding();

  if (!branding.isPartnerSite) {
    return {
      src: mainSiteAsset,
      isPartnerSite: false,
      hasCustomAsset: Boolean(mainSiteAsset),
    };
  }

  const partnerSrc = normalizeMediaUrl(branding.assets?.[slot] || null);
  return {
    src: partnerSrc,
    isPartnerSite: true,
    hasCustomAsset: Boolean(partnerSrc),
  };
}

export function buildWhatsappUrl(number, message = '') {
  const digits = String(number || '').replace(/\D/g, '');
  if (!digits) {
    return null;
  }
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatPhoneHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  return digits ? `tel:+${digits}` : null;
}
