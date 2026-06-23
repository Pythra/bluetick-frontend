import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getPartnerSubdomainFromHost, isBluetickMainHost } from '../utils/partnerSubdomain';
import { applyBrandCssVariables } from '../utils/brandTheme';
import { getDefaultEnabledServices } from '../config/partnerSiteConfig';
import { normalizeMediaUrl } from '../utils/partnerMedia';
import {
  applyCachedBrandingBootstrap,
  readCachedPartnerBranding,
  writeCachedPartnerBranding,
} from '../utils/partnerBrandingCache';
import { applyTemplateFonts, clearTemplateFonts } from '../templates/templateFonts';

const DEFAULT_BRANDING = {
  isPartnerSite: false,
  brandName: 'Bluetickgeng Development',
  shortName: 'Bluetickgeng',
  logoUrl: null,
  subdomain: null,
  siteUrl: null,
  contactEmail: 'info@bluetickgeng.com',
  contactPhone: '',
  contactWhatsapp: '',
  contactWebsite: '',
  primaryColor: '#2563eb',
  primaryColorDark: '#1d4ed8',
  templateId: 'modern',
  tagline: 'Digital Growth Services for Brands',
  heroTitle: '',
  heroDescription: '',
  content: {},
  assets: {},
  features: {
    showHero: true,
    showPublicationLogos: true,
    showImpactStats: true,
    showCelebrities: true,
    showTestimonials: true,
    showFaq: true,
    showCustomRequests: true,
    showBlog: true,
    showAffiliateProgram: true,
    showPartnerProgram: true,
  },
  enabledServices: getDefaultEnabledServices(),
  sectionContent: {},
  customDomain: '',
  customDomainVerified: false,
  showPartnerProgram: true,
  isVideoFirstPartnerSite: false,
  packagePricing: {},
  pricingUpdatedAt: null,
  loading: false,
};

const PartnerBrandingContext = createContext(DEFAULT_BRANDING);

export const usePartnerBranding = () => useContext(PartnerBrandingContext);

function applyBrandingTheme(branding) {
  const root = document.documentElement;
  root.dataset.partnerSite = branding.isPartnerSite ? 'true' : 'false';
  root.dataset.partnerTemplate = branding.isPartnerSite ? branding.templateId || 'modern' : 'default';
  applyBrandCssVariables(root, branding.primaryColor, branding.primaryColorDark);
  document.title = branding.isPartnerSite
    ? `${branding.brandName} - Digital Growth Services`
    : 'Bluetickgeng Development - Web, App & Publication Solutions';
}

function buildBrandingState(data, { loading }) {
  return {
    ...DEFAULT_BRANDING,
    ...data,
    logoUrl: normalizeMediaUrl(data.logoUrl),
    content: data.content || {},
    assets: Object.fromEntries(
      Object.entries(data.assets || {}).map(([key, value]) => [key, normalizeMediaUrl(value)])
    ),
    features: {
      ...DEFAULT_BRANDING.features,
      ...(data.features || {}),
    },
    enabledServices: {
      ...DEFAULT_BRANDING.enabledServices,
      ...(data.enabledServices || {}),
    },
    sectionContent: data.sectionContent || {},
    packagePricing: data.packagePricing || {},
    pricingUpdatedAt: data.pricingUpdatedAt || null,
    loading,
  };
}

function getInitialBranding(isMainHost, hostname) {
  if (isMainHost) {
    return { ...DEFAULT_BRANDING, loading: false };
  }

  const cached = readCachedPartnerBranding(hostname);
  if (cached) {
    const { cssVars, cachedAt, ...brandingData } = cached;
    return buildBrandingState(
      {
        ...brandingData,
        isPartnerSite: true,
      },
      { loading: true }
    );
  }

  return { ...DEFAULT_BRANDING, loading: true };
}

export function PartnerBrandingProvider({ children }) {
  const { apiUrl } = useAuth();
  const subdomain = useMemo(() => getPartnerSubdomainFromHost(), []);
  const hostname = useMemo(() => window.location.hostname.toLowerCase(), []);
  const isMainHost = useMemo(() => isBluetickMainHost(hostname), [hostname]);
  const [branding, setBranding] = useState(() => {
    if (!isMainHost) {
      applyCachedBrandingBootstrap(hostname);
    }
    return getInitialBranding(isMainHost, hostname);
  });

  useEffect(() => {
    if (isMainHost) {
      let cancelled = false;

      const loadGlobalPricing = async ({ force = false } = {}) => {
        try {
          const response = await fetch(`${apiUrl}/api/site/global-pricing`);
          const data = await response.json();

          if (cancelled || !response.ok || !data.success) {
            if (!cancelled) {
              setBranding({ ...DEFAULT_BRANDING, loading: false });
            }
            return;
          }

          setBranding(
            buildBrandingState(
              {
                packagePricing: data.packagePricing || {},
                pricingUpdatedAt: data.pricingUpdatedAt || null,
              },
              { loading: false }
            )
          );
        } catch (error) {
          console.error('Global pricing load failed:', error);
          if (!cancelled) {
            setBranding({ ...DEFAULT_BRANDING, loading: false });
          }
        }
      };

      loadGlobalPricing();

      const handlePricingUpdated = () => loadGlobalPricing({ force: true });
      window.addEventListener('partner-pricing-updated', handlePricingUpdated);

      return () => {
        cancelled = true;
        window.removeEventListener('partner-pricing-updated', handlePricingUpdated);
      };
    }

    return undefined;
  }, [isMainHost, apiUrl]);

  useEffect(() => {
    if (isMainHost) {
      return undefined;
    }

    let cancelled = false;

    const loadBranding = async ({ force = false } = {}) => {
      try {
        const endpoint = subdomain
          ? `${apiUrl}/api/partner-site/${encodeURIComponent(subdomain)}`
          : `${apiUrl}/api/partner-site/by-host/${encodeURIComponent(hostname)}`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (response.ok && data.isPartnerSite) {
          const cached = readCachedPartnerBranding(hostname);
          const cachedPricingAt = cached?.pricingUpdatedAt
            ? new Date(cached.pricingUpdatedAt).getTime()
            : 0;
          const nextPricingAt = data.pricingUpdatedAt
            ? new Date(data.pricingUpdatedAt).getTime()
            : 0;

          if (
            !force &&
            cached?.packagePricing &&
            Object.keys(cached.packagePricing).length > 0 &&
            cachedPricingAt >= nextPricingAt
          ) {
            const nextBranding = buildBrandingState(
              { ...cached, isPartnerSite: true },
              { loading: false }
            );
            setBranding(nextBranding);
            return;
          }

          const nextBranding = buildBrandingState(data, { loading: false });
          setBranding(nextBranding);
          writeCachedPartnerBranding(nextBranding, hostname);
          return;
        }

        setBranding({ ...DEFAULT_BRANDING, loading: false });
      } catch (error) {
        console.error('Partner branding load failed:', error);
        if (!cancelled) {
          const cached = readCachedPartnerBranding(hostname);
          if (cached) {
            const { cssVars, cachedAt, ...brandingData } = cached;
            setBranding(buildBrandingState({ ...brandingData, isPartnerSite: true }, { loading: false }));
          } else {
            setBranding({ ...DEFAULT_BRANDING, loading: false });
          }
        }
      }
    };

    loadBranding();

    const handlePricingUpdated = () => {
      loadBranding({ force: true });
    };

    window.addEventListener('partner-pricing-updated', handlePricingUpdated);

    return () => {
      cancelled = true;
      window.removeEventListener('partner-pricing-updated', handlePricingUpdated);
    };
  }, [apiUrl, subdomain, hostname, isMainHost]);

  useEffect(() => {
    if (branding.isPartnerSite && branding.templateId) {
      applyTemplateFonts(branding.templateId);
    } else {
      clearTemplateFonts();
    }
  }, [branding.isPartnerSite, branding.templateId]);

  useEffect(() => {
    applyBrandingTheme(branding);
  }, [branding]);

  return (
    <PartnerBrandingContext.Provider value={{ ...branding, subdomain: branding.subdomain || subdomain }}>
      {children}
    </PartnerBrandingContext.Provider>
  );
}
