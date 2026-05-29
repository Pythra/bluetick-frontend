import { useEffect, useState } from 'react';
import {
  getPublicationPlatformLogo,
  getPublicationPlatformLogoFallback,
} from '../utils/publicationPlatformLogos';

function PlatformLogo({ platform, className = 'package-platform-logo' }) {
  const primary = getPublicationPlatformLogo(platform);
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(getPublicationPlatformLogo(platform));
    setFailed(false);
  }, [platform]);

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
