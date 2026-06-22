import { PROJECT_STATUS_LABELS, buildTrackingSteps } from '../data/orderTracking';
import './OrderTrackingTimeline.css';

function formatWhen(value) {
  if (!value) return '';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderTrackingTimeline({ tracking, paymentStatus, compact = false }) {
  if (!tracking && paymentStatus !== 'paid') {
    return (
      <p className="order-tracking-note">
        Tracking will appear once your payment is confirmed.
      </p>
    );
  }

  const steps = buildTrackingSteps(tracking);
  const showPaymentPending = paymentStatus && paymentStatus !== 'paid';

  return (
    <div className={`order-tracking${compact ? ' order-tracking-compact' : ''}`}>
      {showPaymentPending ? (
        <p className="order-tracking-note order-tracking-note-pending">
          Payment pending — progress updates begin after payment is confirmed.
        </p>
      ) : null}

      <ol className="order-tracking-steps" aria-label="Order progress">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`order-tracking-step${step.complete ? ' is-complete' : ''}${step.current ? ' is-current' : ''}`}
          >
            <span className="order-tracking-dot" aria-hidden="true" />
            <span className="order-tracking-step-label">{step.label}</span>
          </li>
        ))}
      </ol>

      {tracking?.customerNote ? (
        <div className="order-tracking-customer-note">
          <strong>Latest update</strong>
          <p>{tracking.customerNote}</p>
        </div>
      ) : null}

      {!compact && tracking?.history?.length > 0 ? (
        <div className="order-tracking-history">
          <strong>Activity</strong>
          <ul>
            {tracking.history.slice(0, 5).map((entry) => (
              <li key={entry.id || `${entry.createdAt}-${entry.status}`}>
                <span className="order-tracking-history-status">
                  {entry.statusLabel || PROJECT_STATUS_LABELS[entry.status] || entry.status}
                </span>
                {entry.note ? <span className="order-tracking-history-note">{entry.note}</span> : null}
                <span className="order-tracking-history-when">{formatWhen(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
