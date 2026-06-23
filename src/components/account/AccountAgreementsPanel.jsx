import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoDocumentTextOutline, IoDownloadOutline, IoPrintOutline } from 'react-icons/io5';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { printAgreementHtml } from '../../utils/printAgreement';
import Button from '../Button';

const STATUS_LABELS = {
  draft: 'Draft',
  awaiting_signature: 'Awaiting signature',
  signed_by_client: 'Signed by client',
  fully_executed: 'Fully executed',
  declined: 'Declined',
  expired: 'Expired',
  cancelled: 'Cancelled',
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusTone(status) {
  if (status === 'fully_executed' || status === 'signed_by_client') return 'paid';
  if (status === 'awaiting_signature' || status === 'draft') return 'pending';
  if (status === 'declined' || status === 'cancelled' || status === 'expired') return 'failed';
  return 'pending';
}

export default function AccountAgreementsPanel() {
  const { authFetch, apiUrl } = useAuth();
  const { showToast, confirm } = useToast();
  const navigate = useNavigate();
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadAgreements = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`${apiUrl}/api/account/agreements`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to load agreements');
      }
      setAgreements(data.agreements || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load agreements');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authFetch]);

  useEffect(() => {
    loadAgreements();
  }, [loadAgreements]);

  const handlePrint = (agreement) => {
    const opened = printAgreementHtml(
      agreement.renderedHtml,
      agreement.agreementNumber || 'Service Agreement'
    );
    if (!opened) {
      showToast({ message: 'Please allow pop-ups to print agreements', type: 'error' });
    }
  };

  const handleDecline = async (agreement) => {
    const shouldDecline = await confirm({
      title: 'Decline agreement',
      message: 'Are you sure you want to decline this agreement? Project work cannot begin until an agreement is signed.',
    });
    if (!shouldDecline) return;

    try {
      const response = await authFetch(`${apiUrl}/api/orders/${agreement.orderId}/agreement/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Declined from account dashboard' }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to decline agreement');
      }
      showToast({ message: 'Agreement declined', type: 'success' });
      loadAgreements();
    } catch (declineError) {
      showToast({ message: declineError.message || 'Failed to decline agreement', type: 'error' });
    }
  };

  return (
    <section className="my-account-panel" aria-labelledby="my-account-agreements-heading">
      <header className="my-account-panel-head">
        <h2 id="my-account-agreements-heading" className="my-account-panel-title">
          Service agreements
        </h2>
        <p className="my-account-panel-lead">
          Review, sign, download, and track agreements linked to your paid orders. Project submission
          unlocks after your agreement is fully executed.
        </p>
      </header>

      {loading ? (
        <p className="my-account-orders-empty">Loading your agreements…</p>
      ) : error ? (
        <p className="my-account-orders-error" role="alert">
          {error}
        </p>
      ) : agreements.length === 0 ? (
        <p className="my-account-orders-empty">
          No agreements yet. Agreements are generated automatically after payment is confirmed.
        </p>
      ) : (
        <ul className="my-account-order-list">
          {agreements.map((agreement) => {
            const statusLabel = STATUS_LABELS[agreement.status] || agreement.status;
            const tone = getStatusTone(agreement.status);
            const needsSignature = ['awaiting_signature', 'draft'].includes(agreement.status);
            const serviceLabel =
              agreement.categoryLabels?.join(', ') ||
              agreement.orderDetails?.servicePurchased ||
              'Service agreement';

            return (
              <li key={agreement.id} className="my-account-order-card">
                <div className="my-account-order-top">
                  <div>
                    <h3 className="my-account-order-name">{serviceLabel}</h3>
                    <p className="my-account-order-date">
                      Agreement {agreement.agreementNumber || agreement.id} · {formatDate(agreement.createdAt)}
                    </p>
                    {agreement.orderDetails?.orderNumber ? (
                      <p className="my-account-order-stage">
                        Order <strong>{agreement.orderDetails.orderNumber}</strong>
                      </p>
                    ) : null}
                  </div>
                  <div className="my-account-order-meta">
                    <span className={`my-account-order-badge my-account-order-badge--${tone}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>

                <div className="my-account-agreement-actions">
                  {needsSignature ? (
                    <Button
                      type="button"
                      className="my-account-order-action"
                      onClick={() => navigate(`/service-agreement?orderId=${agreement.orderId}`)}
                    >
                      <IoDocumentTextOutline aria-hidden="true" />
                      Review & sign
                    </Button>
                  ) : null}

                  {agreement.pdfUrl ? (
                    <a
                      href={agreement.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="my-account-invoice-link"
                    >
                      <IoDownloadOutline aria-hidden="true" />
                      Download PDF
                    </a>
                  ) : null}

                  {agreement.renderedHtml ? (
                    <button
                      type="button"
                      className="my-account-invoice-link"
                      onClick={() => handlePrint(agreement)}
                    >
                      <IoPrintOutline aria-hidden="true" />
                      Print
                    </button>
                  ) : null}

                  {agreement.verificationUrl ? (
                    <a
                      href={agreement.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="my-account-invoice-link"
                    >
                      Verify document
                    </a>
                  ) : null}

                  {needsSignature ? (
                    <button
                      type="button"
                      className="my-account-invoice-link my-account-agreement-decline"
                      onClick={() => handleDecline(agreement)}
                    >
                      Decline
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
