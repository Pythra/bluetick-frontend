import { useEffect, useMemo, useState } from 'react';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import {
  getPublicationPlatformLogo,
  getPublicationPlatformLogoFallback,
} from '../utils/publicationPlatformLogos';

function PlatformLogo({ platform, categoryId = null, className = 'package-platform-logo' }) {
  const { getPublicationCategoryPlatformLogo } = useMainSiteMedia();

  const primary = useMemo(() => {
    const adminLogo = categoryId ? getPublicationCategoryPlatformLogo(categoryId, platform?.name) : null;
    if (adminLogo) return adminLogo;
    if (platform?.logo) return platform.logo;
    return getPublicationPlatformLogo(platform);
  }, [categoryId, getPublicationCategoryPlatformLogo, platform]);

  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(primary);
    setFailed(false);
  }, [primary]);

  if (!src || failed) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        const fallback = getPublicationPlatformLogoFallback(platform, src);
        if (fallback && fallback !== src) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

export default PlatformLogo;
