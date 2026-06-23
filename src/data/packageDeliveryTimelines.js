/** Delivery timelines shown on service detail pages. */

const INSTAGRAM_BLOG_24_48 = new Set(
  [
    'Alabareports',
    'Gossipmill (Account 1)',
    'Gossipmill (Account 2)',
    'WahalaNetwork',
    'Instablog',
    'Themixhq',
    'Gossiploaded',
    'Thecontentlovers',
    'Olofofonija',
  ].map((name) => name.toLowerCase())
);

const AFRICAN_OUTLET_24_48 = new Set(
  [
    'Punch',
    'Vanguard',
    'Tribune',
    'Independent',
    'ThisDay',
    'Daily Trust',
    'Guardian',
    'Leadership',
    'Blueprint',
    'SunOnline',
    'Champion',
    "People's Daily",
    'Peoples Daily',
    'The Nation',
    'BusinessDay',
    'Legit',
    'Daily Telegraph',
    'Daily Post',
    'Nairametrics',
    'The Cable',
    'GhanaWeb',
    'Pulse',
  ].map((name) => name.toLowerCase())
);

const DELIVERY_BY_LABEL = {
  // App development
  'Health & Fitness Apps': '4 to 6 Weeks',
  'E-commerce Apps': '4 to 6 Weeks',
  'Fintech & Banking Apps': '8 to 12 Weeks',
  'Social Media Apps': '6 to 12 Weeks',
  'Travel & Booking Apps': '4 to 6 Weeks',
  'Productivity Apps': '4 to 6 Weeks',
  'Streaming & Entertainment Apps': '6 to 12 Weeks',
  'Gaming Apps': '6 to 12 Weeks',
  'Bill Payment Apps': '8 to 12 Weeks',
  'Cryptocurrency Apps': '8 to 12 Weeks',

  // Website development
  'Basic Informational Website': '3 to 7 Days',
  'Standard Website': '3 to 7 Days',
  'Custom Web Applications': '1 to 4 Weeks',

  // Social verification
  'Instagram Verification': '7 to 30 Days',
  'Facebook Verification': '7 to 30 Days',
  'Snapchat Verification': '7 to 30 Days',
  'TikTok Verification': '7 to 30 Days',
  'Twitter Verification': '7 to 30 Days',
  'YouTube Verification': '7 to 30 Days',
  'Telegram Verification': '3 to 14 Days',
  'WhatsApp Channel Verification': '7 to 21 Days',
  'WhatsApp Business Verification': '7 to 21 Days',
  'Meta Subscription Services': '7 to 30 Days',

  // Monetization packages
  'Facebook Page Monetization': '3 to 14 Days',
  'Facebook Profile Monetization': '3 to 14 Days',
  'Instagram Monetization': '3 to 14 Days',
  'YouTube Channel Monetization': '7 to 30 Days',
  'TikTok Account Monetization': '3 to 14 Days',
  'Snapchat Monetization': '3 to 14 Days',
  'X (Twitter) Monetization': '3 to 14 Days',

  // Monetization setup
  'Facebook In-Stream Ads Setup': '3 to 14 Days',
  'Facebook Stars Setup': '3 to 14 Days',
  'Instagram Gifts Setup': '3 to 14 Days',
  'Instagram Subscription Setup': '3 to 14 Days',
  'TikTok Creativity Program Setup': '3 to 14 Days',
  'Social Media Payout Setup Assistance': '3 to 14 Days',

  // Twitter trends
  'Nigeria Trend': '24 Hours',
  'Uganda Trend': '24 Hours',
  'South Africa Trend': '24 Hours',
  'Kenya Trend': '24 Hours',
  'Ghana Trend': '24 Hours',

  // Music streaming
  'Boomplay Verification': '24 to 72 Hours',
  'Spotify Verification': '24 to 72 Hours',
  'Audiomack Verification': '24 to 72 Hours',
  'Apple Music Verification': '24 to 72 Hours',
  'YouTube Official Artist Channel (OAC) Verification': '24 to 72 Hours',
  'Deezer Verification': '24 to 72 Hours',
  'TIDAL Artist Verification': '24 to 72 Hours',
  'Amazon Music Artist Verification': '24 to 72 Hours',
  'Pandora AMP Verification': '24 to 72 Hours',
  'SoundCloud Verification': '24 to 72 Hours',
  'Shazam Artist Profile Verification': '24 to 72 Hours',
  'TikTok Music Profile Placement': '24 to 72 Hours',

  // TikTok artist
  'TikTok Song Claim Under Profile': '24 to 72 Hours',
  '25 Micro Influencers': '24 to 72 Hours',
  '50 Micro Influencers': '24 to 72 Hours',
  '100 Micro Influencers': '24 to 72 Hours',
  '250 TikTok Influencers': '24 to 72 Hours',
  '500 TikTok Influencers': '24 to 72 Hours',
  '1,000 TikTok Influencers': '24 to 72 Hours',

  // Instagram blogs
  Alabareports: '24 to 48 Hours',
  'Gossipmill (Account 1)': '24 to 48 Hours',
  'Gossipmill (Account 2)': '24 to 48 Hours',
  WahalaNetwork: '24 to 48 Hours',
  Instablog: '24 to 48 Hours',
  Themixhq: '24 to 48 Hours',
  Gossiploaded: '24 to 48 Hours',
  Thecontentlovers: '24 to 48 Hours',
  Olofofonija: '24 to 48 Hours',
  Notjustok: '24 to 48 Hours',
  Gistloverblog: '24 to 48 Hours',
  Samklef: '24 to 48 Hours',
  FunnyAfrica: '24 to 48 Hours',
  Tundeednut: '24 to 48 Hours',
  NaijaEverything: '24 to 48 Hours',
  Yabaleftonline: '24 to 48 Hours',
  GoldmyneTV: '24 to 48 Hours',
  Lindaikejisblog: '24 to 48 Hours',
  'Shallipopi News': '24 to 48 Hours',
  Officialbisloded: '24 to 48 Hours',
  '24 Hours Post': '24 to 48 Hours',
  '1 Day Post': '24 to 48 Hours',
  '3 Days Post': '24 to 48 Hours',
  'Collaboration Post (3 Days)': '24 to 48 Hours',
  'Collaboration Post (6 Days)': '24 to 48 Hours',

  // Wikipedia & knowledge panel
  'Wikipedia Page for Individuals': '48 Hours',
  'Wikipedia Page for Organizations': '48 Hours',
  'Individual Google Knowledge Panel': '7 to 30 Days',
  'Company Google Knowledge Panel': '7 to 30 Days',

  // Publication add-ons
  'Article content formats': '24 Hours',
  'Full article enhancement': '24 Hours',
  'Professional copywriting': '24 Hours',
  'Backdating an article': '24 Hours',
  'Including links in an article': '24 Hours',
  'Deleting an existing article': '24 to 72 Hours',
};

const DELIVERY_BY_GROUP = {
  'app-packages': '6 to 12 Weeks',
  'website-packages': '3 to 7 Days',
  'verification-non-notable': '7 to 30 Days',
  'verification-notable': '7 to 30 Days',
  'verification-meta': '7 to 30 Days',
  'monetization-packages': '3 to 14 Days',
  'monetization-setup': '3 to 14 Days',
  'twitter-trends': '24 Hours',
  'music-streaming': '24 to 72 Hours',
  'music-profile': '24 to 72 Hours',
  'tiktok-song': '24 to 72 Hours',
  'tiktok-influencer': '24 to 72 Hours',
  'instagram-blog': '24 to 48 Hours',
  'instagram-wizkid': '24 to 48 Hours',
  'wikipedia-pages': '48 Hours',
  'google-knowledge': '7 to 30 Days',
  'publication-addons': '24 Hours',
  'publication-african': '24 to 72 Hours',
  'publication-uk': '24 to 48 Hours',
  'publication-google-news': '24 to 48 Hours',
  'publication-international': '2 to 7 Working Days',
  'publication-tech': '24 to 48 Hours',
};

export function getPublicationPlatformDelivery(categoryId, platformName) {
  const name = String(platformName || '').trim();
  if (!name) return '24 to 72 Hours';

  if (categoryId === 'african') {
    return AFRICAN_OUTLET_24_48.has(name.toLowerCase()) ? '24 to 48 Hours' : '24 to 72 Hours';
  }

  if (categoryId === 'uk') return '24 to 48 Hours';
  if (categoryId === 'google-news') return '24 to 48 Hours';
  if (categoryId === 'international') return '2 to 7 Working Days';
  if (categoryId === 'tech') return '24 to 48 Hours';

  return '24 to 72 Hours';
}

export function getPackageDelivery(entry) {
  if (!entry) return null;

  const label = String(entry.label || entry.title || '').trim();

  if (entry.groupId === 'instagram-blog') {
    return INSTAGRAM_BLOG_24_48.has(label.toLowerCase()) ? '24 to 48 Hours' : '24 to 72 Hours';
  }

  if (label && DELIVERY_BY_LABEL[label]) {
    return DELIVERY_BY_LABEL[label];
  }

  if (entry.groupId && DELIVERY_BY_GROUP[entry.groupId]) {
    return DELIVERY_BY_GROUP[entry.groupId];
  }

  if (entry.serviceId === 'publication' && entry.groupId?.startsWith('publication-')) {
    const categoryId = entry.groupId.replace('publication-', '');
    return getPublicationPlatformDelivery(categoryId, label);
  }

  return null;
}

export function attachPackageDelivery(entry) {
  if (!entry || typeof entry !== 'object') return entry;
  const delivery = getPackageDelivery(entry);
  return delivery ? { ...entry, delivery } : entry;
}
