import { useEffect, useMemo, useState } from 'react';
import { MdSend, MdSupportAgent, MdPeople, MdAdd, MdSearch, MdClose } from 'react-icons/md';

function ClientPicker({ clients, onSelect }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter(
      (c) =>
        !q ||
        c.email?.toLowerCase().includes(q) ||
        c.name?.toLowerCase().includes(q)
    );
  }, [clients, search]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ position: 'relative' }}>
        <MdSearch size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--pdash-soft)' }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          style={{ width: '100%', paddingLeft: 32, paddingRight: 10 }}
          autoFocus
        />
      </div>
      <div style={{ maxHeight: 260, overflowY: 'auto', border: '1px solid var(--pdash-border)', borderRadius: 8 }}>
        {!filtered.length ? (
          <p style={{ padding: '12px 14px', color: 'var(--pdash-soft)', fontSize: '0.85rem', margin: 0 }}>
            {clients.length === 0 ? 'No clients yet — clients appear once they place an order.' : 'No clients match your search.'}
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
              {c.orderCount > 0 && (
                <span style={{ fontSize: '0.72rem', color: 'var(--pdash-soft)', marginTop: 2 }}>
                  {c.orderCount} order{c.orderCount !== 1 ? 's' : ''}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function PartnerMessagesTab({ api, initialCategory = 'support', initialClient = null }) {
  const [threads, setThreads] = useState([]);
  const [clients, setClients] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [composingNew, setComposingNew] = useState(Boolean(initialClient));
  const [selectedClient, setSelectedClient] = useState(initialClient);
  const [newSubject, setNewSubject] = useState('');

  const loadThreads = async () => {
    try {
      const data = await api.getMessages();
      setThreads(data.threads || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadThreads();
    api.getClients().then((d) => setClients(d.clients || [])).catch(() => {});
  }, [api]);

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

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      if (activeThread) {
        await api.sendMessage({ threadId: activeThread.threadId, channel: activeThread.channel, body: message });
        const data = await api.getThread(activeThread.threadId);
        setActiveThread(data.thread);
      } else {
        const channel = category === 'support' ? 'partner-admin' : 'partner-client';
        const result = await api.sendMessage({
          channel,
          subject: newSubject.trim() || (channel === 'partner-admin'
            ? 'Message to Bluetickgeng Support'
            : `Message to ${selectedClient?.name || selectedClient?.email || ''}`),
          body: message,
          participantEmail: channel === 'partner-client' ? selectedClient?.email : undefined,
          participantName: channel === 'partner-client' ? selectedClient?.name : undefined,
        });
        await loadThreads();
        if (result?.thread?.threadId) {
          const data = await api.getThread(result.thread.threadId);
          setActiveThread(data.thread);
        }
        setComposingNew(false);
        setSelectedClient(null);
        setNewSubject('');
      }
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((t) =>
    category === 'support' ? t.channel === 'partner-admin' : t.channel === 'partner-client'
  );

  const supportCount = threads.filter((t) => t.channel === 'partner-admin').length;
  const clientCount = threads.filter((t) => t.channel === 'partner-client').length;

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  const renderChatArea = () => {
    if (composingNew) {
      const isClientMode = category === 'clients';
      const canSend = message.trim() && (!isClientMode || selectedClient);
      return (
        <>
          <h2 style={{ marginBottom: 16 }}>
            {isClientMode ? 'New message to Client' : 'New message to Bluetickgeng Support'}
          </h2>

          {isClientMode && !selectedClient && (
            <ClientPicker
              clients={clients}
              onSelect={(c) => setSelectedClient(c)}
            />
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
              <div className="pdash-chat-compose">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="pdash-btn pdash-btn-ghost"
                    onClick={() => { setComposingNew(false); setMessage(''); setSelectedClient(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="pdash-btn pdash-btn-primary"
                    onClick={handleSend}
                    disabled={sending || !canSend}
                  >
                    <MdSend size={16} /> Send
                  </button>
                </div>
              </div>
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
          <div className="pdash-chat-messages">
            {(activeThread?.messages || []).map((m) => (
              <div key={m.id} className={`pdash-chat-bubble ${m.senderType}`}>
                <strong>{m.senderName}</strong>
                <p>{m.body}</p>
                {m.voiceNoteUrl ? <audio src={m.voiceNoteUrl} controls /> : null}
                {m.attachments?.map((a, i) => (
                  a.type === 'image' ? (
                    <img key={i} src={a.url} alt="" style={{ maxWidth: 200, borderRadius: 8 }} />
                  ) : (
                    <a key={i} href={a.url} target="_blank" rel="noopener noreferrer">{a.name || 'Attachment'}</a>
                  )
                ))}
              </div>
            ))}
          </div>
          <div className="pdash-chat-compose">
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleSend} disabled={sending}>
              <MdSend size={16} /> Send
            </button>
          </div>
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
              <span>{t.lastMessage?.body?.slice(0, 60) || t.subject}</span>
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
