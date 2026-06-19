import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usePartnerBranding } from '../../contexts/PartnerBrandingContext';
import { getFirstVisibleServiceSectionId } from '../../config/partnerSiteConfig';

export function useTemplateNav(onScrollToSection) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const branding = usePartnerBranding();
  const { isPartnerSite, brandName, logoUrl, features, contactEmail, contactPhone } = branding;
  const navigate = useNavigate();
  const servicesSectionId = getFirstVisibleServiceSectionId(branding);

  const closeMenu = () => setIsMenuOpen(false);

  const handleAction = (callback) => {
    if (typeof callback === 'function') {
      callback();
    }
    closeMenu();
  };

  const scrollTarget = (sectionId) => () => onScrollToSection?.(sectionId);

  return {
    isMenuOpen,
    setIsMenuOpen,
    isAuthenticated,
    user,
    brandName,
    logoUrl,
    features,
    contactEmail,
    contactPhone,
    navigate,
    servicesSectionId,
    handleAction,
    scrollTarget,
    closeMenu,
    isPartnerSite,
  };
}
