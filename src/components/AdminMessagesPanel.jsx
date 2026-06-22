import { MdHandshake, MdPeople, MdSearch } from 'react-icons/md';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChatComposeBar from './chat/ChatComposeBar';
import ChatMessageRow from './chat/ChatMessageRow';
import ChatMessagesPane from './chat/ChatMessagesPane';
import useMessageSocket from '../hooks/useMessageSocket';
import { getDisplayName, isOwnMessage } from '../utils/chatDisplay';
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
  { id: 'partners', label: 'Partners', icon: MdHandshake },
  { id: 'clients', label: 'Clients', icon: MdPeople },
];

function findClientThread(partner, clientEmail) {
  const email = String(clientEmail || '').trim().toLowerCase();
  return (partner?.threads || []).find(
    (thread) => String(thread.participantEmail || '').trim().toLowerCase() === email
  );
}

export default function AdminMessagesPanel({
  apiUrl,
  token,
  onUnreadChange,
  variant = 'drawer',
  initialCategory = 'partners',
}) {
  const [threads, setThreads] = useState([]);
  const [clientPartners, setClientPartners] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [composeTarget, setComposeTarget] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [clientSearch, setClientSearch] = useState('');
  const activeThreadRef = useRef(null);
  const categoryRef = useRef(category);
  activeThreadRef.current = activeThread;
  categoryRef.current = category;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const loadInbox = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/messages/inbox`, {
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
  }, [apiUrl, token, onUnreadChange]);

  const loadClientDirectory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/messages/clients-directory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load clients');
      }
      setClientPartners(data.partners || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load clients');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token]);

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
    if (category === 'clients') {
      loadClientDirectory();
    } else {
      loadInbox();
    }
  }, [category, loadInbox, loadClientDirectory]);

  const handleRealtimeMessage = useCallback(async (payload) => {
    if (categoryRef.current === 'clients') {
      await loadClientDirectory();
    } else {
      await loadInbox();
    }
    await refreshUnreadTotal();

    const current = activeThreadRef.current;
    if (current?.threadId !== payload.threadId) return;

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${current.partnerId}/messages/${payload.threadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setActiveThread(data.thread);
      }
    } catch {
      /* silent */
    }
  }, [apiUrl, token, loadInbox, loadClientDirectory, refreshUnreadTotal]);

  useMessageSocket({
    apiUrl,
    token,
    enabled: Boolean(apiUrl && token),
    onEvent: handleRealtimeMessage,
  });

  useEffect(() => {
    setActiveThread(null);
    setComposeTarget(null);
    setMessage('');
    setClientSearch('');
  }, [category]);

  const openThread = async (thread) => {
    setError('');
    setComposeTarget(null);
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
      if (category === 'partners') {
        await loadInbox();
      } else {
        await loadClientDirectory();
      }
      await refreshUnreadTotal();
    } catch (loadError) {
      setError(loadError.message || 'Unable to open conversation');
    }
  };

  const selectClient = async (partner, client) => {
    setError('');
    const existingThread = findClientThread(partner, client.email);
    if (existingThread) {
      await openThread({
        ...existingThread,
        partnerId: partner.partnerId,
        partnerName: partner.partnerName,
        partnerSubdomain: partner.partnerSubdomain,
      });
      return;
    }

    setActiveThread(null);
    setComposeTarget({
      partnerId: partner.partnerId,
      partnerName: partner.partnerName,
      partnerSubdomain: partner.partnerSubdomain,
      client,
    });
  };

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    const partnerId = activeThread?.partnerId || composeTarget?.partnerId;
    if (!partnerId || (!body?.trim() && !attachment)) return;

    setSending(true);
    setError('');
    try {
      const payload = {
        body,
        attachment,
        attachmentType,
        attachmentName,
      };

      if (activeThread) {
        payload.threadId = activeThread.threadId;
        payload.channel = activeThread.channel;
        payload.participantEmail = activeThread.participantEmail;
        payload.participantName = activeThread.participantName;
      } else if (composeTarget) {
        payload.channel = 'partner-client';
        payload.participantEmail = composeTarget.client.email;
        payload.participantName = composeTarget.client.name;
        payload.subject = `Message to ${composeTarget.client.name || composeTarget.client.email}`;
      } else {
        return;
      }

      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${partnerId}/messages`,
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
      setComposeTarget(null);
      setMessage('');

      if (category === 'clients') {
        await loadClientDirectory();
      } else {
        await loadInbox();
      }
      await refreshUnreadTotal();
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredPartners = useMemo(() => {
    const query = clientSearch.trim().toLowerCase();
    if (!query) return clientPartners;

    return clientPartners
      .map((partner) => {
        const partnerMatches =
          partner.partnerName?.toLowerCase().includes(query) ||
          partner.partnerSubdomain?.toLowerCase().includes(query);

        const clients = (partner.clients || []).filter((client) => {
          const fullName = `${client.firstName || ''} ${client.lastName || ''}`.trim().toLowerCase();
          return (
            partnerMatches ||
            client.email?.toLowerCase().includes(query) ||
            client.name?.toLowerCase().includes(query) ||
            fullName.includes(query)
          );
        });

        if (!clients.length && !partnerMatches) return null;
        return { ...partner, clients: partnerMatches ? partner.clients : clients };
      })
      .filter(Boolean);
  }, [clientPartners, clientSearch]);

  const partnerThreads = threads.filter((thread) => thread.channel === 'partner-admin');
  const partnerUnread = partnerThreads.reduce((sum, thread) => sum + (thread.unreadCount || 0), 0);
  const clientUnread = clientPartners.reduce((sum, partner) => sum + (partner.unreadCount || 0), 0);

  const canCompose = Boolean(activeThread || composeTarget);
  const chatTitle = activeThread
    ? activeThread.channel === 'partner-admin'
      ? activeThread.partnerName || activeThread.subject
      : activeThread.participantName || activeThread.participantEmail || activeThread.subject
    : composeTarget
      ? `Message ${composeTarget.client.name || composeTarget.client.email}`
      : null;

  const chatMeta = activeThread
    ? activeThread.channel === 'partner-admin'
      ? `Partner thread · ${activeThread.partnerEmail || ''}`
      : `Client on ${activeThread.partnerName || 'partner site'} · ${activeThread.participantEmail || ''}`
    : composeTarget
      ? `Client on ${composeTarget.partnerName} · ${composeTarget.partnerSubdomain}`
      : null;

  const shellClass = variant === 'page'
    ? 'admin-messages-page'
    : 'admin-messages-drawer';

  return (
    <div className={shellClass}>
      {variant === 'page' ? (
        <div className="admin-messages-page-head">
          <div>
            <h2>Messages</h2>
            <p>
              {category === 'clients'
                ? 'Chat with clients across all partner sites, grouped by partner.'
                : 'Partner support threads from all partner dashboards.'}
            </p>
          </div>
        </div>
      ) : null}

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
            {(id === 'partners' ? partnerUnread : clientUnread) > 0 ? (
              <span className="admin-messages-cat-count">
                {id === 'partners' ? partnerUnread : clientUnread}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {error ? <p className="admin-messages-drawer-error">{error}</p> : null}

      <div className={`admin-messages-drawer-body${variant === 'page' ? ' admin-messages-page-body' : ''}`}>
        <div className="admin-messages-drawer-list">
          {category === 'partners' ? (
            loading ? (
              <div className="adm-spinner" style={{ margin: '24px auto' }} />
            ) : !partnerThreads.length ? (
              <p className="admin-messages-drawer-empty">No partner support threads yet.</p>
            ) : (
              partnerThreads.map((thread) => (
                <button
                  key={thread.threadId}
                  type="button"
                  className={`admin-messages-drawer-item${activeThread?.threadId === thread.threadId ? ' active' : ''}`}
                  onClick={() => openThread(thread)}
                >
                  <div className="admin-messages-drawer-item-top">
                    <strong>{thread.partnerName || 'Partner'}</strong>
                    {thread.unreadCount ? (
                      <span className="admin-messages-drawer-unread">{thread.unreadCount}</span>
                    ) : null}
                  </div>
                  <span className="admin-messages-drawer-meta">
                    <span className="admin-messages-channel-tag partner-tag">Partner</span>
                    {' '}· {formatWhen(thread.lastMessageAt)}
                  </span>
                  <span className="admin-messages-drawer-preview">
                    {messagePreviewText(thread.lastMessage) || thread.subject}
                  </span>
                </button>
              ))
            )
          ) : (
            <>
              <div className="admin-messages-client-search">
                <MdSearch size={15} />
                <input
                  type="text"
                  value={clientSearch}
                  onChange={(event) => setClientSearch(event.target.value)}
                  placeholder="Search partner site or client…"
                />
              </div>
              {loading ? (
                <div className="adm-spinner" style={{ margin: '24px auto' }} />
              ) : !filteredPartners.length ? (
                <p className="admin-messages-drawer-empty">No partner clients found yet.</p>
              ) : (
                filteredPartners.map((partner) => (
                  <div key={partner.partnerId} className="admin-messages-partner-group">
                    <div className="admin-messages-partner-group-head">
                      <strong>{partner.partnerName}</strong>
                      <span>{partner.partnerSubdomain}</span>
                      {partner.unreadCount ? (
                        <span className="admin-messages-drawer-unread">{partner.unreadCount}</span>
                      ) : null}
                    </div>
                    {(partner.clients || []).map((client) => {
                      const thread = findClientThread(partner, client.email);
                      const isActive =
                        (activeThread?.participantEmail &&
                          activeThread.participantEmail.toLowerCase() === client.email.toLowerCase() &&
                          String(activeThread.partnerId) === String(partner.partnerId)) ||
                        (composeTarget?.client?.email?.toLowerCase() === client.email.toLowerCase() &&
                          String(composeTarget.partnerId) === String(partner.partnerId));

                      return (
                        <button
                          key={`${partner.partnerId}-${client.email}`}
                          type="button"
                          className={`admin-messages-drawer-item admin-messages-client-item${isActive ? ' active' : ''}`}
                          onClick={() => selectClient(partner, client)}
                        >
                          <div className="admin-messages-drawer-item-top">
                            <strong>{getDisplayName(client.name, client.email)}</strong>
                            {thread?.unreadCount ? (
                              <span className="admin-messages-drawer-unread">{thread.unreadCount}</span>
                            ) : null}
                          </div>
                          <span className="admin-messages-drawer-meta">{client.email}</span>
                          {thread ? (
                            <span className="admin-messages-drawer-preview">
                              {messagePreviewText(thread.lastMessage) || thread.subject}
                            </span>
                          ) : (
                            <span className="admin-messages-drawer-preview">Start conversation</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </>
          )}
        </div>

        <div className="admin-messages-drawer-chat">
          {canCompose ? (
            <>
              <h3>{chatTitle}</h3>
              {chatMeta ? <p className="admin-messages-chat-meta">{chatMeta}</p> : null}
              {activeThread ? (
                <ChatMessagesPane
                  className="admin-messages-drawer-messages"
                  threadKey={activeThread.threadId}
                  messageCount={activeThread.messages?.length || 0}
                >
                  {(activeThread.messages || []).map((entry) => (
                    <ChatMessageRow
                      key={entry.id}
                      message={entry}
                      isMine={isOwnMessage(entry.senderType, 'admin')}
                    />
                  ))}
                </ChatMessagesPane>
              ) : (
                <p className="admin-messages-drawer-empty">
                  Send the first message to this client. They will receive an email notification.
                </p>
              )}
              <ChatComposeBar
                message={message}
                onMessageChange={setMessage}
                onSend={handleSend}
                sending={sending}
                placeholder={activeThread ? 'Reply…' : 'Write your message…'}
                variant="drawer"
              />
            </>
          ) : (
            <p className="admin-messages-drawer-empty">
              {category === 'clients'
                ? 'Select a client from a partner site to read or start a conversation.'
                : 'Select a partner conversation to read and reply.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
