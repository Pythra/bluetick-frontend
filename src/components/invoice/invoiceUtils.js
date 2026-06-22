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
  const orderId = String(order._id || order.id || '');
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

export function buildAdminInvoiceFromOrder(order) {
  const nameParts = String(order.userName || '').trim().split(/\s+/).filter(Boolean);
  return buildInvoiceFromOrder(
    {
      ...order,
      _id: order._id || order.id,
      email: order.userEmail || order.email,
    },
    {
      branding: MAIN_SITE_INVOICE_BRANDING,
      user: {
        email: order.userEmail || order.email,
        firstName: nameParts[0] || order.firstName || '',
        lastName: nameParts.slice(1).join(' ') || order.lastName || '',
      },
    }
  );
}

export function buildPartnerInvoiceFromOrder(order, branding) {
  return buildInvoiceFromOrder(
    {
      ...order,
      _id: order._id || order.id,
      email: order.email || order.clientEmail,
    },
    {
      branding: branding
        ? {
            brandName: branding.brandName,
            logoUrl: branding.logoUrl,
            contactEmail: branding.contactEmail,
            contactPhone: branding.contactPhone,
            contactWebsite: branding.contactWebsite || branding.siteUrl,
            contactWhatsapp: branding.contactWhatsapp,
            primaryColor: branding.primaryColor,
            tagline: branding.tagline,
          }
        : undefined,
      user: {
        email: order.email || order.clientEmail,
        firstName: order.clientFirstName || '',
        lastName: order.clientLastName || '',
      },
      fallbackBrandName: branding?.brandName,
    }
  );
}

export const INVOICE_PRINT_STYLES = `
  @page {
    size: A4 portrait;
    margin: 12mm 14mm;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    font-size: 11pt;
  }

  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #0f172a;
    background: #fff;
    padding: 0;
    margin: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .invoice-doc {
    width: 100%;
    max-width: none;
    margin: 0;
  }

  .invoice-doc__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20pt;
    margin-bottom: 0;
  }

  .invoice-doc__brand {
    display: flex;
    align-items: center;
    gap: 14pt;
    min-width: 0;
    flex: 1;
  }

  .invoice-doc__logo {
    width: 68pt;
    height: 68pt;
    object-fit: contain;
    border-radius: 8pt;
    background: #f8fafc;
    padding: 5pt;
    flex-shrink: 0;
  }

  .invoice-doc__company {
    font-size: 17pt;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.2;
  }

  .invoice-doc__tagline {
    margin-top: 4pt;
    font-size: 9pt;
    color: #64748b;
    line-height: 1.4;
    max-width: none;
  }

  .invoice-doc__meta {
    text-align: right;
    flex-shrink: 0;
  }

  .invoice-doc__title {
    font-size: 24pt;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: #0f172a;
    margin-bottom: 8pt;
  }

  .invoice-doc__meta-row {
    font-size: 10pt;
    color: #475569;
    line-height: 1.65;
  }

  .invoice-doc__meta-row strong {
    color: #334155;
  }

  .invoice-doc__accent {
    height: 3pt;
    border-radius: 999px;
    margin: 16pt 0 20pt;
  }

  .invoice-doc__parties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24pt;
    margin-bottom: 22pt;
  }

  .invoice-doc__party-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    font-weight: 700;
    margin-bottom: 6pt;
  }

  .invoice-doc__party-name {
    font-size: 12pt;
    font-weight: 700;
    color: #0f172a;
  }

  .invoice-doc__party-detail {
    margin-top: 3pt;
    font-size: 10pt;
    color: #64748b;
    line-height: 1.45;
  }

  .invoice-doc__table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16pt;
  }

  .invoice-doc__table th {
    background: #f8fafc;
    padding: 9pt 10pt;
    text-align: left;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #64748b;
    border-bottom: 1.5pt solid #e2e8f0;
    font-weight: 700;
  }

  .invoice-doc__table th:last-child,
  .invoice-doc__table td:last-child {
    text-align: right;
  }

  .invoice-doc__table th:nth-child(2),
  .invoice-doc__table td:nth-child(2) {
    text-align: center;
    width: 56pt;
  }

  .invoice-doc__table td {
    padding: 11pt 10pt;
    border-bottom: 1pt solid #f1f5f9;
    font-size: 11pt;
    color: #1e293b;
    vertical-align: top;
  }

  .invoice-doc__totals {
    margin-left: auto;
    width: min(100%, 240pt);
    border-top: 2pt solid #e2e8f0;
    padding-top: 10pt;
  }

  .invoice-doc__total-row {
    display: flex;
    justify-content: space-between;
    gap: 20pt;
    padding: 4pt 0;
    font-size: 11pt;
    color: #475569;
  }

  .invoice-doc__total-row--grand {
    margin-top: 6pt;
    padding-top: 8pt;
    border-top: 1pt solid #e2e8f0;
    font-size: 14pt;
    font-weight: 800;
    color: #0f172a;
  }

  .invoice-doc__footer {
    margin-top: 24pt;
    padding-top: 16pt;
    border-top: 1pt solid #e2e8f0;
  }

  .invoice-doc__footer-note {
    text-align: center;
    font-size: 9pt;
    color: #94a3b8;
    margin-bottom: 14pt;
    line-height: 1.5;
  }

  .invoice-doc__contact-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12pt;
    padding: 12pt 14pt;
    background: #f8fafc;
    border-radius: 8pt;
    border: 1pt solid #e2e8f0;
  }

  .invoice-doc__contact-item {
    min-width: 0;
  }

  .invoice-doc__contact-label {
    display: block;
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    font-weight: 700;
    margin-bottom: 3pt;
  }

  .invoice-doc__contact-value {
    font-size: 10pt;
    color: #334155;
    line-height: 1.4;
    word-break: break-word;
  }

  .invoice-doc__contact-value a {
    color: inherit;
    text-decoration: none;
  }

  .invoice-doc__status {
    display: inline-block;
    padding: 2pt 8pt;
    border-radius: 999px;
    font-size: 8pt;
    font-weight: 700;
    background: #dcfce7;
    color: #15803d;
    text-transform: uppercase;
    letter-spacing: 0.04em;
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
