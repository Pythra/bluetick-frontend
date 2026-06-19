import { useState } from 'react';

export default function PartnerSupportTab({ api, onMessage }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.submitSupport({ subject, message });
      onMessage?.({ type: 'success', text: 'Support request submitted. Bluetickgeng will respond shortly.' });
      setSubject('');
      setMessage('');
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pdash-panel">
      <h2>Support</h2>
      <p className="pdash-panel-lead">
        Contact Bluetickgeng fulfillment team for order issues, technical help, or partnership questions.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="pdash-field">
          <label>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="How can we help?" />
        </div>
        <div className="pdash-field">
          <label>Message</label>
          <textarea rows={6} value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="Describe your issue..." />
        </div>
        <button type="submit" className="pdash-btn pdash-btn-primary" disabled={submitting}>
          {submitting ? 'Sending...' : 'Submit Support Request'}
        </button>
      </form>
    </div>
  );
}
