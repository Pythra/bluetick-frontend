/**
 * Canonical homepage services — same order as the main Bluetick site (App.jsx).
 * Partners pick which of these appear on their white-label homepage.
 */
export const PARTNER_HOMEPAGE_SERVICES = [
  {
    id: 'appDevelopment',
    label: 'App Development',
    description: 'Mobile app development section with packages and CTA.',
    sectionId: 'app-services',
  },
  {
    id: 'websiteDevelopment',
    label: 'Website Development',
    description: 'Website and web application development section.',
    sectionId: 'website-services',
  },
  {
    id: 'socialMedia',
    label: 'Social Media Services',
    description: 'Verification, monetization, and social growth services.',
    sectionId: 'verification-services',
  },
  {
    id: 'musicStreaming',
    label: 'Music Artist Streaming Verification',
    description: 'Spotify, Apple Music, and streaming platform verification.',
    sectionId: 'music-streaming-services',
  },
  {
    id: 'tiktokArtist',
    label: 'TikTok for Artist Services',
    description: 'TikTok song claims and influencer sound campaigns.',
    sectionId: 'tiktok-artist-services',
  },
  {
    id: 'publication',
    label: 'Publication & PR Services',
    description: 'Media placements across local and international outlets.',
    sectionId: 'publication-services',
  },
  {
    id: 'instagram',
    label: 'Instagram Blog Promotion',
    description: 'Promotions on top Instagram pages and celebrity blogs.',
    sectionId: 'instagram-services',
  },
  {
    id: 'wikipedia',
    label: 'Wikipedia Page Services',
    description: 'Wikipedia page creation and online authority building.',
    sectionId: 'wikipedia-services',
  },
];

export const PARTNER_SERVICE_IDS = PARTNER_HOMEPAGE_SERVICES.map((service) => service.id);

export function isCustomServiceId(serviceId) {
  return typeof serviceId === 'string' && serviceId.startsWith('custom-');
}

export function getCustomServiceDefinitions(source = {}) {
  return source?.sectionContent?.customServices?.items || [];
}

export function createCustomServiceDefinition(label = 'Custom Service') {
  const id = `custom-${Date.now()}`;
  return {
    id,
    label,
    description: 'Your own service offering on the homepage.',
    sectionId: id,
    imageUrl: '',
    ctaLabel: 'Get Started',
    ctaLink: '#custom-requests',
  };
}

export function countEnabledHomepageServices(enabledServices = {}, customItems = []) {
  const builtInCount = PARTNER_HOMEPAGE_SERVICES.filter((service) => enabledServices[service.id]).length;
  const customCount = customItems.filter((service) => enabledServices[service.id] !== false).length;
  return builtInCount + customCount;
}

export function getDefaultEnabledServices() {
  return Object.fromEntries(PARTNER_SERVICE_IDS.map((id) => [id, true]));
}

export function isPartnerHomepageServiceEnabled(branding, serviceId) {
  if (!branding?.isPartnerSite) {
    return true;
  }
  const enabled = branding.enabledServices || getDefaultEnabledServices();
  return enabled[serviceId] !== false;
}

export function getFirstVisibleServiceSectionId(branding) {
  const builtIn = PARTNER_HOMEPAGE_SERVICES.find((service) =>
    isPartnerHomepageServiceEnabled(branding, service.id)
  );
  if (builtIn) {
    return builtIn.sectionId;
  }

  const custom = getCustomServiceDefinitions(branding).find((service) =>
    isPartnerHomepageServiceEnabled(branding, service.id)
  );
  return custom?.sectionId || 'website-services';
}

export const PARTNER_TEMPLATES = [
  {
    id: 'modern',
    name: 'Aurora',
    description: 'Glass bento hero, mesh gradients, and a premium SaaS feel with DM Sans + Fraunces.',
    preview: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  },
  {
    id: 'minimal',
    name: 'Atelier',
    description: 'Luxury minimal — centered serif typography, no hero media, refined whitespace.',
    preview: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
  },
  {
    id: 'corporate',
    name: 'Institutional',
    description: 'Enterprise split hero, two-tier nav, table stats, and a structured mega footer.',
    preview: 'linear-gradient(135deg, #0b3d91 0%, #1e5aa8 100%)',
  },
  {
    id: 'bold',
    name: 'Noir',
    description: 'Cinematic full-screen dark hero, Syne display type, and bottom-aligned copy.',
    preview: 'linear-gradient(135deg, #0f172a 0%, #6366f1 100%)',
  },
  {
    id: 'studio',
    name: 'Editorial',
    description: 'Magazine split layout — serif headlines, edge-to-edge media, cream editorial footer.',
    preview: 'linear-gradient(135deg, #1e293b 0%, #f8fafc 50%, #2563eb 100%)',
  },
];

export const PARTNER_ASSET_FIELDS = [
  {
    key: 'heroVideo',
    label: 'Homepage Hero Video',
    type: 'video',
    group: 'hero',
    hint: 'MP4, WEBM or MOV up to 25MB. Shown in the homepage hero (used if no hero image is set).',
  },
  {
    key: 'heroImage',
    label: 'Homepage Hero Image',
    type: 'image',
    group: 'hero',
    hint: 'PNG or JPG up to 5MB. Replaces the hero video when uploaded — great for a static banner or ad.',
  },
  {
    key: 'heroPoster',
    label: 'Hero Video Poster',
    type: 'image',
    group: 'hero',
    hint: 'Fallback thumbnail while the hero video loads (video mode only).',
  },
  {
    key: 'appDevelopmentImage',
    label: 'App Development Section',
    type: 'image',
    group: 'services',
    hint: 'Image for the app development section on your homepage.',
  },
  {
    key: 'websiteServicesImage',
    label: 'Website Services Section',
    type: 'image',
    group: 'services',
    hint: 'Image for the website development section on your homepage.',
  },
  {
    key: 'aboutHero',
    label: 'About Page — Hero Image',
    type: 'image',
    group: 'about',
    hint: 'Primary image on your About page.',
  },
  {
    key: 'aboutTeam',
    label: 'About Page — Team Image',
    type: 'image',
    group: 'about',
    hint: 'Secondary image for your About page story section.',
  },
  {
    key: 'contactBackground',
    label: 'About Page — Contact Background',
    type: 'image',
    group: 'about',
    hint: 'Background for the contact call-to-action on About.',
  },
];

export const PARTNER_MEDIA_GROUPS = [
  { id: 'hero', label: 'Homepage Hero', description: 'Video or image shown in the top hero section. Upload a hero image to use a picture instead of video.' },
  { id: 'services', label: 'Service Sections', description: 'Images inside your homepage service blocks.' },
  { id: 'about', label: 'About Page', description: 'Images on your About page.' },
];

export const PARTNER_CONTENT_FIELDS = [
  { key: 'tagline', label: 'Brand Tagline', rows: 2, section: 'brand' },
  { key: 'heroTitle', label: 'Homepage Hero Title', rows: 2, section: 'homepage' },
  { key: 'heroDescription', label: 'Homepage Hero Description', rows: 4, section: 'homepage' },
  { key: 'footerTagline', label: 'Footer Headline', rows: 2, section: 'footer' },
  { key: 'footerSubtitle', label: 'Footer Subtitle', rows: 3, section: 'footer' },
  { key: 'aboutIntro', label: 'About — Introduction', rows: 4, section: 'about' },
  { key: 'aboutStory', label: 'About — Story', rows: 4, section: 'about' },
  { key: 'aboutMission', label: 'About — Mission', rows: 3, section: 'about' },
  { key: 'aboutVision', label: 'About — Vision', rows: 3, section: 'about' },
];

/** Non-service homepage blocks partners can show or hide. */
export const PARTNER_SECTION_TOGGLES = [
  {
    key: 'showHero',
    label: 'Homepage hero',
    description: 'The main hero with your title, video, and call-to-action buttons.',
    defaultEnabled: true,
  },
  {
    key: 'showPublicationLogos',
    label: 'Publication logos strip',
    description: 'Display the media logos carousel below the hero.',
    defaultEnabled: false,
  },
  {
    key: 'showImpactStats',
    label: 'Impact statistics',
    description: 'The metrics strip (publications, customers, launches) on the homepage.',
    defaultEnabled: true,
  },
  {
    key: 'showCelebrities',
    label: 'Celebrities section',
    description: 'Include the celebrities showcase section.',
    defaultEnabled: false,
  },
  {
    key: 'showTestimonials',
    label: 'Testimonials',
    description: 'Include the testimonials section on your homepage.',
    defaultEnabled: true,
  },
  {
    key: 'showFaq',
    label: 'FAQ section',
    description: 'Show frequently asked questions at the bottom of the homepage.',
    defaultEnabled: true,
  },
  {
    key: 'showCustomRequests',
    label: 'Custom requests form',
    description: 'A contact form at the bottom of the homepage for bespoke project inquiries.',
    defaultEnabled: true,
  },
  {
    key: 'showBlog',
    label: 'Blog in navigation',
    description: 'Keep blog links visible across your site.',
    defaultEnabled: true,
  },
  {
    key: 'showAffiliateProgram',
    label: 'Affiliate program link',
    description: 'Display affiliate program in the footer.',
    defaultEnabled: false,
  },
];

/** Maps homepage section toggles to editable content keys. */
export const PARTNER_TOGGLE_EDITOR_MAP = {
  showHero: { key: 'hero', editorType: 'hero', label: 'Homepage hero' },
  showImpactStats: { key: 'impactStats', editorType: 'impactStats', label: 'Impact statistics' },
  showTestimonials: { key: 'testimonials', editorType: 'testimonials', label: 'Testimonials' },
  showFaq: { key: 'faq', editorType: 'faq', label: 'FAQ section' },
  showCustomRequests: { key: 'customRequests', editorType: 'customRequests', label: 'Custom requests' },
};

export function getServiceEditorMeta(service) {
  return {
    key: service.id,
    editorType: 'service',
    label: service.label,
  };
}

export function getHomepageServiceOptions(brandingOrDraft = {}) {
  const customItems = getCustomServiceDefinitions(brandingOrDraft).map((service) => ({
    id: service.id,
    label: service.label,
  }));
  return [...PARTNER_HOMEPAGE_SERVICES, ...customItems];
}

export const MAX_SERVICE_VIDEO_BYTES = 100 * 1024 * 1024;

export function isVideoFirstPartnerSite(branding = {}) {
  return Boolean(
    branding?.isVideoFirstPartnerSite ||
    branding?.features?.videoFirstHomepage ||
    (typeof branding?.contactEmail === 'string' &&
      branding.contactEmail.toLowerCase() === 'peze336@gmail.com')
  );
}

export function getServiceVideoUrl(branding, serviceId) {
  return branding?.sectionContent?.serviceVideos?.[serviceId]?.videoUrl || '';
}

/** @deprecated Use PARTNER_SECTION_TOGGLES */
export const PARTNER_FEATURE_TOGGLES = PARTNER_SECTION_TOGGLES;
