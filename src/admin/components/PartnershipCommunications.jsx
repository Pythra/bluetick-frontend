import { useCallback, useEffect, useState } from 'react'
import ChatComposeBar from '../../components/chat/ChatComposeBar'
import MessageBubbleContent from '../../components/chat/MessageBubbleContent'
import { messagePreviewText } from '../../utils/chatMedia'

function formatWhen(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function PartnershipCommunications({ apiUrl, adminToken, partner }) {
  const [commTab, setCommTab] = useState('partner')
  const [threads, setThreads] = useState([])
  const [clients, setClients] = useState([])
  const [activeThread, setActiveThread] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingClients, setLoadingClients] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const brandName = partner.company || partner.fullName
  const channel = commTab === 'partner' ? 'partner-admin' : 'partner-client'

  const authHeaders = {
    Authorization: `Bearer ${adminToken}`,
    'Content-Type': 'application/json',
  }

  const loadThreads = useCallback(async () => {
    if (!partner?.id) return

    setLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ channel })
      if (selectedClient?.email) {
        params.set('participantEmail', selectedClient.email)
      }

      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${partner.id}/messages?${params}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load messages')
      }

      setThreads(data.threads || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load messages')
    } finally {
      setLoading(false)
    }
  }, [adminToken, apiUrl, channel, partner?.id, selectedClient?.email])

  const loadClients = useCallback(async () => {
    if (!partner?.id) return

    setLoadingClients(true)
    try {
      const response = await fetch(`${apiUrl}/api/admin/partnerships/${partner.id}/clients`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load clients')
      }
      setClients(data.clients || [])
    } catch (loadError) {
      setError(loadError.message || 'Unable to load clients')
    } finally {
      setLoadingClients(false)
    }
  }, [adminToken, apiUrl, partner?.id])

  useEffect(() => {
    setActiveThread(null)
    setMessage('')
    setSubject('')
    loadThreads()
  }, [loadThreads])

  useEffect(() => {
    if (commTab === 'clients') {
      loadClients()
    }
  }, [commTab, loadClients])

  const openThread = async (threadId) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/admin/partnerships/${partner.id}/messages/${threadId}`,
        { headers: { Authorization: `Bearer ${adminToken}` } }
      )
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load conversation')
      }
      setActiveThread(data.thread)
    } catch (loadError) {
      setError(loadError.message || 'Unable to open conversation')
    }
  }

  const handleSelectClient = (client) => {
    setSelectedClient(client)
    setActiveThread(null)
    setMessage('')
    setSubject('')
  }

  const handleSend = async ({ body, attachment, attachmentType, attachmentName }) => {
    if (!body?.trim() && !attachment) return

    setSending(true)
    setError('')

    try {
      const payload = {
        channel,
        body,
        attachment,
        attachmentType,
        attachmentName,
      }

      if (activeThread) {
        payload.threadId = activeThread.threadId
      } else if (subject.trim()) {
        payload.subject = subject.trim()
      }

      if (channel === 'partner-client' && selectedClient) {
        payload.participantEmail = selectedClient.email
        payload.participantName = selectedClient.name
        if (selectedClient.orders?.[0]?.id) {
          payload.orderId = selectedClient.orders[0].id
        }
      }

      const response = await fetch(`${apiUrl}/api/admin/partnerships/${partner.id}/messages`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message')
      }

      setActiveThread(data.thread)
      setMessage('')
      setSubject('')
      await loadThreads()
    } catch (sendError) {
      setError(sendError.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const canCompose =
    commTab === 'partner' || (commTab === 'clients' && selectedClient)

  const chatTitle = activeThread
    ? activeThread.subject
    : commTab === 'partner'
      ? `Message ${brandName}`
      : selectedClient
        ? `Message ${selectedClient.name || selectedClient.email}`
        : 'Select a client'

  return (
    <div className="adm-panel adm-comm-panel">
      <div className="adm-comm-header">
        <div>
          <div className="adm-detail-label">Communications</div>
          <div className="adm-detail-value" style={{ marginTop: 4 }}>
            Message {brandName} and their clients. Partners see admin messages in their dashboard; clients receive email.
          </div>
        </div>
        <div className="adm-comm-tabs">
          <button
            type="button"
            className={`adm-comm-tab${commTab === 'partner' ? ' active' : ''}`}
            onClick={() => {
              setCommTab('partner')
              setSelectedClient(null)
            }}
          >
            Partner
          </button>
          <button
            type="button"
            className={`adm-comm-tab${commTab === 'clients' ? ' active' : ''}`}
            onClick={() => setCommTab('clients')}
          >
            Clients
          </button>
        </div>
      </div>

      {error ? <p className="adm-comm-error">{error}</p> : null}

      <div className="adm-comm-layout">
        <div className="adm-comm-sidebar">
          {commTab === 'clients' ? (
            <>
              <h3 className="adm-comm-sidebar-title">Clients</h3>
              {loadingClients ? (
                <div className="adm-spinner" style={{ margin: '16px auto' }} />
              ) : !clients.length ? (
                <p className="adm-comm-empty">No clients yet for this partner.</p>
              ) : (
                clients.map((client) => (
                  <button
                    key={client.email}
                    type="button"
                    className={`adm-comm-list-item${selectedClient?.email === client.email ? ' active' : ''}`}
                    onClick={() => handleSelectClient(client)}
                  >
                    <strong>{client.name || client.email}</strong>
                    <span>{client.email}</span>
                    <span>
                      {client.orderCount} order{client.orderCount !== 1 ? 's' : ''}
                      {client.totalSpent ? ` · ₦${client.totalSpent.toLocaleString()}` : ''}
                    </span>
                  </button>
                ))
              )}
            </>
          ) : null}

          <h3 className="adm-comm-sidebar-title">
            {commTab === 'partner' ? 'Conversations' : 'Threads'}
          </h3>
          {loading ? (
            <div className="adm-spinner" style={{ margin: '16px auto' }} />
          ) : !threads.length ? (
            <p className="adm-comm-empty">
              {commTab === 'clients' && !selectedClient
                ? 'Select a client to view or start a conversation.'
                : 'No conversations yet. Send a message below.'}
            </p>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.threadId}
                type="button"
                className={`adm-comm-list-item${activeThread?.threadId === thread.threadId ? ' active' : ''}`}
                onClick={() => openThread(thread.threadId)}
              >
                <strong>
                  {commTab === 'partner'
                    ? brandName
                    : thread.participantName || thread.participantEmail}
                </strong>
                <span>{messagePreviewText(thread.lastMessage) || thread.subject}</span>
                <span>{formatWhen(thread.lastMessageAt)}</span>
              </button>
            ))
          )}
        </div>

        <div className="adm-comm-chat">
          <h3 className="adm-comm-chat-title">{chatTitle}</h3>

          {!canCompose ? (
            <p className="adm-comm-empty">Choose a client from the list to start messaging.</p>
          ) : (
            <>
              <div className="adm-comm-messages">
                {(activeThread?.messages || []).map((entry) => (
                  <div key={entry.id} className={`adm-comm-bubble ${entry.senderType}`}>
                    <div className="adm-comm-bubble-head">
                      <strong>{entry.senderName}</strong>
                      <span>{formatWhen(entry.createdAt)}</span>
                    </div>
                    <MessageBubbleContent message={entry} />
                  </div>
                ))}
                {!activeThread?.messages?.length ? (
                  <p className="adm-comm-empty">Start a new conversation below.</p>
                ) : null}
              </div>

              {!activeThread && subject !== undefined ? (
                <input
                  type="text"
                  className="adm-input adm-comm-subject"
                  placeholder="Subject (optional)"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              ) : null}

              <ChatComposeBar
                message={message}
                onMessageChange={setMessage}
                onSend={handleSend}
                sending={sending}
                placeholder={
                  commTab === 'partner'
                    ? `Write to ${brandName}...`
                    : `Write to ${selectedClient?.name || selectedClient?.email}...`
                }
                variant="panel"
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
