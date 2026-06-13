import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHandshake,
  FaArrowRight,
  FaCheckCircle,
  FaCrown,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import { previewPartnerSiteUrl } from '../utils/partnerSubdomain';
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

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

function PartnerApplicationPage() {
  const navigate = useNavigate();
  const { apiUrl } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reservedSiteUrl, setReservedSiteUrl] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [logoFileName, setLogoFileName] = useState('');

  const previewSiteUrl = previewPartnerSiteUrl(form.company);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Logo must be an image file (PNG, JPG, WEBP or SVG).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setError('Logo file is too large. Please upload an image under 2MB.');
      e.target.value = '';
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(reader.result);
      setLogoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setLogoDataUrl('');
    setLogoFileName('');
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
        body: JSON.stringify({ ...form, logo: logoDataUrl || undefined }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setReservedSiteUrl(data.siteUrl || '');
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-apply-page">
      <Navbar />

      <main className="partner-apply-main">
        <div className="partner-apply-shell">
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

          <section className="partner-apply-form-panel">
            {submitted ? (
              <div className="partner-apply-success">
                <div className="partner-apply-success-icon">
                  <FaCheckCircle />
                </div>
                <h2>Application Submitted</h2>
                <p>
                  Thank you, {form.fullName.split(' ')[0] || 'there'}! We have received your
                  partner application. A confirmation email has been sent to{' '}
                  <strong>{form.email}</strong>.
                </p>
                {reservedSiteUrl ? (
                  <p>
                    Your reserved white-label site address is{' '}
                    <strong>{reservedSiteUrl}</strong>. We will notify you when your site is
                    ready.
                  </p>
                ) : null}
                <p>Our partnerships team will review your application and get back to you within 48 hours.</p>
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
                      setReservedSiteUrl('');
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
                      placeholder="e.g. Acme Media"
                      value={form.company}
                      onChange={handleChange}
                    />
                    {previewSiteUrl ? (
                      <p className="partner-apply-site-preview">
                        Your site will be hosted at <strong>{previewSiteUrl}</strong>
                      </p>
                    ) : null}
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
                    <label htmlFor="brandLogo">Brand Logo (optional)</label>
                    <input
                      id="brandLogo"
                      name="brandLogo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      onChange={handleLogoChange}
                    />
                    {logoDataUrl ? (
                      <div className="partner-apply-logo-preview">
                        <img src={logoDataUrl} alt="Brand logo preview" />
                        <span>{logoFileName}</span>
                        <button type="button" className="partner-apply-link" onClick={handleLogoRemove}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="partner-apply-site-preview">
                        If you upload a logo, your white-label site will use it everywhere instead of
                        the Bluetickgeng logo. No logo? We&apos;ll display your brand name as text.
                      </p>
                    )}
                  </div>

                  <div className="partner-apply-field partner-apply-field--full">
                    <label htmlFor="website">Website / Social Media Handle</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      placeholder="e.g. mybrand.com or @mybrand"
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
