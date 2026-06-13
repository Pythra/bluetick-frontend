import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';

const DEFAULT_BRANDING = {
  isPartnerSite: false,
  brandName: 'Bluetickgeng Development',
  shortName: 'Bluetickgeng',
  subdomain: null,
  siteUrl: null,
  contactEmail: 'info@bluetickgeng.com',
  primaryColor: '#2563eb',
  primaryColorDark: '#1d4ed8',
  tagline: 'Digital Growth Services for Brands',
  showPartnerProgram: true,
  loading: false,
};

const PartnerBrandingContext = createContext(DEFAULT_BRANDING);

export const usePartnerBranding = () => useContext(PartnerBrandingContext);

function applyBrandingTheme(branding) {
  const root = document.documentElement;
  root.dataset.partnerSite = branding.isPartnerSite ? 'true' : 'false';
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
  const [branding, setBranding] = useState(() => ({
    ...DEFAULT_BRANDING,
    loading: Boolean(subdomain),
  }));

  useEffect(() => {
    if (!subdomain) {
      setBranding({ ...DEFAULT_BRANDING, loading: false });
      return undefined;
    }

    let cancelled = false;

    const loadBranding = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/partner-site/${encodeURIComponent(subdomain)}`);
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (response.ok && data.isPartnerSite) {
          setBranding({
            ...DEFAULT_BRANDING,
            ...data,
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
  }, [apiUrl, subdomain]);

  useEffect(() => {
    applyBrandingTheme(branding);
  }, [branding]);

  return (
    <PartnerBrandingContext.Provider value={branding}>
      {children}
    </PartnerBrandingContext.Provider>
  );
}
