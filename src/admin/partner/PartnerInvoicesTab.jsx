import { useEffect, useRef, useState } from 'react';
import { MdPrint, MdClose } from 'react-icons/md';
import { formatAmount } from '../../data/partnerServiceCatalog';

function InvoiceModal({ invoice, onClose }) {
  const printRef = useRef(null);

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice ${invoice.invoiceId}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; padding: 40px; }
  .inv-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
  .inv-title { font-size: 32px; font-weight: 700; letter-spacing: -0.02em; color: #0f172a; }
  .inv-meta { text-align: right; font-size: 13px; color: #475569; line-height: 1.8; }
  .inv-parties { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
  .inv-party-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; margin-bottom: 6px; }
  .inv-party-name { font-size: 15px; font-weight: 600; }
  .inv-party-detail { font-size: 13px; color: #475569; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { background: #f8fafc; padding: 10px 14px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; border-bottom: 1px solid #e2e8f0; }
  td { padding: 12px 14px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
  .inv-totals { border-top: 2px solid #e2e8f0; padding-top: 16px; text-align: right; }
  .inv-total-row { display: flex; justify-content: flex-end; gap: 48px; padding: 4px 0; font-size: 14px; }
  .inv-total-row.grand { font-size: 18px; font-weight: 700; padding-top: 10px; border-top: 1px solid #e2e8f0; margin-top: 8px; }
  .inv-footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
  .status-badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; background: #dcfce7; color: #15803d; }
</style></head><body>${content}</body></html>`);
    win.document.close();
    win.focus();
    win.print();
  };

  const issueDate = new Date(invoice.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const subtotal = Number(invoice.amount) || 0;
  const currency = invoice.currency || 'NGN';
  const items = invoice.items || [];

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={onClose}
      role="presentation"
    >
      <div
        style={{ background: '#fff', borderRadius: 12, maxWidth: 780, width: '100%', maxHeight: '92vh', overflow: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Invoice"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <strong style={{ fontSize: '1rem' }}>Invoice {invoice.invoiceId}</strong>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="pdash-btn pdash-btn-secondary" onClick={handlePrint}>
              <MdPrint size={15} /> Print / Save PDF
            </button>
            <button type="button" className="pdash-btn pdash-btn-ghost" onClick={onClose} aria-label="Close">
              <MdClose size={18} />
            </button>
          </div>
        </div>

        <div ref={printRef} style={{ padding: '36px 40px' }}>
          <div className="inv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, borderBottom: '2px solid #e2e8f0', paddingBottom: 20 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: '#0f172a' }}>INVOICE</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: '#475569', lineHeight: 1.8 }}>
              <div><strong>Invoice No:</strong> {invoice.invoiceId}</div>
              <div><strong>Date Issued:</strong> {issueDate}</div>
              <div><strong>Status:</strong> <span className="status-badge" style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: '#dcfce7', color: '#15803d' }}>Paid</span></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 6 }}>Billed To</div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{invoice.clientEmail}</div>
            </div>
            {invoice.brandName && (
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: 6 }}>Issued By</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{invoice.brandName}</div>
              </div>
            )}
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
            <thead>
              <tr>
                <th style={{ background: '#f8fafc', padding: '10px 14px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Description</th>
                <th style={{ background: '#f8fafc', padding: '10px 14px', textAlign: 'right', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Qty</th>
                <th style={{ background: '#f8fafc', padding: '10px 14px', textAlign: 'right', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? items.map((item, i) => (
                <tr key={item._id || i}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                    {item.productName || item.name || item.category || 'Service'}
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14, textAlign: 'right' }}>1</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14, textAlign: 'right' }}>
                    {formatAmount(item.productPrice || item.price || 0, currency)}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>Professional Services</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14, textAlign: 'right' }}>1</td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', fontSize: 14, textAlign: 'right' }}>{formatAmount(subtotal, currency)}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 48, padding: '4px 0', fontSize: 14 }}>
              <span style={{ color: '#475569' }}>Subtotal</span>
              <span>{formatAmount(subtotal, currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 48, padding: '12px 0 4px', fontSize: 18, fontWeight: 700, borderTop: '2px solid #e2e8f0', marginTop: 8 }}>
              <span>Total</span>
              <span>{formatAmount(subtotal, currency)}</span>
            </div>
          </div>

          <div style={{ marginTop: 48, paddingTop: 16, borderTop: '1px solid #e2e8f0', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            Thank you for your business. This invoice was generated automatically upon payment confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnerInvoicesTab({ api }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getInvoices().then((d) => setInvoices(d.invoices || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  return (
    <>
      {selected && <InvoiceModal invoice={selected} onClose={() => setSelected(null)} />}

      <div className="pdash-panel">
        <h2>Invoices & Receipts</h2>
        <p className="pdash-panel-lead">View and print invoices for paid client orders on your site.</p>
        {!invoices.length ? (
          <p className="pdash-panel-lead">No invoices yet.</p>
        ) : (
          <div className="pdash-table-wrap">
            <table className="pdash-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Your Profit</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.invoiceId}>
                    <td>{inv.invoiceId}</td>
                    <td>{inv.clientEmail}</td>
                    <td>{formatAmount(inv.amount, inv.currency)}</td>
                    <td>{formatAmount(inv.partnerProfit, inv.currency)}</td>
                    <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="pdash-btn pdash-btn-ghost"
                        onClick={() => setSelected(inv)}
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
