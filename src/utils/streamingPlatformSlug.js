import { amazonMusicLogo, boomplayLogo } from '../assets/streamingBrandLogos';

/** Platform logo config: CDN slug or local asset */
const platformByTitle = {
  'Boomplay Verification': { src: boomplayLogo },
  'Spotify Verification': { slug: 'spotify', color: '1DB954' },
  'Audiomack Verification': { slug: 'audiomack', color: 'FFA200' },
  'Apple Music Verification': { slug: 'applemusic', color: 'FA243C' },
  'YouTube Official Artist Channel (OAC) Verification': { slug: 'youtube', color: 'FF0000' },
  'Deezer Verification': { slug: 'deezer', color: 'A238FF' },
  'TIDAL Artist Verification': { slug: 'tidal', color: '000000' },
  'Amazon Music Artist Verification': { src: amazonMusicLogo },
  'Pandora AMP Verification': { slug: 'pandora', color: '224099' },
  'SoundCloud Verification': { slug: 'soundcloud', color: 'FF5500' },
  'Shazam Artist Profile Verification': { slug: 'shazam', color: '0088FF' },
  'TikTok Music Profile Placement': { slug: 'tiktok', color: '000000' },
};

export function getStreamingPlatformLogo(title) {
  return platformByTitle[title] ?? null;
}
