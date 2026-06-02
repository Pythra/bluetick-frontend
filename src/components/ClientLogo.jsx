import { useEffect, useState } from 'react';
import {
  getClientLogoFallbackUrl,
  getClientLogoPrimaryUrl,
} from '../data/clientLogos';

function ClientLogo({ client, className = 'clients-section-logo' }) {
  const primary = getClientLogoPrimaryUrl(client);
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(getClientLogoPrimaryUrl(client));
    setFailed(false);
  }, [client?.name, client?.domain, client?.logo]);

  if (!src || failed) {
    return (
      <span className={`${className} clients-section-logo-fallback`} aria-hidden="true">
        {client?.name?.charAt(0) || '?'}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt={client?.name || 'Client logo'}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        const fallback = getClientLogoFallbackUrl(client, src);
        if (fallback && fallback !== src) {
          setSrc(fallback);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

export default ClientLogo;
