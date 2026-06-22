import { useEffect, useState } from 'react';
import { formatAmount } from '../../data/partnerServiceCatalog';
import InvoiceModal from '../../components/invoice/InvoiceModal';

export default function PartnerInvoicesTab({ api }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.getInvoices().then((d) => setInvoices(d.invoices || [])).finally(() => setLoading(false));
  }, [api]);

  if (loading) {
    return (
      <div className="pdash-panel">
        <div className="pdash-spinner" />
      </div>
    );
  }

  return (
    <>
      {selected ? <InvoiceModal invoice={selected} onClose={() => setSelected(null)} /> : null}

      <div className="pdash-panel">
        <h2>Invoices & Receipts</h2>
        <p className="pdash-panel-lead">View and print branded invoices for paid client orders on your site.</p>
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
                  <th />
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => {
                  const clientLabel =
                    [inv.clientFirstName, inv.clientLastName].filter(Boolean).join(' ') || inv.clientEmail;
                  return (
                    <tr key={inv.invoiceId}>
                      <td>{inv.invoiceId}</td>
                      <td>{clientLabel}</td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
