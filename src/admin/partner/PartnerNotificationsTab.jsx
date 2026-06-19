import { useEffect, useState } from 'react';

export default function PartnerNotificationsTab({ api }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await api.getNotifications();
    setNotifications(data.notifications || []);
    setUnreadCount(data.unreadCount || 0);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.markNotificationRead(id);
    await load();
  };

  const markAllRead = async () => {
    await api.markAllNotificationsRead();
    await load();
  };

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  return (
    <div className="pdash-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Notifications {unreadCount ? `(${unreadCount} unread)` : ''}</h2>
        {unreadCount ? (
          <button type="button" className="pdash-btn pdash-btn-ghost" onClick={markAllRead}>
            Mark all read
          </button>
        ) : null}
      </div>
      {!notifications.length ? (
        <p className="pdash-panel-lead">No notifications yet.</p>
      ) : (
        <div className="pdash-notifications">
          {notifications.map((n) => (
            <button
              key={n._id}
              type="button"
              className={`pdash-notification-item${n.read ? '' : ' unread'}`}
              onClick={() => !n.read && markRead(n._id)}
            >
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <small>{new Date(n.createdAt).toLocaleString()}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
