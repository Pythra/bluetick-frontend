/** Flip to false when the site should go live again. */
export const MAIN_SITE_MAINTENANCE_ACTIVE = true;

export function isMainSiteMaintenanceMode() {
  return MAIN_SITE_MAINTENANCE_ACTIVE;
}

function isLocalDevHost(hostname) {
  const normalized = hostname.trim().toLowerCase();
  return normalized === 'localhost' || normalized === '127.0.0.1';
}

export function shouldShowMainSiteMaintenance(hostname = window.location.hostname) {
  return isMainSiteMaintenanceMode() && !isLocalDevHost(hostname);
}
