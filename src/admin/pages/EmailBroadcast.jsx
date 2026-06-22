import { useMemo, useState } from 'react'
import RichTextEditor from '../../components/RichTextEditor'
import ContentPreviewModal from '../../components/ContentPreviewModal'
import { parseJsonResponse } from '../../utils/apiResponse'
import {
  applyBroadcastMergeTags,
  hasMeaningfulHtml,
  normalizeEditorHtml,
} from '../../utils/richHtml'

const inputStyle = {
  width: '100%',
  border: '1px solid #d6deeb',
  borderRadius: '8px',
  padding: '10px 12px',
  fontSize: '14px',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

export const EmailBroadcast = ({
  apiUrl,
  adminToken,
  users = [],
  broadcastEndpoint = '/api/admin/email-broadcast',
  authQuery = '',
  recipientNoun = 'user',
  excludeField = 'excludeUserIds',
}) => {
  const buildBroadcastUrl = () => {
    const path = `${apiUrl}${broadcastEndpoint}`;
    if (!authQuery) return path;
    return path.includes('?') ? `${path}&${authQuery}` : `${path}?${authQuery}`;
  };
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [excludedUserIds, setExcludedUserIds] = useState([])
  const [excludeSearch, setExcludeSearch] = useState('')
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [scheduleAt, setScheduleAt] = useState('')

  const excludedSet = useMemo(() => new Set(excludedUserIds), [excludedUserIds])

  const filteredUsersForExclude = useMemo(() => {
    const term = excludeSearch.trim().toLowerCase()
    const sorted = [...users].sort((a, b) =>
      `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    )
    if (!term) return sorted
    return sorted.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
    )
  }, [users, excludeSearch])

  const recipientCount = users.length - excludedUserIds.length

  const previewRecipient = useMemo(() => {
    const sampleUser = users.find((user) => !excludedSet.has(user.id))
    if (sampleUser) {
      return {
        firstName: sampleUser.firstName,
        lastName: sampleUser.lastName,
        email: sampleUser.email,
      }
    }
    return { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }
  }, [users, excludedSet])

  const previewSubject = useMemo(
    () => applyBroadcastMergeTags(subject, previewRecipient),
    [subject, previewRecipient]
  )

  const previewContent = useMemo(
    () => applyBroadcastMergeTags(content, previewRecipient),
    [content, previewRecipient]
  )

  const toggleExcludedUser = (userId) => {
    setExcludedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const clearExclusions = () => {
    setExcludedUserIds([])
  }

  const allFilteredExcluded =
    filteredUsersForExclude.length > 0 &&
    filteredUsersForExclude.every((user) => excludedSet.has(user.id))

  const toggleAllFilteredForExclude = () => {
    const filteredIds = filteredUsersForExclude.map((user) => user.id)
    if (allFilteredExcluded) {
      const filteredIdSet = new Set(filteredIds)
      setExcludedUserIds((prev) => prev.filter((id) => !filteredIdSet.has(id)))
    } else {
      setExcludedUserIds((prev) => [...new Set([...prev, ...filteredIds])])
    }
  }

  const actionButtonStyle = {
    padding: '8px 12px',
    backgroundColor: '#fff',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedSubject = subject.trim()
    const normalizedContent = normalizeEditorHtml(content)

    if (!trimmedSubject) {
      setError('Subject is required.')
      return
    }

    if (!hasMeaningfulHtml(normalizedContent)) {
      setError('Email content is required.')
      return
    }

    if (recipientCount === 0) {
      setError(`No recipients selected. Remove some exclusions or add ${recipientNoun}s first.`)
      return
    }

    const exclusionNote =
      excludedUserIds.length > 0
        ? `\n\n${excludedUserIds.length} user(s) will be excluded.`
        : ''

    const scheduleNote = scheduleAt
      ? `\n\nThis message will be scheduled for: ${scheduleAt}.`
      : ''

    const shouldSend = window.confirm(
      `Send this email to ${recipientCount} ${recipientNoun}${recipientCount === 1 ? '' : 's'}?${exclusionNote}${scheduleNote}\n\nThis cannot be undone.`
    )
    if (!shouldSend) return

    setSubmitLoading(true)
    try {
      const response = await fetch(buildBroadcastUrl(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          subject: trimmedSubject,
          contentHtml: normalizedContent,
          [excludeField]: excludedUserIds,
          scheduledFor: scheduleAt ? new Date(scheduleAt).toISOString() : undefined,
        }),
      })

      const { data } = await parseJsonResponse(response)
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || data?.message || 'Failed to send broadcast email')
      }

      if (data.scheduled) {
        const excludedNote =
          data.excludedCount > 0 ? ` ${data.excludedCount} user(s) will be excluded.` : ''
        setSuccess(
          `Broadcast scheduled for ${new Date(data.scheduledFor).toLocaleString()}.${excludedNote}`
        )
      } else {
        const failedNote =
          data.failed > 0 ? ` ${data.failed} recipient(s) failed.` : ''
        const excludedNote =
          data.excludedCount > 0 ? ` ${data.excludedCount} user(s) were excluded.` : ''
        setSuccess(
          `Broadcast sent to ${data.sent} of ${data.totalRecipients} user(s).${excludedNote}${failedNote}`
        )
      }
      setSubject('')
      setContent('')
      setExcludedUserIds([])
      setExcludeSearch('')
      setScheduleAt('')
    } catch (submitError) {
      setError(submitError.message || 'Unable to send broadcast email')
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <ContentPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        dialogTitle="Email preview"
        title={previewSubject || 'Email subject'}
        contentHtml={previewContent}
        emailPreview
      />

      <div
        style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#121212' }}>Email broadcast</h2>
          <p style={{ margin: '8px 0 0', color: '#555', fontSize: '14px' }}>
            Compose an email to send to registered users. Sending to{' '}
            <strong>{recipientCount}</strong> of {users.length} user{users.length === 1 ? '' : 's'}
            {excludedUserIds.length > 0 ? ` (${excludedUserIds.length} excluded)` : ''}.
          </p>
        </div>

        {error ? (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#FFEBEE',
              color: '#C62828',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '16px',
              border: '1px solid #EF5350',
            }}
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#E8F5E9',
              color: '#2E7D32',
              borderRadius: '6px',
              fontSize: '14px',
              marginBottom: '16px',
              border: '1px solid #A5D6A7',
            }}
          >
            {success}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label htmlFor="broadcast-subject" style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>
              Subject
            </label>
            <input
              id="broadcast-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              required
              placeholder="Email subject line"
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gap: '8px', overflow: 'visible' }}>
            <label style={{ fontSize: '14px', fontWeight: 600, color: '#222' }}>Message</label>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
              Personalize with{' '}
              <code>{'{{firstName}}'}</code>, <code>{'{{lastName}}'}</code>,{' '}
              <code>{'{{fullName}}'}</code>, or <code>{'{{email}}'}</code>.
              Preview uses the first recipient
              {previewRecipient.firstName ? ` (${previewRecipient.firstName})` : ''}.
            </p>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your broadcast message here..."
              minHeight={260}
              enableHtmlSource
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <label
                htmlFor="broadcast-schedule-at"
                style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}
              >
                Schedule (optional)
              </label>
              <input
                id="broadcast-schedule-at"
                type="datetime-local"
                value={scheduleAt}
                onChange={(event) => setScheduleAt(event.target.value)}
                style={{
                  borderRadius: '8px',
                  border: '1px solid #d6deeb',
                  padding: '6px 10px',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                }}
              />
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Leave empty to send immediately.
              </span>
            </div>
          </div>

          <div
            style={{
              border: '1px solid #dbe3f0',
              borderRadius: '10px',
              padding: '16px',
              background: '#f8fafc',
              display: 'grid',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#121212' }}>Exclude recipients</h3>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '13px' }}>
                  Check users who should not receive this broadcast.
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {filteredUsersForExclude.length > 0 ? (
                  <button
                    type="button"
                    onClick={toggleAllFilteredForExclude}
                    style={{
                      ...actionButtonStyle,
                      color: '#0066FF',
                      borderColor: '#0066FF',
                    }}
                  >
                    {allFilteredExcluded
                      ? excludeSearch.trim()
                        ? `Unselect all (${filteredUsersForExclude.length})`
                        : 'Unselect all'
                      : excludeSearch.trim()
                        ? `Select all (${filteredUsersForExclude.length})`
                        : 'Select all'}
                  </button>
                ) : null}
                {excludedUserIds.length > 0 ? (
                  <button
                    type="button"
                    onClick={clearExclusions}
                    style={actionButtonStyle}
                  >
                    Clear exclusions ({excludedUserIds.length})
                  </button>
                ) : null}
              </div>
            </div>

            <input
              type="text"
              value={excludeSearch}
              onChange={(event) => setExcludeSearch(event.target.value)}
              placeholder="Search users to exclude..."
              style={inputStyle}
            />

            {users.length === 0 ? (
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>No registered users yet.</p>
            ) : filteredUsersForExclude.length === 0 ? (
              <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>No users match your search.</p>
            ) : (
              <div
                style={{
                  maxHeight: '240px',
                  overflowY: 'auto',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                {filteredUsersForExclude.map((user) => {
                  const isExcluded = excludedSet.has(user.id)
                  return (
                    <label
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '10px 12px',
                        borderBottom: '1px solid #f1f5f9',
                        cursor: 'pointer',
                        background: isExcluded ? '#fff7ed' : '#fff',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isExcluded}
                        onChange={() => toggleExcludedUser(user.id)}
                        style={{ marginTop: '3px', flexShrink: 0 }}
                      />
                      <span style={{ display: 'grid', gap: '2px', minWidth: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                          {user.firstName} {user.lastName}
                        </span>
                        <span style={{ fontSize: '13px', color: '#64748b', wordBreak: 'break-word' }}>
                          {user.email}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              disabled={!subject.trim() && !hasMeaningfulHtml(content)}
              style={{
                padding: '10px 16px',
                backgroundColor: '#fff',
                color: '#0066FF',
                border: '1px solid #0066FF',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={submitLoading || recipientCount === 0}
              style={{
                padding: '10px 16px',
                backgroundColor: '#0066FF',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: submitLoading || recipientCount === 0 ? 'not-allowed' : 'pointer',
                opacity: submitLoading || recipientCount === 0 ? 0.6 : 1,
              }}
            >
              {submitLoading
                ? 'Sending...'
                : `Send to ${recipientCount} user${recipientCount === 1 ? '' : 's'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
