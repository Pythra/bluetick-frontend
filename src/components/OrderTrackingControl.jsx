import { useEffect, useState } from 'react';
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_ORDER } from '../data/orderTracking';
import OrderTrackingTimeline from './OrderTrackingTimeline';
import './OrderTrackingControl.css';

export default function OrderTrackingControl({
  order,
  onSave,
  readOnly = false,
  showPartnerBadge = false,
}) {
  const tracking = order.tracking || {};
  const [projectStatus, setProjectStatus] = useState(
    tracking.projectStatus || order.projectStatus || 'requirements_received'
  );
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setProjectStatus(tracking.projectStatus || order.projectStatus || 'requirements_received');
  }, [order.id, tracking.projectStatus, order.projectStatus]);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setError('');
    try {
      await onSave({ projectStatus, note: note.trim() });
      setNote('');
    } catch (err) {
      setError(err.message || 'Failed to update tracking');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="order-tracking-control">
      <div className="order-tracking-control-head">
        <strong>Order tracking</strong>
        {showPartnerBadge && order.partnerSubdomain ? (
          <span className="order-tracking-partner-badge">Partner order · {order.partnerSubdomain}</span>
        ) : null}
        {!order.partnerSubdomain && showPartnerBadge ? (
          <span className="order-tracking-partner-badge order-tracking-partner-badge-direct">Direct Bluetick order</span>
        ) : null}
      </div>

      <OrderTrackingTimeline
        tracking={tracking}
        paymentStatus={order.paymentStatus}
        compact
      />

      {!readOnly ? (
        <div className="order-tracking-control-form">
          <label className="order-tracking-control-label" htmlFor={`tracking-status-${order.id}`}>
            Update stage
          </label>
          <select
            id={`tracking-status-${order.id}`}
            className="order-tracking-control-select"
            value={projectStatus}
            onChange={(event) => setProjectStatus(event.target.value)}
          >
            {PROJECT_STATUS_ORDER.map((status) => (
              <option key={status} value={status}>
                {PROJECT_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          <label className="order-tracking-control-label" htmlFor={`tracking-note-${order.id}`}>
            Customer note (optional)
          </label>
          <textarea
            id={`tracking-note-${order.id}`}
            className="order-tracking-control-textarea"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Share a short update the customer will see on their dashboard."
          />

          {error ? <p className="order-tracking-control-error">{error}</p> : null}

          <button
            type="button"
            className="order-tracking-control-save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving…' : 'Save tracking update'}
          </button>
        </div>
      ) : null}
    </div>
  );
}
