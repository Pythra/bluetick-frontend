import { getPackagesByGroup, toServiceListEntries } from './partnerPackageCatalog';

const trendMeta = {
  'twitter-trend.nigeria-trend': { countryCode: 'NG', delivery: '24 Hours' },
  'twitter-trend.uganda-trend': { countryCode: 'UG', delivery: '24 Hours' },
  'twitter-trend.south-africa-trend': { countryCode: 'ZA', delivery: '24 Hours' },
  'twitter-trend.kenya-trend': { countryCode: 'KE', delivery: '24 Hours' },
  'twitter-trend.ghana-trend': { countryCode: 'GH', delivery: '24 Hours' },
};

const trendCopy = {
  'twitter-trend.nigeria-trend': {
    description:
      'Premium X (Twitter) trend placement in Nigeria for brands, artists, campaigns, and announcements.',
    highlights: ['Nigeria trends chart placement', 'Hashtag strategy and engagement support', 'Campaign reporting summary'],
  },
  'twitter-trend.uganda-trend': {
    description:
      'Targeted trend visibility in Uganda with coordinated content push and localized hashtag planning.',
    highlights: ['Uganda trends chart placement', 'Localized copy and timing strategy', 'Engagement amplification'],
  },
  'twitter-trend.south-africa-trend': {
    description:
      'South Africa trend campaigns built for launches, brand moments, and high-visibility announcements on X.',
    highlights: ['South Africa trends chart placement', 'Multi-audience reach coordination', 'Post-campaign performance summary'],
  },
  'twitter-trend.kenya-trend': {
    description:
      'Kenya-focused trend packages for artists, public figures, and brands seeking strong national buzz on X.',
    highlights: ['Kenya trends chart placement', 'Hashtag and content coordination', 'Dedicated campaign support'],
  },
  'twitter-trend.ghana-trend': {
    description:
      'Ghana trend promotion for campaigns and announcements with structured execution and reporting.',
    highlights: ['Ghana trends chart placement', 'Engagement and momentum support', 'Campaign analytics summary'],
  },
};

export const twitterTrendPackages = toServiceListEntries(getPackagesByGroup('twitter-trends')).map((entry) => ({
  ...entry,
  title: entry.title.replace(' Trend', ' Trend').replace('Nigeria Trend', 'Nigeria Trend'),
  delivery: '24 Hours',
  ...trendMeta[entry.packageId],
  ...(trendCopy[entry.packageId] || {}),
}));

export const twitterTrendNotice = {
  lead: 'Every package includes strategy, execution, and post-campaign reporting.',
  body:
    'Our team handles hashtag research, trend timing, engagement coordination, and compliance with platform guidelines so your campaign reaches the right audience at the right moment.',
};
