import { createPortal } from 'react-dom';
import { MdChat, MdClose } from 'react-icons/md';
import { useCallback, useEffect, useState } from 'react';
import AdminMessagesPanel from './AdminMessagesPanel';
import './AdminMessagesFab.css';

function AdminMessagesDrawer({ apiUrl, token, onClose, onUnreadChange }) {
  return (
    <div className="admin-messages-drawer-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-messages-drawer-shell"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Messages inbox"
      >
        <div className="admin-messages-drawer-head">
          <div>
            <h2>Messages</h2>
            <p>Quick inbox — open the Messages tab for the full view.</p>
          </div>
          <button type="button" className="admin-messages-drawer-close" onClick={onClose} aria-label="Close">
            <MdClose size={22} />
          </button>
        </div>
        <AdminMessagesPanel
          apiUrl={apiUrl}
          token={token}
          onUnreadChange={onUnreadChange}
          variant="drawer"
        />
      </div>
    </div>
  );
}

export default function AdminMessagesFab({
  apiUrl,
  token,
  mode = 'admin',
  subdomain,
  onNavigate,
  refreshKey,
}) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;

    try {
      const url =
        mode === 'partner'
          ? `${apiUrl}/api/partner-admin/messages/unread-count?subdomain=${encodeURIComponent(subdomain || '')}`
          : `${apiUrl}/api/admin/messages/unread-count`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // Ignore polling errors
    }
  }, [apiUrl, token, mode, subdomain]);

  useEffect(() => {
    fetchUnreadCount();
    const intervalId = window.setInterval(fetchUnreadCount, 30000);
    return () => window.clearInterval(intervalId);
  }, [fetchUnreadCount, refreshKey]);

  if (!token || typeof document === 'undefined') {
    return null;
  }

  const handleClick = () => {
    if (mode === 'partner') {
      onNavigate?.();
      return;
    }
    setDrawerOpen(true);
  };

  return createPortal(
    <>
      <button
        type="button"
        className="admin-messages-fab"
        onClick={handleClick}
        aria-label={unreadCount ? `${unreadCount} unread messages` : 'Open messages'}
      >
        <MdChat size={26} aria-hidden="true" />
        {unreadCount > 0 ? (
          <span className="admin-messages-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        ) : null}
      </button>

      {mode === 'admin' && drawerOpen ? (
        <AdminMessagesDrawer
          apiUrl={apiUrl}
          token={token}
          onClose={() => {
            setDrawerOpen(false);
            fetchUnreadCount();
          }}
          onUnreadChange={setUnreadCount}
        />
      ) : null}
    </>,
    document.body
  );
}
