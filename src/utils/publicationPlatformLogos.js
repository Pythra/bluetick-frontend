import yahooLogo from '../assets/yahoo.png';

const downloadedLogos = import.meta.glob(
  '../assets/platforms/logos/*.{png,jpg,jpeg,webp,ico}',
  { eager: true, import: 'default' }
);

/** @type {Record<string, string>} */
export const PLATFORM_DOMAINS = {
  Nollywire: 'nollywire.com',
  'The Nollywood Reporter': 'thenollywoodreporter.com',
  WKMup: 'wkmup.com',
  'Nolly Critic': 'nollycritic.com',
  'Nigerian Movies Review': 'nigerianmovies.com',
  OkayAfrican: 'okayafrica.com',
  GQ: 'gq.com',
  AP: 'apnews.com',
  Benzinga: 'benzinga.com',
  'Joy Online': 'myjoyonline.com',
  'PeaceFm Online': 'peacefmonline.com',
  'B&FT Online': 'thebftonline.com',
  'Cybersecurity Insiders': 'cybersecurity-insiders.com',
  CyberNews: 'cybernews.com',
  Influence: 'influence.co',
  TechRound: 'techround.co.uk',
  'Startup Observer': 'startupobserver.com',
  'Technology Dispatch': 'technologydispatch.com',
  'Tech News Vision': 'technewsvision.com',
  'Esports News UK': 'esports-news.co.uk',
  'Coin Journal': 'coinjournal.net',
  'Tech Bullion': 'techbullion.com',
  'Crypto Daily': 'cryptodaily.co.uk',
  'The Crypto Week': 'thecryptoweek.com',
  'The Coins Herald': 'thecoinsherald.com',
  'The Coins Wire': 'thecoinswire.com',
  Finsmes: 'finsmes.com',
  'Brands Journal': 'brandsjournal.com',
  'Business Matters': 'businessmattersmag.co.uk',
  'Finance Digest': 'financedigest.com',
  'Financial News': 'fnlondon.com',
  'Wealth Tribune': 'wealthtribune.com',
  'Trading Herald': 'tradingherald.com',
  'Investment Guide': 'investmentguide.co.uk',
  'Investing.com': 'investing.com',
  'StreetInsiders.com': 'streetinsiders.com',
  'Palm Bay Herald': 'palmbayherald.com',
  'Property Development': 'propertyweek.com',
  'Online World News': 'onlineworldnews.com',
  'International Releases': 'internationalreleases.com',
  'London Journal': 'londonjournal.co.uk',
  LondonJournal: 'londonjournal.co.uk',
  'Glasgow Report': 'glasgowreport.co.uk',
  'Manchester Times': 'manchestertimes.co.uk',
  UkHerald: 'theukherald.com',
  'Birmingham Times': 'birminghamtimes.co.uk',
  UkReporter: 'ukreporter.com',
  'The Bristol Press': 'bristolpress.com',
  'Uk Wire': 'ukwire.com',
  'Manchester Evening News': 'manchestereveningnews.co.uk',
  'Wales Online': 'walesonline.co.uk',
  MyLondon: 'mylondon.news',
  'Chronicle Live': 'chroniclelive.co.uk',
  'Edinburgh Live': 'edinburghlive.co.uk',
  'Galway Beo': 'galwaybeo.ie',
  InYourArea: 'inyourarea.co.uk',
  'Daily Records': 'dailyrecord.co.uk',
  Echo: 'liverpoolecho.co.uk',
  'Business Live': 'business-live.co.uk',
  'Business Cheshire': 'businesscheshire.co.uk',
  'Business Lancashire': 'businesslancashire.co.uk',
  'Business Manchester': 'businessmanchester.co.uk',
  'Calculator UK Business News': 'calculator.co.uk',
  'Talk Business': 'talk-business.co.uk',
  'The Sporting News': 'sportingnews.com',
  'Football.London': 'football.london',
  'Female First': 'femalefirst.co.uk',
  'Funeral Notices': 'funeral-notices.co.uk',
  'Luxury Adviser': 'luxuryadviser.com',
  BusinessMole: 'businessmole.com',
  'Economy Standard': 'economystandard.com',
  DeadLine: 'deadline.com',
  'The Open News': 'theopennews.com',
  'Verna Magazine': 'vernamagazine.com',
  AllNewsBuzz: 'allnewsbuzz.com',
  'Entertainment Paper': 'entertainmentpaper.com',
  FabWorldToday: 'fabworldtoday.com',
  'Resident Weekly': 'residentweekly.com',
  'Sportz Weekly': 'sportzweekly.com',
  'Data Source Hub': 'datasourcehub.com',
  GlobeStats: 'globestats.com',
  'Stats Globe': 'statsglobe.com',
  'Apsters Media': 'apstersmedia.com',
  'Coverage Log': 'coveragelog.com',
  'Time Bulletin': 'timebulletin.com',
  'The Nashville Post': 'nashvillepost.com',
  'Industry Today': 'industrytoday.com',
  'California Times': 'californiatimes.us',
  'Feature Weekly': 'featureweekly.com',
  'Infuse News': 'infusenews.com',
  'Business Insider': 'businessinsider.com',
  'Yahoo Finance': 'finance.yahoo.com',
  'NewYork Weekly': 'newyorkweekly.com',
  'USA Wire': 'usawire.com',
  AsiaOne: 'asiaone.com',
  MSN: 'msn.com',
  'International Business Times': 'ibtimes.com',
  IGB: 'igamingbusiness.com',
  'Casino Life': 'casinolifemagazine.com',
  Punch: 'punchng.com',
  Vanguard: 'vanguardngr.com',
  Guardian: 'guardian.ng',
  'The Guardian': 'guardian.ng',
  'The Nation': 'thenationonlineng.net',
  ThisDay: 'thisdaylive.com',
  BusinessDay: 'businessday.ng',
  'Daily Trust': 'dailytrust.com',
  Leadership: 'leadership.ng',
  Tribune: 'tribuneonlineng.com',
  SunOnline: 'sunnewsonline.com',
  'The Sun': 'sunnewsonline.com',
  'Daily Telegraph': 'dailytelegraph.com.au',
  'The Telegraph': 'telegraph.co.uk',
  Independent: 'independent.co.uk',
  Champion: 'championnews.com.ng',
  "People's Daily": 'peoplesdaily.ng',
  'Peoples Daily': 'peoplesdaily.ng',
  Blueprint: 'blueprint.ng',
  Legit: 'legit.ng',
  GhanaWeb: 'ghanaweb.com',
  Techpoint: 'techpoint.africa',
  TechCabal: 'techcabal.com',
  Forbes: 'forbes.com',
  'Fox News': 'foxnews.com',
  'BBC News': 'bbc.com',
  Bloomberg: 'bloomberg.com',
  'Hardcore News': 'hardcorenews.co',
  'The Cable': 'thecable.ng',
  'Daily Post': 'dailypost.ng',
  Pulse: 'pulse.ng',
};

const LOCAL_LOGO_OVERRIDES = {
  'Yahoo Finance': yahooLogo,
};

const logosBySlug = Object.fromEntries(
  Object.entries(downloadedLogos).map(([filePath, url]) => {
    const fileName = filePath.split('/').pop() || '';
    const slug = fileName.replace(/\.[^.]+$/, '');
    return [slug, url];
  })
);

export function slugifyPlatformName(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildFaviconUrl(domain) {
  const site = encodeURIComponent(`https://${domain}`);
  return `https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${site}&size=128`;
}

export function buildDuckDuckGoIconUrl(domain) {
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

/**
 * Resolve a logo URL for a publication platform (bundled asset or remote favicon).
 */
export function getPublicationPlatformLogo(platform) {
  if (platform?.logo) {
    return platform.logo;
  }

  const name = platform?.name;
  if (!name) {
    return null;
  }

  if (LOCAL_LOGO_OVERRIDES[name]) {
    return LOCAL_LOGO_OVERRIDES[name];
  }

  const slug = slugifyPlatformName(name);
  if (logosBySlug[slug]) {
    return logosBySlug[slug];
  }

  const domain = PLATFORM_DOMAINS[name];
  if (domain) {
    return buildFaviconUrl(domain);
  }

  return null;
}

/**
 * Next logo URL to try when the primary image fails to load.
 */
export function getPublicationPlatformLogoFallback(platform, currentSrc) {
  const domain = PLATFORM_DOMAINS[platform?.name];
  if (!domain || !currentSrc) {
    return null;
  }

  if (currentSrc.includes('gstatic.com')) {
    return buildDuckDuckGoIconUrl(domain);
  }

  if (currentSrc.includes('duckduckgo.com')) {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  }

  return null;
}
