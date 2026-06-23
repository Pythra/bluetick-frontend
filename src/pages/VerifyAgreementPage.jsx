import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import './ServiceAgreementPage.css';

export default function VerifyAgreementPage() {
  const { token } = useParams();
  const { apiUrl } = useAuth();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      try {
        const response = await fetch(`${apiUrl}/api/agreements/verify/${token}`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Verification failed');
        }
        setResult(data);
      } catch (verifyError) {
        setError(verifyError.message || 'Unable to verify agreement');
      }
    }
    if (token) verify();
  }, [apiUrl, token]);

  const agreement = result?.agreement;

  return (
    <div className="agreement-page">
      <Navbar />
      <main className="agreement-shell">
        <div className="agreement-header-card">
          <h1>Agreement Verification</h1>
          {error ? <p role="alert">{error}</p> : null}
          {agreement ? (
            <>
              <span className={`agreement-status-pill ${result.verified ? 'fully_executed' : 'awaiting_signature'}`}>
                {result.verified ? 'Verified' : 'Not Executed'}
              </span>
              <div className="agreement-meta-grid">
                <div className="agreement-meta-block">
                  <h3>Agreement</h3>
                  <p><strong>{agreement.agreementNumber}</strong></p>
                  <p>Order: {agreement.orderDetails?.orderNumber}</p>
                  <p>Client: {agreement.clientDetails?.name}</p>
                </div>
                <div className="agreement-meta-block">
                  <h3>Status</h3>
                  <p>{agreement.status.replace(/_/g, ' ')}</p>
                  {agreement.pdfUrl ? (
                    <p><a href={agreement.pdfUrl} target="_blank" rel="noopener noreferrer">Download PDF</a></p>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
