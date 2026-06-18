import { useEffect, useMemo } from 'react';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { isPartnerHost } from '../utils/partnerSubdomain';
import './PartnerBrandingGate.css';

function PartnerBrandingGate({ children }) {
  const branding = usePartnerBranding();
  const likelyPartnerHost = useMemo(() => isPartnerHost(), []);
  const isAdminPath = useMemo(
    () => window.location.pathname.startsWith('/admin'),
    []
  );

  useEffect(() => {
    if (!branding.loading) {
      document.documentElement.removeAttribute('data-partner-pending');
    }
  }, [branding.loading]);

  if (
    !isAdminPath &&
    likelyPartnerHost &&
    branding.loading &&
    !branding.isPartnerSite
  ) {
    return (
      <div className="partner-branding-shell" role="status" aria-live="polite" aria-busy="true">
        <div className="partner-branding-shell-card">
          <div className="partner-branding-shell-spinner" aria-hidden="true" />
          <p>Loading your site…</p>
        </div>
      </div>
    );
  }

  return children;
}

export default PartnerBrandingGate;
