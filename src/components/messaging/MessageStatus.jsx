export default function MessageStatus({ status = 'sent' }) {
  const label =
    status === 'read'
      ? 'Read'
      : status === 'delivered'
        ? 'Delivered'
        : 'Sent';

  return <span className="chat-message-status">{label}</span>;
}
