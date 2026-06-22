import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageSocket from '../../hooks/useMessageSocket';
import ChatComposeBar from '../chat/ChatComposeBar';
import ChatMessageRow from '../chat/ChatMessageRow';
import ChatMessagesPane from '../chat/ChatMessagesPane';
import { isOwnMessage } from '../../utils/chatDisplay';
import { messagePreviewText } from '../../utils/chatMedia';
import '../ClientMessagesFab.css';

export const MAIN_SITE_MESSAGING_SUBDOMAIN = 'bluetick-main';

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resolveSiteMode(subdomain, siteMode) {
  if (siteMode === 'main' || siteMode === 'partner') {
    return siteMode;
  }
  return subdomain ? 'partner' : 'main';
}

function buildMessagesApiBase(apiUrl, siteMode, subdomain) {
  if (siteMode === 'main') {
    return `${apiUrl}/api/account/client-messages`;
  }
  const siteSlug = encodeURIComponent(String(subdomain).trim().toLowerCase());
  return `${apiUrl}/api/partner-site/${siteSlug}/client-messages`;
}

export default function AccountMessagesPanel({
  apiUrl,
  token,
  subdomain,
  siteMode: siteModeProp,
  brandName,
  accountEmail,
  supportEmail,
  variant = 'inline',
  compact = false,
  onUnreadChange,
}) {
  const siteMode = resolveSiteMode(subdomain, siteModeProp);
  const socketSubdomain = siteMode === 'main' ? MAIN_SITE_MESSAGING_SUBDOMAIN : subdomain;

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [matchedEmails, setMatchedEmails] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [sendError, setSendError] = useState('');
  const activeThreadIdRef = useRef(null);
  activeThreadIdRef.current = activeThread?.threadId;

  const headers = { Authorization: `Bearer ${token}` };
  const canChat = Boolean(token && apiUrl && (siteMode === 'main' || subdomain));
  const messagesApiBase = canChat ? buildMessagesApiBase(apiUrl, siteMode, subdomain) : '';

  const loadThreads = useCallback(async () => {
    if (!canChat) {
      setLoading(false);
      return;
    }
    setLoadError('');
    try {
      const res = await fetch(messagesApiBase, { headers });
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
  }, [apiUrl, canChat, messagesApiBase, onUnreadChange, token]);

  useEffect(() => {
    setLoading(true);
    loadThreads();
  }, [loadThreads]);

  const handleRealtimeMessage = useCallback(async (payload) => {
    await loadThreads();
    if (activeThreadIdRef.current === payload.threadId) {
      try {
        const res = await fetch(`${messagesApiBase}/${payload.threadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setActiveThread(data.thread);
        }
      } catch { /* silent */ }
    }
  }, [messagesApiBase, token, loadThreads]);

  useMessageSocket({
    apiUrl,
    token,
    subdomain: socketSubdomain,
    enabled: canChat,
    onEvent: handleRealtimeMessage,
  });

  const openThread = useCallback(async (threadId) => {
    try {
      const res = await fetch(`${messagesApiBase}/${threadId}`, { headers });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        await loadThreads();
      }
    } catch { /* silent */ }
  }, [messagesApiBase, headers, loadThreads]);

  useEffect(() => {
    if (loading || activeThread || threads.length !== 1 || compact) return;
    openThread(threads[0].threadId);
  }, [loading, threads, activeThread, openThread, compact]);

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!body?.trim() && !attachment) return;
    setSending(true);
    setSendError('');
    try {
      const payload = { body, attachment, attachmentType, attachmentName };
      const url = activeThread ? `${messagesApiBase}/${activeThread.threadId}/reply` : messagesApiBase;

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
  const bodyClass = `cmsg-body${showSinglePartnerChat ? ' cmsg-body-single' : ''}${variant === 'inline' ? ' cmsg-body-inline' : ''}${compact ? ' cmsg-body-compact' : ''}`;

  const chatContent = (
    <div className={bodyClass}>
        {!showSinglePartnerChat && !compact ? (
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
              {!compact ? (
                <h3>{activeThread?.subject || `Message ${brandName}`}</h3>
              ) : null}
              {activeThread ? (
                <ChatMessagesPane
                  className={`cmsg-messages${compact ? ' cmsg-messages-compact' : ''}`}
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
              ) : compact ? (
                <p className="cmsg-empty cmsg-empty-compact">
                  No messages yet. Open Messages to start a conversation with {brandName}.
                </p>
              ) : (
                <p className="cmsg-empty">
                  Send a message to {brandName}. They will see it in their dashboard.
                </p>
              )}
              {sendError ? <p className="cmsg-compose-error">{sendError}</p> : null}
              {!compact ? (
                <ChatComposeBar
                  message={message}
                  onMessageChange={setMessage}
                  onSend={handleSend}
                  sending={sending}
                  placeholder={activeThread ? 'Type your reply…' : `Write to ${brandName}…`}
                  sendLabel={activeThread ? 'Send' : 'Send message'}
                  variant={variant === 'inline' ? 'panel' : 'drawer'}
                />
              ) : null}
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
