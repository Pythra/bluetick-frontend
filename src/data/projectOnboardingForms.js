export const FORM_TYPES = {
  CLIENT_PROFILE: 'client_profile',
  WEBSITE: 'website',
  MOBILE_APP: 'mobile_app',
  VERIFICATION: 'verification',
  WIKIPEDIA: 'wikipedia',
  GOOGLE_KNOWLEDGE: 'google_knowledge',
  PUBLICATION: 'publication',
  BRANDING: 'branding',
  GENERAL: 'general',
};

const fileField = (id, label, multiple = false) => ({
  id,
  label,
  type: multiple ? 'files' : 'file',
  required: false,
});

const text = (id, label, required = false, placeholder = '') => ({
  id,
  label,
  type: 'text',
  required,
  placeholder,
});

const textarea = (id, label, required = false) => ({
  id,
  label,
  type: 'textarea',
  required,
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

const checkbox = (id, label) => ({
  id,
  label,
  type: 'checkbox',
  required: false,
});

export const FORM_SCHEMAS = {
  [FORM_TYPES.CLIENT_PROFILE]: {
    title: 'General client information',
    description: 'Required for every service. Our team uses this to reach you about your project.',
    fields: [
      text('fullName', 'Full name', true),
      text('businessName', 'Business name'),
      email('email', 'Email'),
      tel('phone', 'Phone number', true),
      tel('whatsapp', 'WhatsApp number'),
      text('country', 'Country', true),
      textarea('address', 'Address'),
    ],
  },
  [FORM_TYPES.WEBSITE]: {
    title: 'Website development',
    description: 'Tell us about the website you want us to build.',
    fields: [
      text('websiteName', 'Website name', true),
      text('websiteType', 'Website type (e.g. corporate, e-commerce, portfolio)', true),
      textarea('websiteDescription', 'Website description', true),
      textarea('pagesNeeded', 'Pages needed'),
      textarea('featuresNeeded', 'Features needed'),
      textarea('referenceWebsites', 'Reference websites'),
      textarea('domainInformation', 'Domain information'),
      textarea('hostingInformation', 'Hosting information'),
      fileField('logoUpload', 'Logo upload'),
      fileField('imagesUpload', 'Images upload', true),
      fileField('contentUpload', 'Content upload (documents)', true),
    ],
  },
  [FORM_TYPES.MOBILE_APP]: {
    title: 'Mobile app development',
    description: 'Share your app vision and technical requirements.',
    fields: [
      text('appName', 'App name', true),
      textarea('appDescription', 'App description', true),
      text('appCategory', 'App category'),
      checkbox('androidRequired', 'Android required'),
      checkbox('iosRequired', 'iOS required'),
      textarea('similarApps', 'Similar apps'),
      textarea('featuresList', 'Features list', true),
      textarea('userRoles', 'User roles'),
      textarea('paymentGatewayRequirements', 'Payment gateway requirements'),
      textarea('adminDashboardRequirements', 'Admin dashboard requirements'),
      textarea('designReferences', 'App design references'),
      fileField('designFiles', 'Design references / files', true),
    ],
  },
  [FORM_TYPES.VERIFICATION]: {
    title: 'Social media verification',
    description: 'Information required to process your verification request.',
    fields: [
      text('fullName', 'Full name', true),
      text('platform', 'Platform', true),
      text('username', 'Username / handle', true),
      text('accountLink', 'Account link', true),
      fileField('governmentId', 'Government ID upload (passport, driver license, etc.)'),
      fileField('businessRegistration', 'Business registration (if applicable)'),
      textarea('mediaPublications', 'Existing media publications (links)'),
      textarea('biography', 'Biography', true),
      textarea('contactInformation', 'Contact information', true),
    ],
  },
  [FORM_TYPES.WIKIPEDIA]: {
    title: 'Wikipedia page creation',
    fields: [
      text('subjectName', 'Full name / company name', true),
      textarea('biography', 'Biography', true),
      textarea('companyHistory', 'Company history'),
      textarea('awards', 'Awards (if any)'),
      textarea('achievements', 'Achievements'),
      textarea('mediaPublications', 'Existing media publications (links)'),
      text('website', 'Website'),
      textarea('socialMediaLinks', 'Social media links'),
      fileField('images', 'Images', true),
      textarea('referencesSources', 'References & sources'),
    ],
  },
  [FORM_TYPES.GOOGLE_KNOWLEDGE]: {
    title: 'Google Knowledge Panel',
    fields: [
      text('brandName', 'Full name / brand name', true),
      text('existingPanelLink', 'Existing Knowledge Panel link (if any)'),
      text('website', 'Website'),
      textarea('socialMediaProfiles', 'Social media profiles'),
      text('wikipediaLink', 'Wikipedia link (if available)'),
      textarea('mediaPublications', 'Media publications (links)'),
      email('googleAccountEmail', 'Google account email', true),
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
