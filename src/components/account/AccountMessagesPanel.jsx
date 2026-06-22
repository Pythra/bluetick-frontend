import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageSocket from '../../hooks/useMessageSocket';
import ChatComposeBar from '../chat/ChatComposeBar';
import ChatMessageRow from '../chat/ChatMessageRow';
import ChatMessagesPane from '../chat/ChatMessagesPane';
import { isOwnMessage } from '../../utils/chatDisplay';
import { messagePreviewText } from '../../utils/chatMedia';
import '../ClientMessagesFab.css';

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AccountMessagesPanel({
  apiUrl,
  token,
  subdomain,
  brandName,
  accountEmail,
  supportEmail,
  variant = 'inline',
  onUnreadChange,
}) {
  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(Boolean(subdomain));
  const [sending, setSending] = useState(false);
  const [matchedEmails, setMatchedEmails] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [sendError, setSendError] = useState('');
  const activeThreadIdRef = useRef(null);
  activeThreadIdRef.current = activeThread?.threadId;

  const headers = { Authorization: `Bearer ${token}` };
  const canChat = Boolean(subdomain && token && apiUrl);

  const loadThreads = useCallback(async () => {
    if (!canChat) {
      setLoading(false);
      return;
    }
    setLoadError('');
    const siteSlug = encodeURIComponent(String(subdomain).trim().toLowerCase());
    try {
      const res = await fetch(`${apiUrl}/api/partner-site/${siteSlug}/client-messages`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setThreads(data.threads || []);
        setMatchedEmails(data.matchedEmails || []);
        onUnreadChange?.(data.unreadCount || 0);
      } else {
        setLoadError(data.error || 'Could not load messages');
      }
    } catch {
      setLoadError('Could not load messages');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, subdomain, token, canChat, onUnreadChange]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleRealtimeMessage = useCallback(async (payload) => {
    await loadThreads();
    if (activeThreadIdRef.current === payload.threadId) {
      try {
        const siteSlug = encodeURIComponent(String(subdomain).trim().toLowerCase());
        const res = await fetch(
          `${apiUrl}/api/partner-site/${siteSlug}/client-messages/${payload.threadId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (res.ok && data.success) {
          setActiveThread(data.thread);
        }
      } catch { /* silent */ }
    }
  }, [apiUrl, subdomain, token, loadThreads]);

  useMessageSocket({
    apiUrl,
    token,
    subdomain,
    enabled: canChat,
    onEvent: handleRealtimeMessage,
  });

  const openThread = useCallback(async (threadId) => {
    try {
      const siteSlug = encodeURIComponent(String(subdomain).trim().toLowerCase());
      const res = await fetch(`${apiUrl}/api/partner-site/${siteSlug}/client-messages/${threadId}`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        await loadThreads();
      }
    } catch { /* silent */ }
  }, [apiUrl, subdomain, token, headers, loadThreads]);

  useEffect(() => {
    if (loading || activeThread || threads.length !== 1) return;
    openThread(threads[0].threadId);
  }, [loading, threads, activeThread, openThread]);

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!body?.trim() && !attachment) return;
    setSending(true);
    setSendError('');
    try {
      const payload = { body, attachment, attachmentType, attachmentName };
      const siteSlug = encodeURIComponent(String(subdomain).trim().toLowerCase());
      const url = activeThread
        ? `${apiUrl}/api/partner-site/${siteSlug}/client-messages/${activeThread.threadId}/reply`
        : `${apiUrl}/api/partner-site/${siteSlug}/client-messages`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        setMessage('');
        await loadThreads();
      } else {
        setSendError(data.error || 'Failed to send message');
      }
    } catch {
      setSendError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (!canChat) {
    return (
      <div className="my-account-messages-fallback">
        <p>
          Message {brandName} directly at{' '}
          <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
        </p>
      </div>
    );
  }

  const showSinglePartnerChat = threads.length <= 1;
  const showCompose = showSinglePartnerChat || Boolean(activeThread) || !threads.length;
  const bodyClass = `cmsg-body${showSinglePartnerChat ? ' cmsg-body-single' : ''}${variant === 'inline' ? ' cmsg-body-inline' : ''}`;

  const chatContent = (
    <div className={bodyClass}>
        {!showSinglePartnerChat ? (
          <div className="cmsg-list">
            {loading ? (
              <div className="my-account-messages-loading">Loading…</div>
            ) : loadError ? (
              <div className="cmsg-empty-wrap">
                <p className="cmsg-empty">{loadError}</p>
              </div>
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
                    Use the compose box to send {brandName} your first message.
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
        ) : null}

        <div className="cmsg-chat">
          {loading && showSinglePartnerChat ? (
            <div className="my-account-messages-loading">Loading…</div>
          ) : loadError && showSinglePartnerChat ? (
            <p className="cmsg-empty">{loadError}</p>
          ) : (showSinglePartnerChat || showCompose) ? (
            <>
              <h3>{activeThread?.subject || `Message ${brandName}`}</h3>
              {activeThread ? (
                <ChatMessagesPane
                  className="cmsg-messages"
                  threadKey={activeThread.threadId}
                  messageCount={activeThread.messages?.length || 0}
                >
                  {(activeThread.messages || []).map((m) => (
                    <ChatMessageRow
                      key={m.id}
                      message={m}
                      isMine={isOwnMessage(m.senderType, 'client')}
                      tone="client"
                    />
                  ))}
                </ChatMessagesPane>
              ) : (
                <p className="cmsg-empty">
                  Send a message to {brandName}. They will see it in their dashboard.
                </p>
              )}
              {sendError ? <p className="cmsg-compose-error">{sendError}</p> : null}
              <ChatComposeBar
                message={message}
                onMessageChange={setMessage}
                onSend={handleSend}
                sending={sending}
                placeholder={activeThread ? 'Type your reply…' : `Write to ${brandName}…`}
                sendLabel={activeThread ? 'Send' : 'Send message'}
                variant={variant === 'inline' ? 'panel' : 'drawer'}
              />
            </>
          ) : (
            <p className="cmsg-empty">Select a conversation to read and reply.</p>
          )}
        </div>
      </div>
  );

  if (variant === 'inline') {
    return <div className="my-account-messages">{chatContent}</div>;
  }

  return chatContent;
}
