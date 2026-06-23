import { useCallback, useMemo } from 'react';

export function createMainAdminPricingApi(apiUrl, adminToken) {
  const request = async (path, options = {}) => {
    const response = await fetch(`${apiUrl}/api/admin/package-pricing${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
        ...(options.headers || {}),
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }
    return data;
  };

  return {
    getServices: () => request(''),
    updateServices: (pricing) =>
      request('', {
        method: 'PATCH',
        body: JSON.stringify({ pricing }),
      }),
  };
}

export function useMainAdminPricingApi(apiUrl, adminToken) {
  return useMemo(
    () => (adminToken ? createMainAdminPricingApi(apiUrl, adminToken) : null),
    [apiUrl, adminToken]
  );
}
