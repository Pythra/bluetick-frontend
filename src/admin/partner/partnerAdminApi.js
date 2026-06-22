export function createPartnerAdminApi(apiUrl, subdomain, token) {
  const base = `${apiUrl}/api/partner-admin`;
  const qs = `subdomain=${encodeURIComponent(subdomain)}`;

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  async function request(path, options = {}) {
    const url = `${base}${path}${path.includes('?') ? '&' : '?'}${qs}`;
    const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.error || `Request failed (${response.status})`;
      throw new Error(message);
    }
    return data;
  }

  return {
    getDashboard: () => request('/dashboard'),
    getServices: () => request('/services'),
    updateServices: (pricing) =>
      request('/services', { method: 'PATCH', body: JSON.stringify({ pricing }) }),
    getClients: () => request('/clients'),
    getMessages: () => request('/messages'),
    getUnreadCount: () => request('/messages/unread-count'),
    getThread: (threadId) => request(`/messages/${threadId}`),
    markThreadRead: (threadId) => request(`/messages/${threadId}/read`, { method: 'PATCH' }),
    sendMessage: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
    getEarnings: () => request('/earnings'),
    getPayoutMethods: () => request('/payout-methods'),
    savePayoutMethod: (method) =>
      request('/payout-methods', { method: 'POST', body: JSON.stringify(method) }),
    deletePayoutMethod: (methodId) =>
      request(`/payout-methods/${methodId}`, { method: 'DELETE' }),
    getWithdrawals: () => request('/withdrawals'),
    requestWithdrawal: (payload) =>
      request('/withdrawals', { method: 'POST', body: JSON.stringify(payload) }),
    getInvoices: () => request('/invoices'),
    getNotifications: () => request('/notifications'),
    markNotificationRead: (id) =>
      request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllNotificationsRead: () =>
      request('/notifications/read-all', { method: 'POST' }),
    getSettings: () => request('/settings'),
    updateSettings: (payload) =>
      request('/settings', { method: 'PATCH', body: JSON.stringify(payload) }),
    submitKyc: (payload) =>
      request('/kyc', { method: 'POST', body: JSON.stringify(payload) }),
    submitSupport: (payload) =>
      request('/support', { method: 'POST', body: JSON.stringify(payload) }),
    getAnalytics: () => request('/analytics'),
    getProgressReport: () => request('/reports/progress'),
    updateOrderTracking: (orderId, payload) =>
      request(`/orders/${orderId}/tracking`, { method: 'PATCH', body: JSON.stringify(payload) }),
  };
}
