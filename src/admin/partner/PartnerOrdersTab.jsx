import { useEffect, useState } from 'react';
import { MdChat } from 'react-icons/md';
import { formatAmount } from '../../data/partnerServiceCatalog';
import { getOrderServiceLabel } from '../utils/orderServices';
import OrderTrackingControl from '../../components/OrderTrackingControl';
import InvoiceModal from '../../components/invoice/InvoiceModal';
import { buildPartnerInvoiceFromOrder } from '../../components/invoice/invoiceUtils';

const STATUS_LABELS = {
  completed: 'Completed',
  in_progress: 'In Progress',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function PartnerOrdersTab({ orders = [], overviewOrders, api, branding }) {
  const initialList = orders.length ? orders : overviewOrders || [];
  const [list, setList] = useState(initialList);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceMap, setInvoiceMap] = useState({});

  useEffect(() => {
    setList(orders.length ? orders : overviewOrders || []);
  }, [orders, overviewOrders]);

  useEffect(() => {
    if (!api?.getInvoices) return;
    api
      .getInvoices()
      .then((data) => {
        const next = {};
        (data.invoices || []).forEach((invoice) => {
          if (invoice.orderId) {
            next[String(invoice.orderId)] = invoice;
          }
        });
        setInvoiceMap(next);
      })
      .catch(() => {});
  }, [api]);

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const handleSaveTracking = async (orderId, payload) => {
    if (!api?.updateOrderTracking) {
      throw new Error('Tracking updates are unavailable. Redeploy the backend to enable this feature.');
    }
    const data = await api.updateOrderTracking(orderId, payload);
    const updated = data.order;
    setList((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, ...updated } : order))
    );
  };

  const openInvoice = (order) => {
    const enriched = invoiceMap[String(order.id)];
    if (enriched) {
      setSelectedInvoice(enriched);
      return;
    }
    setSelectedInvoice(buildPartnerInvoiceFromOrder(order, branding));
  };

  return (
    <>
      {selectedInvoice ? (
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      ) : null}

      <div className="pdash-panel">
      <h2>Orders</h2>
      <p className="pdash-panel-lead">
        Track orders placed on your storefront and share progress updates with your clients.
      </p>

      {!list.length ? (
        <div className="adm-empty" style={{ border: 'none' }}>
          <div className="adm-empty-emoji">🛍️</div>
          <p style={{ margin: 0 }}>No orders yet — share your site link to get started.</p>
        </div>
      ) : (
        <div className="pdash-orders-grid">
          {list.map((order) => {
            const isExpanded = expandedOrders[order.id];
            return (
              <div key={order.id} className={`pdash-order-card${isExpanded ? ' expanded' : ''}`}>
                <div className="pdash-order-top">
                  <h3>{order.email}</h3>
                  <span className={`adm-badge ${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                {order.tracking?.projectStatusLabel ? (
                  <div className="pdash-order-project">
                    Project: {order.tracking.projectStatusLabel}
                  </div>
                ) : null}
                <div className="pdash-order-services">{getOrderServiceLabel(order)}</div>
                <div className="pdash-order-foot">
                  <div>
                    <div className="pdash-order-amount">{formatAmount(order.totalAmount, order.currency)}</div>
                    {order.partnerProfit != null ? (
                      <div className="pdash-order-profit">Profit: {formatAmount(order.partnerProfit, order.currency)}</div>
                    ) : null}
                    <div className="pdash-order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="pdash-order-foot-actions">
                    <span className={`adm-badge ${order.paymentStatus === 'paid' ? 'completed' : 'pending'}`}>
                      {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                    </span>
                    {order.paymentStatus === 'paid' ? (
                      <button
                        type="button"
                        className="pdash-btn pdash-btn-ghost"
                        style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                        onClick={() => openInvoice(order)}
                      >
                        View Invoice
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-ghost"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => toggleOrder(order.id)}
                    >
                      {isExpanded ? 'Hide tracking' : 'Manage tracking'}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <OrderTrackingControl
                    order={order}
                    onSave={(payload) => handleSaveTracking(order.id, payload)}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      )}
      </div>
    </>
  );
}

export function PartnerClientsTab({ api, onMessageClient }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getClients()
      .then((d) => setClients(d.clients || []))
      .catch((err) => setError(err.message || 'Failed to load clients'))
      .finally(() => setLoading(false));
  }, [api]);

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  if (error) {
    return (
      <div className="pdash-panel">
        <div className="pdash-alert error">{error}</div>
        <p className="pdash-panel-lead">
          Client data could not be loaded. If the API route is missing, redeploy the backend to pick up the latest partner dashboard routes.
        </p>
      </div>
    );
  }

  return (
    <div className="pdash-panel">
      <h2>Clients</h2>
      <p className="pdash-panel-lead">Everyone who signed up, logged in, or ordered on your site.</p>
      {!clients.length ? (
        <p className="pdash-panel-lead">No site users yet. Users appear here after they create an account or place an order.</p>
      ) : (
        <div className="pdash-table-wrap">
          <table className="pdash-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Last Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.email}>
                  <td>{c.name || c.email}</td>
                  <td>{c.orderCount}</td>
                  <td>{formatAmount(c.totalSpent)}</td>
                  <td>{c.lastOrderAt ? formatDate(c.lastOrderAt) : '—'}</td>
                  <td>
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-ghost"
                      style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                      onClick={() => onMessageClient?.(c)}
                    >
                      <MdChat size={14} /> Message
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
