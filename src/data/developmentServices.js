import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

export const appDevelopmentServices = toServiceListEntries(getPackagesByGroup('app-packages'));

export const websiteDevelopmentServices = toServiceListEntries(getPackagesByGroup('website-packages'));

export const publicationAddonServices = toServiceListEntries(getPackagesByGroup('publication-addons'));
