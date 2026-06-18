import { useState } from 'react';
import SectionHeader from './SectionHeader';
import { useAuth } from '../contexts/AuthContext';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './CustomRequestsSection.css';

function CustomRequestsSection() {
  const { apiUrl } = useAuth();
  const { subdomain, isPartnerSite } = usePartnerBranding();
  const section = usePartnerSectionContent('customRequests');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isPartnerSite) {
    return null;
  }

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`${apiUrl}/api/partner-site/custom-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          subdomain,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send request');
      }

      setFeedback({ type: 'success', text: data.message || section.successMessage });
      setForm({ name: '', email: '', phone: '', serviceType: '', message: '' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="custom-requests" className="custom-requests-section">
      <div className="custom-requests-container">
        <SectionHeader
          title={(
            <>
              <span className="services-summary-title-black">{section.titleBlack}</span>{' '}
              <span className="services-summary-title-blue">{section.titleBlue}</span>
            </>
          )}
          subtitle={section.intro}
        />

        <form className="custom-requests-form" onSubmit={handleSubmit}>
          <div className="custom-requests-grid">
            <div className="custom-requests-field">
              <label htmlFor="custom-request-name">Full name</label>
              <input
                id="custom-request-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                placeholder="Your name"
              />
            </div>
            <div className="custom-requests-field">
              <label htmlFor="custom-request-email">Email</label>
              <input
                id="custom-request-email"
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div className="custom-requests-field">
              <label htmlFor="custom-request-phone">Phone (optional)</label>
              <input
                id="custom-request-phone"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+234 ..."
              />
            </div>
            <div className="custom-requests-field">
              <label htmlFor="custom-request-service">Service / topic</label>
              <input
                id="custom-request-service"
                value={form.serviceType}
                onChange={(e) => updateField('serviceType', e.target.value)}
                placeholder="e.g. Custom app, PR campaign, special package"
              />
            </div>
          </div>

          <div className="custom-requests-field">
            <label htmlFor="custom-request-message">Tell us what you need</label>
            <textarea
              id="custom-request-message"
              rows={5}
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
              required
              placeholder="Describe your project, timeline, budget, or any special requirements."
            />
          </div>

          {feedback ? (
            <div className={`custom-requests-alert ${feedback.type}`}>{feedback.text}</div>
          ) : null}

          <button type="submit" className="custom-requests-submit" disabled={submitting}>
            {submitting ? 'Sending...' : 'Submit Custom Request'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CustomRequestsSection;
