import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';

export default function KycReviewModal({ apiUrl, adminToken, onComplete }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast, confirm } = useToast();
  const kycToken = searchParams.get('kycToken') || '';
  const kycAction = searchParams.get('kycAction') || '';

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  const clearKycParams = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('kycToken');
    next.delete('kycAction');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const loadReview = useCallback(async () => {
    if (!kycToken || !adminToken) return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/kyc-review?token=${encodeURIComponent(kycToken)}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to load KYC review');
      }
      setReview(data.review);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load KYC review');
    } finally {
      setLoading(false);
    }
  }, [adminToken, apiUrl, kycToken]);

  useEffect(() => {
    if (kycToken && adminToken) {
      loadReview();
    }
  }, [kycToken, adminToken, loadReview]);

  if (!kycToken || !kycAction) {
    return null;
  }

  const handleClose = () => {
    clearKycParams();
    onComplete?.();
  };

  const submitReview = async (action, reason = '') => {
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/kyc-review`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: kycToken,
          action,
          rejectionReason: reason,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to process KYC review');
      }
      showToast({ message: data.message || 'KYC review completed.', type: 'success' });
      handleClose();
    } catch (submitError) {
      const message = submitError.message || 'Failed to process KYC review';
      setError(message);
      showToast({ message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    const approved = await confirm({
      title: 'Approve KYC',
      message: `Approve identity verification for ${review?.partnerName || 'this partner'}?`,
      confirmLabel: 'Approve',
    });
    if (!approved) return;
    await submitReview('approve');
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError('Enter a reason for rejection before submitting.');
      return;
    }
    const rejected = await confirm({
      title: 'Reject KYC',
      message: `Reject KYC for ${review?.partnerName || 'this partner'} and notify them by email?`,
      confirmLabel: 'Reject',
      tone: 'danger',
    });
    if (!rejected) return;
    await submitReview('reject', rejectionReason.trim());
  };

  const isRejectFlow = kycAction === 'reject';

  return (
    <div className="adm-kyc-review-overlay" role="presentation" onClick={handleClose}>
      <div
        className="adm-kyc-review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="adm-kyc-review-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="adm-kyc-review-head">
          <h2 id="adm-kyc-review-title">
            {isRejectFlow ? 'Reject partner KYC' : 'Approve partner KYC'}
          </h2>
          <button type="button" className="adm-kyc-review-close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </header>

        {loading ? <p className="adm-kyc-review-status">Loading submission…</p> : null}
        {error ? <p className="adm-kyc-review-error" role="alert">{error}</p> : null}

        {review ? (
          <div className="adm-kyc-review-body">
            <p><strong>{review.partnerName}</strong></p>
            <p>{review.email} · {review.phone || 'No phone'} · {review.country || 'No country'}</p>
            {review.subdomain ? <p>Subdomain: {review.subdomain}</p> : null}
            <div className="adm-kyc-review-docs">
              {review.idDocumentUrl ? (
                <a href={review.idDocumentUrl} target="_blank" rel="noopener noreferrer">Government ID</a>
              ) : null}
              {review.businessDocumentUrl ? (
                <a href={review.businessDocumentUrl} target="_blank" rel="noopener noreferrer">Business document</a>
              ) : null}
            </div>

            {isRejectFlow ? (
              <div className="adm-kyc-review-field">
                <label htmlFor="kyc-rejection-reason">Reason for rejection *</label>
                <textarea
                  id="kyc-rejection-reason"
                  rows={4}
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain what the partner should fix before resubmitting."
                />
              </div>
            ) : null}

            <div className="adm-kyc-review-actions">
              {isRejectFlow ? (
                <button
                  type="button"
                  className="adm-btn adm-btn-danger"
                  disabled={submitting}
                  onClick={handleReject}
                >
                  {submitting ? 'Submitting…' : 'Reject & notify partner'}
                </button>
              ) : (
                <button
                  type="button"
                  className="adm-btn adm-btn-success"
                  disabled={submitting}
                  onClick={handleApprove}
                >
                  {submitting ? 'Submitting…' : 'Approve & notify partner'}
                </button>
              )}
              <button type="button" className="adm-btn adm-btn-secondary" onClick={handleClose} disabled={submitting}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
