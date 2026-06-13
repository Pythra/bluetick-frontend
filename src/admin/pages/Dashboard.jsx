import { MdPeople, MdShoppingCart, MdInventory2, MdArticle } from 'react-icons/md'
import '../styles/admin.css'

export const Dashboard = ({ users, carts, orders, submissions, onNavigateToTab }) => {
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

  const orderServices = (order) =>
    order.cartItems && order.cartItems.length > 0
      ? order.cartItems.map((item) => item.title).join(', ')
      : order.productName

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
    .slice(0, 6)

  return (
    <div>
      <div className="adm-stats-grid">
        <StatCard icon={MdPeople} value={formatNumber(users.length)} label="Total Users" onClick={() => onNavigateToTab?.('users')} />
        <StatCard icon={MdShoppingCart} value={formatNumber(carts.length)} label="Active Carts" onClick={() => onNavigateToTab?.('carts')} />
        <StatCard icon={MdInventory2} value={formatNumber(orders.length)} label="Total Orders" onClick={() => onNavigateToTab?.('orders')} />
        <StatCard icon={MdArticle} value={formatNumber(submissions.length)} label="Submissions" onClick={() => onNavigateToTab?.('submissions')} />
      </div>

      <div className="adm-panel">
        <h2>Recent Pending Orders</h2>

        {pendingOrders.length === 0 ? (
          <p style={{ color: 'var(--adm-text-soft)', margin: 0 }}>No pending orders</p>
        ) : (
          <div className="adm-card-grid">
            {pendingOrders.map((order) => (
              <div key={order.id} className="adm-card">
                <div className="adm-card-top">
                  <h3 className="adm-card-title">{order.userName}</h3>
                  <span className="adm-badge pending">Pending</span>
                </div>
                <p className="adm-card-meta"><span>{order.userEmail}</span></p>
                <p className="adm-card-meta"><span>{order.userPhone}</span></p>
                <div className="adm-card-services">{orderServices(order)}</div>
                <div className="adm-card-foot">
                  <span className="adm-card-date">{formatDate(order.createdAt)}</span>
                  <button
                    type="button"
                    className="adm-btn adm-btn-ghost"
                    onClick={() => onNavigateToTab?.('orders')}
                  >
                    View Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="adm-panel">
        <h2>Quick Overview</h2>
        <p style={{ color: 'var(--adm-text-soft)', lineHeight: 1.65, margin: 0 }}>
          Welcome to the admin dashboard. Use the navigation menu to manage users,
          shopping carts, orders, and article submissions. All data is displayed in real-time.
        </p>
      </div>
    </div>
  )
}

const StatCard = ({ icon: IconComponent, value, label, onClick }) => (
  <div className="adm-stat-card" onClick={onClick}>
    <div className="adm-stat-icon">
      <IconComponent size={24} />
    </div>
    <div className="adm-stat-value">{value}</div>
    <div className="adm-stat-label">{label}</div>
  </div>
)
