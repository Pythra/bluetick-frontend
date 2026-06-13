import { useState } from 'react'
import '../styles/admin.css'

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
      <div className="adm-toolbar">
        <input
          type="text"
          className="adm-input"
          placeholder="Search by user name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <div className="adm-empty">
          <div className="adm-empty-emoji">🛒</div>
          <p>{searchTerm ? 'No matching carts found' : 'No active carts'}</p>
        </div>
      ) : (
        <div className="adm-card-grid">
          {filteredUsers.map((user) => {
            const cartTotal = calculateCartTotal(user.cart.items)
            return (
              <div key={user.id} className="adm-card">
                <div className="adm-card-top">
                  <h3 className="adm-card-title">{user.firstName} {user.lastName}</h3>
                  <span className="adm-badge neutral">
                    {user.cart.items.length} item{user.cart.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <p className="adm-card-meta"><span>{user.email}</span></p>

                <div className="adm-item-grid">
                  {user.cart.items.map((item, idx) => (
                    <div key={idx} className="adm-item-card">
                      <div className="adm-item-card-title">{item.title}</div>
                      {item.category && <div className="adm-item-card-cat">{item.category}</div>}
                      <div className="adm-item-card-row">
                        <span className="adm-item-card-price">{item.price}</span>
                        <span className="adm-item-card-qty">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="adm-card-foot">
                  <div className="adm-card-amount">
                    ₦{cartTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                  {user.cart.updatedAt && (
                    <span className="adm-card-date">Updated {formatDate(user.cart.updatedAt)}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="adm-count-note">
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} with active carts out of {users.length} total users
      </div>
    </div>
  )
}
