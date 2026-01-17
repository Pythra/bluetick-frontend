import React, { useState } from 'react'
import { MdExpandMore, MdCheckCircle, MdAccessTime, MdCancel } from 'react-icons/md'
import './OrderManagement.css'

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

  // Collect all orders from all users
  const allOrders = users.flatMap(user =>
    (user.orders || []).map(order => ({
      ...order,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      userPhone: user.phone,
      userId: user.id
    }))
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Filter and search
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch = 
      order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.productName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { bg: '#D4EDDA', color: '#155724', icon: MdCheckCircle, label: 'Completed' },
      'in_progress': { bg: '#D1ECF1', color: '#0C5460', icon: MdAccessTime, label: 'In Progress' },
      'pending': { bg: '#FFF3CD', color: '#856404', icon: MdAccessTime, label: 'Pending' },
      'cancelled': { bg: '#F8D7DA', color: '#721C24', icon: MdCancel, label: 'Cancelled' }
    }
    return statusConfig[status] || statusConfig['pending']
  }

  const toggleOrder = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    setUpdatingOrderId(orderId)
    if (onUpdateOrder) {
      onUpdateOrder(orderId, newStatus)
    }
    setTimeout(() => setUpdatingOrderId(null), 500)
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
          placeholder="Search by customer name, email or product..."
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📦</div>
          <p>No orders found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredOrders.map((order, index) => {
            const statusConfig = getStatusBadge(order.status)
            const isExpanded = expandedOrders[order.id]
            const StatusIcon = statusConfig.icon

            return (
              <div
                key={order.id}
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
                  onClick={() => toggleOrder(order.id)}
                  className="order-header-grid"
                  style={{
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    gap: '16px',
                    alignItems: 'center',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <div style={{ flex: '1', minWidth: 0 }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666' }}>
                      {order.userName}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                      📱 {order.userPhone}
                    </p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
                      ✉️ {order.userEmail}
                    </p>
                    <p style={{ margin: '0', fontSize: '14px', color: '#0066FF', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {order.cartItems && order.cartItems.length > 0 
                        ? order.cartItems.map(item => item.title).join(', ')
                        : order.productName}
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#999',
                      marginBottom: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      {formatDate(order.createdAt)}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0066FF',
                    }}>
                      ₦{order.totalAmount?.toLocaleString() || order.productPrice}
                    </div>
                  </div>

                  <div style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    backgroundColor: statusConfig.bg,
                    color: statusConfig.color,
                    fontSize: '12px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}>
                    {statusConfig.label}
                  </div>

                  <button
                    onClick={() => toggleOrder(order.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#0066FF',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isExpanded ? 'See Less' : 'See More'}
                  </button>
                </div>

                {isExpanded && (
                  <div 
                    className="order-details-section"
                    style={{
                      padding: '20px',
                      borderTop: '1px solid #eee',
                      backgroundColor: '#fafafa'
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: '600' }}>Service</div>
                        <div style={{ fontSize: '14px', color: '#121212', fontWeight: '500' }}>
                          {order.cartItems && order.cartItems.length > 0 
                            ? order.cartItems.map(item => item.title).join(', ')
                            : order.productName}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: '600' }}>Price</div>
                        <div style={{ fontSize: '14px', color: '#121212', fontWeight: '500' }}>{order.productPrice}</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px', fontWeight: '600' }}>Total Amount</div>
                        <div style={{ fontSize: '14px', color: '#0066FF', fontWeight: '700' }}>
                          ₦{order.totalAmount?.toLocaleString() || 'N/A'}
                        </div>
                      </div>
                    </div>

                    {/* Cart Items */}
                    {order.cartItems && order.cartItems.length > 0 && (
                      <div style={{
                        marginBottom: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid #eee'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#121212', marginBottom: '12px' }}>
                          Ordered Items ({order.cartItems.length})
                        </div>
                        <div 
                          className="cart-items-grid"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '16px'
                          }}
                        >
                          {order.cartItems.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: '#f9f9f9',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #eee',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                              }}
                            >
                              <div style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#121212',
                                marginBottom: '4px',
                                lineHeight: '1.4',
                                wordBreak: 'break-word'
                              }}>
                                {item.title}
                              </div>
                              {item.category && (
                                <div style={{
                                  fontSize: '12px',
                                  color: '#666',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px'
                                }}>
                                  {item.category}
                                </div>
                              )}
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto',
                                paddingTop: '8px',
                                borderTop: '1px solid #eee'
                              }}>
                                <span style={{ color: '#0066FF', fontWeight: '700', fontSize: '14px' }}>
                                  ₦{item.price?.toLocaleString ? item.price.toLocaleString() : item.price || 'N/A'}
                                </span>
                                {item.quantity && (
                                  <span style={{ 
                                    color: '#999', 
                                    fontSize: '12px',
                                    backgroundColor: '#f0f0f0',
                                    padding: '4px 8px',
                                    borderRadius: '4px'
                                  }}>
                                    Qty: {item.quantity}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Services/Items */}
                    {order.services && order.services.length > 0 && (
                      <div style={{
                        marginBottom: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid #eee'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#121212', marginBottom: '12px' }}>
                          Services ({order.services.length})
                        </div>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                          gap: '12px'
                        }}>
                          {order.services.map((service, idx) => (
                            <div
                              key={idx}
                              style={{
                                backgroundColor: '#f9f9f9',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #eee'
                              }}
                            >
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#121212',
                                marginBottom: '4px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {service.title || service.name}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: '#666',
                                marginBottom: '8px'
                              }}>
                                {service.category}
                              </div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '12px'
                              }}>
                                <span style={{ color: '#0066FF', fontWeight: '600' }}>
                                  ₦{service.price?.toLocaleString() || service.amount?.toLocaleString() || 'N/A'}
                                </span>
                                {service.quantity && (
                                  <span style={{ color: '#999' }}>
                                    Qty: {service.quantity}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Submission Details */}
                    {(order.postTitle || order.postBody || order.articleContent || order.fileName || (order.imageUrls && order.imageUrls.length > 0)) && (
                      <div style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        border: '1px solid #eee'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#121212', marginBottom: '12px' }}>
                          📝 Submission Details
                        </div>
                        {order.postTitle && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Post Title</div>
                            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              {order.postTitle}
                            </div>
                          </div>
                        )}
                        {order.postSummary && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Post Summary</div>
                            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              {order.postSummary}
                            </div>
                          </div>
                        )}
                        {order.postContent && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Post Content</div>
                            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', maxHeight: '300px', overflow: 'auto' }} dangerouslySetInnerHTML={{ __html: order.postContent }}></div>
                          </div>
                        )}
                        {order.postBody && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Post Body (Legacy)</div>
                            <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', maxHeight: '120px', overflow: 'auto' }}>
                              {order.postBody}
                            </div>
                          </div>
                        )}
                        {order.articleContent && (
                          <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>Content / Notes</div>
                            <div 
                              style={{ 
                                fontSize: '14px', 
                                color: '#333', 
                                lineHeight: '1.6', 
                                padding: '16px', 
                                backgroundColor: '#f9f9f9', 
                                borderRadius: '6px', 
                                border: '1px solid #e0e0e0',
                                overflow: 'auto'
                              }}
                              dangerouslySetInnerHTML={{ __html: order.articleContent }}
                            />
                          </div>
                        )}
                        {order.fileName && (
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Uploaded Document</div>
                            <div style={{ fontSize: '13px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                              {order.fileUrl ? (
                                <a 
                                  href={order.fileUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  style={{ color: '#0066FF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                  📎 {order.fileName} (Download)
                                </a>
                              ) : (
                                <span style={{ color: '#666' }}>📎 {order.fileName}</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Posted Images - Right after article content */}
                        {order.imageUrls && order.imageUrls.length > 0 && (
                          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e0e0e0' }}>
                            <div style={{ fontSize: '16px', fontWeight: '600', color: '#121212', marginBottom: '16px' }}>
                              📷 Posted Images ({order.imageUrls.length})
                            </div>
                            <div 
                              className="images-grid"
                              style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                gap: '16px'
                              }}
                            >
                              {order.imageUrls.map((imageUrl, idx) => (
                                <div key={idx} style={{ 
                                  position: 'relative',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: '2px solid #e0e0e0',
                                  backgroundColor: '#f9f9f9',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                  transition: 'transform 0.2s, box-shadow 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-4px)'
                                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)'
                                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                                >
                                  <a 
                                    href={imageUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ display: 'block', textDecoration: 'none' }}
                                  >
                                    <img 
                                      src={imageUrl} 
                                      alt={`Posted image ${idx + 1}`}
                                      style={{ 
                                        width: '100%', 
                                        height: '180px', 
                                        objectFit: 'cover', 
                                        display: 'block',
                                        cursor: 'pointer'
                                      }}
                                    />
                                    <div style={{
                                      padding: '10px',
                                      fontSize: '12px',
                                      color: '#666',
                                      textAlign: 'center',
                                      backgroundColor: 'white',
                                      fontWeight: '500'
                                    }}>
                                      Image {idx + 1}
                                    </div>
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Metadata */}
                    {order.metadata && Object.keys(order.metadata).length > 0 && (
                      <div style={{
                        padding: '16px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        border: '1px solid #eee'
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#121212', marginBottom: '12px' }}>
                          Additional Information
                        </div>
                        {Object.entries(order.metadata).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: '8px', fontSize: '13px' }}>
                            <strong style={{ color: '#666' }}>{key}:</strong>
                            <div style={{ color: '#333', marginTop: '4px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', maxHeight: '100px', overflow: 'auto' }}>
                              {String(value)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status Update Buttons */}
                    {order.status !== 'completed' && (
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap'
                      }}>
                        {order.status !== 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'in_progress')}
                            disabled={updatingOrderId === order.id}
                            style={{
                              padding: '10px 16px',
                              backgroundColor: '#D1ECF1',
                              color: '#0C5460',
                              border: '1px solid #0C5460',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                              transition: 'all 0.2s',
                              opacity: updatingOrderId === order.id ? 0.6 : 1
                            }}
                          >
                            Mark In Progress
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusUpdate(order.id, 'completed')}
                          disabled={updatingOrderId === order.id}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#D4EDDA',
                            color: '#155724',
                            border: '1px solid #155724',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            transition: 'all 0.2s',
                            opacity: updatingOrderId === order.id ? 0.6 : 1
                          }}
                        >
                          Mark Completed
                        </button>
                        {order.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                            disabled={updatingOrderId === order.id}
                            style={{
                              padding: '10px 16px',
                              backgroundColor: '#F8D7DA',
                              color: '#721C24',
                              border: '1px solid #721C24',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '13px',
                              transition: 'all 0.2s',
                              opacity: updatingOrderId === order.id ? 0.6 : 1
                            }}
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

      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: '#0066FF10',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        Showing {filteredOrders.length} of {allOrders.length} orders
      </div>
    </div>
  )
}
