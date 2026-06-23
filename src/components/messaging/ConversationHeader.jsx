import { getAvatarColor, getInitials } from '../../utils/chatDisplay';

function formatLastActive(value) {
  if (!value) return 'Offline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Offline';
  return `Last active ${date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function statusLabel(status) {
  if (status === 'online') return 'Online';
  if (status === 'away') return 'Away';
  return 'Offline';
}

export default function ConversationHeader({
  participant,
  onViewProfile,
  onViewOrders,
  onViewInvoices,
  onViewPartnership,
  onSuspend,
  onArchive,
  archived = false,
}) {
  if (!participant) return null;

  const initials = getInitials(participant.name, participant.email);
  const avatarColor = getAvatarColor(participant.email || participant.name);
  const status = participant.onlineStatus || 'offline';

  return (
    <div className="messaging-crm-header">
      <div className="messaging-crm-header-main">
        <div className="messaging-crm-header-avatar" style={{ backgroundColor: avatarColor }}>
          {participant.avatarUrl ? (
            <img src={participant.avatarUrl} alt={participant.name || 'User'} />
          ) : (
            initials
          )}
        </div>
        <div className="messaging-crm-header-text">
          <h3>{participant.name || participant.email}</h3>
          <p>
            <span className={`messaging-crm-tag ${participant.type === 'partner' ? 'partner' : 'client'}`}>
              {participant.type === 'partner' ? 'Partner' : 'Client'}
            </span>
            {' · '}
            ID: {participant.accountId}
            {participant.orderNumber ? (
              <>
                {' · '}
                <span className="messaging-crm-tag order">
                  Order {participant.orderNumber}
                </span>
              </>
            ) : null}
          </p>
          <div className="messaging-crm-status">
            <span className={`messaging-crm-status-dot ${status}`} />
            {status === 'offline'
              ? formatLastActive(participant.lastActiveAt)
              : statusLabel(status)}
          </div>
        </div>
      </div>

      <div className="messaging-crm-header-actions">
        {onViewProfile ? (
          <button type="button" className="messaging-crm-action-btn" onClick={onViewProfile}>
            View Profile
          </button>
        ) : null}
        {participant.type === 'client' && onViewOrders ? (
          <button type="button" className="messaging-crm-action-btn" onClick={onViewOrders}>
            View Orders
          </button>
        ) : null}
        {participant.type === 'client' && onViewInvoices ? (
          <button type="button" className="messaging-crm-action-btn" onClick={onViewInvoices}>
            View Invoices
          </button>
        ) : null}
        {participant.type === 'partner' && onViewPartnership ? (
          <button type="button" className="messaging-crm-action-btn" onClick={onViewPartnership}>
            Partnership
          </button>
        ) : null}
        {onArchive ? (
          <button type="button" className="messaging-crm-action-btn" onClick={onArchive}>
            {archived ? 'Unarchive' : 'Archive'}
          </button>
        ) : null}
        {onSuspend ? (
          <button type="button" className="messaging-crm-action-btn danger" onClick={onSuspend}>
            Suspend
          </button>
        ) : null}
      </div>
    </div>
  );
}
