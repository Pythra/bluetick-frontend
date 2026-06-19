import { useEffect, useState } from 'react';
import {
  PAYOUT_METHOD_LABELS,
  WITHDRAWAL_STATUS_LABELS,
  getPayoutMethodFields,
} from '../../data/partnerPayoutMethods';
import { formatAmount } from '../../data/partnerServiceCatalog';

export default function PartnerWithdrawalsTab({ api, onMessage }) {
  const [withdrawals, setWithdrawals] = useState([]);
  const [payoutData, setPayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: 'bank' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const [w, p] = await Promise.all([api.getWithdrawals(), api.getPayoutMethods()]);
      setWithdrawals(w.withdrawals || []);
      setPayoutData(p);
      if (!selectedMethodId && p.savedMethods?.length) {
        const defaultMethod = p.savedMethods.find((m) => m.isDefault) || p.savedMethods[0];
        setSelectedMethodId(defaultMethod.id);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddMethod = async () => {
    try {
      await api.savePayoutMethod(newMethod);
      onMessage?.({ type: 'success', text: 'Payout method saved.' });
      setShowAddMethod(false);
      setNewMethod({ type: 'bank' });
      await load();
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    }
  };

  const handleWithdraw = async () => {
    try {
      setSubmitting(true);
      await api.requestWithdrawal({
        amount: Number(amount),
        payoutMethodId: selectedMethodId,
      });
      onMessage?.({ type: 'success', text: 'Withdrawal request submitted.' });
      setAmount('');
      await load();
    } catch (err) {
      onMessage?.({ type: 'error', text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  const fields = getPayoutMethodFields(newMethod.type);

  return (
    <>
      <div className="pdash-grid-2">
        <div className="pdash-panel">
          <h2>Request Withdrawal</h2>
          <div className="pdash-field">
            <label>Amount (NGN)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>
          <div className="pdash-field">
            <label>Payout Method</label>
            <select value={selectedMethodId} onChange={(e) => setSelectedMethodId(e.target.value)}>
              <option value="">Select method</option>
              {(payoutData?.savedMethods || []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label || PAYOUT_METHOD_LABELS[m.type]} — {m.accountNumber || m.email || m.walletAddress}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="pdash-btn pdash-btn-primary"
            onClick={handleWithdraw}
            disabled={submitting || !amount || !selectedMethodId}
          >
            {submitting ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </div>

        <div className="pdash-panel">
          <h2>Payout Methods</h2>
          <p className="pdash-panel-lead">
            Available in {payoutData?.country}:{' '}
            {(payoutData?.availableMethods || []).map((m) => m.label).join(', ')}
          </p>
          {(payoutData?.savedMethods || []).map((m) => (
            <div key={m.id} className="pdash-payout-card">
              <strong>{PAYOUT_METHOD_LABELS[m.type]}</strong>
              <span>{m.bankName || m.email || m.network}</span>
              <span>{m.accountNumber || m.walletAddress || ''}</span>
            </div>
          ))}
          {!showAddMethod ? (
            <button type="button" className="pdash-btn pdash-btn-ghost" onClick={() => setShowAddMethod(true)}>
              Add Payout Method
            </button>
          ) : (
            <div className="pdash-payout-form">
              <div className="pdash-field">
                <label>Method Type</label>
                <select
                  value={newMethod.type}
                  onChange={(e) => setNewMethod({ type: e.target.value })}
                >
                  {(payoutData?.availableMethods || []).map((m) => (
                    <option key={m.type} value={m.type}>{m.label}</option>
                  ))}
                </select>
              </div>
              {fields.map((f) => (
                <div key={f.key} className="pdash-field">
                  <label>{f.label}</label>
                  {f.type === 'select' ? (
                    <select
                      value={newMethod[f.key] || ''}
                      onChange={(e) => setNewMethod({ ...newMethod, [f.key]: e.target.value })}
                    >
                      <option value="">Select</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type={f.type}
                      value={newMethod[f.key] || ''}
                      onChange={(e) => setNewMethod({ ...newMethod, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="pdash-btn pdash-btn-primary" onClick={handleAddMethod}>
                  Save Method
                </button>
                <button type="button" className="pdash-btn pdash-btn-ghost" onClick={() => setShowAddMethod(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pdash-panel">
        <h2>Withdrawal History</h2>
        {!withdrawals.length ? (
          <p className="pdash-panel-lead">No withdrawals yet.</p>
        ) : (
          <div className="pdash-table-wrap">
            <table className="pdash-table">
              <thead>
                <tr>
                  <th>Withdrawal ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Payout Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w._id || w.withdrawalId}>
                    <td>{w.withdrawalId}</td>
                    <td>{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td>{formatAmount(w.amount, w.currency)}</td>
                    <td>{PAYOUT_METHOD_LABELS[w.payoutMethod?.type] || w.payoutMethod?.type}</td>
                    <td><span className={`adm-badge ${w.status}`}>{WITHDRAWAL_STATUS_LABELS[w.status]}</span></td>
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
