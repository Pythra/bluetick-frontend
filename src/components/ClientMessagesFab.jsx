import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MdChat, MdClose } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';
import useMessageSocket from '../hooks/useMessageSocket';
import AccountMessagesPanel from './account/AccountMessagesPanel';
import './ClientMessagesFab.css';

const ADMIN_PATH_PREFIXES = ['/admin', '/admin-dashboard'];

function ClientMessagesDrawer({ apiUrl, token, subdomain, brandName, accountEmail, supportEmail, onClose, onUnreadChange }) {
  return (
    <div className="cmsg-backdrop" onClick={onClose} role="presentation">
      <div className="cmsg-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Messages">
        <div className="cmsg-head">
          <div>
            <h2>Messages</h2>
            <p>Messages from {brandName}</p>
            {accountEmail ? (
              <p className="cmsg-account-email">Signed in as {accountEmail}</p>
            ) : null}
          </div>
          <button type="button" className="cmsg-close" onClick={onClose} aria-label="Close">
            <MdClose size={20} />
          </button>
        </div>

        <AccountMessagesPanel
          apiUrl={apiUrl}
          token={token}
          subdomain={subdomain}
          brandName={brandName}
          accountEmail={accountEmail}
          supportEmail={supportEmail}
          variant="drawer"
          onUnreadChange={onUnreadChange}
        />
      </div>
    </div>
  );
}

export default function ClientMessagesFab() {
  const { apiUrl, token, user } = useAuth();
  const { isPartnerSite, brandName, subdomain: brandingSubdomain, loading: brandingLoading, contactEmail } = usePartnerBranding();
  const location = useLocation();
  const hostSubdomain = getPartnerSubdomainFromHost();
  const subdomain = (brandingSubdomain || hostSubdomain || '').trim().toLowerCase();
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdminRoute = ADMIN_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  const fetchUnread = useCallback(async () => {
    if (!token || !subdomain) return;
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${subdomain}/client-messages?summary=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setUnreadCount(data.unreadCount || 0);
    } catch { /* silent */ }
  }, [apiUrl, token, subdomain]);

  useEffect(() => {
    if (isPartnerSite && token && subdomain && !isAdminRoute) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 60000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPartnerSite, token, subdomain, isAdminRoute, fetchUnread]);

  useMessageSocket({
    apiUrl,
    token,
    subdomain,
    enabled: isPartnerSite && Boolean(token && subdomain) && !isAdminRoute,
    onEvent: fetchUnread,
  });

  if (!isPartnerSite || !token || isAdminRoute || typeof document === 'undefined') {
    return null;
  }

  if (brandingLoading && !subdomain) {
    return null;
  }

  if (!subdomain) {
    return null;
  }

  return createPortal(
    <>
      <button
        type="button"
        className="cmsg-fab"
        onClick={() => { setDrawerOpen(true); }}
        aria-label={unreadCount ? `${unreadCount} unread messages` : 'Open messages'}
      >
        <MdChat size={22} />
        {unreadCount > 0 && (
          <span className="cmsg-fab-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {drawerOpen ? (
        <ClientMessagesDrawer
          apiUrl={apiUrl}
          token={token}
          subdomain={subdomain}
          brandName={brandName}
          accountEmail={user?.email}
          supportEmail={contactEmail}
          onClose={() => { setDrawerOpen(false); fetchUnread(); }}
          onUnreadChange={setUnreadCount}
        />
      ) : null}
    </>,
    document.body
  );
}
