import { getPackagesByGroup, toServiceListEntries, PARTNER_PACKAGE_CATALOG } from './partnerPackageCatalog';

function getPackageEntry(packageId) {
  return PARTNER_PACKAGE_CATALOG.find((entry) => entry.id === packageId);
}

export const tiktokSongClaimService = (() => {
  const entry = getPackageEntry('tiktok.song-claim');
  return {
    id: entry.id,
    packageId: entry.id,
    title: entry.label,
    meta: 'Setup & Claiming · $5 USD',
    price: entry.basePriceNgn,
    description:
      'Securing official recognition for your track under your artist TikTok profile enhances visibility and allows you to access usage data—such as how many creators are using your sound. This boosts credibility and enables you to track and potentially monetize your music on the platform.',
    included: [
      'Verification of track ownership on TikTok',
      'Analytics access to monitor sound usage and engagement',
    ],
    note:
      'TikTok does not offer a formal public claiming feature; it is managed via distribution platforms. Pricing is minimal as this is predominantly a setup process via distributor services.',
  };
})();

const influencerDescriptions = {
  'tiktok.25-micro':
    'Real TikTok influencers create authentic videos using your sound to spark trends and expand your music’s reach.',
  'tiktok.50-micro':
    'Scaled creator push with guaranteed influencers using your sound in creative dance, lip-sync, and challenge content.',
  'tiktok.100-micro':
    'Broader campaign reach with guaranteed engagement and flexible support for growing artists and brands.',
  'tiktok.250-influencers':
    'High-volume influencer activation designed to maximize sound adoption across TikTok creator networks.',
  'tiktok.500-influencers':
    'Large-scale sound promotion with guaranteed influencer participation and wider audience reach.',
  'tiktok.1000-influencers':
    'Maximum visibility campaign for established artists and brands seeking dominant TikTok sound presence.',
};

export const tiktokInfluencerPackages = toServiceListEntries(getPackagesByGroup('tiktok-influencer')).map(
  (entry) => ({
    ...entry,
    meta: entry.title.includes('Micro') ? 'Micro influencer package' : 'Growth package',
    description: influencerDescriptions[entry.packageId] || '',
  })
);

export const tiktokInfluencerSectionIntro = {
  title: 'TikTok Influencer Campaigns Using Your Sound',
  lead:
    'In this strategy, real TikTok influencers create authentic videos using your track—this can spark trends and expand your music’s reach across platforms. All packages include guaranteed influencers using your sound, placement in TikTok videos, and campaign support.',
  industryNote:
    'Industry reference pricing by tier: Mid-tier (100K–500K followers) $325–$1,200 per post · Macro (500K–1M) $2,200–$3,500 · Mega (1M+) $4,500+ per post. Our micro influencer packages below are tailored for upcoming and established artists.',
};

export const tiktokArtistTermsSections = [
  {
    title: '1. Services Provided',
    body:
      'We provide TikTok influencer marketing services to promote your sound through verified influencers. Services may include influencers using your sound in content, placement in TikTok videos created by micro/mid-level influencers, customized campaigns based on package selection, guaranteed influencer counts per package, and campaign reports when applicable.',
  },
  {
    title: '2. Client Responsibilities',
    body:
      'You must provide accurate details including a valid TikTok sound link (or upload assistance if requested), music you legally own or have distribution rights to, and any campaign instructions (hashtags, captions, or challenges). You must not submit unauthorized, copyrighted, or illegal content.',
  },
  {
    title: '4. Campaign Performance',
    body:
      'Engagement results (likes, views, followers, or virality) may vary depending on content quality, audience response, and TikTok’s algorithm. We do not guarantee viral results or specific follower/stream counts.',
  },
  {
    title: '5. Refund Policy',
    body:
      'Refunds are not available for lack of expected engagement/virality or delays caused by TikTok platform policies. Refunds will only be issued if your campaign does not launch due to our error, or promised influencers do not use your sound as agreed.',
  },
  {
    title: '6. Intellectual Property Rights',
    body:
      'You retain ownership of your sound and related content. By using our services, you grant us permission to distribute your sound to selected influencers for campaign purposes. We do not claim ownership of your music or brand.',
  },
  {
    title: '7. Termination of Services',
    body:
      'We reserve the right to terminate campaigns if submitted content violates TikTok community guidelines or infringes third-party rights. In such cases, no refunds will be issued.',
  },
  {
    title: '8. Limitation of Liability',
    body:
      'We are not responsible for TikTok platform policy changes or influencer account issues beyond our control (suspensions, deletions). Our liability is limited to the total amount paid for the specific campaign.',
  },
  {
    title: '9. Governing Law & Dispute Resolution',
    body:
      'These Terms are governed by applicable advertising and marketing regulations. Disputes shall first be resolved amicably, and if unresolved, through arbitration under local law.',
  },
  {
    title: '10. Updates to Terms',
    body:
      'We reserve the right to update these Terms at any time via our official contact channels. Continued use of our services confirms acceptance of updated Terms.',
  },
];

export const tiktokArtistTermsFooter =
  'By purchasing a TikTok Influencer Sound Promotion Package, you confirm that you have read, understood, and agreed to these Terms of Service. Contact: Info@bluetickgeng.com';
