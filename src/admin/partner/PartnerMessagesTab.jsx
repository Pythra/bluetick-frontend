import { useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';

export default function PartnerMessagesTab({ api }) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

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

  const openThread = async (threadId) => {
    const data = await api.getThread(threadId);
    setActiveThread(data.thread);
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
        await api.sendMessage({
          channel: 'partner-client',
          subject: 'New message',
          body: message,
        });
        await loadThreads();
      }
      setMessage('');
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  return (
    <div className="pdash-messages-layout">
      <div className="pdash-panel pdash-messages-list">
        <h2>Conversations</h2>
        {!threads.length ? (
          <p className="pdash-panel-lead">No messages yet. Start a conversation with a client.</p>
        ) : (
          threads.map((t) => (
            <button
              key={t.threadId}
              type="button"
              className={`pdash-thread-item${activeThread?.threadId === t.threadId ? ' active' : ''}`}
              onClick={() => openThread(t.threadId)}
            >
              <strong>{t.participantName || t.participantEmail || 'Conversation'}</strong>
              <span>{t.lastMessage?.body?.slice(0, 60) || t.subject}</span>
            </button>
          ))
        )}
      </div>

      <div className="pdash-panel pdash-messages-chat">
        <h2>{activeThread ? activeThread.subject : 'New Message'}</h2>
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
      </div>
    </div>
  );
}
