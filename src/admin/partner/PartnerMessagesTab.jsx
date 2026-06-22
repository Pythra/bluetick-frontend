import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MdSupportAgent, MdPeople, MdAdd, MdSearch, MdClose } from 'react-icons/md';
import ChatComposeBar from '../../components/chat/ChatComposeBar';
import ChatMessageRow from '../../components/chat/ChatMessageRow';
import ChatMessagesPane from '../../components/chat/ChatMessagesPane';
import useMessageSocket from '../../hooks/useMessageSocket';
import { isOwnMessage } from '../../utils/chatDisplay';
import { messagePreviewText } from '../../utils/chatMedia';
import {
  appendThreadMessage,
  patchPartnerThreadSummaries,
} from '../../utils/messagingRealtime';

function ClientPicker({ clients, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return clients.filter((c) => {
      if (!q) return true;
      const fullName = `${c.firstName || ''} ${c.lastName || ''}`.trim().toLowerCase();
      return (
        c.email?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q) ||
        fullName.includes(q) ||
        c.firstName?.toLowerCase().includes(q) ||
        c.lastName?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative' }}>
        <MdSearch size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pdash-soft)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone…"
          style={{ width: '100%', paddingLeft: 32, paddingRight: 10 }}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--pdash-border)', borderRadius: 8 }}>
        {!filtered.length ? (
          <p style={{ padding: '12px 14px', color: 'var(--pdash-soft)', fontSize: '0.85rem', margin: 0 }}>
            {clients.length === 0
              ? 'No site users yet — users appear here when they sign up, log in, or place an order on your site.'
              : 'No users match your search.'}
          </p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.email}
              type="button"
              onClick={() => onSelect(c)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                width: '100%', padding: '10px 14px', border: 'none', borderBottom: '1px solid var(--pdash-border)',
                background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--pdash-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <strong style={{ fontSize: '0.88rem' }}>{c.name || c.email}</strong>
              {c.name && <span style={{ fontSize: '0.78rem', color: 'var(--pdash-soft)' }}>{c.email}</span>}
              {c.orderCount > 0 ? (
                <span style={{ fontSize: '0.72rem', color: 'var(--pdash-soft)', marginTop: 2 }}>
                  {c.orderCount} order{c.orderCount !== 1 ? 's' : ''}
                </span>
              ) : (
                <span style={{ fontSize: '0.72rem', color: 'var(--pdash-soft)', marginTop: 2 }}>
                  Signed up on your site
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function PartnerMessagesTab({
  api,
  apiUrl,
  token,
  subdomain,
  initialCategory = 'support',
  initialClient = null,
}) {
  const [threads, setThreads] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [composingNew, setComposingNew] = useState(Boolean(initialClient));
  const [selectedClient, setSelectedClient] = useState(initialClient);
  const [newSubject, setNewSubject] = useState('');
  const activeThreadIdRef = useRef(null);
  activeThreadIdRef.current = activeThread?.threadId;

  const loadThreadsRef = useRef(null);

  const loadThreads = useCallback(async () => {
    try {
      const data = await api.getMessages();
      setThreads(data.threads || []);
    } finally {
      setLoading(false);
    }
  }, [api]);

  loadThreadsRef.current = loadThreads;

  useEffect(() => {
    setLoading(true);
    loadThreads();
  }, [loadThreads]);

  const refreshClients = useCallback(() => {
    setClientsLoading(true);
    api.getClients()
      .then((data) => setClients(data.clients || []))
      .catch(() => {})
      .finally(() => setClientsLoading(false));
  }, [api]);

  useEffect(() => {
    if (composingNew && category === 'clients' && !clients.length && !clientsLoading) {
      refreshClients();
    }
  }, [composingNew, category, clients.length, clientsLoading, refreshClients]);

  const handleRealtimeMessage = useCallback((payload) => {
    setThreads((previous) => {
      const result = patchPartnerThreadSummaries(previous, payload);
      if (result.needsReload) {
        loadThreadsRef.current?.();
        return previous;
      }
      return result.changed ? result.threads : previous;
    });

    if (activeThreadIdRef.current === payload.threadId) {
      setActiveThread((previous) =>
        appendThreadMessage(previous, payload, { hideSenderTypes: ['admin'] })
      );
    }
  }, []);

  useMessageSocket({
    apiUrl,
    token,
    subdomain,
    enabled: Boolean(apiUrl && token),
    onEvent: handleRealtimeMessage,
  });

  useEffect(() => {
    if (initialClient) {
      setCategory('clients');
      setSelectedClient(initialClient);
      setComposingNew(true);
      setActiveThread(null);
    } else if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, initialClient]);

  useEffect(() => {
    if (activeThread?.threadId) {
      api.markThreadRead(activeThread.threadId).catch(() => {});
    }
  }, [activeThread?.threadId, api]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    setActiveThread(null);
    setComposingNew(false);
    setMessage('');
    setSelectedClient(null);
    setNewSubject('');
  };

  const openThread = async (threadId) => {
    const data = await api.getThread(threadId);
    setActiveThread(data.thread);
    setComposingNew(false);
  };

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!body?.trim() && !attachment) return;
    setSending(true);
    try {
      const mediaFields = { body, attachment, attachmentType, attachmentName };
      if (activeThread) {
        const result = await api.sendMessage({ threadId: activeThread.threadId, channel: activeThread.channel, ...mediaFields });
        setActiveThread(result?.thread || activeThread);
        if (result?.thread) {
          setThreads((previous) => patchPartnerThreadSummaries(previous, {
            threadId: result.thread.threadId,
            message: result.thread.messages?.[result.thread.messages.length - 1],
            lastMessageAt: result.thread.lastMessageAt,
          }).threads);
        }
      } else {
        const channel = category === 'support' ? 'partner-admin' : 'partner-client';
        const result = await api.sendMessage({
          channel,
          subject: newSubject.trim() || (channel === 'partner-admin'
            ? 'Message to Bluetickgeng Support'
            : `Message to ${selectedClient?.name || selectedClient?.email || ''}`),
          ...mediaFields,
          participantEmail: channel === 'partner-client' ? selectedClient?.email : undefined,
          participantName: channel === 'partner-client' ? selectedClient?.name : undefined,
        });
        await loadThreads();
        if (result?.thread?.threadId) {
          setActiveThread(result.thread);
        }
        setComposingNew(false);
        setSelectedClient(null);
        setNewSubject('');
      }
      setMessage('');
      refreshClients();
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((t) =>
    category === 'support' ? t.channel === 'partner-admin' : t.channel === 'partner-client'
  );

  const supportCount = threads.filter((t) => t.channel === 'partner-admin').length;
  const clientCount = threads.filter((t) => t.channel === 'partner-client').length;

  if (loading) {
    return (
      <div className="pdash-messages-layout">
        <div className="pdash-panel pdash-messages-list">
          <div className="pdash-spinner" style={{ margin: '24px auto' }} />
        </div>
        <div className="pdash-panel pdash-messages-chat">
          <div className="pdash-spinner" style={{ margin: '24px auto' }} />
        </div>
      </div>
    );
  }

  const renderChatArea = () => {
    if (composingNew) {
      const isClientMode = category === 'clients';
      return (
        <>
          <h2 style={{ marginBottom: 16 }}>
            {isClientMode ? 'New message to Client' : 'New message to Bluetickgeng Support'}
          </h2>

          {isClientMode && !selectedClient && (
            clientsLoading ? (
              <div className="pdash-spinner" style={{ margin: '12px auto' }} />
            ) : (
              <ClientPicker
                clients={clients}
                onSelect={(c) => setSelectedClient(c)}
              />
            )
          )}

          {isClientMode && selectedClient && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 14px', background: 'var(--pdash-hover)', borderRadius: 8,
              marginBottom: 12, border: '1px solid var(--pdash-border)',
            }}>
              <div>
                <strong style={{ fontSize: '0.9rem' }}>{selectedClient.name || selectedClient.email}</strong>
                {selectedClient.name && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--pdash-soft)' }}>{selectedClient.email}</div>
                )}
              </div>
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost"
                style={{ padding: '4px 8px' }}
                onClick={() => setSelectedClient(null)}
                aria-label="Change client"
              >
                <MdClose size={14} /> Change
              </button>
            </div>
          )}

          {isClientMode && selectedClient && (
            <p className="pdash-panel-lead" style={{ fontSize: '0.82rem', marginBottom: 12 }}>
              This message goes to <strong>{selectedClient.email}</strong>. They will see it on your site when signed in with that email or an account linked to that order.
            </p>
          )}

          {(!isClientMode || selectedClient) && (
            <>
              <div className="pdash-field" style={{ marginBottom: 10 }}>
                <label>Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <ChatComposeBar
                message={message}
                onMessageChange={setMessage}
                onSend={handleSend}
                sending={sending}
                disabled={isClientMode && !selectedClient}
                variant="panel"
              />
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost"
                style={{ alignSelf: 'flex-start' }}
                onClick={() => { setComposingNew(false); setMessage(''); setSelectedClient(null); }}
              >
                Cancel
              </button>
            </>
          )}

          {isClientMode && !selectedClient && (
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost"
                onClick={() => { setComposingNew(false); setMessage(''); }}
              >
                Cancel
              </button>
            </div>
          )}
        </>
      );
    }

    if (activeThread) {
      const title = activeThread.channel === 'partner-admin'
        ? 'Bluetickgeng Support'
        : activeThread.participantName || activeThread.participantEmail || activeThread.subject;
      return (
        <>
          <h2>{title}</h2>
          <ChatMessagesPane
            className="pdash-chat-messages"
            threadKey={activeThread.threadId}
            messageCount={
              (activeThread.messages || []).filter(
                (m) => (activeThread.channel === 'partner-client' ? m.senderType !== 'admin' : true)
              ).length
            }
          >
            {(activeThread?.messages || [])
              .filter((m) => (activeThread.channel === 'partner-client' ? m.senderType !== 'admin' : true))
              .map((m) => (
                <ChatMessageRow
                  key={m.id}
                  message={m}
                  isMine={isOwnMessage(m.senderType, 'partner')}
                />
              ))}
          </ChatMessagesPane>
          <ChatComposeBar
            message={message}
            onMessageChange={setMessage}
            onSend={handleSend}
            sending={sending}
            variant="panel"
          />
        </>
      );
    }

    return (
      <p className="pdash-panel-lead">
        {category === 'support'
          ? 'Select a support thread or start a new conversation with Bluetickgeng.'
          : 'Select a client conversation or start a new one.'}
      </p>
    );
  };

  return (
    <div className="pdash-messages-layout">
      <div className="pdash-panel pdash-messages-list">
        <div className="pdash-subnav" style={{ marginBottom: 12 }}>
          <button
            type="button"
            className={`pdash-subnav-item${category === 'support' ? ' active' : ''}`}
            onClick={() => handleCategoryChange('support')}
          >
            <MdSupportAgent size={14} />
            Support
            {supportCount > 0 ? <span className="pdash-thread-badge" style={{ marginTop: 0, marginLeft: 4 }}>{supportCount}</span> : null}
          </button>
          <button
            type="button"
            className={`pdash-subnav-item${category === 'clients' ? ' active' : ''}`}
            onClick={() => handleCategoryChange('clients')}
          >
            <MdPeople size={14} />
            Clients
            {clientCount > 0 ? <span className="pdash-thread-badge" style={{ marginTop: 0, marginLeft: 4 }}>{clientCount}</span> : null}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--pdash-soft)' }}>
            {category === 'support' ? 'Bluetickgeng Support' : 'Client Conversations'}
          </strong>
          <button
            type="button"
            className="pdash-btn pdash-btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.78rem', gap: 4 }}
            onClick={() => {
              if (category === 'support') {
                setComposingNew(true);
                setActiveThread(null);
                setMessage('');
                return;
              }
              handleCategoryChange('clients');
              setComposingNew(true);
              setActiveThread(null);
              setMessage('');
            }}
          >
            <MdAdd size={14} /> New
          </button>
        </div>

        {!filteredThreads.length ? (
          <p className="pdash-panel-lead" style={{ fontSize: '0.82rem' }}>
            {category === 'support' ? 'No support conversations yet.' : 'No client conversations yet.'}
          </p>
        ) : (
          filteredThreads.map((t) => (
            <button
              key={t.threadId}
              type="button"
              className={`pdash-thread-item${activeThread?.threadId === t.threadId ? ' active' : ''}`}
              onClick={() => openThread(t.threadId)}
            >
              <strong>
                {t.channel === 'partner-admin'
                  ? 'Bluetickgeng Support'
                  : t.participantName || t.participantEmail || 'Conversation'}
              </strong>
              {t.channel === 'partner-admin' ? (
                <span className="pdash-thread-badge">Platform</span>
              ) : null}
              <span>{messagePreviewText(t.lastMessage) || t.subject}</span>
            </button>
          ))
        )}
      </div>

      <div className="pdash-panel pdash-messages-chat">
        {renderChatArea()}
      </div>
    </div>
  );
}
