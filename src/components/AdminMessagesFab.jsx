import { createPortal } from 'react-dom';
import { MdChat, MdClose, MdHandshake, MdApps } from 'react-icons/md';
import { useCallback, useEffect, useState } from 'react';
import ChatComposeBar from './chat/ChatComposeBar';
import MessageBubbleContent from './chat/MessageBubbleContent';
import { messagePreviewText } from '../utils/chatMedia';
import './AdminMessagesFab.css';

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: MdApps },
  { id: 'partners', label: 'Partners', icon: MdHandshake },
];

function AdminMessagesDrawer({ apiUrl, token, onClose, onUnreadChange }) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('all');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/messages/inbox`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load inbox');
      }
      setThreads(data.threads || []);
      onUnreadChange?.(data.unreadCount || 0);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load messages');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, onUnreadChange]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  useEffect(() => {
    setActiveThread(null);
    setMessage('');
  }, [category]);

  const openThread = async (thread) => {
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${thread.partnerId}/messages/${thread.threadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load conversation');
      }
      setActiveThread(data.thread);
      await loadInbox();
    } catch (loadError) {
      setError(loadError.message || 'Unable to open conversation');
    }
  };

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!activeThread || (!body?.trim() && !attachment)) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${activeThread.partnerId}/messages`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            threadId: activeThread.threadId,
            channel: activeThread.channel,
            body,
            attachment,
            attachmentType,
            attachmentName,
            participantEmail: activeThread.participantEmail,
            participantName: activeThread.participantName,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }
      setActiveThread(data.thread);
      setMessage('');
      await loadInbox();
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((thread) => {
    if (category === 'partners') return thread.channel === 'partner-admin';
    return thread.channel === 'partner-admin';
  });

  const partnerCount = threads.filter((t) => t.channel === 'partner-admin').length;

  const getCategoryCount = (cat) => {
    if (cat === 'partners') return partnerCount;
    return partnerCount;
  };

  const getCategoryDescription = () => 'Partner support threads only — client conversations stay on partner sites';

  return (
    <div className="admin-messages-drawer-backdrop" onClick={onClose} role="presentation">
      <div
        className="admin-messages-drawer"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-label="Messages inbox"
      >
        <div className="admin-messages-drawer-head">
          <div>
            <h2>Messages</h2>
            <p>{getCategoryDescription()}</p>
          </div>
          <button type="button" className="admin-messages-drawer-close" onClick={onClose} aria-label="Close">
            <MdClose size={22} />
          </button>
        </div>

        <div className="admin-messages-drawer-cats">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`admin-messages-cat-tab${category === id ? ' active' : ''}`}
              onClick={() => setCategory(id)}
            >
              <Icon size={14} />
              {label}
              {getCategoryCount(id) > 0 ? (
                <span className="admin-messages-cat-count">{getCategoryCount(id)}</span>
              ) : null}
            </button>
          ))}
        </div>

        {error ? <p className="admin-messages-drawer-error">{error}</p> : null}

        <div className="admin-messages-drawer-body">
          <div className="admin-messages-drawer-list">
            {loading ? (
              <div className="adm-spinner" style={{ margin: '24px auto' }} />
            ) : !filteredThreads.length ? (
              <p className="admin-messages-drawer-empty">
                No partner support threads yet.
              </p>
            ) : (
              filteredThreads.map((thread) => (
                <button
                  key={thread.threadId}
                  type="button"
                  className={`admin-messages-drawer-item${activeThread?.threadId === thread.threadId ? ' active' : ''}`}
                  onClick={() => openThread(thread)}
                >
                  <div className="admin-messages-drawer-item-top">
                    <strong>
                      {thread.channel === 'partner-admin'
                        ? thread.partnerName || 'Partner'
                        : thread.participantName || thread.participantEmail}
                    </strong>
                    {thread.unreadCount ? (
                      <span className="admin-messages-drawer-unread">{thread.unreadCount}</span>
                    ) : null}
                  </div>
                  <span className="admin-messages-drawer-meta">
                    {thread.channel === 'partner-admin'
                      ? <span className="admin-messages-channel-tag partner-tag">Partner</span>
                      : <span className="admin-messages-channel-tag client-tag">Client · {thread.partnerName}</span>}
                    {' '}· {formatWhen(thread.lastMessageAt)}
                  </span>
                  <span className="admin-messages-drawer-preview">
                    {messagePreviewText(thread.lastMessage) || thread.subject}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="admin-messages-drawer-chat">
            {activeThread ? (
              <>
                <h3>
                  {activeThread.channel === 'partner-admin'
                    ? activeThread.partnerName || activeThread.subject
                    : activeThread.participantName || activeThread.participantEmail || activeThread.subject}
                </h3>
                <p className="admin-messages-chat-meta">
                  {activeThread.channel === 'partner-admin'
                    ? `Partner thread · ${activeThread.partnerEmail || ''}`
                    : `Client of ${activeThread.partnerName || 'partner'} · ${activeThread.participantEmail || ''}`}
                </p>
                <div className="admin-messages-drawer-messages">
                  {(activeThread.messages || []).map((entry) => (
                    <div key={entry.id} className={`adm-comm-bubble ${entry.senderType}`}>
                      <div className="adm-comm-bubble-head">
                        <strong>{entry.senderName}</strong>
                        <span>{formatWhen(entry.createdAt)}</span>
                      </div>
                      <MessageBubbleContent message={entry} />
                    </div>
                  ))}
                </div>
                <ChatComposeBar
                  message={message}
                  onMessageChange={setMessage}
                  onSend={handleSend}
                  sending={sending}
                  placeholder="Reply..."
                  variant="drawer"
                />
              </>
            ) : (
              <p className="admin-messages-drawer-empty">Select a conversation to read and reply.</p>
            )}
          </div>
        </div>
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
