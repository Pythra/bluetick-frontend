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
      setBranding({ ...DEFAULT_BRANDING, loading: false });
      return undefined;
    }

    let cancelled = false;

    const loadBranding = async () => {
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

    return () => {
      cancelled = true;
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
