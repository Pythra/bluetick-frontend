import { isBluetickMainHost } from './partnerSubdomain';

/** Flip to false when the main site should go live again. */
export const MAIN_SITE_MAINTENANCE_ACTIVE = true;

export function isMainSiteMaintenanceMode() {
  return MAIN_SITE_MAINTENANCE_ACTIVE;
}

export function shouldShowMainSiteMaintenance(hostname = window.location.hostname) {
  return isBluetickMainHost(hostname) && isMainSiteMaintenanceMode();
}
