import punchLogo from '../assets/punch.png';
import guardianLogo from '../assets/guardian.png';
import businessDayLogo from '../assets/platforms/buisnessday.png';
import cableLogo from '../assets/platforms/cable.jpg';
import dailyPostLogo from '../assets/platforms/dailypost.jpg';
import nairametricsLogo from '../assets/platforms/nairametrics.png';
import techCabalLogo from '../assets/platforms/techcabal.png';
import vanguardLogo from '../assets/platforms/Vanguard.png';

export const DEFAULT_PUBLICATION_CAROUSEL_LOGOS = [
  { id: 'punch', name: 'Punch', image: punchLogo },
  { id: 'guardian', name: 'Guardian', image: guardianLogo },
  { id: 'businessday', name: 'BusinessDay', image: businessDayLogo },
  { id: 'cable', name: 'The Cable', image: cableLogo },
  { id: 'dailypost', name: 'Daily Post', image: dailyPostLogo },
  { id: 'nairametrics', name: 'Nairametrics', image: nairametricsLogo },
  { id: 'techcabal', name: 'TechCabal', image: techCabalLogo },
  { id: 'vanguard', name: 'Vanguard', image: vanguardLogo },
];

const defaultCarouselMap = new Map(
  DEFAULT_PUBLICATION_CAROUSEL_LOGOS.map((logo) => [logo.id, logo.image])
);

export function resolvePublicationCarouselLogo(logo) {
  if (logo?.imageUrl) {
    return logo.imageUrl;
  }
  if (logo?.id && defaultCarouselMap.has(logo.id)) {
    return defaultCarouselMap.get(logo.id);
  }
  return logo?.image || null;
}

export const PUBLICATION_CATEGORY_LABELS = {
  african: 'African News',
  uk: 'UK News',
  'google-news': 'Google News',
  international: 'Global News',
  tech: 'Tech & Startups',
};
