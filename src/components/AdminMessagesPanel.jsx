import { MdSearch } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChatComposeBar from './chat/ChatComposeBar';
import ChatMessageRow from './chat/ChatMessageRow';
import ChatMessagesPane from './chat/ChatMessagesPane';
import useMessageSocket from '../hooks/useMessageSocket';
import { getDisplayName, isOwnMessage } from '../utils/chatDisplay';
import { messagePreviewText } from '../utils/chatMedia';
import { appendThreadMessage, patchAdminPartnerInbox, upsertAdminThreadSummary } from '../utils/messagingRealtime';
import ConversationHeader from './messaging/ConversationHeader';
import MessagingStatsBar from './messaging/MessagingStatsBar';
import TypingIndicator from './messaging/TypingIndicator';
import './AdminMessagesFab.css';
import './messaging/messagingCrm.css';

const FILTERS = [
  { id: 'all', label: 'All Messages' },
  { id: 'unread', label: 'Unread' },
  { id: 'partners', label: 'Partners' },
  { id: 'clients', label: 'Clients' },
  { id: 'archived', label: 'Archived' },
];

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminMessagesPanel({
  apiUrl,
  token,
  onUnreadChange,
  variant = 'drawer',
  initialFilter = 'all',
}) {
  const [threads, setThreads] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeThread, setActiveThread] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [message, setMessage] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [internalMode, setInternalMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(initialFilter);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [typingName, setTypingName] = useState('');
  const activeThreadRef = useRef(null);
  const typingTimerRef = useRef(null);
  activeThreadRef.current = activeThread;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/messages/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data.stats);
      }
    } catch {
      /* silent */
    }
  }, [apiUrl, token]);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ filter, q: search.trim() });
      const response = await fetch(`${apiUrl}/api/admin/messages/unified-inbox?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
  }, [apiUrl, token, filter, search, onUnreadChange]);

  const refreshUnreadTotal = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/messages/unread-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        onUnreadChange?.(data.unreadCount || 0);
      }
    } catch {
      /* silent */
    }
  }, [apiUrl, token, onUnreadChange]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    loadInbox();
    if (variant === 'page') {
      loadStats();
    }
  }, [loadInbox, loadStats, variant]);

  const loadParticipantContext = useCallback(async (thread) => {
    if (!thread?.partnerId || !thread?.threadId) {
      setParticipant(null);
      return;
    }
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${thread.partnerId}/messages/${thread.threadId}/context`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setParticipant(data.participant);
      }
    } catch {
      setParticipant(null);
    }
  }, [apiUrl, token]);

  const handleRealtimeMessage = useCallback((payload) => {
    if (payload.type === 'typing:start') {
      if (payload.threadId === activeThreadRef.current?.threadId) {
        setTypingName(payload.name || 'Someone');
      }
      return;
    }
    if (payload.type === 'typing:stop') {
      if (payload.threadId === activeThreadRef.current?.threadId) {
        setTypingName('');
      }
      return;
    }
    if (payload.type === 'message:read') {
      if (activeThreadRef.current?.threadId === payload.threadId) {
        setActiveThread((previous) => {
          if (!previous) return previous;
          const nextMessages = (previous.messages || []).map((entry) =>
            payload.messageIds?.includes(entry.id)
              ? { ...entry, deliveryStatus: 'read', readAt: payload.readAt }
              : entry
          );
          return { ...previous, messages: nextMessages };
        });
      }
      return;
    }

    refreshUnreadTotal();
    setThreads((previous) => patchAdminPartnerInbox(previous, payload));
    if (activeThreadRef.current?.threadId === payload.threadId) {
      setActiveThread((previous) => appendThreadMessage(previous, payload));
    }
  }, [refreshUnreadTotal]);

  const { sendEvent } = useMessageSocket({
    apiUrl,
    token,
    enabled: Boolean(apiUrl && token),
    onEvent: handleRealtimeMessage,
  });

  const openThread = async (thread) => {
    setError('');
    setTypingName('');
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
      setThreads((previous) =>
        previous.map((entry) =>
          entry.threadId === thread.threadId ? { ...entry, unreadCount: 0 } : entry
        )
      );
      await loadParticipantContext(data.thread);
      await refreshUnreadTotal();
      sendEvent({ type: 'join', room: `thread:${thread.threadId}` });
    } catch (loadError) {
      setError(loadError.message || 'Unable to open conversation');
    }
  };

  const publishTyping = (typing) => {
    if (!activeThread?.threadId) return;
    sendEvent({
      type: typing ? 'typing:start' : 'typing:stop',
      threadId: activeThread.threadId,
      name: 'Admin',
    });
    fetch(`${apiUrl}/api/admin/messages/typing`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        threadId: activeThread.threadId,
        typing,
        name: 'Admin',
      }),
    }).catch(() => {});
  };

  const handleMessageChange = (value) => {
    setMessage(value);
    window.clearTimeout(typingTimerRef.current);
    publishTyping(true);
    typingTimerRef.current = window.setTimeout(() => publishTyping(false), 1200);
  };

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!activeThread?.partnerId || (!body?.trim() && !attachment)) return;

    setSending(true);
    setError('');
    publishTyping(false);
    try {
      const payload = {
        threadId: activeThread.threadId,
        channel: activeThread.channel,
        participantEmail: activeThread.participantEmail,
        participantName: activeThread.participantName,
        body,
        attachment,
        attachmentType,
        attachmentName,
      };

      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${activeThread.partnerId}/messages`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setActiveThread(data.thread);
      setMessage('');
      setThreads((previous) => upsertAdminThreadSummary(previous, data.thread));
      await refreshUnreadTotal();
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleInternalNoteSend = async () => {
    if (!activeThread?.partnerId || !internalNote.trim()) return;
    setSending(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${activeThread.partnerId}/messages/${activeThread.threadId}/internal-note`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ body: internalNote.trim() }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save internal note');
      }
      setActiveThread(data.thread);
      setInternalNote('');
      setInternalMode(false);
    } catch (sendError) {
      setError(sendError.message || 'Failed to save internal note');
    } finally {
      setSending(false);
    }
  };

  const handleMessageAction = async (action, entry) => {
    if (!activeThread?.partnerId) return;

    if (action === 'menu') {
      const choice = window.prompt(
        'Message action: edit, delete, pin, unpin, mark-unread',
        'edit'
      );
      if (!choice) return;
      const normalized = choice.trim().toLowerCase();

      let body;
      if (normalized === 'edit') {
        body = window.prompt('Updated message', entry.body || '');
        if (!body?.trim()) return;
      }

      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${activeThread.partnerId}/messages/${activeThread.threadId}/messages/${entry.id}`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            action: normalized === 'unpin' ? 'pin' : normalized,
            body: body?.trim(),
            pinned: normalized === 'pin' ? true : normalized === 'unpin' ? false : undefined,
          }),
        }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveThread(data.thread);
      }
    }
  };

  const handleArchiveToggle = async () => {
    if (!activeThread?.partnerId) return;
    const response = await fetch(
      `${apiUrl}/api/admin/partnerships/${activeThread.partnerId}/messages/${activeThread.threadId}/archive`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ archived: !activeThread.archived }),
      }
    );
    const data = await response.json();
    if (response.ok && data.success) {
      setActiveThread(null);
      setParticipant(null);
      await loadInbox();
    }
  };

  const filterCounts = useMemo(() => ({
    unread: threads.filter((thread) => thread.unreadCount > 0).length,
  }), [threads]);

  const shellClass = variant === 'page' ? 'admin-messages-page' : 'admin-messages-drawer';

  return (
    <div className={shellClass}>
      {variant === 'page' ? (
        <div className="admin-messages-page-head">
          <div>
            <h2>Messages</h2>
            <p>Professional inbox for partner support, client communication, and order threads.</p>
          </div>
        </div>
      ) : null}

      {variant === 'page' ? <MessagingStatsBar stats={stats} /> : null}
      {error ? <p className="admin-messages-drawer-error">{error}</p> : null}

      <div className={`messaging-crm-shell${variant === 'page' ? ' admin-messages-page-body' : ''}`}>
        <aside className="messaging-crm-sidebar">
          <p className="messaging-crm-sidebar-title">Inbox</p>
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`messaging-crm-filter-btn${filter === id ? ' active' : ''}`}
              onClick={() => {
                setFilter(id);
                setActiveThread(null);
                setParticipant(null);
              }}
            >
              <span>{label}</span>
              {id === 'unread' && filterCounts.unread > 0 ? (
                <span className="messaging-crm-filter-count">{filterCounts.unread}</span>
              ) : null}
            </button>
          ))}
        </aside>

        <div className="messaging-crm-list-panel">
          <div className="messaging-crm-search">
            <MdSearch size={16} />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search partners, clients, emails, orders…"
            />
          </div>
          <div className="messaging-crm-thread-list">
            {loading ? (
              <div className="adm-spinner" style={{ margin: '24px auto' }} />
            ) : !threads.length ? (
              <p className="admin-messages-drawer-empty">No conversations found.</p>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.threadId}
                  type="button"
                  className={`messaging-crm-thread-item${activeThread?.threadId === thread.threadId ? ' active' : ''}${thread.unreadCount ? ' unread' : ''}`}
                  onClick={() => openThread(thread)}
                >
                  <div className="messaging-crm-thread-top">
                    <strong>
                      {thread.channel === 'partner-admin'
                        ? thread.partnerName || 'Partner'
                        : getDisplayName(thread.participantName, thread.participantEmail)}
                    </strong>
                    {thread.unreadCount ? (
                      <span className="admin-messages-drawer-unread">{thread.unreadCount}</span>
                    ) : null}
                  </div>
                  <div className="messaging-crm-thread-meta">
                    <span className={`messaging-crm-tag ${thread.participantType === 'partner' ? 'partner' : 'client'}`}>
                      {thread.participantType === 'partner' ? 'Partner' : 'Client'}
                    </span>
                    {thread.orderNumber ? (
                      <span className="messaging-crm-tag order">{thread.orderNumber}</span>
                    ) : null}
                    <span>{formatWhen(thread.lastMessageAt)}</span>
                  </div>
                  <div className="messaging-crm-thread-preview">
                    {thread.orderTitle ? `${thread.orderTitle} · ` : ''}
                    {messagePreviewText(thread.lastMessage) || thread.subject}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="messaging-crm-chat-panel">
          {activeThread ? (
            <>
              <ConversationHeader
                participant={participant || {
                  name: activeThread.channel === 'partner-admin'
                    ? activeThread.partnerName
                    : activeThread.participantName,
                  email: activeThread.channel === 'partner-admin'
                    ? activeThread.partnerEmail
                    : activeThread.participantEmail,
                  type: activeThread.participantType,
                  accountId: activeThread.participantUserId || activeThread.participantEmail,
                  orderNumber: activeThread.orderNumber,
                  orderTitle: activeThread.orderTitle,
                  onlineStatus: 'offline',
                }}
                archived={activeThread.archived}
                onViewPartnership={
                  activeThread.participantType === 'partner'
                    ? () => window.open(`/admin?tab=partnerships&partnerId=${activeThread.partnerId}`, '_blank')
                    : undefined
                }
                onViewOrders={
                  activeThread.participantType === 'client'
                    ? () => window.open(`/admin?tab=orders&email=${encodeURIComponent(activeThread.participantEmail || '')}`, '_blank')
                    : undefined
                }
                onViewInvoices={
                  activeThread.participantType === 'client'
                    ? () => window.open(`/admin?tab=orders&email=${encodeURIComponent(activeThread.participantEmail || '')}`, '_blank')
                    : undefined
                }
                onArchive={handleArchiveToggle}
                onSuspend={
                  activeThread.participantType === 'partner'
                    ? () => window.open(`/admin?tab=partnerships&partnerId=${activeThread.partnerId}`, '_blank')
                    : undefined
                }
              />
              <TypingIndicator name={typingName} />
              <ChatMessagesPane
                className="admin-messages-drawer-messages"
                threadKey={activeThread.threadId}
                messageCount={activeThread.messages?.length || 0}
              >
                {(activeThread.messages || []).map((entry) => (
                  <ChatMessageRow
                    key={entry.id}
                    message={entry}
                    isMine={isOwnMessage(entry.senderType, 'admin') && !entry.isInternal}
                    showStatus={isOwnMessage(entry.senderType, 'admin') && !entry.isInternal}
                    onAction={handleMessageAction}
                  />
                ))}
              </ChatMessagesPane>
              <div className="messaging-crm-internal-bar">
                <label className="messaging-crm-internal-toggle">
                  <input
                    type="checkbox"
                    checked={internalMode}
                    onChange={(event) => setInternalMode(event.target.checked)}
                  />
                  Add internal admin note (hidden from partners & clients)
                </label>
                {internalMode ? (
                  <>
                    <textarea
                      value={internalNote}
                      onChange={(event) => setInternalNote(event.target.value)}
                      rows={3}
                      placeholder="Withdrawal request received, verification in progress, etc."
                      style={{ width: '100%', marginBottom: 8, borderRadius: 8, padding: 10 }}
                    />
                    <button type="button" className="messaging-crm-action-btn" onClick={handleInternalNoteSend} disabled={sending}>
                      Save internal note
                    </button>
                  </>
                ) : null}
              </div>
              <ChatComposeBar
                message={message}
                onMessageChange={handleMessageChange}
                onSend={handleSend}
                sending={sending}
                placeholder="Reply to this conversation…"
                variant="drawer"
              />
            </>
          ) : (
            <p className="admin-messages-drawer-empty" style={{ margin: 'auto', padding: 24 }}>
              Select a conversation to view messages, order context, and internal notes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
