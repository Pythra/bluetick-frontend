import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';

export default function RegisterPartnerSiteUser() {
  const { apiUrl, token } = useAuth();
  const { isPartnerSite, subdomain: brandingSubdomain } = usePartnerBranding();
  const hostSubdomain = getPartnerSubdomainFromHost();
  const subdomain = brandingSubdomain || hostSubdomain;

  useEffect(() => {
    if (!isPartnerSite || !token || !subdomain) return;

    fetch(`${apiUrl}/api/partner-site/${subdomain}/site-user/register`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }).catch(() => {});
  }, [apiUrl, isPartnerSite, subdomain, token]);

  return null;
}
