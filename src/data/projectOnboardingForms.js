export const FORM_TYPES = {
  CLIENT_PROFILE: 'client_profile',
  WEBSITE: 'website',
  MOBILE_APP: 'mobile_app',
  VERIFICATION: 'verification',
  MONETIZATION: 'monetization',
  TWITTER_TREND: 'twitter_trend',
  MUSIC_STREAMING: 'music_streaming',
  TIKTOK_ARTIST: 'tiktok_artist',
  PUBLICATION: 'publication',
  INSTAGRAM: 'instagram',
  WIKIPEDIA: 'wikipedia',
  GOOGLE_KNOWLEDGE: 'google_knowledge',
  BRANDING: 'branding',
  GENERAL: 'general',
};

const fileField = (id, label, multiple = false, required = false) => ({
  id,
  label,
  type: multiple ? 'files' : 'file',
  required,
});

const text = (id, label, required = false, placeholder = '') => ({
  id,
  label,
  type: 'text',
  required,
  placeholder,
});

const textarea = (id, label, required = false, placeholder = '') => ({
  id,
  label,
  type: 'textarea',
  required,
  placeholder,
});

const email = (id, label, required = true) => ({
  id,
  label,
  type: 'email',
  required,
});

const tel = (id, label, required = false) => ({
  id,
  label,
  type: 'tel',
  required,
});

const dateField = (id, label, required = false) => ({
  id,
  label,
  type: 'date',
  required,
});

const readonly = (id, label) => ({
  id,
  label,
  type: 'readonly',
  required: false,
});

export const FORM_SCHEMAS = {
  [FORM_TYPES.CLIENT_PROFILE]: {
    title: 'Client & order information',
    description:
      'Required for every order. Auto-filled fields are linked to your payment record.',
    fields: [
      readonly('orderId', 'Order ID'),
      text('fullName', 'Client full name', true),
      text('companyBrandName', 'Company/Brand name'),
      email('email', 'Email address'),
      tel('phone', 'Phone number', true),
      text('country', 'Country', true),
      readonly('servicePurchased', 'Service purchased'),
      textarea('additionalInstructions', 'Additional instructions'),
      fileField('generalAttachments', 'File upload section', true),
      readonly('paymentReference', 'Payment reference'),
      readonly('submissionDate', 'Submission date'),
    ],
  },
  [FORM_TYPES.MOBILE_APP]: {
    title: 'Mobile app development',
    description: 'Tell us about the app you want us to build.',
    fields: [
      text('appName', 'App name', true),
      textarea('appDescription', 'App description', true),
      text('appCategory', 'App category', true),
      textarea('targetAudience', 'Target audience', true),
      text(
        'platformsRequired',
        'Platforms required (Android, iOS, Web, Cross Platform)',
        true,
        'e.g. Android, iOS'
      ),
      textarea('featuresList', 'List of features required', true),
      textarea('similarApps', 'Similar apps for reference', true),
      text('preferredDesignStyle', 'Preferred design style', true),
      text('brandColors', 'Brand colors', true),
      textarea('userTypes', 'User types (Admin, Customer, Vendor, Driver, etc.)', true),
      textarea('revenueModel', 'Revenue model', true),
      textarea('thirdPartyIntegrations', 'Third-party integrations required', true),
      text('projectDeadline', 'Project deadline', true),
      fileField('logo', 'Logo'),
      fileField('brandGuidelines', 'Brand guidelines'),
      fileField('wireframes', 'Wireframes', true),
      fileField('uiDesigns', 'UI designs', true),
      fileField('existingProjectFiles', 'Existing project files', true),
    ],
  },
  [FORM_TYPES.WEBSITE]: {
    title: 'Website development',
    description: 'Share the details for your website project.',
    fields: [
      text('websiteName', 'Website name', true),
      textarea('businessDescription', 'Business description', true),
      text('websiteType', 'Website type', true),
      textarea('requiredPages', 'Required pages', true),
      textarea('referenceWebsites', 'Reference websites', true),
      text('domainName', 'Domain name', true),
      textarea('hostingDetails', 'Hosting details'),
      text('preferredDesignStyle', 'Preferred design style', true),
      text('brandColors', 'Brand colors', true),
      textarea('websiteFeatures', 'Website features required', true),
      textarea('contactInformation', 'Contact information to display', true),
      textarea('socialMediaLinks', 'Social media links', true),
      fileField('logo', 'Logo'),
      fileField('images', 'Images', true),
      fileField('companyProfile', 'Company profile'),
      fileField('websiteContent', 'Website content', true),
      fileField('brandingMaterials', 'Branding materials', true),
    ],
  },
  [FORM_TYPES.VERIFICATION]: {
    title: 'Social media verification',
    description: 'Information required to process your verification request.',
    fields: [
      text('platform', 'Platform for verification', true),
      text('profileUsername', 'Profile username', true),
      text('profileUrl', 'Profile URL', true),
      text('fullNameOnAccount', 'Full name on account', true),
      text('country', 'Country', true),
      text('occupation', 'Occupation', true),
      textarea('existingMediaCoverage', 'Existing media coverage', true),
      text('personalWebsite', 'Personal website'),
      textarea('socialMediaLinks', 'Social media links', true),
      textarea('additionalInformation', 'Additional information', true),
      fileField('governmentId', 'Government issued ID'),
      fileField('passportPhoto', 'Passport photograph'),
      fileField('mediaLinksPublications', 'Media links or publications', true),
      fileField('supportingDocuments', 'Supporting documents', true),
    ],
  },
  [FORM_TYPES.MONETIZATION]: {
    title: 'Social media monetization',
    description: 'Help us understand your monetization goals.',
    fields: [
      text('platform', 'Platform', true),
      text('profileUsername', 'Profile username', true),
      text('profileUrl', 'Profile URL', true),
      text('country', 'Country', true),
      text('contentNiche', 'Content niche', true),
      text('currentFollowerCount', 'Current follower count', true),
      text('currentMonetizationStatus', 'Current monetization status', true),
      textarea('monetizationGoal', 'Monetization goal', true),
      fileField('analyticsScreenshots', 'Analytics screenshots', true),
      fileField('dashboardScreenshots', 'Dashboard screenshots', true),
      fileField('governmentId', 'Government ID'),
      fileField('supportingDocuments', 'Supporting documents', true),
    ],
  },
  [FORM_TYPES.TWITTER_TREND]: {
    title: 'Twitter (X) trending services',
    description: 'Campaign details for your trending request.',
    fields: [
      text('hashtagToTrend', 'Hashtag to trend', true),
      textarea('campaignObjective', 'Campaign objective', true),
      text('targetCountry', 'Target country', true),
      dateField('preferredStartDate', 'Preferred start date', true),
      text('preferredStartTime', 'Preferred start time', true, 'e.g. 2:00 PM WAT'),
      text('campaignDuration', 'Campaign duration', true, 'e.g. 6 hours'),
      textarea('keywordsToInclude', 'Keywords to include', true),
      textarea('additionalInstructions', 'Additional instructions', true),
      fileField('campaignArtwork', 'Campaign artwork', true),
      fileField('videos', 'Videos', true),
      fileField('promotionalMaterials', 'Promotional materials', true),
    ],
  },
  [FORM_TYPES.MUSIC_STREAMING]: {
    title: 'Music streaming promotion',
    description: 'Details for your music promotion campaign.',
    fields: [
      text('artistName', 'Artist name', true),
      text('songTitle', 'Song title', true),
      text('albumEpName', 'Album/EP name'),
      dateField('releaseDate', 'Release date', true),
      text('genre', 'Genre', true),
      textarea('streamingLinks', 'Streaming links', true),
      textarea('targetCountries', 'Target countries', true),
      textarea('campaignObjective', 'Campaign objective', true),
      text('campaignBudget', 'Campaign budget'),
      fileField('coverArtwork', 'Cover artwork'),
      fileField('pressPhotos', 'Press photos', true),
      fileField('audioFiles', 'Audio files', true),
      fileField('pressKit', 'Press kit', true),
    ],
  },
  [FORM_TYPES.TIKTOK_ARTIST]: {
    title: 'TikTok artist services',
    description: 'Artist and release information for TikTok services.',
    fields: [
      text('artistName', 'Artist name', true),
      text('tiktokUsername', 'TikTok username', true),
      text('tiktokProfileUrl', 'TikTok profile URL', true),
      text('distributorName', 'Distributor name', true),
      textarea('musicReleaseLinks', 'Music release links', true),
      text('existingArtistStatus', 'Existing artist status', true),
      text('serviceRequired', 'Service required', true),
      fileField('governmentId', 'Government ID'),
      fileField('artistPhotos', 'Artist photos', true),
      fileField('pressCoverage', 'Press coverage', true),
      fileField('distributionDocuments', 'Distribution documents', true),
    ],
  },
  [FORM_TYPES.PUBLICATION]: {
    title: 'Publication / press release services',
    description: 'Submit your press release details.',
    fields: [
      text('headline', 'Headline', true),
      textarea('articleContent', 'Article content', true),
      text('preferredPublicationCategory', 'Preferred publication category', true),
      dateField('preferredPublicationDate', 'Preferred publication date', true),
      textarea('preferredMediaPlatforms', 'Preferred media platforms', true),
      textarea('contactInformation', 'Contact information', true),
      textarea('linksToInclude', 'Links to include', true),
      textarea('socialMediaLinks', 'Social media links', true),
      fileField('articleDocument', 'Article document'),
      fileField('images', 'Images', true),
      fileField('videos', 'Videos', true),
      fileField('companyLogo', 'Company logo'),
    ],
  },
  [FORM_TYPES.INSTAGRAM]: {
    title: 'Instagram services',
    description: 'Campaign and profile details for Instagram services.',
    fields: [
      text('instagramUsername', 'Instagram username', true),
      text('instagramProfileUrl', 'Instagram profile URL', true),
      text('serviceRequested', 'Service requested', true),
      text('currentFollowerCount', 'Current follower count', true),
      textarea('targetAudience', 'Target audience', true),
      textarea('campaignObjective', 'Campaign objective', true),
      dateField('preferredStartDate', 'Preferred start date', true),
      fileField('campaignMaterials', 'Campaign materials', true),
      fileField('images', 'Images', true),
      fileField('videos', 'Videos', true),
      fileField('supportingDocuments', 'Supporting documents', true),
    ],
  },
  [FORM_TYPES.WIKIPEDIA]: {
    title: 'Wikipedia services',
    description: 'Subject details and references for Wikipedia work.',
    fields: [
      text('subjectFullName', 'Subject full name', true),
      textarea('biography', 'Biography', true),
      text('occupation', 'Occupation', true),
      text('nationality', 'Nationality', true),
      text('dateOfBirth', 'Date of birth', true),
      text('officialWebsite', 'Official website', true),
      textarea('socialMediaLinks', 'Social media links', true),
      textarea('awardsRecognition', 'Awards and recognition', true),
      text('existingWikipediaUrl', 'Existing Wikipedia URL (if applicable)'),
      textarea('newsReferences', 'News references', true),
      textarea('additionalInformation', 'Additional information', true),
      fileField('biographyDocument', 'Biography document'),
      fileField('professionalPhotographs', 'Professional photographs', true),
      fileField('newsArticles', 'News articles', true),
      fileField('awardsCertificates', 'Awards and certificates', true),
      fileField('referenceMaterials', 'Reference materials', true),
    ],
  },
  [FORM_TYPES.GOOGLE_KNOWLEDGE]: {
    title: 'Google Knowledge Panel',
    description: 'Brand and authority details for Knowledge Panel work.',
    fields: [
      text('brandName', 'Full name / brand name', true),
      text('existingPanelLink', 'Existing Knowledge Panel link (if any)'),
      text('website', 'Website', true),
      textarea('socialMediaProfiles', 'Social media profiles', true),
      text('wikipediaLink', 'Wikipedia link (if available)'),
      textarea('mediaPublications', 'Media publications (links)', true),
      email('googleAccountEmail', 'Google account email', true),
      fileField('supportingDocuments', 'Supporting documents', true),
    ],
  },
  [FORM_TYPES.BRANDING]: {
    title: 'Branding & design',
    fields: [
      text('brandName', 'Brand name', true),
      text('designType', 'Design type', true),
      textarea('preferredColors', 'Preferred colors'),
      textarea('designStyle', 'Design style'),
      textarea('inspirations', 'Inspirations'),
      fileField('logoFiles', 'Logo files', true),
      fileField('existingBrandMaterials', 'Existing brand materials', true),
    ],
  },
  [FORM_TYPES.GENERAL]: {
    title: 'Project details',
    description: 'Describe what you need so our team can get started.',
    fields: [
      text('projectTitle', 'Project title', true),
      textarea('projectDescription', 'Project description', true),
      textarea('requirements', 'Requirements / deliverables'),
      textarea('timeline', 'Preferred timeline'),
      textarea('references', 'References or links'),
      fileField('attachments', 'Attachments (images, PDFs, documents)', true),
    ],
  },
};

export const getFormSchema = (formType) =>
  FORM_SCHEMAS[formType] || FORM_SCHEMAS[FORM_TYPES.GENERAL];

export const getFormTypeLabel = (formType) => getFormSchema(formType).title;

export function buildOrderContextValues(order = {}, taskLabel = '') {
  const orderId = order._id || order.id || '';
  const paymentReference =
    order.paymentReference ||
    order.paymentDetails?.reference ||
    order.paymentDetails?.tx_ref ||
    order.paymentDetails?.transaction_id ||
    '—';

  return {
    orderId: String(orderId),
    servicePurchased: taskLabel || order.productName || '—',
    paymentReference: String(paymentReference),
    submissionDate: new Date().toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
  };
}
