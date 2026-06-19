import { useCallback, useEffect, useState } from 'react'
import { MdDelete, MdExpandMore, MdLanguage, MdEmail, MdPhone } from 'react-icons/md'
import '../styles/admin.css'

const STATUS_LABELS = {
  pending: 'Pending',
  under_review: 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
}

const PARTNERSHIP_LABELS = {
  'white-label': 'White-Label',
  referral: 'Referral',
  both: 'White-Label + Referral',
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const PartnershipManagement = ({ apiUrl, adminToken }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const loadApplications = useCallback(async () => {
    if (!adminToken) return

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/api/admin/partnerships`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load partnership applications')
      }

      setApplications(data.applications || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load applications')
    } finally {
      setLoading(false)
    }
  }, [adminToken, apiUrl])

  useEffect(() => {
    loadApplications()
  }, [loadApplications])

  const handlePartnerAction = async (id, body) => {
    setUpdatingId(id)
    try {
      const response = await fetch(`${apiUrl}/api/admin/partnerships/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update partner')
      }
      if (data.application) {
        setApplications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data.application, id: data.application.id || id } : item))
        )
      }
    } catch (updateError) {
      setError(updateError.message || 'Failed to update partner')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleStatusUpdate = async (id, newStatus, app = null) => {
    if (newStatus === 'rejected') {
      const target = app || applications.find((item) => item.id === id)
      if (!target) {
        return
      }

      const subdomain = target.siteDetails?.subdomain
      const customDomain = target.siteConfig?.customDomain
      const domainLines = [
        subdomain ? `Subdomain: ${subdomain}` : null,
        customDomain ? `Custom domain: ${customDomain}` : null,
      ].filter(Boolean)

      const domainNote = domainLines.length
        ? `\n\nThis will release:\n${domainLines.join('\n')}\n\nThose names can be used again for a new partnership application.`
        : '\n\nAny assigned subdomain or custom domain will be released for reuse.'

      const confirmed = window.confirm(
        `Reject and permanently remove the partnership application for ${target.company || target.fullName}?${domainNote}\n\nThis cannot be undone.`
      )

      if (!confirmed) {
        return
      }
    }

    setUpdatingId(id)

    try {
      const response = await fetch(`${apiUrl}/api/admin/partnerships/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to update status')
      }

      if (data.deleted) {
        setApplications((prev) => prev.filter((item) => item.id !== id))
        if (expandedId === id) {
          setExpandedId(null)
        }
        return
      }

      setApplications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus, updatedAt: data.application.updatedAt } : item
        )
      )
    } catch (updateError) {
      setError(updateError.message || 'Failed to update application')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (app) => {
    const subdomain = app.siteDetails?.subdomain
    const customDomain = app.siteConfig?.customDomain
    const domainLines = [
      subdomain ? `Subdomain: ${subdomain}` : null,
      customDomain ? `Custom domain: ${customDomain}` : null,
    ].filter(Boolean)

    const domainNote = domainLines.length
      ? `\n\nThis will release:\n${domainLines.join('\n')}\n\nThose names can be used again for a new partnership application.`
      : '\n\nAny assigned subdomain or custom domain will be released for reuse.'

    const confirmed = window.confirm(
      `Permanently delete the partnership application for ${app.company || app.fullName}?${domainNote}\n\nThis cannot be undone.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(app.id)
    setError('')

    try {
      const response = await fetch(`${apiUrl}/api/admin/partnerships/${app.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete application')
      }

      setApplications((prev) => prev.filter((item) => item.id !== app.id))
      if (expandedId === app.id) {
        setExpandedId(null)
      }
    } catch (deleteError) {
      setError(deleteError.message || 'Failed to delete application')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      app.fullName.toLowerCase().includes(term) ||
      app.email.toLowerCase().includes(term) ||
      (app.company || '').toLowerCase().includes(term) ||
      (app.country || '').toLowerCase().includes(term) ||
      (app.siteDetails?.subdomain || '').toLowerCase().includes(term)

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {})

  if (loading && applications.length === 0) {
    return (
      <div className="adm-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
        <div className="adm-spinner" />
        <p style={{ color: 'var(--adm-text-soft)', margin: 0 }}>Loading partnership applications...</p>
      </div>
    )
  }

  return (
    <div>
      {error ? (
        <div className="adm-panel" style={{ marginBottom: 16 }}>
          <p style={{ color: '#b91c1c', marginTop: 0 }}>{error}</p>
          <button type="button" className="adm-btn adm-btn-primary" onClick={loadApplications}>
            Try Again
          </button>
        </div>
      ) : null}

      <div className="adm-stats-grid" style={{ marginBottom: 20 }}>
        <div className="adm-stat-card" style={{ cursor: 'default' }}>
          <div className="adm-stat-value">{applications.length}</div>
          <div className="adm-stat-label">Total Applications</div>
        </div>
        <div className="adm-stat-card" style={{ cursor: 'default' }}>
          <div className="adm-stat-value">{statusCounts.under_review || 0}</div>
          <div className="adm-stat-label">Under Review</div>
        </div>
        <div className="adm-stat-card" style={{ cursor: 'default' }}>
          <div className="adm-stat-value">{statusCounts.approved || 0}</div>
          <div className="adm-stat-label">Approved</div>
        </div>
        <div className="adm-stat-card" style={{ cursor: 'default' }}>
          <div className="adm-stat-value">{statusCounts.pending || 0}</div>
          <div className="adm-stat-label">Pending</div>
        </div>
      </div>

      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Search by name, email, brand, country or subdomain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="adm-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-emoji">🤝</div>
          <p>{searchTerm || statusFilter !== 'all' ? 'No matching applications' : 'No partnership applications yet'}</p>
        </div>
      ) : (
        <div className="adm-card-grid">
          {filteredApplications.map((app) => {
            const isExpanded = expandedId === app.id
            const brandName = app.company || app.fullName
            const siteUrl = app.siteDetails?.siteUrl

            return (
              <div key={app.id} className={`adm-card${isExpanded ? ' expanded' : ''}`}>
                <div className="adm-card-top">
                  <h3 className="adm-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {app.logoUrl ? (
                      <img
                        src={app.logoUrl}
                        alt=""
                        style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
                      />
                    ) : null}
                    {brandName}
                  </h3>
                  <span className={`adm-badge ${app.status}`}>{STATUS_LABELS[app.status] || app.status}</span>
                </div>

                <p className="adm-card-meta">
                  <span>{app.fullName}</span>
                </p>
                <p className="adm-card-meta">
                  <MdEmail size={14} />
                  <span>{app.email}</span>
                </p>
                <p className="adm-card-meta">
                  <MdPhone size={14} />
                  <span>{app.phone}</span>
                </p>

                <div className="adm-card-services">
                  {PARTNERSHIP_LABELS[app.partnershipType] || app.partnershipType}
                  {app.country ? ` · ${app.country}` : ''}
                </div>

                {siteUrl ? (
                  <a
                    className="adm-site-url"
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    <MdLanguage size={14} />
                    {siteUrl.replace(/^https?:\/\//, '')}
                  </a>
                ) : null}

                <div className="adm-card-foot">
                  <span className="adm-card-date">{formatDate(app.createdAt)}</span>
                  <button
                    type="button"
                    className="adm-btn adm-btn-ghost"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    {isExpanded ? 'See Less' : 'See More'}
                    <MdExpandMore size={16} style={{ transform: isExpanded ? 'rotate(180deg)' : 'none' }} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="adm-detail">
                    <div className="adm-detail-grid">
                      <div>
                        <div className="adm-detail-label">Partnership Type</div>
                        <div className="adm-detail-value">
                          {PARTNERSHIP_LABELS[app.partnershipType] || app.partnershipType}
                        </div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Payment Status</div>
                        <div className="adm-detail-value">{app.paymentStatus || 'pending'}</div>
                      </div>
                      {app.website ? (
                        <div>
                          <div className="adm-detail-label">Website / Social</div>
                          <div className="adm-detail-value">{app.website}</div>
                        </div>
                      ) : null}
                      {app.audience ? (
                        <div>
                          <div className="adm-detail-label">Audience</div>
                          <div className="adm-detail-value">{app.audience}</div>
                        </div>
                      ) : null}
                    </div>

                    {app.message ? (
                      <div>
                        <div className="adm-detail-label">Message</div>
                        <pre className="adm-pre">{app.message}</pre>
                      </div>
                    ) : null}

                    {app.kyc?.status ? (
                      <div className="adm-panel" style={{ padding: 16, marginBottom: 12 }}>
                        <div className="adm-detail-label">KYC Status</div>
                        <div className="adm-detail-value">{app.kyc.status}</div>
                        {app.kyc.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                            <button
                              type="button"
                              className="adm-btn adm-btn-success"
                              disabled={updatingId === app.id}
                              onClick={() => handlePartnerAction(app.id, { kycStatus: 'approved' })}
                            >
                              Approve KYC
                            </button>
                            <button
                              type="button"
                              className="adm-btn adm-btn-danger"
                              disabled={updatingId === app.id}
                              onClick={() => handlePartnerAction(app.id, { kycStatus: 'rejected', kycNotes: 'Rejected by admin' })}
                            >
                              Reject KYC
                            </button>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {app.earnings ? (
                      <div className="adm-panel" style={{ padding: 16, marginBottom: 12 }}>
                        <div className="adm-detail-label">Partner Earnings</div>
                        <div className="adm-detail-value">
                          Available: ₦{(app.earnings.availableBalance || 0).toLocaleString()} ·
                          Pending: ₦{(app.earnings.pendingEarnings || 0).toLocaleString()} ·
                          Total: ₦{(app.earnings.totalEarnings || 0).toLocaleString()}
                        </div>
                      </div>
                    ) : null}

                    {siteUrl ? (
                      <div className="adm-panel" style={{ padding: 16, marginBottom: 0 }}>
                        <div className="adm-detail-label">Partner Site</div>
                        <a className="adm-site-url" href={siteUrl} target="_blank" rel="noopener noreferrer">
                          {siteUrl}
                        </a>
                        {app.siteDetails?.adminCredentials?.password ? (
                          <div style={{ marginTop: 12, fontSize: 13, color: 'var(--adm-text-soft)' }}>
                            <strong>Dashboard login:</strong>{' '}
                            {app.siteDetails.adminCredentials.username || app.email} /{' '}
                            <code>{app.siteDetails.adminCredentials.password}</code>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {app.status !== 'under_review' && (
                        <button
                          type="button"
                          className="adm-btn adm-btn-warn"
                          disabled={updatingId === app.id || deletingId === app.id}
                          onClick={() => handleStatusUpdate(app.id, 'under_review')}
                        >
                          Mark Under Review
                        </button>
                      )}
                      {app.status !== 'approved' && (
                        <button
                          type="button"
                          className="adm-btn adm-btn-success"
                          disabled={updatingId === app.id || deletingId === app.id}
                          onClick={() => handleStatusUpdate(app.id, 'approved')}
                        >
                          Approve
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          type="button"
                          className="adm-btn adm-btn-danger"
                          disabled={updatingId === app.id || deletingId === app.id}
                          onClick={() => handleStatusUpdate(app.id, 'rejected', app)}
                        >
                          Reject
                        </button>
                      )}
                      {app.status === 'suspended' ? (
                        <button
                          type="button"
                          className="adm-btn adm-btn-success"
                          disabled={updatingId === app.id}
                          onClick={() => handlePartnerAction(app.id, { action: 'unsuspend' })}
                        >
                          Unsuspend
                        </button>
                      ) : app.status === 'approved' ? (
                        <button
                          type="button"
                          className="adm-btn adm-btn-warn"
                          disabled={updatingId === app.id}
                          onClick={() => handlePartnerAction(app.id, { action: 'suspend', suspendedReason: 'Suspended by admin' })}
                        >
                          Suspend
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="adm-btn adm-btn-danger"
                        disabled={updatingId === app.id || deletingId === app.id}
                        onClick={() => handleDelete(app)}
                      >
                        <MdDelete size={16} />
                        {deletingId === app.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="adm-count-note">
        Showing {filteredApplications.length} of {applications.length} partnership application
        {applications.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
