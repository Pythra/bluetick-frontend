import { formatAmount } from '../../data/partnerServiceCatalog';
import {
  formatClientDisplayName,
  formatWebsiteLabel,
  resolveInvoiceBranding,
  resolveInvoiceLogoUrl,
} from './invoiceUtils';
import './InvoiceDocument.css';

function ContactItem({ label, value, href }) {
  if (!value) return null;
  return (
    <div className="invoice-doc__contact-item">
      <span className="invoice-doc__contact-label">{label}</span>
      {href ? (
        <a className="invoice-doc__contact-value" href={href}>
          {value}
        </a>
      ) : (
        <span className="invoice-doc__contact-value">{value}</span>
      )}
    </div>
  );
}

export default function InvoiceDocument({ invoice }) {
  const branding = resolveInvoiceBranding(invoice.branding || { brandName: invoice.brandName });
  const logoUrl = resolveInvoiceLogoUrl(branding.logoUrl, { partnerSite: branding.partnerSite });
  const accentColor = branding.primaryColor || '#2563eb';
  const clientName = formatClientDisplayName({
    firstName: invoice.clientFirstName,
    lastName: invoice.clientLastName,
    email: invoice.clientEmail,
  });

  const issueDate = new Date(invoice.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const subtotal = Number(invoice.amount) || 0;
  const currency = invoice.currency || 'NGN';
  const items = invoice.items?.length
    ? invoice.items
    : [{ title: invoice.productName || 'Professional Services', price: subtotal }];

  const websiteLabel = formatWebsiteLabel(branding.contactWebsite);
  const websiteHref = branding.contactWebsite
    ? branding.contactWebsite.startsWith('http')
      ? branding.contactWebsite
      : `https://${branding.contactWebsite.replace(/^\/+/, '')}`
    : null;

  return (
    <div className="invoice-doc">
      <header className="invoice-doc__header">
        <div className="invoice-doc__brand">
          {logoUrl ? (
            <img src={logoUrl} alt={`${branding.brandName} logo`} className="invoice-doc__logo" />
          ) : null}
          <div>
            <h1 className="invoice-doc__company">{branding.brandName}</h1>
            {branding.tagline ? <p className="invoice-doc__tagline">{branding.tagline}</p> : null}
          </div>
        </div>
        <div className="invoice-doc__meta">
          <div className="invoice-doc__title">INVOICE</div>
          <div className="invoice-doc__meta-row">
            <div>
              <strong>Invoice No:</strong> {invoice.invoiceId}
            </div>
            <div>
              <strong>Date Issued:</strong> {issueDate}
            </div>
            <div>
              <strong>Status:</strong>{' '}
              <span className="invoice-doc__status">Paid</span>
            </div>
          </div>
        </div>
      </header>

      <div className="invoice-doc__accent" style={{ background: accentColor }} aria-hidden="true" />

      <div className="invoice-doc__parties">
        <div>
          <div className="invoice-doc__party-label">Billed To</div>
          <div className="invoice-doc__party-name">{clientName}</div>
          {invoice.clientEmail ? (
            <div className="invoice-doc__party-detail">{invoice.clientEmail}</div>
          ) : null}
        </div>
        <div>
          <div className="invoice-doc__party-label">Issued By</div>
          <div className="invoice-doc__party-name">{branding.brandName}</div>
          {branding.contactEmail ? (
            <div className="invoice-doc__party-detail">{branding.contactEmail}</div>
          ) : null}
        </div>
      </div>

      <table className="invoice-doc__table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.itemId || item.title || item.productName || index}>
              <td>{item.title || item.productName || item.name || item.category || 'Service'}</td>
              <td>{item.quantity || 1}</td>
              <td>{formatAmount(item.productPrice ?? item.price ?? subtotal, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="invoice-doc__totals">
        <div className="invoice-doc__total-row">
          <span>Subtotal</span>
          <span>{formatAmount(subtotal, currency)}</span>
        </div>
        <div className="invoice-doc__total-row invoice-doc__total-row--grand">
          <span>Total Paid</span>
          <span>{formatAmount(subtotal, currency)}</span>
        </div>
      </div>

      <footer className="invoice-doc__footer">
        <p className="invoice-doc__footer-note">
          Thank you for your business. This invoice was generated upon payment confirmation and serves
          as your official receipt.
        </p>
        <div className="invoice-doc__contact-grid">
          <ContactItem label="Email" value={branding.contactEmail} href={`mailto:${branding.contactEmail}`} />
          <ContactItem label="Phone" value={branding.contactPhone} href={branding.contactPhone ? `tel:${branding.contactPhone}` : null} />
          <ContactItem label="Website" value={websiteLabel} href={websiteHref} />
        </div>
      </footer>
    </div>
  );
}
