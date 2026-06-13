import { useState } from 'react'
import '../styles/admin.css'

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
      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Search users by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select className="adm-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {sortedUsers.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-emoji">👥</div>
          <p>No users found</p>
        </div>
      ) : (
        <div className="adm-card-grid">
          {sortedUsers.map((user) => (
            <div key={user.id} className="adm-card">
              <div className="adm-card-top">
                <h3 className="adm-card-title">{user.firstName} {user.lastName}</h3>
                <span className="adm-badge live">Active</span>
              </div>
              <p className="adm-card-meta"><span>{user.email}</span></p>
              <p className="adm-card-meta"><span>{user.phone}</span></p>
              <div className="adm-card-foot">
                <span className="adm-card-date">Joined {formatDate(user.createdAt)}</span>
                <span className="adm-card-date">ID: {user.id.slice(-8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="adm-count-note">
        Showing {sortedUsers.length} of {users.length} users
      </div>
    </div>
  )
}
