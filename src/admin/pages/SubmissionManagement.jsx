import { useState } from 'react'
import { getOrderServiceLabel } from '../utils/orderServices'
import '../styles/admin.css'

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const SubmissionManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSubmissions, setExpandedSubmissions] = useState({})

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const allSubmissions = users.flatMap(user =>
    (user.orders || [])
      .filter(order => order.postTitle || order.postBody || order.articleContent || order.fileName)
      .map(order => ({
        ...order,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userPhone: user.phone,
        userId: user.id,
        submittedAt: order.createdAt
      }))
  ).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const filteredSubmissions = allSubmissions.filter(submission =>
    submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (submission.postTitle && submission.postTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (submission.articleContent && submission.articleContent.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const toggleSubmission = (submissionId) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }))
  }

  return (
    <div>
      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Search by customer name, email or submission content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-emoji">📝</div>
          <p>{searchTerm ? 'No matching submissions found' : 'No submissions yet'}</p>
        </div>
      ) : (
        <div className="adm-card-grid">
          {filteredSubmissions.map((submission) => {
            const isExpanded = expandedSubmissions[submission.id]

            return (
              <div key={submission.id} className={`adm-card${isExpanded ? ' expanded' : ''}`}>
                <div className="adm-card-top">
                  <h3 className="adm-card-title">
                    {submission.postTitle || submission.articleContent?.substring(0, 50) || 'Submission'}
                  </h3>
                  <span className={`adm-badge ${submission.status || 'pending'}`}>
                    {STATUS_LABELS[submission.status] || submission.status || 'Pending'}
                  </span>
                </div>

                <p className="adm-card-meta"><span>{submission.userName}</span></p>
                <p className="adm-card-meta"><span>{submission.userEmail}</span></p>
                <div className="adm-card-services">{getOrderServiceLabel(submission)}</div>

                <div className="adm-card-foot">
                  <span className="adm-card-date">{formatDate(submission.submittedAt)}</span>
                  <button
                    type="button"
                    className="adm-btn adm-btn-ghost"
                    onClick={() => toggleSubmission(submission.id)}
                  >
                    {isExpanded ? 'See Less' : 'See More'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="adm-detail">
                    <div className="adm-detail-grid">
                      <div>
                        <div className="adm-detail-label">Customer Email</div>
                        <div className="adm-detail-value">{submission.userEmail}</div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Phone</div>
                        <div className="adm-detail-value">{submission.userPhone}</div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Service Type</div>
                        <div className="adm-detail-value">{getOrderServiceLabel(submission)}</div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Status</div>
                        <div className="adm-detail-value" style={{ textTransform: 'capitalize' }}>
                          {submission.status?.replace('_', ' ') || 'Pending'}
                        </div>
                      </div>
                    </div>

                    {submission.postTitle && (
                      <div>
                        <div className="adm-detail-label">Post Title</div>
                        <div className="adm-detail-value">{submission.postTitle}</div>
                      </div>
                    )}

                    {submission.postBody && (
                      <div>
                        <div className="adm-detail-label">Post Body</div>
                        <pre className="adm-pre">{submission.postBody}</pre>
                      </div>
                    )}

                    {submission.articleContent && (
                      <div>
                        <div className="adm-detail-label">Content / Notes</div>
                        <pre className="adm-pre">{submission.articleContent}</pre>
                      </div>
                    )}

                    {submission.fileName && (
                      <div>
                        <div className="adm-detail-label">Uploaded File</div>
                        <div className="adm-detail-value" style={{ color: 'var(--adm-primary)' }}>
                          📎 {submission.fileName}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="adm-count-note">
        Showing {filteredSubmissions.length} of {allSubmissions.length} submission{allSubmissions.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
