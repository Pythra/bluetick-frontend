import blueLogo from '../../assets/bluelogo.png';
import { normalizeMediaUrl } from '../../utils/partnerMedia';

export const MAIN_SITE_INVOICE_BRANDING = {
  brandName: 'Bluetickgeng Development',
  logoUrl: blueLogo,
  contactEmail: 'info@bluetickgeng.com',
  contactPhone: '',
  contactWebsite: 'https://bluetickgeng.com',
  contactWhatsapp: '',
  primaryColor: '#2563eb',
  tagline: 'Digital Growth Services for Brands',
};

export function formatClientDisplayName({ firstName, lastName, email } = {}) {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  if (email) return String(email).split('@')[0];
  return 'Customer';
}

export function resolveInvoiceLogoUrl(logoUrl) {
  const normalized = normalizeMediaUrl(logoUrl);
  if (normalized) {
    if (/^https?:\/\//i.test(normalized) || normalized.startsWith('data:')) {
      return normalized;
    }
    if (typeof window !== 'undefined') {
      const path = normalized.startsWith('/') ? normalized : `/${normalized}`;
      return `${window.location.origin}${path}`;
    }
    return normalized;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/bluelogo.png`;
  }
  return blueLogo;
}

export function resolveInvoiceBranding(branding) {
  if (!branding?.brandName) {
    return { ...MAIN_SITE_INVOICE_BRANDING };
  }
  return {
    ...MAIN_SITE_INVOICE_BRANDING,
    ...branding,
    logoUrl: branding.logoUrl || MAIN_SITE_INVOICE_BRANDING.logoUrl,
  };
}

export function buildInvoiceFromOrder(order, { user, branding, fallbackBrandName } = {}) {
  const orderId = String(order._id || '');
  const resolvedBranding = resolveInvoiceBranding(
    branding || {
      brandName: fallbackBrandName || MAIN_SITE_INVOICE_BRANDING.brandName,
    }
  );

  return {
    invoiceId: `INV-${orderId.slice(-8).toUpperCase()}`,
    orderId,
    createdAt: order.createdAt,
    clientEmail: order.email || user?.email || '',
    clientFirstName: user?.firstName || order.clientFirstName || order.metadata?.firstName || '',
    clientLastName: user?.lastName || order.clientLastName || order.metadata?.lastName || '',
    brandName: resolvedBranding.brandName,
    branding: resolvedBranding,
    amount: order.totalAmount,
    currency: order.currency || 'NGN',
    items: order.cartItems || [],
    productName: order.productName,
  };
}

/** @deprecated use buildInvoiceFromOrder */
export function orderToInvoice(order, brandName, userEmail, user) {
  return buildInvoiceFromOrder(order, {
    user: user || { email: userEmail },
    fallbackBrandName: brandName,
  });
}

export const INVOICE_PRINT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #0f172a; background: #fff; padding: 40px; }
  .invoice-doc { max-width: 760px; margin: 0 auto; }
  .invoice-doc__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; margin-bottom: 0; }
  .invoice-doc__brand { display: flex; align-items: center; gap: 16px; min-width: 0; }
  .invoice-doc__logo { width: 64px; height: 64px; object-fit: contain; border-radius: 10px; background: #f8fafc; padding: 6px; }
  .invoice-doc__company { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; color: #0f172a; line-height: 1.25; }
  .invoice-doc__tagline { margin-top: 4px; font-size: 0.78rem; color: #64748b; line-height: 1.45; max-width: 260px; }
  .invoice-doc__meta { text-align: right; flex-shrink: 0; }
  .invoice-doc__title { font-size: 1.75rem; font-weight: 800; letter-spacing: 0.12em; color: #0f172a; margin-bottom: 10px; }
  .invoice-doc__meta-row { font-size: 0.82rem; color: #475569; line-height: 1.7; }
  .invoice-doc__accent { height: 4px; border-radius: 999px; margin: 22px 0 28px; }
  .invoice-doc__parties { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }
  .invoice-doc__party-label { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; font-weight: 700; margin-bottom: 8px; }
  .invoice-doc__party-name { font-size: 1.05rem; font-weight: 700; color: #0f172a; }
  .invoice-doc__party-detail { margin-top: 4px; font-size: 0.84rem; color: #64748b; line-height: 1.5; }
  .invoice-doc__table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .invoice-doc__table th { background: #f8fafc; padding: 11px 14px; text-align: left; font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; border-bottom: 1px solid #e2e8f0; font-weight: 700; }
  .invoice-doc__table th:last-child, .invoice-doc__table td:last-child { text-align: right; }
  .invoice-doc__table th:nth-child(2), .invoice-doc__table td:nth-child(2) { text-align: center; width: 72px; }
  .invoice-doc__table td { padding: 13px 14px; border-bottom: 1px solid #f1f5f9; font-size: 0.92rem; color: #1e293b; vertical-align: top; }
  .invoice-doc__totals { margin-left: auto; width: min(100%, 320px); border-top: 2px solid #e2e8f0; padding-top: 12px; }
  .invoice-doc__total-row { display: flex; justify-content: space-between; gap: 24px; padding: 5px 0; font-size: 0.92rem; color: #475569; }
  .invoice-doc__total-row--grand { margin-top: 8px; padding-top: 10px; border-top: 1px solid #e2e8f0; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
  .invoice-doc__footer { margin-top: 36px; padding-top: 22px; border-top: 1px solid #e2e8f0; }
  .invoice-doc__footer-note { text-align: center; font-size: 0.78rem; color: #94a3b8; margin-bottom: 18px; line-height: 1.55; }
  .invoice-doc__contact-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; padding: 16px 18px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
  .invoice-doc__contact-item { min-width: 0; }
  .invoice-doc__contact-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
  .invoice-doc__contact-value { font-size: 0.82rem; color: #334155; line-height: 1.45; word-break: break-word; }
  .invoice-doc__contact-value a { color: inherit; text-decoration: none; }
  .invoice-doc__status { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 0.68rem; font-weight: 700; background: #dcfce7; color: #15803d; text-transform: uppercase; letter-spacing: 0.04em; }
  @media (max-width: 640px) {
    .invoice-doc__header { flex-direction: column; }
    .invoice-doc__meta { text-align: left; width: 100%; }
    .invoice-doc__parties, .invoice-doc__contact-grid { grid-template-columns: 1fr; }
  }
`;

export function formatWebsiteLabel(website) {
  if (!website) return '';
  return String(website)
    .trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');
}
