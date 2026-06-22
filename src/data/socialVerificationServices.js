import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

export const nonNotableVerificationServices = toServiceListEntries(
  getPackagesByGroup('verification-non-notable')
);

export const notableVerificationServices = toServiceListEntries(
  getPackagesByGroup('verification-notable')
);

export const metaSubscriptionService = (() => {
  const [entry] = toServiceListEntries(getPackagesByGroup('verification-meta'));
  return {
    ...entry,
    description:
      'Monthly Meta subscription with valid ID support for verification purposes on Facebook, Instagram, X (Twitter), and WhatsApp Business.',
  };
})();

export const verificationTierNotes = {
  nonNotable: {
    lead:
      'For accounts without existing press coverage. Includes five online newspaper publications to establish notability.',
    permanent: 'Permanent verification (not a Meta subscription).',
  },
  notable: {
    lead: 'For accounts that already have qualifying online media coverage and publication history.',
    permanent: 'Permanent verification (not a Meta subscription).',
  },
};
