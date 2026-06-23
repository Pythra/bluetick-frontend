import { getAvatarColor, getDisplayName, getInitials } from '../../utils/chatDisplay';
import MessageBubbleContent from './MessageBubbleContent';
import MessageStatus from '../messaging/MessageStatus';

function formatWhen(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatMessageRow({
  message,
  isMine = false,
  tone = 'default',
  showName = true,
  showStatus = false,
  onAction,
}) {
  if (!message) return null;

  const seed = message.senderEmail || message.senderName || message.senderType;
  const initials = getInitials(message.senderName, message.senderEmail);
  const avatarColor = getAvatarColor(seed);
  const displayName = getDisplayName(message.senderName, message.senderEmail);
  const rowTone = message.isInternal ? 'internal' : tone;

  return (
    <div className={`chat-msg-row ${isMine ? 'mine' : 'theirs'} chat-msg-row-${rowTone}${message.isInternal ? ' chat-msg-row-internal' : ''}`}>
      <div
        className="chat-msg-avatar"
        style={{ backgroundColor: avatarColor }}
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="chat-msg-col">
        {showName && !isMine ? (
          <div className="chat-msg-name">
            {displayName}
            {message.isInternal ? ' · Internal note' : null}
            {message.pinned ? ' · Pinned' : null}
          </div>
        ) : null}
        <div className={`chat-msg-bubble ${isMine ? 'mine' : 'theirs'}`}>
          <MessageBubbleContent message={message} />
        </div>
        <div className="chat-msg-time">
          {formatWhen(message.createdAt)}
          {showStatus && isMine ? (
            <>
              {' · '}
              <MessageStatus status={message.deliveryStatus || 'sent'} />
            </>
          ) : null}
          {onAction ? (
            <>
              {' · '}
              <button type="button" className="chat-msg-action-link" onClick={() => onAction('menu', message)}>
                ···
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
