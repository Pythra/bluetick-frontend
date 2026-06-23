import { useCallback, useEffect, useMemo, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';

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
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AgreementManagement({ apiUrl, adminToken }) {
  const { showToast, confirm } = useToast();
  const [view, setView] = useState('agreements');
  const [agreements, setAgreements] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [savingTemplate, setSavingTemplate] = useState(false);

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    }),
    [adminToken]
  );

  const loadAgreements = useCallback(async () => {
    const query = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : '';
    const response = await fetch(`${apiUrl}/api/admin/agreements${query}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to load agreements');
    }
    setAgreements(data.agreements || []);
  }, [adminToken, apiUrl, statusFilter]);

  const loadTemplates = useCallback(async () => {
    const response = await fetch(`${apiUrl}/api/admin/agreement-templates`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to load templates');
    }
    setTemplates(data.templates || []);
  }, [adminToken, apiUrl]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadAgreements(), loadTemplates()]);
    } catch (loadError) {
      showToast({ message: loadError.message || 'Failed to load agreement data', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [loadAgreements, loadTemplates, showToast]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleResend = async (agreementId) => {
    try {
      const response = await fetch(`${apiUrl}/api/admin/agreements/${agreementId}/resend`, {
        method: 'POST',
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to resend agreement email');
      }
      showToast({ message: 'Agreement email resent', type: 'success' });
    } catch (error) {
      showToast({ message: error.message || 'Failed to resend email', type: 'error' });
    }
  };

  const handleCancel = async (agreement) => {
    const shouldCancel = await confirm({
      title: 'Cancel agreement',
      message: `Cancel agreement ${agreement.agreementNumber || agreement.id}? This cannot be undone.`,
    });
    if (!shouldCancel) return;

    try {
      const response = await fetch(`${apiUrl}/api/admin/agreements/${agreement.id}/cancel`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to cancel agreement');
      }
      showToast({ message: 'Agreement cancelled', type: 'success' });
      loadAgreements();
    } catch (error) {
      showToast({ message: error.message || 'Failed to cancel agreement', type: 'error' });
    }
  };

  const openTemplateEditor = (template) => {
    setEditingTemplate({
      categoryKey: template.categoryKey,
      title: template.title,
      active: template.active !== false,
      sections: (template.sections || []).map((section) => ({
        heading: section.heading || '',
        body: section.body || '',
      })),
    });
  };

  const updateTemplateSection = (index, field, value) => {
    setEditingTemplate((prev) => {
      const sections = [...prev.sections];
      sections[index] = { ...sections[index], [field]: value };
      return { ...prev, sections };
    });
  };

  const addTemplateSection = () => {
    setEditingTemplate((prev) => ({
      ...prev,
      sections: [...prev.sections, { heading: '', body: '' }],
    }));
  };

  const removeTemplateSection = (index) => {
    setEditingTemplate((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const saveTemplate = async () => {
    if (!editingTemplate?.title?.trim() || !editingTemplate.sections?.length) {
      showToast({ message: 'Title and at least one section are required', type: 'error' });
      return;
    }

    setSavingTemplate(true);
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/agreement-templates/${editingTemplate.categoryKey}`,
        {
          method: 'PATCH',
          headers: authHeaders,
          body: JSON.stringify({
            title: editingTemplate.title.trim(),
            sections: editingTemplate.sections.filter((s) => s.heading?.trim() && s.body?.trim()),
            active: editingTemplate.active,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to save template');
      }
      showToast({ message: 'Template saved', type: 'success' });
      setEditingTemplate(null);
      loadTemplates();
    } catch (error) {
      showToast({ message: error.message || 'Failed to save template', type: 'error' });
    } finally {
      setSavingTemplate(false);
    }
  };

  return (
    <div className="adm-panel">
      <div className="adm-panel-head-row">
        <div>
          <h2 className="adm-panel-title">Agreement management</h2>
          <p className="adm-panel-lead">
            Track client signatures, verify documents, resend agreements, and edit service templates.
          </p>
        </div>
        <div className="adm-btn-group">
          <button
            type="button"
            className={`adm-btn ${view === 'agreements' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView('agreements')}
          >
            Agreements
          </button>
          <button
            type="button"
            className={`adm-btn ${view === 'templates' ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView('templates')}
          >
            Templates
          </button>
        </div>
      </div>

      {loading ? (
        <div className="adm-empty">
          <div className="adm-spinner" />
          <p>Loading agreement data…</p>
        </div>
      ) : view === 'agreements' ? (
        <>
          <div className="adm-filter-row" style={{ marginBottom: 16 }}>
            <label htmlFor="agreement-status-filter">Filter by status</label>
            <select
              id="agreement-status-filter"
              className="adm-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {!agreements.length ? (
            <div className="adm-empty">
              <div className="adm-empty-emoji">📄</div>
              <p>No agreements found.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Agreement #</th>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Signed</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {agreements.map((agreement) => (
                    <tr key={agreement.id}>
                      <td>{agreement.agreementNumber || agreement.id}</td>
                      <td>
                        <div>{agreement.clientDetails?.name || '—'}</div>
                        <div style={{ fontSize: 12, color: 'var(--adm-text-soft)' }}>
                          {agreement.clientDetails?.email || '—'}
                        </div>
                      </td>
                      <td>
                        {agreement.categoryLabels?.join(', ') ||
                          agreement.orderDetails?.servicePurchased ||
                          '—'}
                      </td>
                      <td>{STATUS_LABELS[agreement.status] || agreement.status}</td>
                      <td>{formatDate(agreement.clientSignature?.signedAt)}</td>
                      <td>
                        <div className="adm-btn-group">
                          {agreement.pdfUrl ? (
                            <a
                              href={agreement.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-btn adm-btn-ghost"
                            >
                              Download
                            </a>
                          ) : null}
                          {agreement.verificationUrl ? (
                            <a
                              href={agreement.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="adm-btn adm-btn-ghost"
                            >
                              Verify
                            </a>
                          ) : null}
                          {['awaiting_signature', 'draft'].includes(agreement.status) ? (
                            <button
                              type="button"
                              className="adm-btn adm-btn-ghost"
                              onClick={() => handleResend(agreement.id)}
                            >
                              Resend
                            </button>
                          ) : null}
                          {!['cancelled', 'fully_executed'].includes(agreement.status) ? (
                            <button
                              type="button"
                              className="adm-btn adm-btn-ghost danger"
                              onClick={() => handleCancel(agreement)}
                            >
                              Cancel
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {!templates.length ? (
            <div className="adm-empty">
              <div className="adm-empty-emoji">📝</div>
              <p>No templates available.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Sections</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {templates.map((template) => (
                    <tr key={template.categoryKey}>
                      <td>{template.categoryKey}</td>
                      <td>{template.title}</td>
                      <td>{template.sections?.length || 0}</td>
                      <td>{template.active === false ? 'Inactive' : 'Active'}</td>
                      <td>
                        <button
                          type="button"
                          className="adm-btn adm-btn-ghost"
                          onClick={() => openTemplateEditor(template)}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editingTemplate ? (
            <div className="adm-modal-overlay" role="presentation" onClick={() => setEditingTemplate(null)}>
              <div
                className="adm-modal adm-modal-wide"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="adm-modal-head">
                  <h3>Edit template: {editingTemplate.categoryKey}</h3>
                  <button type="button" className="adm-modal-close" onClick={() => setEditingTemplate(null)}>
                    ×
                  </button>
                </div>
                <div className="adm-modal-body">
                  <div className="adm-form-field">
                    <label htmlFor="template-title">Title</label>
                    <input
                      id="template-title"
                      className="adm-input"
                      value={editingTemplate.title}
                      onChange={(event) =>
                        setEditingTemplate((prev) => ({ ...prev, title: event.target.value }))
                      }
                    />
                  </div>
                  <label className="adm-checkbox">
                    <input
                      type="checkbox"
                      checked={editingTemplate.active}
                      onChange={(event) =>
                        setEditingTemplate((prev) => ({ ...prev, active: event.target.checked }))
                      }
                    />
                    Active
                  </label>

                  {editingTemplate.sections.map((section, index) => (
                    <div key={`section-${index}`} className="adm-form-block">
                      <div className="adm-form-field">
                        <label htmlFor={`section-heading-${index}`}>Section heading</label>
                        <input
                          id={`section-heading-${index}`}
                          className="adm-input"
                          value={section.heading}
                          onChange={(event) => updateTemplateSection(index, 'heading', event.target.value)}
                        />
                      </div>
                      <div className="adm-form-field">
                        <label htmlFor={`section-body-${index}`}>Section body</label>
                        <textarea
                          id={`section-body-${index}`}
                          className="adm-textarea"
                          rows={5}
                          value={section.body}
                          onChange={(event) => updateTemplateSection(index, 'body', event.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost danger"
                        onClick={() => removeTemplateSection(index)}
                      >
                        Remove section
                      </button>
                    </div>
                  ))}

                  <button type="button" className="adm-btn adm-btn-ghost" onClick={addTemplateSection}>
                    Add section
                  </button>
                </div>
                <div className="adm-modal-foot">
                  <button type="button" className="adm-btn adm-btn-ghost" onClick={() => setEditingTemplate(null)}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="adm-btn adm-btn-primary"
                    disabled={savingTemplate}
                    onClick={saveTemplate}
                  >
                    {savingTemplate ? 'Saving…' : 'Save template'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
