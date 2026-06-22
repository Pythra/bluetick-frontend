import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

export const monetizationPackages = toServiceListEntries(getPackagesByGroup('monetization-packages'));

export const monetizationSetupServices = toServiceListEntries(getPackagesByGroup('monetization-setup'));

export const monetizationImportantNotice = {
  lead: 'All listed platforms support monetization services.',
  body:
    'The prices listed above cover the complete monetization process from start to finish. Even if your account has not yet met the monetization requirements, our team will handle everything needed to achieve approval, including watch hours, followers, engagement, views, eligibility requirements, payout setup, and every other requirement necessary for successful monetization.',
};
