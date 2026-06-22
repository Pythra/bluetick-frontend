import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

export const streamingPlatformVerifications = toServiceListEntries(
  getPackagesByGroup('music-streaming')
);

export const musicProfilePlacements = toServiceListEntries(getPackagesByGroup('music-profile'));

export const musicStreamingVerificationNotice = {
  lead: 'All listed streaming and music platforms are supported.',
  body:
    'Prices cover the full verification process from start to finish. Our team handles profile setup, eligibility requirements, distributor coordination, and platform approval so your artist profile appears official across every major streaming service.',
};
