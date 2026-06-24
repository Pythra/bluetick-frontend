/** Flip to false when the site should go live again. */
export const SITE_MAINTENANCE_ACTIVE = true;

export function isSiteMaintenanceMode() {
  return SITE_MAINTENANCE_ACTIVE;
}

export function shouldShowSiteMaintenance(hostname = window.location.hostname) {
  if (!isSiteMaintenanceMode()) {
    return false;
  }

  const normalizedHost = hostname.trim().toLowerCase();
  if (normalizedHost === 'localhost' || normalizedHost === '127.0.0.1') {
    return false;
  }

  return true;
}

/** @deprecated Use shouldShowSiteMaintenance */
export function shouldShowMainSiteMaintenance(hostname) {
  return shouldShowSiteMaintenance(hostname);
}
