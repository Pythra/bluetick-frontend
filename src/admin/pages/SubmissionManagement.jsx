import React, { useState } from 'react'

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

  // Collect all submissions
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

  // Filter submissions
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
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search by customer name, email or submission content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {filteredSubmissions.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
          <p>{searchTerm ? 'No matching submissions found' : 'No submissions yet'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredSubmissions.map((submission) => {
            const isExpanded = expandedSubmissions[submission.id]

            return (
              <div
                key={submission.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 102, 255, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  onClick={() => toggleSubmission(submission.id)}
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9'
                  }}
                >
                  <div style={{ flex: '1' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#121212' }}>
                      {submission.postTitle || submission.articleContent?.substring(0, 50) || 'Submission'}
                    </h3>
                    <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                      {submission.userName} • {submission.userEmail}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
                      {formatDate(submission.submittedAt)}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginLeft: '16px'
                  }}>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      backgroundColor: '#E3F2FD',
                      color: '#1976D2',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      {submission.productName || 'Article'}
                    </div>

                    <span style={{
                      fontSize: '18px',
                      color: '#666',
                      transition: 'transform 0.2s ease',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{
                    padding: '20px',
                    borderTop: '1px solid #eee',
                    backgroundColor: '#fafafa'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Customer Email</div>
                        <div style={{ fontSize: '14px', color: '#121212', fontWeight: '500' }}>{submission.userEmail}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Phone</div>
                        <div style={{ fontSize: '14px', color: '#121212', fontWeight: '500' }}>{submission.userPhone}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Service Type</div>
                        <div style={{ fontSize: '14px', color: '#121212', fontWeight: '500' }}>{submission.productName || 'N/A'}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Status</div>
                        <div style={{ 
                          fontSize: '14px', 
                          color: '#121212', 
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {submission.status?.replace('_', ' ') || 'Pending'}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      {submission.postTitle && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>
                            Post Title
                          </div>
                          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                            {submission.postTitle}
                          </div>
                        </div>
                      )}

                      {submission.postBody && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>
                            Post Body
                          </div>
                          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                            {submission.postBody}
                          </div>
                        </div>
                      )}

                      {submission.articleContent && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>
                            Content / Notes
                          </div>
                          <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                            {submission.articleContent}
                          </div>
                        </div>
                      )}

                      {submission.fileName && (
                        <div style={{
                          padding: '12px',
                          backgroundColor: 'white',
                          borderRadius: '6px',
                          border: '1px solid #eee'
                        }}>
                          <div style={{ fontSize: '12px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>
                            Uploaded File
                          </div>
                          <div style={{ 
                            fontSize: '14px', 
                            color: '#0066FF',
                            wordBreak: 'break-all'
                          }}>
                            📎 {submission.fileName}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#0066FF10',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing {filteredSubmissions.length} of {allSubmissions.length} submission{allSubmissions.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
