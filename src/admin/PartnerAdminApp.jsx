import { useState, useEffect, useCallback } from 'react'
import { MdInventory2, MdAccessTime, MdCheckCircle, MdPayments, MdLogout, MdLanguage } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import { getOrderServiceLabel } from './utils/orderServices'
import './styles/admin.css'

const STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In Progress',
  pending: 'Pending',
  cancelled: 'Cancelled',
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatAmount(amount, currency = 'NGN') {
  if (amount == null) return '—'
  const symbol = currency === 'USD' ? '$' : currency === 'NGN' ? '₦' : `${currency} `
  return `${symbol}${Number(amount).toLocaleString()}`
}

function PartnerAdminApp({ subdomain }) {
  const { apiUrl } = useAuth()
  const tokenKey = `partnerAdminToken:${subdomain}`

  const [token, setToken] = useState(() => {
    return localStorage.getItem(tokenKey) || localStorage.getItem('adminToken')
  })
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogout = useCallback(() => {
    const activeToken = token
    localStorage.removeItem(tokenKey)
    if (activeToken && activeToken === localStorage.getItem('adminToken')) {
      localStorage.removeItem('adminToken')
    }
    setToken(null)
    setOverview(null)
  }, [token, tokenKey])

  const fetchOverview = useCallback(async () => {
    if (!token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${apiUrl}/api/partner-admin/overview?subdomain=${encodeURIComponent(subdomain)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const data = await response.json()

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          handleLogout()
          return
        }
        throw new Error(data.error || 'Failed to load dashboard')
      }

      setOverview(data)
    } catch (err) {
      console.error('Partner overview error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiUrl, token, handleLogout, subdomain])

  useEffect(() => {
    fetchOverview()
  }, [fetchOverview])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    try {
      let response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginData.username.trim(),
          password: loginData.password,
        }),
      })
      let data = await response.json()

      if (!response.ok) {
        response = await fetch(`${apiUrl}/api/partner-admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain, ...loginData }),
        })
        data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        if (data.isMainAdmin) {
          localStorage.setItem('adminToken', data.token)
        }
      } else {
        localStorage.setItem('adminToken', data.token)
      }

      localStorage.setItem(tokenKey, data.token)
      setToken(data.token)
      setLoginData({ username: '', password: '' })
    } catch (err) {
      setLoginError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const brandName = overview?.branding?.brandName || subdomain

  if (!token) {
    return (
      <div className="adm-login-wrap">
        <div className="adm-login-card">
          <div className="adm-login-badge">{subdomain.charAt(0).toUpperCase()}</div>
          <h1>Partner Dashboard</h1>
          <p className="adm-login-sub">
            Sign in to manage <strong>{subdomain}.bluetickgeng.com</strong>
          </p>

          <form onSubmit={handleLogin}>
            <div className="adm-login-field">
              <label htmlFor="partner-username">Email / Username</label>
              <input
                id="partner-username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="adm-login-field">
              <label htmlFor="partner-password">Password</label>
              <input
                id="partner-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Your dashboard password"
                required
              />
            </div>

            {loginError && <div className="adm-login-error">{loginError}</div>}

            <button type="submit" className="adm-btn adm-btn-primary adm-login-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="adm-login-sub" style={{ marginTop: 18, marginBottom: 0 }}>
            Use your partner dashboard credentials, or your main Bluetick admin login.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="adm-root">
      <div className="adm-main" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="adm-header">
          <div>
            <h1>{brandName} — Partner Dashboard</h1>
            <p className="adm-header-sub">Orders placed on your white-label site</p>
          </div>
          <button type="button" className="adm-btn adm-btn-danger" onClick={handleLogout}>
            <MdLogout size={17} />
            Sign out
          </button>
        </div>

        {loading ? (
          <div className="adm-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="adm-spinner" />
            <p style={{ color: 'var(--adm-text-soft)', margin: 0 }}>Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="adm-panel">
            <p style={{ color: '#b91c1c', marginTop: 0 }}>{error}</p>
            <button type="button" className="adm-btn adm-btn-primary" onClick={fetchOverview}>
              Try Again
            </button>
          </div>
        ) : overview ? (
          <>
            <div className="adm-panel adm-site-card">
              <div>
                <div className="adm-detail-label">Your site</div>
                <a
                  className="adm-site-url"
                  href={overview.site.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MdLanguage size={15} style={{ verticalAlign: '-2px', marginRight: 5 }} />
                  {overview.site.siteUrl}
                </a>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span className="adm-badge live">Site Live</span>
                <span className="adm-badge neutral">
                  {overview.site.partnershipType === 'both'
                    ? 'White-Label + Referral'
                    : overview.site.partnershipType === 'white-label'
                      ? 'White-Label Partner'
                      : 'Referral Partner'}
                </span>
              </div>
            </div>

            <div className="adm-stats-grid">
              <StatCard icon={MdInventory2} value={overview.stats.totalOrders} label="Total Orders" />
              <StatCard icon={MdAccessTime} value={overview.stats.pending + overview.stats.inProgress} label="In Progress" />
              <StatCard icon={MdCheckCircle} value={overview.stats.completed} label="Completed" />
              <StatCard icon={MdPayments} value={formatAmount(overview.stats.totalRevenue)} label="Total Revenue" />
            </div>

            <div className="adm-panel">
              <h2>Orders on Your Site</h2>

              {overview.orders.length === 0 ? (
                <div className="adm-empty" style={{ border: 'none' }}>
                  <div className="adm-empty-emoji">🛍️</div>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, color: 'var(--adm-text)' }}>No orders yet</p>
                  <p style={{ margin: 0 }}>
                    Share your site link with your audience — orders placed there will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="adm-card-grid">
                  {overview.orders.map((order) => (
                    <div key={order.id} className="adm-card">
                      <div className="adm-card-top">
                        <h3 className="adm-card-title">{order.email}</h3>
                        <span className={`adm-badge ${order.status}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                      <div className="adm-card-services">{getOrderServiceLabel(order)}</div>
                      <div className="adm-card-foot">
                        <div>
                          <div className="adm-card-amount">
                            {formatAmount(order.totalAmount, order.currency)}
                          </div>
                          <div className="adm-card-date">{formatDate(order.createdAt)}</div>
                        </div>
                        <span className={`adm-badge ${order.paymentStatus === 'paid' ? 'completed' : 'pending'}`}>
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

const StatCard = ({ icon: IconComponent, value, label }) => (
  <div className="adm-stat-card" style={{ cursor: 'default' }}>
    <div className="adm-stat-icon">
      <IconComponent size={24} />
    </div>
    <div className="adm-stat-value">{value}</div>
    <div className="adm-stat-label">{label}</div>
  </div>
)

export default PartnerAdminApp
