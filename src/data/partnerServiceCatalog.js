/** Mirrors backend partner service catalog — base prices in NGN */
export const PARTNER_SERVICE_CATALOG = [
  { id: 'wikipedia', label: 'Wikipedia Services', basePriceNgn: 650000, category: 'authority' },
  { id: 'socialMedia', label: 'Verification & Social Media Services', basePriceNgn: 350000, category: 'social' },
  { id: 'websiteDevelopment', label: 'Website Development', basePriceNgn: 500000, category: 'development' },
  { id: 'appDevelopment', label: 'Mobile App Development', basePriceNgn: 800000, category: 'development' },
  { id: 'softwareDevelopment', label: 'Software Development', basePriceNgn: 750000, category: 'development' },
  { id: 'publication', label: 'PR & Media Publications', basePriceNgn: 400000, category: 'media' },
  { id: 'googleKnowledge', label: 'Google Knowledge Panel', basePriceNgn: 550000, category: 'authority' },
  { id: 'instagram', label: 'Social Media Services', basePriceNgn: 280000, category: 'social' },
  { id: 'branding', label: 'Branding Services', basePriceNgn: 320000, category: 'branding' },
  { id: 'musicStreaming', label: 'Music Streaming Verification', basePriceNgn: 250000, category: 'social' },
  { id: 'tiktokArtist', label: 'TikTok Artist Services', basePriceNgn: 220000, category: 'social' },
];

export const PROJECT_STATUS_LABELS = {
  requirements_received: 'Requirements Received',
  planning: 'Planning Phase',
  in_progress: 'In Progress',
  under_review: 'Under Review',
  completed: 'Completed',
};

export function formatNgn(amount) {
  if (amount == null) return '—';
  return `₦${Number(amount).toLocaleString('en-NG')}`;
}

export function formatAmount(amount, currency = 'NGN') {
  if (amount == null) return '—';
  if (currency === 'USD') return `$${Number(amount).toLocaleString('en-US')}`;
  if (currency === 'NGN') return formatNgn(amount);
  return `${currency} ${Number(amount).toLocaleString()}`;
}
