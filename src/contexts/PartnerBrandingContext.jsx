import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getPartnerSubdomainFromHost, isBluetickMainHost } from '../utils/partnerSubdomain';

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
    showPublicationLogos: true,
    showCelebrities: true,
    showTestimonials: true,
    showBlog: true,
    showAffiliateProgram: true,
    showPartnerProgram: true,
  },
  customDomain: '',
  customDomainVerified: false,
  showPartnerProgram: true,
  loading: false,
};

const PartnerBrandingContext = createContext(DEFAULT_BRANDING);

export const usePartnerBranding = () => useContext(PartnerBrandingContext);

function applyBrandingTheme(branding) {
  const root = document.documentElement;
  root.dataset.partnerSite = branding.isPartnerSite ? 'true' : 'false';
  root.dataset.partnerTemplate = branding.isPartnerSite ? branding.templateId || 'modern' : 'default';
  root.style.setProperty('--brand-primary', branding.primaryColor);
  root.style.setProperty('--brand-primary-dark', branding.primaryColorDark);
  root.style.setProperty('--brand-accent', branding.primaryColor);
  document.title = branding.isPartnerSite
    ? `${branding.brandName} - Digital Growth Services`
    : 'Bluetickgeng Development - Web, App & Publication Solutions';
}

export function PartnerBrandingProvider({ children }) {
  const { apiUrl } = useAuth();
  const subdomain = useMemo(() => getPartnerSubdomainFromHost(), []);
  const hostname = useMemo(() => window.location.hostname.toLowerCase(), []);
  const isMainHost = useMemo(() => isBluetickMainHost(hostname), [hostname]);
  const [branding, setBranding] = useState(() => ({
    ...DEFAULT_BRANDING,
    loading: !isMainHost,
  }));

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
          setBranding({
            ...DEFAULT_BRANDING,
            ...data,
            content: data.content || {},
            assets: data.assets || {},
            features: {
              ...DEFAULT_BRANDING.features,
              ...(data.features || {}),
            },
            loading: false,
          });
          return;
        }

        setBranding({ ...DEFAULT_BRANDING, loading: false });
      } catch (error) {
        console.error('Partner branding load failed:', error);
        if (!cancelled) {
          setBranding({ ...DEFAULT_BRANDING, loading: false });
        }
      }
    };

    loadBranding();

    return () => {
      cancelled = true;
    };
  }, [apiUrl, subdomain, hostname, isMainHost]);

  useEffect(() => {
    applyBrandingTheme(branding);
  }, [branding]);

  return (
    <PartnerBrandingContext.Provider value={branding}>
      {children}
    </PartnerBrandingContext.Provider>
  );
}
