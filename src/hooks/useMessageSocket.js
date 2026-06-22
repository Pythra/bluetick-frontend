import { useEffect, useRef } from 'react';

function buildSocketUrl(apiUrl, token, subdomain) {
  const base = String(apiUrl || '').replace(/\/$/, '');
  const wsBase = base.replace(/^http/i, 'ws');
  const params = new URLSearchParams({ token });
  if (subdomain) {
    params.set('subdomain', subdomain);
  }
  return `${wsBase}/ws/messages?${params.toString()}`;
}

export default function useMessageSocket({ apiUrl, token, subdomain, enabled = true, onEvent }) {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    if (!enabled || !token || !apiUrl) {
      return undefined;
    }

    let active = true;
    let socket;
    let retryTimer;

    const connect = () => {
      if (!active) return;
      socket = new WebSocket(buildSocketUrl(apiUrl, token, subdomain));

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'message:new') {
            handlerRef.current?.(payload);
          }
        } catch {
          /* ignore */
        }
      };

      socket.onclose = () => {
        if (!active) return;
        retryTimer = window.setTimeout(connect, 4000);
      };
    };

    connect();

    return () => {
      active = false;
      window.clearTimeout(retryTimer);
      socket?.close();
    };
  }, [apiUrl, token, subdomain, enabled]);
}
