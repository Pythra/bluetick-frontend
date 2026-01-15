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
            {pendingOrders.map((order) => {
              const isExpanded = expandedOrder === order.id
              return (
                <div
                  key={order.id}
                  style={{
                    padding: '16px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '6px',
                    border: '1px solid #eee',
                  }}
                >
                  {/* Header Row */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: isExpanded ? '16px' : '0',
                    paddingBottom: isExpanded ? '16px' : '0',
                    borderBottom: isExpanded ? '1px solid #eee' : 'none'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: '#121212', marginBottom: '8px' }}>
                        {order.userName}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                        📱 {order.userPhone}
                      </div>
                      <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                        ✉️ {order.userEmail}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0066FF', marginBottom: '4px' }}>
                        {order.cartItems && order.cartItems.length > 0 
                          ? order.cartItems.map(item => item.title).join(', ')
                          : order.productName}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                        {formatDate(order.createdAt)}
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
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                      <div>
                        <span style={{ fontWeight: '600', color: '#666' }}>Order ID:</span>
                        <span style={{ color: '#333', marginLeft: '8px' }}>#{order.id.slice(-8)}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#666' }}>Amount:</span>
                        <span style={{ color: '#0066FF', fontWeight: '700', marginLeft: '8px' }}>
                          {order.currency === 'USD' ? '$' : '₦'}{order.totalAmount?.toLocaleString() || order.productPrice}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: '600', color: '#666' }}>Status:</span>
                        <span style={{ 
                          marginLeft: '8px',
                          padding: '4px 8px',
                          backgroundColor: '#FFF3CD',
                          color: '#856404',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          Pending
                        </span>
                      </div>
                      {(order.postTitle || order.postBody) && (
                        <div>
                          <span style={{ fontWeight: '600', color: '#666' }}>Post Title:</span>
                          <span style={{ color: '#333', marginLeft: '8px' }}>
                            {order.postTitle || 'N/A'}
                          </span>
                        </div>
                      )}
                      {order.articleContent && (
                        <div>
                          <span style={{ fontWeight: '600', color: '#666' }}>Notes:</span>
                          <div style={{ color: '#333', marginTop: '4px', padding: '8px', backgroundColor: 'white', borderRadius: '4px', maxHeight: '100px', overflow: 'auto' }}>
                            {order.articleContent}
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
