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
  const [availableBalance, setAvailableBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: 'bank' });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showFeedback = (message) => {
    setFeedback(message);
    onMessage?.(message);
  };

  const load = async () => {
    try {
      const [w, p, earnings] = await Promise.all([
        api.getWithdrawals(),
        api.getPayoutMethods(),
        api.getEarnings().catch(() => null),
      ]);
      setWithdrawals(w.withdrawals || []);
      setPayoutData(p);
      setAvailableBalance(earnings?.summary?.availableBalance || 0);

      const methods = p.savedMethods || [];
      if (methods.length) {
        const defaultMethod = methods.find((m) => m.isDefault) || methods[0];
        if (defaultMethod?.id) {
          setSelectedMethodId((current) => current || defaultMethod.id);
        }
      }
    } catch (err) {
      showFeedback({ type: 'error', text: err.message || 'Failed to load withdrawals.' });
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
      showFeedback({ type: 'success', text: 'Payout method saved.' });
      setShowAddMethod(false);
      setNewMethod({ type: 'bank' });
      await load();
    } catch (err) {
      showFeedback({ type: 'error', text: err.message });
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      showFeedback({ type: 'error', text: 'Enter a valid withdrawal amount.' });
      return;
    }
    if (!selectedMethodId) {
      showFeedback({ type: 'error', text: 'Select a payout method first.' });
      return;
    }
    if (withdrawAmount > availableBalance) {
      showFeedback({
        type: 'error',
        text: `Insufficient balance. Available: ${formatAmount(availableBalance, payoutData?.currency || 'NGN')}`,
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const result = await api.requestWithdrawal({
        amount: withdrawAmount,
        payoutMethodId: selectedMethodId,
      });
      const successText = result.autoPayout
        ? 'Withdrawal submitted and Paystack transfer initiated.'
        : result.autoPayoutError
          ? `Withdrawal submitted (pending review). Paystack note: ${result.autoPayoutError}`
          : 'Withdrawal request submitted and is pending review.';
      showFeedback({ type: 'success', text: successText });
      setAmount('');
      await load();
    } catch (err) {
      showFeedback({ type: 'error', text: err.message || 'Withdrawal request failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  const bankOptions =
    payoutData?.paystackBanks?.length > 0
      ? payoutData.paystackBanks.map((bank) => bank.name)
      : payoutData?.nigeriaBanks || [];
  const fields = getPayoutMethodFields(newMethod.type, { bankOptions });
  const minWithdrawal = payoutData?.minWithdrawalNgn || 5000;

  return (
    <>
      {feedback ? <div className={`pdash-alert ${feedback.type}`}>{feedback.text}</div> : null}

      <div className="pdash-grid-2">
        <div className="pdash-panel">
          <h2>Request Withdrawal</h2>
          <p className="pdash-panel-lead">
            Available balance:{' '}
            <strong>{formatAmount(availableBalance, payoutData?.currency || 'NGN')}</strong>
          </p>
          {payoutData?.paystackTransfersEnabled && (
            <p className="pdash-panel-lead">
              Nigerian bank withdrawals are paid via Paystack
              {payoutData?.autoPayoutEnabled ? ' automatically' : ' after admin approval'}.
              Minimum: ₦{minWithdrawal.toLocaleString()}.
            </p>
          )}
          <div className="pdash-field">
            <label>Amount (NGN)</label>
            <input
              type="number"
              min={minWithdrawal}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(minWithdrawal)}
            />
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
          {(payoutData?.savedMethods || []).length === 0 && (
            <p className="pdash-panel-lead">Add a payout method before requesting a withdrawal.</p>
          )}
          <button
            type="button"
            className="pdash-btn pdash-btn-primary"
            onClick={handleWithdraw}
            disabled={submitting || !amount || !selectedMethodId || availableBalance <= 0}
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
              {m.paystackRecipientCode && <span>Paystack verified</span>}
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
