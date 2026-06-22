import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MdChat, MdClose, MdSend } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';
import './ClientMessagesFab.css';

const ADMIN_PATH_PREFIXES = ['/admin', '/admin-dashboard'];

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ClientMessagesDrawer({ apiUrl, token, subdomain, brandName, onClose, onUnreadChange }) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${subdomain}/client-messages`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setThreads(data.threads || []);
        onUnreadChange?.(data.unreadCount || 0);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [apiUrl, subdomain, token]);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  const openThread = async (threadId) => {
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${subdomain}/client-messages/${threadId}`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        await loadThreads();
      }
    } catch { /* silent */ }
  };

  const handleSend = async () => {
    if (!activeThread || !message.trim()) return;
    setSending(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/partner-site/${subdomain}/client-messages/${activeThread.threadId}/reply`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: message.trim() }),
        }
      );
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        setMessage('');
      }
    } catch { /* silent */ } finally {
      setSending(false);
    }
  };

  return (
    <div className="cmsg-backdrop" onClick={onClose} role="presentation">
      <div className="cmsg-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Messages">
        <div className="cmsg-head">
          <div>
            <h2>Messages</h2>
            <p>Messages from {brandName}</p>
          </div>
          <button type="button" className="cmsg-close" onClick={onClose} aria-label="Close">
            <MdClose size={20} />
          </button>
        </div>

        <div className="cmsg-body">
          <div className="cmsg-list">
            {loading ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#94a3b8' }}>Loading…</div>
            ) : !threads.length ? (
              <p className="cmsg-empty">No messages yet.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.threadId}
                  type="button"
                  className={`cmsg-item${activeThread?.threadId === t.threadId ? ' active' : ''}`}
                  onClick={() => openThread(t.threadId)}
                >
                  <div className="cmsg-item-top">
                    <strong>{t.subject || brandName}</strong>
                    {t.unreadCount > 0 && <span className="cmsg-unread">{t.unreadCount}</span>}
                  </div>
                  <span className="cmsg-preview">{t.lastMessage?.body?.slice(0, 60) || '—'}</span>
                  <span className="cmsg-when">{formatWhen(t.lastMessageAt)}</span>
                </button>
              ))
            )}
          </div>

          <div className="cmsg-chat">
            {activeThread ? (
              <>
                <h3>{activeThread.subject || brandName}</h3>
                <div className="cmsg-messages">
                  {(activeThread.messages || []).map((m) => (
                    <div key={m.id} className={`cmsg-bubble ${m.senderType === 'client' ? 'mine' : 'theirs'}`}>
                      <div className="cmsg-bubble-meta">{m.senderName} · {formatWhen(m.createdAt)}</div>
                      <p>{m.body}</p>
                    </div>
                  ))}
                </div>
                <div className="cmsg-compose">
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your reply…"
                  />
                  <button
                    type="button"
                    className="cmsg-send-btn"
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                  >
                    <MdSend size={16} /> {sending ? 'Sending…' : 'Send'}
                  </button>
                </div>
              </>
            ) : (
              <p className="cmsg-empty">Select a conversation to read and reply.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientMessagesFab() {
  const { apiUrl, token } = useAuth();
  const { isPartnerSite, brandName, subdomain: brandingSubdomain } = usePartnerBranding();
  const location = useLocation();
  const hostSubdomain = getPartnerSubdomainFromHost();
  const subdomain = brandingSubdomain || hostSubdomain;
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isAdminRoute = ADMIN_PATH_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));

  const fetchUnread = useCallback(async () => {
    if (!token || !subdomain) return;
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${subdomain}/client-messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) setUnreadCount(data.unreadCount || 0);
    } catch { /* silent */ }
  }, [apiUrl, token, subdomain]);

  useEffect(() => {
    if (isPartnerSite && token && subdomain && !isAdminRoute) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isPartnerSite, token, subdomain, isAdminRoute, fetchUnread]);

  if (!isPartnerSite || !token || !subdomain || isAdminRoute || typeof document === 'undefined') {
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
          onClose={() => { setDrawerOpen(false); fetchUnread(); }}
          onUnreadChange={setUnreadCount}
        />
      ) : null}
    </>,
    document.body
  );
}
