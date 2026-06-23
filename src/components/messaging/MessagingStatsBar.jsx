export default function MessagingStatsBar({ stats }) {
  if (!stats) return null;

  return (
    <div className="messaging-crm-stats">
      <div className="messaging-crm-stat-card">
        <span>Total conversations</span>
        <strong>{stats.totalConversations ?? 0}</strong>
      </div>
      <div className="messaging-crm-stat-card">
        <span>Unread messages</span>
        <strong>{stats.unreadMessages ?? 0}</strong>
      </div>
      <div className="messaging-crm-stat-card">
        <span>Active (7 days)</span>
        <strong>{stats.activeConversations ?? 0}</strong>
      </div>
      <div className="messaging-crm-stat-card">
        <span>Avg response time</span>
        <strong>{stats.averageResponseTimeLabel || '—'}</strong>
      </div>
    </div>
  );
}
