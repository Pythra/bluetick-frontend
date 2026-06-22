import { useMemo, useState } from 'react';
import InvoiceModal from '../../components/invoice/InvoiceModal';
import { buildAdminInvoiceFromOrder } from '../../components/invoice/invoiceUtils';

function formatAmount(amount, currency = 'NGN') {
  const value = Number(amount) || 0;
  if (currency === 'USD') {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `₦${value.toLocaleString('en-NG')}`;
}

export default function AdminInvoicesTab({ users = [] }) {
  const [selected, setSelected] = useState(null);

  const invoices = useMemo(() => {
    return users
      .flatMap((user) =>
        (user.orders || [])
          .filter((order) => order.paymentStatus === 'paid')
          .map((order) => ({
            order,
            user,
            invoice: buildAdminInvoiceFromOrder({
              ...order,
              id: order.id || order._id,
              userName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              userEmail: user.email,
            }),
          }))
      )
      .sort((a, b) => new Date(b.order.createdAt) - new Date(a.order.createdAt));
  }, [users]);

  return (
    <>
      {selected ? <InvoiceModal invoice={selected} onClose={() => setSelected(null)} /> : null}

      <div className="adm-panel">
        <h2 className="adm-panel-title">Invoices & Receipts</h2>
        <p className="adm-panel-lead">
          View and print branded invoices for paid orders on the main site.
        </p>

        {!invoices.length ? (
          <div className="adm-empty">
            <div className="adm-empty-emoji">🧾</div>
            <p>No paid orders yet.</p>
          </div>
        ) : (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {invoices.map(({ invoice, user, order }) => (
                  <tr key={`${invoice.invoiceId}-${order.id || order._id}`}>
                    <td>{invoice.invoiceId}</td>
                    <td>
                      {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
                    </td>
                    <td>{formatAmount(order.totalAmount, order.currency)}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        className="adm-btn adm-btn-ghost"
                        onClick={() => setSelected(invoice)}
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
