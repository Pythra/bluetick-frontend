import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { useToast, ToastProvider } from '../contexts/ToastContext'
import KycReviewModal from './components/KycReviewModal'
import { Dashboard } from './pages/Dashboard'
import { UserManagement } from './pages/UserManagement'
import { CartManagement } from './pages/CartManagement'
import { OrderManagement } from './pages/OrderManagement'
import { SubmissionManagement } from './pages/SubmissionManagement'
import { BlogManagement } from './pages/BlogManagement'
import { EmailBroadcast } from './pages/EmailBroadcast'
import { PartnershipManagement } from './pages/PartnershipManagement'
import AdminMessages from './pages/AdminMessages'
import AdminReports from './pages/AdminReports'
import AdminInvoicesTab from './pages/AdminInvoicesTab'
import MainServicesPricingTab from './pages/MainServicesPricingTab'
import PartnerAdminApp from './PartnerAdminApp'
import AdminMessagesFab from '../components/AdminMessagesFab'
import { useAuth } from '../contexts/AuthContext'
import { getPartnerSubdomainFromHost } from '../utils/partnerSubdomain'
import './styles/admin.css'
import './styles/partnerDashboard.css'

function AdminApp() {
  const { apiUrl } = useAuth()
  const { showToast, confirm } = useToast()
  const [searchParams] = useSearchParams()
  const partnerSubdomain = useMemo(() => getPartnerSubdomainFromHost(), [])

  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ username: '', password: '' })
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  const [users, setUsers] = useState([])
  const [broadcastAudience, setBroadcastAudience] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [saveMessage, setSaveMessage] = useState(null)
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'))

  const handleLogout = useCallback(async (requireConfirmation = true) => {
    if (requireConfirmation) {
      const shouldLogout = await confirm({
        title: 'Log out',
        message: 'Are you sure you want to log out?',
      })
      if (!shouldLogout) {
        return
      }
    }

    localStorage.removeItem('adminToken')
    setAdminToken(null)
    setIsLoggedIn(false)
    setUsers([])
    setActiveTab('dashboard')
    setLoginData({ username: '', password: '' })
    showToast({ message: 'Logged out successfully', type: 'success' })
  }, [confirm, showToast])

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
          handleLogout(false)
          return
        }
        throw new Error(data.error || 'Failed to fetch users')
      }

      if (data.success) {
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
  }, [apiUrl, adminToken, handleLogout])

  const fetchBroadcastAudience = useCallback(async () => {
    if (!adminToken) return

    try {
      const response = await fetch(`${apiUrl}/api/admin/broadcast-audience`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          handleLogout(false)
          return
        }
        throw new Error(data.error || 'Failed to fetch broadcast audience')
      }

      if (data.success) {
        setBroadcastAudience(data.clients || [])
      }
    } catch (err) {
      console.error('Error fetching broadcast audience:', err)
      setBroadcastAudience([])
    }
  }, [apiUrl, adminToken, handleLogout])

  useEffect(() => {
    if (adminToken && !partnerSubdomain) {
      setIsLoggedIn(true)
      fetchUsers()
    }
  }, [adminToken, partnerSubdomain, fetchUsers])

  useEffect(() => {
    if (adminToken && !partnerSubdomain && activeTab === 'broadcast') {
      fetchBroadcastAudience()
    }
  }, [adminToken, partnerSubdomain, activeTab, fetchBroadcastAudience])

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'partnerships' && adminToken && !partnerSubdomain) {
      setActiveTab('partnerships')
    }
  }, [searchParams, adminToken, partnerSubdomain])

  // Partner subdomains get their own white-label dashboard
  if (partnerSubdomain) {
    return (
      <ToastProvider>
        <PartnerAdminApp subdomain={partnerSubdomain} />
      </ToastProvider>
    )
  }

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

  const handleTabChange = (tabId) => {
    if (tabId === 'signout') {
      handleLogout()
    } else {
      setActiveTab(tabId)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const response = await fetch(`${apiUrl}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update order status')
    }

    setUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        orders: user.orders?.map(order =>
          order.id === orderId
            ? { ...order, status: data.order.status, projectStatus: data.order.projectStatus }
            : order
        ) || []
      }))
    )
  }

  const handleUpdateOrderTracking = async (orderId, payload) => {
    const response = await fetch(`${apiUrl}/api/admin/orders/${orderId}/tracking`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update order tracking')
    }

    setUsers(prevUsers =>
      prevUsers.map(user => ({
        ...user,
        orders: user.orders?.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: data.order.status,
                projectStatus: data.order.projectStatus,
                tracking: data.order.tracking,
              }
            : order
        ) || []
      }))
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="adm-login-wrap">
        <div className="adm-login-card">
          <div className="adm-login-badge">B</div>
          <h1>Bluetick Admin</h1>
          <p className="adm-login-sub">Sign in to your admin account</p>

          <form onSubmit={handleLogin}>
            <div className="adm-login-field">
              <label htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="adm-login-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Enter admin password"
                required
              />
            </div>

            {loginError && <div className="adm-login-error">{loginError}</div>}

            <button type="submit" className="adm-btn adm-btn-primary adm-login-btn" disabled={loginLoading}>
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const getPageTitle = () => {
    const titles = {
      'dashboard': 'Admin Dashboard',
      'users': 'User Management',
      'carts': 'Shopping Carts',
      'orders': 'Orders',
      'services': 'Services',
      'invoices': 'Invoices',
      'submissions': 'Article Submissions',
      'partnerships': 'Partnership Applications',
      'messages': 'Messages',
      'reports': 'Progress Reports',
      'blog': 'Blog Management',
      'broadcast': 'Email Broadcast',
    }
    return titles[activeTab] || 'Dashboard'
  }

  const cartData = users
    .filter(u => u.cart?.items?.length > 0)
    .map(u => ({ ...u.cart, userId: u.id }))

  const orderData = users
    .flatMap(u => u.orders || [])

  const submissionData = users
    .flatMap(u => (u.orders || []).filter(o => o.postTitle || o.postBody || o.articleContent || o.fileName))

  return (
    <div className="adm-root">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        brandName="Bluetick"
        brandSub="Admin Panel"
      />

      <div className="adm-main">
        <Header title={getPageTitle()} onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)} />

        {loading ? (
          <div className="adm-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="adm-spinner" />
            <p style={{ color: 'var(--adm-text-soft)', margin: 0 }}>Loading data...</p>
          </div>
        ) : error ? (
          <div className="adm-panel">
            <p style={{ color: '#b91c1c', marginTop: 0 }}>{error}</p>
            <button type="button" className="adm-btn adm-btn-primary" onClick={fetchUsers}>
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
          <OrderManagement
            users={users}
            onUpdateOrder={handleUpdateOrderStatus}
            onUpdateTracking={handleUpdateOrderTracking}
          />
        ) : activeTab === 'services' ? (
          <>
            {saveMessage ? (
              <div className={`pdash-alert ${saveMessage.type}`}>{saveMessage.text}</div>
            ) : null}
            <MainServicesPricingTab
              apiUrl={apiUrl}
              adminToken={adminToken}
              onMessage={setSaveMessage}
            />
          </>
        ) : activeTab === 'invoices' ? (
          <AdminInvoicesTab users={users} />
        ) : activeTab === 'submissions' ? (
          <SubmissionManagement users={users} />
        ) : activeTab === 'partnerships' ? (
          <PartnershipManagement apiUrl={apiUrl} adminToken={adminToken} />
        ) : activeTab === 'messages' ? (
          <AdminMessages apiUrl={apiUrl} adminToken={adminToken} />
        ) : activeTab === 'reports' ? (
          <AdminReports apiUrl={apiUrl} adminToken={adminToken} />
        ) : activeTab === 'blog' ? (
          <BlogManagement apiUrl={apiUrl} adminToken={adminToken} />
        ) : activeTab === 'broadcast' ? (
          <EmailBroadcast
            apiUrl={apiUrl}
            adminToken={adminToken}
            users={broadcastAudience}
            recipientNoun="main-site user"
          />
        ) : null}
      </div>

      <AdminMessagesFab apiUrl={apiUrl} token={adminToken} mode="admin" refreshKey={activeTab} />
      {isLoggedIn ? (
        <KycReviewModal apiUrl={apiUrl} adminToken={adminToken} />
      ) : null}
    </div>
  )
}

export default AdminApp
