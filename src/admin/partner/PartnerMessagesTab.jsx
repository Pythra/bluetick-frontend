import { useEffect, useState } from 'react';
import { MdSend, MdSupportAgent, MdPeople, MdAdd } from 'react-icons/md';

export default function PartnerMessagesTab({ api }) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState('support');
  const [composingNew, setComposingNew] = useState(false);
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientName, setNewClientName] = useState('');
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
  }, []);

  useEffect(() => {
    if (activeThread?.threadId) {
      api.markThreadRead(activeThread.threadId).catch(() => {});
    }
  }, [activeThread?.threadId, api]);

  useEffect(() => {
    setActiveThread(null);
    setComposingNew(false);
    setMessage('');
  }, [category]);

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
        await api.sendMessage({ threadId: activeThread.threadId, body: message });
        const data = await api.getThread(activeThread.threadId);
        setActiveThread(data.thread);
      } else {
        const channel = category === 'support' ? 'partner-admin' : 'partner-client';
        await api.sendMessage({
          channel,
          subject: newSubject.trim() || (channel === 'partner-admin' ? 'Message to Bluetickgeng Support' : `Message to ${newClientName.trim() || newClientEmail.trim()}`),
          body: message,
          participantEmail: channel === 'partner-client' ? newClientEmail.trim() : undefined,
          participantName: channel === 'partner-client' ? newClientName.trim() : undefined,
        });
        await loadThreads();
        setComposingNew(false);
        setNewClientEmail('');
        setNewClientName('');
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
      return (
        <>
          <h2 style={{ marginBottom: 16 }}>
            {category === 'support' ? 'New message to Bluetickgeng Support' : 'New message to Client'}
          </h2>
          {category === 'clients' && (
            <>
              <div className="pdash-field">
                <label>Client Email *</label>
                <input
                  type="email"
                  value={newClientEmail}
                  onChange={(e) => setNewClientEmail(e.target.value)}
                  placeholder="client@email.com"
                />
              </div>
              <div className="pdash-field">
                <label>Client Name</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </>
          )}
          <div className="pdash-field">
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
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="pdash-btn pdash-btn-ghost"
                onClick={() => { setComposingNew(false); setMessage(''); }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pdash-btn pdash-btn-primary"
                onClick={handleSend}
                disabled={sending || !message.trim() || (category === 'clients' && !newClientEmail.trim())}
              >
                <MdSend size={16} /> Send
              </button>
            </div>
          </div>
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
            onClick={() => setCategory('support')}
          >
            <MdSupportAgent size={14} />
            Support
            {supportCount > 0 ? <span className="pdash-thread-badge" style={{ marginTop: 0, marginLeft: 4 }}>{supportCount}</span> : null}
          </button>
          <button
            type="button"
            className={`pdash-subnav-item${category === 'clients' ? ' active' : ''}`}
            onClick={() => setCategory('clients')}
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
            onClick={() => { setComposingNew(true); setActiveThread(null); setMessage(''); }}
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
