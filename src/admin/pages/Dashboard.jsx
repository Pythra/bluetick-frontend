import React, { useState } from 'react'
import { MdPeople, MdShoppingCart, MdInventory2, MdArticle } from 'react-icons/md'

export const Dashboard = ({ users, carts, orders, submissions, onNavigateToTab }) => {
  const [expandedOrder, setExpandedOrder] = useState(null)
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

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

  // Get pending orders sorted by newest first
  const pendingOrders = users
    .flatMap(user =>
      (user.orders || []).map(order => ({
        ...order,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        userPhone: user.phone
      }))
    )
    .filter(order => order.status === 'pending')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Cards */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        <style>{`
          @media (max-width: 1024px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
        `}</style>
        <StatCard 
          icon={MdPeople}
          value={formatNumber(users.length)}
          label="Total Users"
          color="#0066FF"
          onClick={() => onNavigateToTab && onNavigateToTab('users')}
        />
        
        <StatCard 
          icon={MdShoppingCart}
          value={formatNumber(carts.length)}
          label="Active Carts"
          color="#0066FF"
          onClick={() => onNavigateToTab && onNavigateToTab('carts')}
        />
        
        <StatCard 
          icon={MdInventory2}
          value={formatNumber(orders.length)}
          label="Total Orders"
          color="#0066FF"
          onClick={() => onNavigateToTab && onNavigateToTab('orders')}
        />
        
        <StatCard 
          icon={MdArticle}
          value={formatNumber(submissions.length)}
          label="Submissions"
          color="#0066FF"
          onClick={() => onNavigateToTab && onNavigateToTab('submissions')}
        />
      </div>

      {/* Pending Orders Overview */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: '0', marginBottom: '20px', color: '#121212' }}>
          Recent Pending Orders
        </h2>

        {pendingOrders.length === 0 ? (
          <p style={{ color: '#666', margin: '0' }}>No pending orders</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingOrders.map((order, index) => {
              const isExpanded = expandedOrder === order.id
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
                  {/* Header */}
                  <div
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                    style={{
                      padding: '20px',
                      cursor: 'pointer',
                      display: 'grid',
                      gridTemplateColumns: 'auto auto 1fr auto auto auto',
                      gap: '16px',
                      alignItems: 'center',
                      backgroundColor: '#f9f9f9',
                    }}
                  >
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0066FF', minWidth: '30px' }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    
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
                      backgroundColor: '#FFF3CD',
                      color: '#856404',
                      fontSize: '12px',
                      fontWeight: '600',
                      whiteSpace: 'nowrap'
                    }}>
                      Pending
                    </div>

                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
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

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{
                      padding: '20px',
                      borderTop: '1px solid #eee',
                      backgroundColor: '#fafafa'
                    }}>
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
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '12px'
                          }}>
                            {order.cartItems.map((item, idx) => (
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
                                  {item.title}
                                </div>
                                {item.category && (
                                  <div style={{
                                    fontSize: '13px',
                                    color: '#666',
                                    marginBottom: '8px'
                                  }}>
                                    {item.category}
                                  </div>
                                )}
                                <div style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '12px'
                                }}>
                                  <span style={{ color: '#0066FF', fontWeight: '600' }}>
                                    ₦{item.price?.toLocaleString ? item.price.toLocaleString() : item.price || 'N/A'}
                                  </span>
                                  {item.quantity && (
                                    <span style={{ color: '#999' }}>
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
                      {(order.postTitle || order.postBody || order.articleContent || order.fileName) && (
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
                          {order.postBody && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Post Body</div>
                              <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', maxHeight: '120px', overflow: 'auto' }}>
                                {order.postBody}
                              </div>
                            </div>
                          )}
                          {order.articleContent && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Content / Notes</div>
                              <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', maxHeight: '120px', overflow: 'auto' }}>
                                {order.articleContent}
                              </div>
                            </div>
                          )}
                          {order.fileName && (
                            <div style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>Uploaded File</div>
                              <div style={{ fontSize: '13px', color: '#0066FF', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px', wordBreak: 'break-all' }}>
                                📎 {order.fileName}
                              </div>
                            </div>
                          )}

                          {/* Display Images */}
                          {order.images && order.images.length > 0 && (
                            <div style={{ marginTop: '12px' }}>
                              <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Submitted Images ({order.images.length})</div>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                                gap: '12px'
                              }}>
                                {order.images.map((imagePath, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      position: 'relative',
                                      borderRadius: '6px',
                                      overflow: 'hidden',
                                      backgroundColor: '#f5f5f5',
                                      border: '1px solid #eee'
                                    }}
                                  >
                                    <img
                                      src={imagePath}
                                      alt={`Submission image ${idx + 1}`}
                                      style={{
                                        width: '100%',
                                        height: '120px',
                                        objectFit: 'cover',
                                        cursor: 'pointer'
                                      }}
                                      onClick={() => window.open(imagePath, '_blank')}
                                    />
                                    <div style={{
                                      position: 'absolute',
                                      top: '4px',
                                      right: '4px',
                                      backgroundColor: 'rgba(0,0,0,0.6)',
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontSize: '11px'
                                    }}>
                                      Image {idx + 1}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
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
      </div>

      {/* Quick Overview */}
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginTop: '0', marginBottom: '20px', color: '#121212' }}>
          Quick Overview
        </h2>
        <p style={{ color: '#666', lineHeight: '1.6', margin: '0' }}>
          Welcome to the Bluetick Admin Dashboard. Use the navigation menu on the left to manage users, shopping carts, orders, and article submissions. All data is displayed in real-time.
        </p>
      </div>
    </div>
  )
}

const StatCard = ({ icon: IconComponent, value, label, color, onClick }) => (
  <div 
    onClick={onClick}
    style={{ 
      backgroundColor: 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      border: `2px solid ${color}20`,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 102, 255, 0.15)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}>
    <div>
      <IconComponent size={32} style={{ color }} />
    </div>
    <div style={{ 
      fontSize: '24px', 
      fontWeight: '700', 
      color: color,
      margin: '0'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '14px',
      color: '#666',
      fontWeight: '500'
    }}>
      {label}
    </div>
  </div>
)
