import { getPackagesByGroup, PARTNER_PACKAGE_CATALOG } from './partnerPackageCatalog';

function getPackageEntry(packageId) {
  return PARTNER_PACKAGE_CATALOG.find((entry) => entry.id === packageId);
}

export const wikipediaPagePackages = ['wikipedia.individual', 'wikipedia.company'].map((packageId) => {
  const entry = getPackageEntry(packageId);
  return {
    id: entry.id,
    packageId: entry.id,
    title: entry.label,
    price: entry.basePriceNgn,
    delivery: '48 Hours',
    deliveryTime: '48 Hours',
    description: packageId === 'wikipedia.individual'
      ? 'Professional Wikipedia page creation for individuals with comprehensive content development and quality assurance.'
      : 'Specialized Wikipedia page creation for businesses and organizations with stricter notability and sourcing requirements.',
    features: packageId === 'wikipedia.individual'
      ? [
          'Content creation and publication',
          'Up to 12 news publications',
          'Content review and compliance',
          'Quality assurance',
          'Wikipedia standards compliance',
          'Professional page layout',
        ]
      : [
          'Comprehensive content creation',
          'Up to 12 high-quality publications',
          'Detailed business coverage',
          'Company achievement highlights',
          'Advanced content review',
          'Wikipedia compliance verification',
          'Media sourcing support',
          'Notability assessment',
        ],
  };
});

export const wikipediaScopeItems = [
  {
    title: 'News Publications',
    meta: 'Scope · Step 01',
    description:
      'Creation and publication of up to 12 news publications tailored to meet Wikipedia’s notability and reliable-source requirements.',
  },
  {
    title: 'Content Review',
    meta: 'Scope · Step 02',
    description:
      'Existing publications are reviewed to align with Wikipedia guidelines, improving the chance your page is accepted.',
  },
  {
    title: 'Quality Assurance',
    meta: 'Scope · Step 03',
    description:
      'Additional articles are produced to high editorial standards so content meets Wikipedia quality and notability thresholds.',
  },
];

export const googleKnowledgePanelPackages = ['google-knowledge.individual', 'google-knowledge.company'].map(
  (packageId) => {
    const entry = getPackageEntry(packageId);
    const isIndividual = packageId === 'google-knowledge.individual';
    return {
      id: entry.id,
      packageId: entry.id,
      title: entry.label,
      price: entry.basePriceNgn,
      delivery: '7 to 30 Days',
      deliveryTime: '7 to 30 Days',
      description: isIndividual
        ? 'Enhance personal credibility with a Google Knowledge Panel alongside your Wikipedia presence.'
        : 'Establish your brand in Google search with a Knowledge Panel built to complement your Wikipedia page.',
    };
  }
);

export const wikipediaServiceNotice = {
  lead: 'Our Wikipedia services provide a comprehensive approach to building credible encyclopedia pages.',
  body:
    'Each package includes content development, publication strategy, editorial review, and quality assurance to maximize approval success on Wikipedia.',
};
