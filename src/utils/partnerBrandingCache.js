import { buildBrandCssVariables } from './brandTheme';

const CACHE_VERSION = 1;
const CACHE_PREFIX = `partnerBranding:v${CACHE_VERSION}:`;

export function getBrandingCacheKey(hostname = window.location.hostname) {
  return `${CACHE_PREFIX}${hostname.trim().toLowerCase()}`;
}

export function readCachedPartnerBranding(hostname = window.location.hostname) {
  try {
    const raw = sessionStorage.getItem(getBrandingCacheKey(hostname));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.isPartnerSite) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function writeCachedPartnerBranding(branding, hostname = window.location.hostname) {
  if (!branding?.isPartnerSite) {
    return;
  }

  try {
    const cssVars = buildBrandCssVariables(branding.primaryColor, branding.primaryColorDark);
    const payload = {
      isPartnerSite: true,
      brandName: branding.brandName,
      shortName: branding.shortName,
      logoUrl: branding.logoUrl,
      primaryColor: branding.primaryColor,
      primaryColorDark: branding.primaryColorDark,
      templateId: branding.templateId,
      tagline: branding.tagline,
      heroTitle: branding.heroTitle,
      heroDescription: branding.heroDescription,
      content: branding.content,
      assets: branding.assets,
      features: branding.features,
      enabledServices: branding.enabledServices,
      sectionContent: branding.sectionContent,
      contactPhone: branding.contactPhone,
      contactWhatsapp: branding.contactWhatsapp,
      contactWebsite: branding.contactWebsite,
      contactEmail: branding.contactEmail,
      customDomain: branding.customDomain,
      customDomainVerified: branding.customDomainVerified,
      showPartnerProgram: branding.showPartnerProgram,
      isVideoFirstPartnerSite: branding.isVideoFirstPartnerSite,
      cssVars,
      cachedAt: Date.now(),
    };

    sessionStorage.setItem(getBrandingCacheKey(hostname), JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function applyCachedBrandingBootstrap(hostname = window.location.hostname) {
  const cached = readCachedPartnerBranding(hostname);
  if (!cached) {
    return null;
  }

  const root = document.documentElement;
  root.dataset.partnerSite = 'true';
  root.dataset.partnerTemplate = cached.templateId || 'modern';
  root.removeAttribute('data-partner-pending');

  if (cached.cssVars) {
    Object.entries(cached.cssVars).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
  }

  return cached;
}
