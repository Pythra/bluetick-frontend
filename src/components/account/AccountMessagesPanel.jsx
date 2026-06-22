import { useCallback, useEffect, useRef, useState } from 'react';
import useMessageSocket from '../../hooks/useMessageSocket';
import ChatComposeBar from '../chat/ChatComposeBar';
import ChatMessageRow from '../chat/ChatMessageRow';
import ChatMessagesPane from '../chat/ChatMessagesPane';
import { isOwnMessage } from '../../utils/chatDisplay';
import { messagePreviewText } from '../../utils/chatMedia';
import {
  appendThreadMessage,
  clearThreadUnread,
  computeClientUnreadCount,
  patchClientThreadSummaries,
  upsertClientThreadSummary,
} from '../../utils/messagingRealtime';
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
  deferLoad = false,
  onUnreadChange,
}) {
  const siteMode = resolveSiteMode(subdomain, siteModeProp);
  const socketSubdomain = siteMode === 'main' ? MAIN_SITE_MESSAGING_SUBDOMAIN : subdomain;

  const [threads, setThreads] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!deferLoad);
  const [sending, setSending] = useState(false);
  const [matchedEmails, setMatchedEmails] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [sendError, setSendError] = useState('');
  const activeThreadIdRef = useRef(null);
  activeThreadIdRef.current = activeThread?.threadId;
  const loadThreadsRef = useRef(null);
  const onUnreadChangeRef = useRef(onUnreadChange);
  onUnreadChangeRef.current = onUnreadChange;

  const canChat = Boolean(token && apiUrl && (siteMode === 'main' || subdomain));
  const messagesApiBase = canChat ? buildMessagesApiBase(apiUrl, siteMode, subdomain) : '';

  const loadThreads = useCallback(async ({ background = false } = {}) => {
    if (!canChat || deferLoad) {
      setLoading(false);
      return;
    }

    if (!background) {
      setLoadError('');
    }

    try {
      const params = new URLSearchParams();
      if (!compact) {
        params.set('includeActive', '1');
      }
      const query = params.toString();
      const url = query ? `${messagesApiBase}?${query}` : messagesApiBase;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setThreads(data.threads || []);
        setMatchedEmails(data.matchedEmails || []);
        if (data.activeThread) {
          setActiveThread((previous) => {
            if (previous?.threadId !== data.activeThread.threadId) {
              return data.activeThread;
            }
            const previousCount = previous.messages?.length || 0;
            const nextCount = data.activeThread.messages?.length || 0;
            if (nextCount >= previousCount) {
              return data.activeThread;
            }
            return previous;
          });
        }
        onUnreadChangeRef.current?.(data.unreadCount || 0);
      } else if (!background) {
        setLoadError(data.error || 'Could not load messages');
      }
    } catch {
      if (!background) {
        setLoadError('Could not load messages');
      }
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  }, [canChat, compact, deferLoad, messagesApiBase, token]);

  loadThreadsRef.current = () => loadThreads({ background: true });

  useEffect(() => {
    if (deferLoad) {
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    loadThreads();
    return undefined;
  }, [canChat, compact, deferLoad, messagesApiBase, token, loadThreads]);

  const handleRealtimeMessage = useCallback((payload) => {
    setThreads((previous) => {
      const result = patchClientThreadSummaries(previous, payload);
      if (result.needsReload) {
        loadThreadsRef.current?.();
        return previous;
      }
      if (result.changed) {
        onUnreadChangeRef.current?.(computeClientUnreadCount(result.threads));
      }
      return result.changed ? result.threads : previous;
    });

    if (activeThreadIdRef.current === payload.threadId) {
      setActiveThread((previous) => appendThreadMessage(previous, payload));
      setThreads((previous) => clearThreadUnread(previous, payload.threadId));
      onUnreadChangeRef.current?.(0);
    }
  }, []);

  useMessageSocket({
    apiUrl,
    token,
    subdomain: socketSubdomain,
    enabled: canChat && !deferLoad,
    onEvent: handleRealtimeMessage,
  });

  const openThread = useCallback(async (threadId) => {
    try {
      const res = await fetch(`${messagesApiBase}/${threadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        setThreads((previous) => {
          const next = clearThreadUnread(previous, threadId);
          onUnreadChangeRef.current?.(computeClientUnreadCount(next));
          return next;
        });
      }
    } catch { /* silent */ }
  }, [messagesApiBase, token]);

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!body?.trim() && !attachment) return;
    setSending(true);
    setSendError('');
    try {
      const payload = { body, attachment, attachmentType, attachmentName };
      const url = activeThread ? `${messagesApiBase}/${activeThread.threadId}/reply` : messagesApiBase;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActiveThread(data.thread);
        setMessage('');
        setThreads((previous) => upsertClientThreadSummary(previous, data.thread));
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

  if (deferLoad) {
    return (
      <p className="cmsg-empty cmsg-empty-compact">
        Open Messages to view and send conversations with {brandName}.
      </p>
    );
  }

  const showSinglePartnerChat = threads.length <= 1;
  const showCompose = showSinglePartnerChat || Boolean(activeThread) || !threads.length;
  const showInitialLoading = loading && !threads.length && !activeThread && !loadError;
  const bodyClass = `cmsg-body${showSinglePartnerChat ? ' cmsg-body-single' : ''}${variant === 'inline' ? ' cmsg-body-inline' : ''}${compact ? ' cmsg-body-compact' : ''}`;

  const chatContent = (
    <div className={bodyClass}>
        {!showSinglePartnerChat && !compact ? (
          <div className="cmsg-list">
            {showInitialLoading ? (
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
          {showInitialLoading && showSinglePartnerChat ? (
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
