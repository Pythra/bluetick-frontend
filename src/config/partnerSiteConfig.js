export const PARTNER_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Bold gradients, dynamic hero media, and a polished conversion-focused layout.',
    preview: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean whitespace, understated typography, and a refined professional feel.',
    preview: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Structured sections, strong hierarchy, and a trustworthy enterprise tone.',
    preview: 'linear-gradient(135deg, #0b3d91 0%, #1e5aa8 100%)',
  },
];

export const PARTNER_ASSET_FIELDS = [
  {
    key: 'heroVideo',
    label: 'Homepage Hero Video',
    type: 'video',
    hint: 'MP4, WEBM or MOV up to 25MB. Shown on your homepage hero.',
  },
  {
    key: 'heroPoster',
    label: 'Hero Video Poster',
    type: 'image',
    hint: 'Fallback image while the hero video loads.',
  },
  {
    key: 'appDevelopmentImage',
    label: 'App Development Section',
    type: 'image',
    hint: 'Image for the app development section on your homepage.',
  },
  {
    key: 'websiteServicesImage',
    label: 'Website Services Section',
    type: 'image',
    hint: 'Image for the website development section on your homepage.',
  },
  {
    key: 'aboutHero',
    label: 'About Page — Hero Image',
    type: 'image',
    hint: 'Primary image on your About page.',
  },
  {
    key: 'aboutTeam',
    label: 'About Page — Team Image',
    type: 'image',
    hint: 'Secondary image for your About page story section.',
  },
  {
    key: 'contactBackground',
    label: 'About Page — Contact Background',
    type: 'image',
    hint: 'Background for the contact call-to-action on About.',
  },
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

export const PARTNER_FEATURE_TOGGLES = [
  { key: 'showPublicationLogos', label: 'Show publication logos strip', description: 'Display the media logos carousel on your homepage.' },
  { key: 'showTestimonials', label: 'Show testimonials', description: 'Include the testimonials section on your homepage.' },
  { key: 'showCelebrities', label: 'Show celebrities section', description: 'Include the celebrities showcase section.' },
  { key: 'showBlog', label: 'Show blog in navigation', description: 'Keep blog links visible across your site.' },
  { key: 'showAffiliateProgram', label: 'Show affiliate program link', description: 'Display affiliate program in the footer.' },
];
