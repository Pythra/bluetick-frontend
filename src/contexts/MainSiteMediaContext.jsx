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
  getHeroVideo: (_fallback) => _fallback,
  getServiceVideo: (_slot, fallback) => fallback,
  getServiceImage: (_slot, fallback) => fallback,
  getClientLogos: () => [],
  getCelebrityLogos: () => [],
  getPublicationCarouselLogos: () => DEFAULT_PUBLICATION_CAROUSEL_LOGOS,
  getPublicationCategoryLogos: (_categoryId, fallback = []) => fallback,
  getPublicationCategoryPlatformLogo: (_categoryId, _platformName) => null,
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

  const getHeroVideo = useCallback(
    (fallback = null) => {
      if (isPartnerSite) return fallback;
      return media?.heroVideo || fallback;
    },
    [isPartnerSite, media]
  );

  const getServiceVideo = useCallback(
    (slot, fallback = null) => {
      if (isPartnerSite) return fallback;
      const override = media?.serviceVideos?.[slot];
      return override || fallback;
    },
    [isPartnerSite, media]
  );

  const getClientLogos = useCallback(() => {
    if (isPartnerSite) return [];
    const configured = media?.clientLogos;
    if (!Array.isArray(configured)) return [];
    return configured.filter((logo) => logo?.imageUrl);
  }, [isPartnerSite, media]);

  const getCelebrityLogos = useCallback(() => {
    if (isPartnerSite) return [];
    const configured = media?.celebrityLogos;
    if (!Array.isArray(configured)) return [];
    return configured.filter((entry) => entry?.imageUrl);
  }, [isPartnerSite, media]);

  const getPublicationCarouselLogos = useCallback(() => {
    if (isPartnerSite) {
      return DEFAULT_PUBLICATION_CAROUSEL_LOGOS;
    }

    const configured = media?.publicationCarouselLogos;
    if (media?.seeded && Array.isArray(configured)) {
      return configured
        .filter((logo) => logo.imageUrl)
        .map((logo) => ({
          ...logo,
          image: logo.imageUrl,
        }));
    }

    if (!Array.isArray(configured) || !configured.length) {
      return DEFAULT_PUBLICATION_CAROUSEL_LOGOS;
    }

    return configured.map((logo) => ({
      ...logo,
      image: resolvePublicationCarouselLogo(logo),
    }));
  }, [isPartnerSite, media]);

  const getPublicationCategoryPlatformLogo = useCallback(
    (categoryId, platformName) => {
      if (isPartnerSite || !categoryId || !platformName) return null;
      const configured = media?.publicationCategoryLogos?.[categoryId];
      if (!Array.isArray(configured)) return null;

      const key = String(platformName).trim().toLowerCase();
      const match = configured.find(
        (logo) => String(logo?.name || '').trim().toLowerCase() === key && logo?.imageUrl
      );
      return match?.imageUrl || null;
    },
    [isPartnerSite, media]
  );

  const getPublicationCategoryLogos = useCallback(
    (categoryId, fallback = []) => {
      if (isPartnerSite) return fallback;

      const configured = media?.publicationCategoryLogos?.[categoryId];
      if (!Array.isArray(configured) || !configured.length) {
        return fallback;
      }

      const fallbackByName = new Map(
        fallback
          .filter((logo) => logo?.src)
          .map((logo) => [String(logo.alt || '').trim().toLowerCase(), logo])
      );

      const resolved = configured
        .map((logo) => {
          const name = String(logo?.name || '').trim();
          const fallbackLogo = name ? fallbackByName.get(name.toLowerCase()) : null;
          const src = logo?.imageUrl || fallbackLogo?.src || null;
          if (!src) return null;
          return {
            src,
            alt: name || fallbackLogo?.alt || 'Publication outlet',
          };
        })
        .filter(Boolean);

      return resolved.length ? resolved : fallback;
    },
    [isPartnerSite, media]
  );

  const value = useMemo(
    () => ({
      loaded,
      media,
      getHeroVideo,
      getServiceVideo,
      getServiceImage,
      getClientLogos,
      getCelebrityLogos,
      getPublicationCarouselLogos,
      getPublicationCategoryLogos,
      getPublicationCategoryPlatformLogo,
    }),
    [
      loaded,
      media,
      getHeroVideo,
      getServiceVideo,
      getServiceImage,
      getClientLogos,
      getCelebrityLogos,
      getPublicationCarouselLogos,
      getPublicationCategoryLogos,
      getPublicationCategoryPlatformLogo,
    ]
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
