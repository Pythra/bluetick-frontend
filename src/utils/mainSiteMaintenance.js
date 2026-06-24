import { isBluetickMainHost } from './partnerSubdomain';

export function isMainSiteMaintenanceMode() {
  return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
}

export function shouldShowMainSiteMaintenance(hostname = window.location.hostname) {
  return isBluetickMainHost(hostname) && isMainSiteMaintenanceMode();
}
