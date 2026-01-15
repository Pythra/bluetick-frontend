import React, { useState } from 'react'

export const UserManagement = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

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

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt)
    } else if (sortBy === 'name') {
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
    }
    return 0
  })

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
          placeholder="Search users by name, email or phone..."
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '14px',
            fontFamily: 'inherit',
            cursor: 'pointer'
          }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {sortedUsers.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          padding: '48px 24px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
          <p>No users found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 102, 255, 0.15)'
                e.currentTarget.style.transform = 'translateX(4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                e.currentTarget.style.transform = 'translateX(0)'
              }}
            >
              <div style={{ flex: '1' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#121212' }}>
                  {user.firstName} {user.lastName}
                </h3>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  📧 {user.email}
                </p>
                <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                  📱 {user.phone}
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#999' }}>
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 0 0 24px',
                borderLeft: '1px solid #eee'
              }}>
                <div style={{
                  textAlign: 'right'
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '4px'
                  }}>
                    ID: {user.id.slice(-8)}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    backgroundColor: '#0066FF20',
                    color: '#0066FF',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Active
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        Showing {sortedUsers.length} of {users.length} users
      </div>
    </div>
  )
}
