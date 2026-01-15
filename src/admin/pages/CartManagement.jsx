import React, { useState } from 'react'

export const CartManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('')

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

  // Get users with active carts
  const usersWithCarts = users.filter(user => 
    user.cart?.items && user.cart.items.length > 0
  )

  const filteredUsers = usersWithCarts.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const calculateCartTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, '')) || 0
      const qty = item.quantity || 1
      return total + (price * qty)
    }, 0)
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
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontFamily: 'inherit'
          }}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛒</div>
          <p>{searchTerm ? 'No matching carts found' : 'No active carts'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredUsers.map((user) => {
            const cartTotal = calculateCartTotal(user.cart.items)
            return (
              <div
                key={user.id}
                style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #eee',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}>
                  <div style={{ minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: '600', color: '#121212' }}>
                      {user.firstName} {user.lastName}
                    </h3>
                    <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                      {user.email}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#0066FF'
                    }}>
                      ₦{cartTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {user.cart.items.length} item{user.cart.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px'
                }}>
                  {user.cart.items.map((item, idx) => (
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
                      <div style={{
                        fontSize: '13px',
                        color: '#666',
                        marginBottom: '8px'
                      }}>
                        {item.category}
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px'
                      }}>
                        <span style={{ color: '#0066FF', fontWeight: '600' }}>
                          {item.price}
                        </span>
                        <span style={{ color: '#999' }}>
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {user.cart.updatedAt && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    Last updated: {formatDate(user.cart.updatedAt)}
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
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} with active carts out of {users.length} total users
      </div>
    </div>
  )
}
