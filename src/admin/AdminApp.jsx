import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { CartManagement } from './pages/CartManagement'
import { OrderManagement } from './pages/OrderManagement'
import { SubmissionManagement } from './pages/SubmissionManagement'
import { useAuth } from '../contexts/AuthContext'

function AdminApp() {
  const { apiUrl } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))

  // Check if admin is already logged in
  useEffect(() => {
    if (adminToken) {
      setIsLoggedIn(true)
      fetchUsers()
    }
  }, [adminToken])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    try {
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      if (data.success) {
        const token = data.token
        localStorage.setItem('adminToken', token)
        setAdminToken(token)
        setIsLoggedIn(true)
        setLoginData({ username: '', password: '' })
        fetchUsers()
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoginError(err.message)
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setIsLoggedIn(false)
    setUsers([])
    setActiveTab('dashboard')
    setLoginData({ username: '', password: '' })
  }

  const fetchUsers = useCallback(async () => {
    if (!adminToken) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${apiUrl}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          handleLogout()
          return
        }
        throw new Error(data.error || 'Failed to fetch users')
      }

      if (data.success) {
        // Sort orders by creation date (newest first) for each user
        const usersWithSortedOrders = (data.users || []).map(user => ({
          ...user,
          orders: user.orders?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || []
        }))
        setUsers(usersWithSortedOrders)
      } else {
        throw new Error('Failed to fetch users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [apiUrl, adminToken])

  const handleTabChange = (tabId) => {
    if (tabId === 'signout') {
      handleLogout()
    } else {
      setActiveTab(tabId)
    }
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    // Update the order status in the local state
    setUsers(prevUsers => 
      prevUsers.map(user => ({
        ...user,
        orders: user.orders?.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        ) || []
      }))
    )
    console.log(`Order ${orderId} updated to status: ${newStatus}`)
  }

  // Login screen
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f5f7',
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              backgroundColor: '#0066FF',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              margin: '0 auto 20px'
            }}>
              B
            </div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#121212',
              margin: '0 0 8px'
            }}>
              Bluetick Admin
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0'
            }}>
              Sign in to your admin account
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#121212',
                marginBottom: '8px'
              }}>
                Username
              </label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Enter admin username"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#121212',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {loginError && (
              <div style={{
                padding: '12px',
                backgroundColor: '#FFEBEE',
                color: '#C62828',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '20px',
                border: '1px solid #EF5350'
              }}>
                ⚠️ {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#0066FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loginLoading ? 'not-allowed' : 'pointer',
                opacity: loginLoading ? 0.6 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main dashboard
  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Admin Dashboard',
      'users': 'User Management',
      'carts': 'Shopping Carts',
      'orders': 'Orders',
      'submissions': 'Article Submissions'
    }
    return titles[activeTab] || 'Dashboard'
  }

  // Prepare cart and order data
  const cartData = users
    .filter(u => u.cart?.items?.length > 0)
    .map(u => ({ ...u.cart, userId: u.id }))

  const orderData = users
    .flatMap(u => u.orders || [])

  const submissionData = users
    .flatMap(u => (u.orders || []).filter(o => o.postTitle || o.postBody || o.articleContent || o.fileName))

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f3f5f7',
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="admin-content" style={{ 
        flex: '1', 
        padding: '24px',
        overflow: 'auto',
        width: '100%',
        minWidth: 0
      }}>
      <style>{`
        @media (max-width: 768px) {
          .admin-content {
            padding: 12px !important;
            padding-top: 60px !important;
            width: 100% !important;
            overflow-x: hidden !important;
          }
        }
      `}</style>
        <Header title={getPageTitle()} onSignout={handleLogout} onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)} />

        {loading ? (
          <div style={{
            backgroundColor: 'white',
            padding: '48px 24px',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #0066FF20',
              borderTop: '4px solid #0066FF',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#666', fontSize: '14px' }}>Loading data...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #FFCDD2'
          }}>
            <div style={{ color: '#C62828', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
            <button
              onClick={fetchUsers}
              style={{
                padding: '10px 16px',
                backgroundColor: '#0066FF',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Try Again
            </button>
          </div>
        ) : activeTab === 'dashboard' ? (
          <Dashboard users={users} carts={cartData} orders={orderData} submissions={submissionData} onNavigateToTab={handleTabChange} />
        ) : activeTab === 'users' ? (
          <UserManagement users={users} />
        ) : activeTab === 'carts' ? (
          <CartManagement users={users} />
        ) : activeTab === 'orders' ? (
          <OrderManagement users={users} onUpdateOrder={handleUpdateOrderStatus} />
        ) : activeTab === 'submissions' ? (
          <SubmissionManagement users={users} />
        ) : null}
      </div>
    </div>
  )
}

export default AdminApp
