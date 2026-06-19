import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import './PartnerApplicationPage.css';

export default function PartnerVerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const { apiUrl } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    fetch(`${apiUrl}/api/partner/verify-email?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
        setStatus('success');
        setMessage(data.message || 'Email verified successfully.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
      });
  }, [apiUrl, searchParams]);

  return (
    <div className="partner-apply-page">
      <Navbar />
      <main className="partner-apply-main">
        <div className="partner-apply-success" style={{ maxWidth: 520, margin: '48px auto' }}>
          {status === 'loading' ? (
            <p>Verifying your email...</p>
          ) : status === 'success' ? (
            <>
              <div className="partner-apply-success-icon"><FaCheckCircle /></div>
              <h2>Email Verified</h2>
              <p>{message}</p>
              <Link to="/partner" className="partner-apply-submit">Back to Partner Program</Link>
            </>
          ) : (
            <>
              <h2>Verification Failed</h2>
              <p>{message}</p>
              <Link to="/partner/apply" className="partner-apply-submit">Partner Application</Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
