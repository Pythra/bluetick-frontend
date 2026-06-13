import { useState } from 'react'
import { MdCheckCircle, MdAccessTime, MdCancel } from 'react-icons/md'
import { getOrderServiceLabel, orderMatchesServiceSearch } from '../utils/orderServices'
import '../styles/admin.css'

const STATUS_CONFIG = {
  completed: { icon: MdCheckCircle, label: 'Completed' },
  in_progress: { icon: MdAccessTime, label: 'In Progress' },
  pending: { icon: MdAccessTime, label: 'Pending' },
  cancelled: { icon: MdCancel, label: 'Cancelled' },
}

export const OrderManagement = ({ users, onUpdateOrder }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrders, setExpandedOrders] = useState({})
  const [updatingOrderId, setUpdatingOrderId] = useState(null)

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

  const orderServices = (order) => getOrderServiceLabel(order)

  const allOrders = users.flatMap(user =>
    (user.orders || []).map(order => ({
      ...order,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone,
      userId: user.id
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const filteredOrders = allOrders.filter(order => {
    const matchesSearch =
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orderMatchesServiceSearch(order, searchTerm)

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    onUpdateOrder?.(orderId, newStatus)
    setTimeout(() => setUpdatingOrderId(null), 500)
  }

  return (
    <div>
      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Search by customer name, email or service..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="adm-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-emoji">📦</div>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="adm-card-grid">
          {filteredOrders.map((order) => {
            const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isExpanded = expandedOrders[order.id]
            const StatusIcon = statusConfig.icon

            return (
              <div key={order.id} className={`adm-card${isExpanded ? ' expanded' : ''}`}>
                <div className="adm-card-top">
                  <h3 className="adm-card-title">{order.userName}</h3>
                  <span className={`adm-badge ${order.status}`}>
                    <StatusIcon size={13} />
                    {statusConfig.label}
                  </span>
                </div>

                <p className="adm-card-meta"><span>{order.userEmail}</span></p>
                <p className="adm-card-meta"><span>{order.userPhone}</span></p>
                <div className="adm-card-services">{orderServices(order)}</div>

                <div className="adm-card-foot">
                  <div>
                    <div className="adm-card-amount">
                      ₦{order.totalAmount?.toLocaleString() || order.productPrice}
                    </div>
                    <div className="adm-card-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <button type="button" className="adm-btn adm-btn-ghost" onClick={() => toggleOrder(order.id)}>
                    {isExpanded ? 'See Less' : 'See More'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="adm-detail">
                    <div className="adm-detail-grid">
                      <div>
                        <div className="adm-detail-label">Service</div>
                        <div className="adm-detail-value">{orderServices(order)}</div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Price</div>
                        <div className="adm-detail-value">{order.productPrice}</div>
                      </div>
                      <div>
                        <div className="adm-detail-label">Total Amount</div>
                        <div className="adm-detail-value" style={{ color: 'var(--adm-primary)' }}>
                          ₦{order.totalAmount?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {order.cartItems && order.cartItems.length > 0 && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>
                          Ordered Items ({order.cartItems.length})
                        </div>
                        <div className="adm-item-grid">
                          {order.cartItems.map((item, idx) => (
                            <div key={idx} className="adm-item-card">
                              <div className="adm-item-card-title">{item.title}</div>
                              {item.category && <div className="adm-item-card-cat">{item.category}</div>}
                              <div className="adm-item-card-row">
                                <span className="adm-item-card-price">
                                  ₦{item.price?.toLocaleString ? item.price.toLocaleString() : item.price || 'N/A'}
                                </span>
                                {item.quantity && <span className="adm-item-card-qty">Qty: {item.quantity}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.services && order.services.length > 0 && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>
                          Services ({order.services.length})
                        </div>
                        <div className="adm-item-grid">
                          {order.services.map((service, idx) => (
                            <div key={idx} className="adm-item-card">
                              <div className="adm-item-card-title">{service.title || service.name}</div>
                              {service.category && <div className="adm-item-card-cat">{service.category}</div>}
                              <div className="adm-item-card-row">
                                <span className="adm-item-card-price">
                                  ₦{service.price?.toLocaleString() || service.amount?.toLocaleString() || 'N/A'}
                                </span>
                                {service.quantity && <span className="adm-item-card-qty">Qty: {service.quantity}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(order.clientProfile || order.metadata?.clientProfile) && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>Client profile</div>
                        <pre className="adm-pre">
                          {JSON.stringify(order.clientProfile || order.metadata?.clientProfile, null, 2)}
                        </pre>
                      </div>
                    )}

                    {((order.projectSubmissions || order.metadata?.projectSubmissions || []).length > 0) && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>
                          Project onboarding submissions
                        </div>
                        {(order.projectSubmissions || order.metadata?.projectSubmissions || []).map((entry, idx) => (
                          <div key={idx} style={{ marginBottom: 12 }}>
                            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                              {entry.formType} — {entry.title || 'Service'}
                            </div>
                            <pre className="adm-pre">{JSON.stringify(entry.formData || entry, null, 2)}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {(order.postTitle || order.postBody || order.articleContent || order.fileName) && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>Submission Details</div>
                        {order.postTitle && (
                          <div style={{ marginBottom: 10 }}>
                            <div className="adm-detail-label">Post Title</div>
                            <div className="adm-detail-value">{order.postTitle}</div>
                          </div>
                        )}
                        {order.postBody && (
                          <div style={{ marginBottom: 10 }}>
                            <div className="adm-detail-label">Post Body</div>
                            <pre className="adm-pre">{order.postBody}</pre>
                          </div>
                        )}
                        {order.articleContent && (
                          <div style={{ marginBottom: 10 }}>
                            <div className="adm-detail-label">Content / Notes</div>
                            <pre className="adm-pre">{order.articleContent}</pre>
                          </div>
                        )}
                        {order.fileName && (
                          <div>
                            <div className="adm-detail-label">Uploaded File</div>
                            <div className="adm-detail-value" style={{ color: 'var(--adm-primary)' }}>
                              📎 {order.fileName}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {order.metadata && Object.keys(order.metadata).length > 0 && (
                      <div>
                        <div className="adm-detail-label" style={{ marginBottom: 10 }}>Additional Information</div>
                        {Object.entries(order.metadata).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: 8, fontSize: 13 }}>
                            <strong style={{ color: 'var(--adm-text-soft)' }}>{key}:</strong>
                            <pre className="adm-pre" style={{ marginTop: 4 }}>{String(value)}</pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {order.status !== 'completed' && (
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {order.status !== 'in_progress' && (
                          <button
                            type="button"
                            className="adm-btn adm-btn-warn"
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button
                          type="button"
                          className="adm-btn adm-btn-success"
                          disabled={updatingOrderId === order.id}
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                        >
                          Mark Completed
                        </button>
                        {order.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="adm-btn adm-btn-danger"
                            disabled={updatingOrderId === order.id}
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
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
        Showing {filteredOrders.length} of {allOrders.length} orders
      </div>
    </div>
  )
}
