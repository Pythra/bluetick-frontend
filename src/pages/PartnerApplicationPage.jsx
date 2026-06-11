import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
  FaCrown,
  FaWhatsapp,
  FaLock,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import bluego from '../assets/bluego.png';
import './PartnerApplicationPage.css';

const partnershipTypes = [
  { value: 'white-label', label: 'White-Label Partner' },
  { value: 'referral', label: 'Referral Partner' },
  { value: 'both', label: 'Both (White-Label + Referral)' },
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  company: '',
  partnershipType: '',
  website: '',
  audience: '',
  message: '',
};

function PartnerApplicationPage() {
  const navigate = useNavigate();
  const { apiUrl } = useAuth();
  const { currency, convert, format } = useCurrency();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const PARTNER_FEE_NGN = 50000; // ₦50,000 partner fee in Naira
  
  const partnerFee = convert(PARTNER_FEE_NGN);
  const formattedFee = format(partnerFee);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) return setError('Please enter your full name.');
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
      return setError('Please enter a valid email address.');
    }
    if (!form.phone.trim()) return setError('Please enter your phone number.');
    if (!form.country.trim()) return setError('Please enter your country.');
    if (!form.partnershipType) return setError('Please select a partnership type.');

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/partner-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setApplicationId(data.applicationId);
      setPaymentInitialized(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiUrl}/api/partner-application/${applicationId}/initialize-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: partnerFee, currency }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initialize payment');
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-apply-page">
      <Navbar />

      <main className="partner-apply-main">
        <div className="partner-apply-shell">
          {/* Left panel */}
          <aside className="partner-apply-aside">
            <div className="partner-apply-aside-inner">
              <img src={bluego} alt="Bluetick" className="partner-apply-aside-logo" />
              <div className="partner-apply-badge">
                <FaCrown />
                <span>Exclusive Program</span>
              </div>
              <h1>
                Become a<span> Bluetickgeng Partner</span>
              </h1>
              <p>
                Tell us about yourself and your network. Our partnerships team
                reviews every application personally and responds within 48 hours.
              </p>
              <ul className="partner-apply-perks">
                <li>
                  <FaCheckCircle />
                  <span>Set your own prices — keep the profit</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>White-label website under your brand</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Commissions on every referral</span>
                </li>
                <li>
                  <FaCheckCircle />
                  <span>Flexible payouts — bank, Wise, PayPal, USDT</span>
                </li>
              </ul>
              <div className="partner-apply-aside-foot">
                <FaHandshake />
                <span>500+ partners already earning with us</span>
              </div>
            </div>
          </aside>

          {/* Form panel */}
          <section className="partner-apply-form-panel">
            {submitted ? (
              <div className="partner-apply-success">
                <div className="partner-apply-success-icon">
                  <FaWhatsapp />
                </div>
                <h2>Application Sent</h2>
                <p>
                  Your application has been opened in WhatsApp. Send the message to
                  complete your submission — our partnerships team will get back to
                  you within 48 hours.
                </p>
                <div className="partner-apply-success-actions">
                  <button
                    type="button"
                    className="partner-apply-submit"
                    onClick={() => navigate('/partner')}
                  >
                    Back to Partner Program
                  </button>
                  <button
                    type="button"
                    className="partner-apply-ghost"
                    onClick={() => {
                      setForm(initialForm);
                      setSubmitted(false);
                    }}
                  >
                    Submit another application
                  </button>
                </div>
              </div>
            ) : (
              <form className="partner-apply-form" onSubmit={handleSubmit} noValidate>
                <h2>Partner Application</h2>
                <p className="partner-apply-form-sub">
                  Fields marked <span>*</span> are required.
                </p>

                <div className="partner-apply-grid">
                  <div className="partner-apply-field">
                    <label htmlFor="fullName">Full Name <span>*</span></label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="e.g. Adaeze Okonkwo"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field">
                    <label htmlFor="email">Email Address <span>*</span></label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field">
                    <label htmlFor="phone">Phone / WhatsApp <span>*</span></label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field">
                    <label htmlFor="country">Country <span>*</span></label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="e.g. Nigeria"
                      value={form.country}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field">
                    <label htmlFor="company">Company / Brand Name</label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Optional"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field">
                    <label htmlFor="partnershipType">Partnership Type <span>*</span></label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      value={form.partnershipType}
                      onChange={handleChange}
                    >
                      <option value="">Select an option</option>
                      {partnershipTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="partner-apply-field partner-apply-field--full">
                    <label htmlFor="website">Website / Social Media Handle</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      placeholder="https:// or @handle"
                      value={form.website}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field partner-apply-field--full">
                    <label htmlFor="audience">Tell us about your audience or network</label>
                    <input
                      id="audience"
                      name="audience"
                      type="text"
                      placeholder="e.g. 10k Instagram followers, agency clients, business community"
                      value={form.audience}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="partner-apply-field partner-apply-field--full">
                    <label htmlFor="message">Anything else we should know?</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Share your goals, experience, or questions…"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error ? (
                  <p className="partner-apply-error" role="alert">{error}</p>
                ) : null}

                {!paymentInitialized ? (
                  <>
                    <button type="submit" className="partner-apply-submit" disabled={loading}>
                      <span>{loading ? 'Submitting...' : 'Submit Application'}</span>
                      <FaArrowRight />
                    </button>
                    <p className="partner-apply-disclaimer">
                      By applying you agree to our{' '}
                      <button
                        type="button"
                        className="partner-apply-link"
                        onClick={() => navigate('/legal/partner-commission-payout-policy')}
                      >
                        Partner Commission &amp; Payout Policy
                      </button>.
                    </p>
                  </>
                ) : (
                  <div className="partner-apply-payment-step">
                    <div className="partner-apply-payment-summary">
                      <h3><FaLock /> Partner Program Fee</h3>
                      <p className="partner-apply-fee">{formattedFee}</p>
                      <p className="partner-apply-fee-note">
                        One-time fee to activate your partner account and receive your white-label site credentials.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="partner-apply-submit"
                      onClick={handlePayment}
                      disabled={loading}
                    >
                      <span>{loading ? 'Processing...' : 'Pay Now'}</span>
                      <FaArrowRight />
                    </button>
                    <p className="partner-apply-disclaimer">
                      Secure payment via Paystack. You'll receive your site details via email after payment confirmation.
                    </p>
                  </div>
                )}
              </form>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PartnerApplicationPage;
