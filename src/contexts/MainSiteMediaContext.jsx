import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import { usePartnerBranding } from './PartnerBrandingContext';
import {
  DEFAULT_PUBLICATION_CAROUSEL_LOGOS,
  resolvePublicationCarouselLogo,
} from '../data/defaultPublicationLogos';

const MainSiteMediaContext = createContext({
  loaded: false,
  media: null,
  getServiceImage: (_slot, fallback) => fallback,
  getPublicationCarouselLogos: () => DEFAULT_PUBLICATION_CAROUSEL_LOGOS,
  getPublicationCategoryLogos: (_categoryId, fallback = []) => fallback,
});

export function MainSiteMediaProvider({ children }) {
  const { apiUrl } = useAuth();
  const { isPartnerSite } = usePartnerBranding();
  const [media, setMedia] = useState(null);
  const [loaded, setLoaded] = useState(isPartnerSite);

  useEffect(() => {
    if (isPartnerSite) {
      setLoaded(true);
      return;
    }

    let cancelled = false;

    const loadMedia = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/homepage-media`);
        const data = await response.json();
        if (!cancelled && response.ok && data.success) {
          setMedia(data.media || null);
        }
      } catch (error) {
        console.error('[MainSiteMedia] Failed to load homepage media:', error);
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    };

    loadMedia();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, isPartnerSite]);

  const getServiceImage = useCallback(
    (slot, fallback = null) => {
      if (isPartnerSite) return fallback;
      const override = media?.serviceImages?.[slot];
      return override || fallback;
    },
    [isPartnerSite, media]
  );

  const getPublicationCarouselLogos = useCallback(() => {
    if (isPartnerSite) {
      return DEFAULT_PUBLICATION_CAROUSEL_LOGOS;
    }

    const configured = media?.publicationCarouselLogos;
    if (!Array.isArray(configured) || !configured.length) {
      return DEFAULT_PUBLICATION_CAROUSEL_LOGOS;
    }

    return configured.map((logo) => ({
      ...logo,
      image: resolvePublicationCarouselLogo(logo),
    }));
  }, [isPartnerSite, media]);

  const getPublicationCategoryLogos = useCallback(
    (categoryId, fallback = []) => {
      if (isPartnerSite) return fallback;
      const configured = media?.publicationCategoryLogos?.[categoryId];
      if (!Array.isArray(configured) || !configured.length) {
        return fallback;
      }
      return configured
        .map((logo) => ({
          src: logo.imageUrl || null,
          alt: logo.name || 'Publication outlet',
        }))
        .filter((logo) => logo.src);
    },
    [isPartnerSite, media]
  );

  const value = useMemo(
    () => ({
      loaded,
      media,
      getServiceImage,
      getPublicationCarouselLogos,
      getPublicationCategoryLogos,
    }),
    [loaded, media, getServiceImage, getPublicationCarouselLogos, getPublicationCategoryLogos]
  );

  return <MainSiteMediaContext.Provider value={value}>{children}</MainSiteMediaContext.Provider>;
}

export function useMainSiteMedia() {
  return useContext(MainSiteMediaContext);
}

export function useMainSiteServiceImage(slot, fallback = null) {
  const { getServiceImage } = useMainSiteMedia();
  return getServiceImage(slot, fallback);
}
