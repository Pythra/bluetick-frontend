import { useRef } from 'react';
import { MdClose, MdPrint } from 'react-icons/md';
import { formatAmount } from '../../data/partnerServiceCatalog';

const INVOICE_PRINT_STYLES = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; }
  .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
  .inv-title { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; color: #0f172a; }
  .inv-meta { text-align: right; font-size: 13px; color: #475569; line-height: 1.8; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
  .inv-footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
`;

export function orderToInvoice(order, brandName, userEmail) {
  const orderId = String(order._id || '');
  return {
    invoiceId: `INV-${orderId.slice(-8).toUpperCase()}`,
    orderId,
    createdAt: order.createdAt,
    clientEmail: order.email || userEmail,
    brandName: brandName || 'Bluetickgeng Development',
    amount: order.totalAmount,
    currency: order.currency || 'NGN',
    items: order.cartItems || [],
    productName: order.productName,
  };
}

export default function UserInvoiceModal({ invoice, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.invoiceId}</title><style>${INVOICE_PRINT_STYLES}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

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

  return (
    <div
      className="my-account-invoice-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="my-account-invoice-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Invoice"
      >
        <div className="my-account-invoice-toolbar">
          <strong>Invoice {invoice.invoiceId}</strong>
          <div className="my-account-invoice-actions">
            <button type="button" className="my-account-invoice-btn" onClick={handlePrint}>
              <MdPrint size={16} aria-hidden="true" />
              Print / Save PDF
            </button>
            <button type="button" className="my-account-invoice-close" onClick={onClose} aria-label="Close">
              <MdClose size={18} />
            </button>
          </div>
        </div>

        <div ref={printRef} className="my-account-invoice-body">
          <div className="my-account-invoice-header">
            <div className="my-account-invoice-title">INVOICE</div>
            <div className="my-account-invoice-meta">
              <div><strong>Invoice No:</strong> {invoice.invoiceId}</div>
              <div><strong>Date Issued:</strong> {issueDate}</div>
              <div>
                <strong>Status:</strong>{' '}
                <span className="my-account-invoice-status">Paid</span>
              </div>
            </div>
          </div>

          <div className="my-account-invoice-parties">
            <div>
              <div className="my-account-invoice-party-label">Billed To</div>
              <div className="my-account-invoice-party-name">{invoice.clientEmail}</div>
            </div>
            {invoice.brandName ? (
              <div>
                <div className="my-account-invoice-party-label">Issued By</div>
                <div className="my-account-invoice-party-name">{invoice.brandName}</div>
              </div>
            ) : null}
          </div>

          <table className="my-account-invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.itemId || item.title || index}>
                  <td>{item.title || item.productName || item.name || item.category || 'Service'}</td>
                  <td>{item.quantity || 1}</td>
                  <td>{formatAmount(item.productPrice ?? item.price ?? subtotal, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="my-account-invoice-totals">
            <div className="my-account-invoice-total-row">
              <span>Subtotal</span>
              <span>{formatAmount(subtotal, currency)}</span>
            </div>
            <div className="my-account-invoice-total-row my-account-invoice-total-row--grand">
              <span>Total</span>
              <span>{formatAmount(subtotal, currency)}</span>
            </div>
          </div>

          <div className="my-account-invoice-footer">
            Thank you for your business. This receipt was generated upon payment confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
