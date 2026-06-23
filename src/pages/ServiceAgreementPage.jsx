import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AgreementSignaturePad from '../components/agreements/AgreementSignaturePad';
import { useAuth } from '../contexts/AuthContext';
import './ServiceAgreementPage.css';

const CONFIRMATIONS = [
  { key: 'readAndUnderstood', label: 'I have read and understood this agreement.' },
  { key: 'agreeTerms', label: 'I agree to the terms and conditions.' },
  { key: 'understandProcessing', label: 'I understand that project processing will not begin until all required project information has been submitted.' },
  { key: 'informationAccurate', label: 'I confirm that all information provided during this order process is accurate.' },
];

export default function ServiceAgreementPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();
  const { isAuthenticated, authFetch, apiUrl } = useAuth();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [method, setMethod] = useState('draw');
  const [signatureData, setSignatureData] = useState('');
  const [typedName, setTypedName] = useState('');
  const [confirmations, setConfirmations] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadAgreement = useCallback(async () => {
    if (!orderId) {
      setError('Order ID is required.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authFetch(`${apiUrl}/api/orders/${orderId}/agreement`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load agreement');
      }
      setAgreement(data.agreement);
      if (data.agreement?.agreementSigned) {
        navigate(data.onboardingUrl || `/project-onboarding?orderId=${orderId}`, { replace: true });
      }
    } catch (loadError) {
      setError(loadError.message || 'Unable to load agreement');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authFetch, navigate, orderId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?returnTo=${encodeURIComponent(`/service-agreement?orderId=${orderId || ''}`)}`);
      return;
    }
    loadAgreement();
  }, [isAuthenticated, loadAgreement, navigate, orderId]);

  const allConfirmed = useMemo(
    () => CONFIRMATIONS.every(({ key }) => confirmations[key]),
    [confirmations]
  );

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSignatureData(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleSign = async () => {
    if (!allConfirmed) {
      setError('Please confirm all required statements.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const response = await authFetch(`${apiUrl}/api/orders/${orderId}/agreement/sign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          signatureData: method === 'type' ? null : signatureData,
          typedName,
          confirmations: {
            readAndUnderstood: true,
            agreeTerms: true,
            understandProcessing: true,
            informationAccurate: true,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign agreement');
      }
      navigate(data.redirectUrl || `/project-onboarding?orderId=${orderId}`, { replace: true });
    } catch (signError) {
      setError(signError.message || 'Unable to sign agreement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    const reason = window.prompt('Optional reason for declining this agreement:') || '';
    setSubmitting(true);
    setError('');
    try {
      const response = await authFetch(`${apiUrl}/api/orders/${orderId}/agreement/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to decline agreement');
      }
      setAgreement(data.agreement);
    } catch (declineError) {
      setError(declineError.message || 'Unable to decline agreement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="agreement-page">
      <Navbar />
      <main className="agreement-shell">
        <div className="agreement-header-card">
          <h1>Service Agreement</h1>
          <p>Review, accept, and sign your service agreement before submitting project requirements.</p>
          {agreement ? (
            <span className={`agreement-status-pill ${agreement.status}`}>{agreement.status.replace(/_/g, ' ')}</span>
          ) : null}
        </div>

        {loading ? <p>Loading agreement…</p> : null}
        {error ? <div className="agreement-locked-banner" role="alert">{error}</div> : null}

        {agreement ? (
          <>
            <div className="agreement-meta-grid">
              <div className="agreement-meta-block">
                <h3>Client</h3>
                <p><strong>{agreement.clientDetails?.name}</strong></p>
                <p>{agreement.clientDetails?.email}</p>
                <p>{agreement.clientDetails?.phone || '—'}</p>
                <p>{agreement.clientDetails?.country || '—'}</p>
              </div>
              <div className="agreement-meta-block">
                <h3>Order</h3>
                <p>Agreement: <strong>{agreement.agreementNumber}</strong></p>
                <p>Order: <strong>{agreement.orderDetails?.orderNumber}</strong></p>
                <p>Invoice: <strong>{agreement.orderDetails?.invoiceNumber}</strong></p>
                <p>Service: {agreement.orderDetails?.services}</p>
                <p>Amount: <strong>{agreement.orderDetails?.amountPaid}</strong></p>
                {agreement.orderDetails?.deliveryItems?.length ? (
                  <div className="agreement-delivery-summary">
                    <h4>Estimated delivery</h4>
                    <ul>
                      {agreement.orderDetails.deliveryItems.map((item) => (
                        <li key={`${item.packageId || item.displayTitle}-${item.delivery}`}>
                          <span>{item.displayTitle || item.title}</span>
                          <strong>{item.delivery}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="agreement-document-card">
              <h2>Agreement Terms</h2>
              {agreement.renderedHtml ? (
                <iframe
                  title="Service Agreement"
                  srcDoc={agreement.renderedHtml}
                  className="agreement-document-html"
                />
              ) : null}
            </div>

            {agreement.status === 'awaiting_signature' ? (
              <div className="agreement-sign-card">
                <h2>Sign Agreement</h2>
                <div className="agreement-sign-methods">
                  {['draw', 'type', 'upload'].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`agreement-sign-method${method === value ? ' active' : ''}`}
                      onClick={() => setMethod(value)}
                    >
                      {value === 'draw' ? 'Draw Signature' : value === 'type' ? 'Type Signature' : 'Upload Signature'}
                    </button>
                  ))}
                </div>

                {method === 'draw' ? (
                  <AgreementSignaturePad onChange={setSignatureData} />
                ) : null}
                {method === 'type' ? (
                  <input
                    className="agreement-typed-input"
                    value={typedName}
                    onChange={(event) => setTypedName(event.target.value)}
                    placeholder="Type your full legal name"
                  />
                ) : null}
                {method === 'upload' ? (
                  <input className="agreement-upload-input" type="file" accept="image/*" onChange={handleUpload} />
                ) : null}

                <div className="agreement-checks">
                  {CONFIRMATIONS.map(({ key, label }) => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={Boolean(confirmations[key])}
                        onChange={(event) => setConfirmations((prev) => ({ ...prev, [key]: event.target.checked }))}
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="agreement-actions">
                  <button type="button" className="agreement-primary-btn" onClick={handleSign} disabled={submitting}>
                    {submitting ? 'Signing…' : 'Accept & Sign Agreement'}
                  </button>
                  <button type="button" className="agreement-danger-btn" onClick={handleDecline} disabled={submitting}>
                    Decline Agreement
                  </button>
                </div>
              </div>
            ) : null}

            {agreement.pdfUrl ? (
              <div className="agreement-actions">
                <a className="agreement-primary-btn" href={agreement.pdfUrl} target="_blank" rel="noopener noreferrer">Download Signed PDF</a>
                <button type="button" className="agreement-secondary-btn" onClick={() => window.print()}>Print Agreement</button>
              </div>
            ) : null}
          </>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}
