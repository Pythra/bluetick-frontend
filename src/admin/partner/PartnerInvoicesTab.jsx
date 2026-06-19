import { useEffect, useState } from 'react';
import { formatAmount } from '../../data/partnerServiceCatalog';

export default function PartnerInvoicesTab({ api }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices().then((d) => setInvoices(d.invoices || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  return (
    <div className="pdash-panel">
      <h2>Invoices & Receipts</h2>
      <p className="pdash-panel-lead">Download invoices for paid client orders on your site.</p>
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
                      onClick={() => window.print()}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
