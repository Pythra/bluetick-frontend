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
  const socketRef = useRef(null);
  handlerRef.current = onEvent;

  useEffect(() => {
    if (!enabled || !token || !apiUrl) {
      return undefined;
    }

    let active = true;
    let socket;
    let retryTimer;
    let pingTimer;

    const connect = () => {
      if (!active) return;
      socket = new WebSocket(buildSocketUrl(apiUrl, token, subdomain));
      socketRef.current = socket;

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (
            payload.type === 'message:new' ||
            payload.type === 'typing:start' ||
            payload.type === 'typing:stop' ||
            payload.type === 'message:read'
          ) {
            handlerRef.current?.(payload);
          }
        } catch {
          /* ignore */
        }
      };

      socket.onopen = () => {
        pingTimer = window.setInterval(() => {
          if (socket.readyState === 1) {
            socket.send(JSON.stringify({ type: 'presence:ping' }));
          }
        }, 30000);
      };

      socket.onclose = () => {
        window.clearInterval(pingTimer);
        socketRef.current = null;
        if (!active) return;
        retryTimer = window.setTimeout(connect, 4000);
      };
    };

    connect();

    return () => {
      active = false;
      window.clearTimeout(retryTimer);
      window.clearInterval(pingTimer);
      socketRef.current = null;
      socket?.close();
    };
  }, [apiUrl, token, subdomain, enabled]);

  const sendEvent = (payload) => {
    const socket = socketRef.current;
    if (socket?.readyState === 1) {
      socket.send(JSON.stringify(payload));
    }
  };

  return { sendEvent };
}
