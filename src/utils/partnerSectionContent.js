import { useMemo } from 'react';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import {
  getDefaultSectionContent,
  PARTNER_FAQ_DEFAULTS,
  PARTNER_IMPACT_STATS_DEFAULTS,
  PARTNER_SERVICE_SECTION_DEFAULTS,
  PARTNER_TESTIMONIALS_DEFAULTS,
} from '../data/partnerSectionDefaults';

function mergeServiceSection(stored, serviceId) {
  const defaults = PARTNER_SERVICE_SECTION_DEFAULTS[serviceId] || {};
  const custom = stored?.[serviceId] || {};
  return {
    ...defaults,
    ...custom,
    bullets: custom.bullets?.length ? custom.bullets : defaults.bullets || [],
  };
}

function mergeListSection(stored, sectionKey, defaults) {
  const custom = stored?.[sectionKey] || {};
  return {
    ...defaults,
    ...custom,
    items: custom.items?.length ? custom.items : defaults.items || [],
  };
}

export function resolvePartnerSectionContent(branding, sectionKey) {
  const stored = branding?.sectionContent || {};
  const isPartner = Boolean(branding?.isPartnerSite);

  if (sectionKey === 'testimonials') {
    return isPartner
      ? mergeListSection(stored, 'testimonials', PARTNER_TESTIMONIALS_DEFAULTS)
      : PARTNER_TESTIMONIALS_DEFAULTS;
  }

  if (sectionKey === 'faq') {
    return isPartner ? mergeListSection(stored, 'faq', PARTNER_FAQ_DEFAULTS) : PARTNER_FAQ_DEFAULTS;
  }

  if (sectionKey === 'impactStats') {
    return isPartner
      ? mergeListSection(stored, 'impactStats', PARTNER_IMPACT_STATS_DEFAULTS)
      : PARTNER_IMPACT_STATS_DEFAULTS;
  }

  if (PARTNER_SERVICE_SECTION_DEFAULTS[sectionKey]) {
    return isPartner
      ? mergeServiceSection(stored, sectionKey)
      : PARTNER_SERVICE_SECTION_DEFAULTS[sectionKey];
  }

  return stored[sectionKey] || getDefaultSectionContent()[sectionKey] || {};
}

export function usePartnerSectionContent(sectionKey) {
  const branding = usePartnerBranding();
  return useMemo(
    () => resolvePartnerSectionContent(branding, sectionKey),
    [branding, sectionKey]
  );
}
