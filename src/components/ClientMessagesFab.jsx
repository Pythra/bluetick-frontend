import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { MdChat, MdClose } from 'react-icons/md';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain';
import ChatComposeBar from './chat/ChatComposeBar';
import MessageBubbleContent from './chat/MessageBubbleContent';
import { messagePreviewText } from '../utils/chatMedia';
import './ClientMessagesFab.css';

const ADMIN_PATH_PREFIXES = ['/admin', '/admin-dashboard'];

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function ClientMessagesDrawer({ apiUrl, token, subdomain, brandName, accountEmail, onClose, onUnreadChange }) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [matchedEmails, setMatchedEmails] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const loadThreads = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${subdomain}/client-messages`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setThreads(data.threads || []);
        setMatchedEmails(data.matchedEmails || []);
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

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!activeThread || (!body?.trim() && !attachment)) return;
    setSending(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/partner-site/${subdomain}/client-messages/${activeThread.threadId}/reply`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ body, attachment, attachmentType, attachmentName }),
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
            {accountEmail ? (
              <p className="cmsg-account-email">Signed in as {accountEmail}</p>
            ) : null}
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
              <div className="cmsg-empty-wrap">
                <p className="cmsg-empty">No messages yet.</p>
                {matchedEmails.length > 1 ? (
                  <p className="cmsg-empty-hint">
                    We also check order emails linked to your account:
                    {' '}
                    {matchedEmails.filter((e) => e !== accountEmail).join(', ')}
                  </p>
                ) : (
                  <p className="cmsg-empty-hint">
                    Messages are delivered here when {brandName} contacts the email on your orders or account.
                  </p>
                )}
              </div>
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
                  <span className="cmsg-preview">{messagePreviewText(t.lastMessage)}</span>
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
                      <div className="cmsg-bubble-meta">{m.senderName || brandName} · {formatWhen(m.createdAt)}</div>
                      <MessageBubbleContent message={m} />
                    </div>
                  ))}
                </div>
                <ChatComposeBar
                  message={message}
                  onMessageChange={setMessage}
                  onSend={handleSend}
                  sending={sending}
                  placeholder="Type your reply…"
                  variant="drawer"
                />
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
  const { apiUrl, token, user } = useAuth();
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
          accountEmail={user?.email}
          onClose={() => { setDrawerOpen(false); fetchUnread(); }}
          onUnreadChange={setUnreadCount}
        />
      ) : null}
    </>,
    document.body
  );
}
