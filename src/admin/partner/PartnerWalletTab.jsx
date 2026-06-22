import { useEffect, useMemo, useState } from 'react';
import {
  MdAccountBalanceWallet,
  MdHistory,
  MdHourglassTop,
  MdPayments,
  MdTrendingUp,
} from 'react-icons/md';
import {
  PAYOUT_METHOD_LABELS,
  WITHDRAWAL_STATUS_LABELS,
  getPayoutMethodFields,
} from '../../data/partnerPayoutMethods';
import { formatAmount } from '../../data/partnerServiceCatalog';

export default function PartnerWalletTab({ api, onMessage }) {
  const [earningsData, setEarningsData] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [payoutData, setPayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyTab, setHistoryTab] = useState('earnings');
  const [amount, setAmount] = useState('');
  const [selectedMethodId, setSelectedMethodId] = useState('');
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: 'bank' });
  const [submitting, setSubmitting] = useState(false);
  const [savingMethod, setSavingMethod] = useState(false);
  const [deletingMethodId, setDeletingMethodId] = useState('');
  const [feedback, setFeedback] = useState(null);

  const summary = earningsData?.summary || {};
  const currency = summary.currency || payoutData?.currency || 'NGN';
  const availableBalance = summary.availableBalance || 0;
  const pendingEarnings = summary.pendingEarnings || 0;
  const savedMethods = payoutData?.savedMethods || [];
  const minWithdrawal = payoutData?.minWithdrawalNgn || 5000;

  const showFeedback = (message) => {
    setFeedback(message);
    onMessage?.(message);
  };

  const resolveDefaultMethodId = (methods, current) => {
    if (!methods.length) return '';
    if (current && methods.some((method) => method.id === current)) return current;
    const pick = methods.find((method) => method.isDefault) || methods[0];
    return pick?.id || '';
  };

  const load = async () => {
    try {
      const [earnings, w, p] = await Promise.all([
        api.getEarnings(),
        api.getWithdrawals(),
        api.getPayoutMethods(),
      ]);
      setEarningsData(earnings);
      setWithdrawals(w.withdrawals || []);
      setPayoutData(p);
      setSelectedMethodId((current) => resolveDefaultMethodId(p.savedMethods || [], current));
    } catch (err) {
      showFeedback({ type: 'error', text: err.message || 'Failed to load wallet.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddMethod = async () => {
    try {
      setSavingMethod(true);
      setFeedback(null);
      const verifyingBank = newMethod.type === 'bank' && payoutData?.paystackTransfersEnabled;
      if (verifyingBank) {
        showFeedback({
          type: 'info',
          text: 'Verifying your bank account with Paystack. This may take a few seconds…',
        });
      }
      await api.savePayoutMethod(newMethod);
      showFeedback({
        type: 'success',
        text: verifyingBank
          ? 'Bank account verified and saved with Paystack.'
          : 'Payout method saved.',
      });
      setShowAddMethod(false);
      setNewMethod({ type: 'bank' });
      await load();
    } catch (err) {
      showFeedback({ type: 'error', text: err.message });
    } finally {
      setSavingMethod(false);
    }
  };

  const handleDeleteMethod = async (methodId) => {
    if (!methodId) return;
    if (!window.confirm('Remove this payout method?')) return;

    try {
      setDeletingMethodId(methodId);
      setFeedback(null);
      await api.deletePayoutMethod(methodId);
      if (selectedMethodId === methodId) {
        setSelectedMethodId('');
      }
      showFeedback({ type: 'success', text: 'Payout method removed.' });
      await load();
    } catch (err) {
      showFeedback({ type: 'error', text: err.message || 'Failed to remove payout method.' });
    } finally {
      setDeletingMethodId('');
    }
  };

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      showFeedback({ type: 'error', text: 'Enter a valid withdrawal amount.' });
      return;
    }
    if (withdrawAmount < minWithdrawal) {
      showFeedback({ type: 'error', text: `Minimum withdrawal is ₦${minWithdrawal.toLocaleString()}.` });
      return;
    }
    if (!selectedMethodId) {
      showFeedback({ type: 'error', text: 'Select a payout method first.' });
      return;
    }
    if (withdrawAmount > availableBalance) {
      showFeedback({
        type: 'error',
        text: `Insufficient available balance (${formatAmount(availableBalance, currency)}).${
          pendingEarnings > 0
            ? ` You have ${formatAmount(pendingEarnings, currency)} still pending from active orders.`
            : ''
        }`,
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
      setHistoryTab('withdrawals');
      await load();
    } catch (err) {
      showFeedback({ type: 'error', text: err.message || 'Withdrawal request failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const withdrawHint = useMemo(() => {
    if (!amount && !selectedMethodId && savedMethods.length === 0) {
      return 'Add a payout method to withdraw your earnings.';
    }
    if (!selectedMethodId && savedMethods.length > 0) {
      return 'Choose a payout method above.';
    }
    if (availableBalance <= 0) {
      return pendingEarnings > 0
        ? `${formatAmount(pendingEarnings, currency)} is pending and will become withdrawable when orders are completed.`
        : 'No withdrawable balance yet. Earnings appear here after paid orders are completed.';
    }
    if (Number(amount) > availableBalance) {
      return `Amount exceeds available balance (${formatAmount(availableBalance, currency)}).`;
    }
    if (Number(amount) > 0 && Number(amount) < minWithdrawal) {
      return `Minimum withdrawal is ${formatAmount(minWithdrawal, currency)}.`;
    }
    return null;
  }, [
    amount,
    availableBalance,
    currency,
    minWithdrawal,
    pendingEarnings,
    savedMethods.length,
    selectedMethodId,
  ]);

  if (loading) {
    return (
      <div className="pdash-panel pdash-wallet-loading">
        <div className="pdash-spinner" />
        <p>Loading your wallet…</p>
      </div>
    );
  }

  const bankOptions =
    payoutData?.paystackBanks?.length > 0
      ? payoutData.paystackBanks.map((bank) => bank.name)
      : payoutData?.nigeriaBanks || [];
  const fields = getPayoutMethodFields(newMethod.type, { bankOptions });

  return (
    <div className="pdash-wallet">
      {feedback ? <div className={`pdash-alert ${feedback.type}`}>{feedback.text}</div> : null}

      <section className="pdash-wallet-hero">
        <div className="pdash-wallet-hero-copy">
          <span className="pdash-wallet-eyebrow">Available to withdraw</span>
          <div className="pdash-wallet-balance">{formatAmount(availableBalance, currency)}</div>
          <p>
            {pendingEarnings > 0
              ? `${formatAmount(pendingEarnings, currency)} pending from active orders.`
              : 'Withdraw to your saved bank account or payout method.'}
          </p>
        </div>
        <div className="pdash-wallet-hero-stats">
          <div>
            <span>Total earned</span>
            <strong>{formatAmount(summary.totalEarnings, currency)}</strong>
          </div>
          <div>
            <span>Total withdrawn</span>
            <strong>{formatAmount(summary.totalWithdrawals, currency)}</strong>
          </div>
        </div>
      </section>

      <div className="pdash-stats pdash-stats--wallet">
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdAccountBalanceWallet size={20} /></div>
          <div className="pdash-stat-value">{formatAmount(availableBalance, currency)}</div>
          <div className="pdash-stat-label">Available</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdHourglassTop size={20} /></div>
          <div className="pdash-stat-value">{formatAmount(pendingEarnings, currency)}</div>
          <div className="pdash-stat-label">Pending</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdTrendingUp size={20} /></div>
          <div className="pdash-stat-value">{formatAmount(summary.totalEarnings, currency)}</div>
          <div className="pdash-stat-label">Total earned</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdPayments size={20} /></div>
          <div className="pdash-stat-value">{formatAmount(summary.totalWithdrawals, currency)}</div>
          <div className="pdash-stat-label">Withdrawn</div>
        </div>
      </div>

      <div className="pdash-wallet-grid">
        <div className="pdash-panel pdash-wallet-withdraw">
          <h2>Request withdrawal</h2>
          {payoutData?.paystackTransfersEnabled && (
            <p className="pdash-panel-lead">
              Nigerian bank payouts via Paystack
              {payoutData?.autoPayoutEnabled ? ' (automatic)' : ' after admin approval'}.
              Minimum {formatAmount(minWithdrawal, currency)}.
            </p>
          )}
          <div className="pdash-field">
            <label>Amount ({currency})</label>
            <input
              type="number"
              min={minWithdrawal}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={String(minWithdrawal)}
            />
          </div>
          <div className="pdash-field">
            <label>Payout method</label>
            <select value={selectedMethodId} onChange={(e) => setSelectedMethodId(e.target.value)}>
              <option value="">Select method</option>
              {savedMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.label || PAYOUT_METHOD_LABELS[method.type]} —{' '}
                  {method.accountNumber || method.email || method.walletAddress}
                </option>
              ))}
            </select>
          </div>
          {withdrawHint ? <p className="pdash-wallet-hint">{withdrawHint}</p> : null}
          <button
            type="button"
            className="pdash-btn pdash-btn-primary pdash-wallet-submit"
            onClick={handleWithdraw}
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Request withdrawal'}
          </button>
        </div>

        <div className="pdash-panel pdash-wallet-methods">
          <h2>Payout methods</h2>
          <p className="pdash-panel-lead">
            Available in {payoutData?.country}:{' '}
            {(payoutData?.availableMethods || []).map((method) => method.label).join(', ')}
          </p>
          {savedMethods.map((method) => (
            <div key={method.id} className="pdash-payout-card">
              <div className="pdash-payout-card-head">
                <strong>{PAYOUT_METHOD_LABELS[method.type]}</strong>
                <button
                  type="button"
                  className="pdash-payout-delete"
                  onClick={() => handleDeleteMethod(method.id)}
                  disabled={Boolean(deletingMethodId) || savingMethod}
                >
                  {deletingMethodId === method.id ? (
                    <span className="pdash-payout-delete-loading">
                      <span className="pdash-spinner pdash-spinner-inline" aria-hidden="true" />
                      Removing…
                    </span>
                  ) : (
                    'Remove'
                  )}
                </button>
              </div>
              <span>{method.bankName || method.email || method.network}</span>
              <span>{method.accountNumber || method.walletAddress || ''}</span>
              {method.type === 'bank' && payoutData?.paystackTransfersEnabled ? (
                method.paystackRecipientCode ? (
                  <span className="pdash-payout-verified">Paystack verified</span>
                ) : (
                  <span className="pdash-payout-unverified">Not verified with Paystack</span>
                )
              ) : null}
            </div>
          ))}
          {!showAddMethod ? (
            <button
              type="button"
              className="pdash-btn pdash-btn-ghost"
              onClick={() => setShowAddMethod(true)}
            >
              Add payout method
            </button>
          ) : (
            <div className="pdash-payout-form">
              {savingMethod ? (
                <div className="pdash-payout-verifying" role="status" aria-live="polite">
                  <div className="pdash-spinner" />
                  <p>
                    {newMethod.type === 'bank' && payoutData?.paystackTransfersEnabled
                      ? 'Verifying bank account with Paystack…'
                      : 'Saving payout method…'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="pdash-field">
                    <label>Method type</label>
                    <select
                      value={newMethod.type}
                      onChange={(e) => setNewMethod({ type: e.target.value })}
                    >
                      {(payoutData?.availableMethods || []).map((method) => (
                        <option key={method.type} value={method.type}>
                          {method.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {fields.map((field) => (
                    <div key={field.key} className="pdash-field">
                      <label>{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          value={newMethod[field.key] || ''}
                          onChange={(e) =>
                            setNewMethod({ ...newMethod, [field.key]: e.target.value })
                          }
                        >
                          <option value="">Select</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          value={newMethod[field.key] || ''}
                          onChange={(e) =>
                            setNewMethod({ ...newMethod, [field.key]: e.target.value })
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div className="pdash-wallet-form-actions">
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-primary"
                      onClick={handleAddMethod}
                    >
                      Save method
                    </button>
                    <button
                      type="button"
                      className="pdash-btn pdash-btn-ghost"
                      onClick={() => setShowAddMethod(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pdash-panel pdash-wallet-history">
        <div className="pdash-wallet-history-head">
          <h2><MdHistory size={22} /> Activity</h2>
          <div className="pdash-wallet-history-tabs">
            <button
              type="button"
              className={historyTab === 'earnings' ? 'active' : ''}
              onClick={() => setHistoryTab('earnings')}
            >
              Earnings
            </button>
            <button
              type="button"
              className={historyTab === 'withdrawals' ? 'active' : ''}
              onClick={() => setHistoryTab('withdrawals')}
            >
              Withdrawals
            </button>
          </div>
        </div>

        {historyTab === 'earnings' ? (
          !earningsData?.transactions?.length ? (
            <p className="pdash-panel-lead">No paid orders yet.</p>
          ) : (
            <div className="pdash-table-wrap">
              <table className="pdash-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Client price</th>
                    <th>Your profit</th>
                    <th>Bluetick share</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {earningsData.transactions.map((tx) => (
                    <tr key={tx.orderId}>
                      <td>{tx.email}</td>
                      <td>{formatAmount(tx.clientPrice, currency)}</td>
                      <td className="pdash-profit">{formatAmount(tx.partnerProfit, currency)}</td>
                      <td>{formatAmount(tx.bluetickRevenue, currency)}</td>
                      <td>{tx.projectStatus || tx.status}</td>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : !withdrawals.length ? (
          <p className="pdash-panel-lead">No withdrawals yet.</p>
        ) : (
          <div className="pdash-table-wrap">
            <table className="pdash-table">
              <thead>
                <tr>
                  <th>Withdrawal ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id || withdrawal.withdrawalId}>
                    <td>{withdrawal.withdrawalId}</td>
                    <td>{new Date(withdrawal.createdAt).toLocaleDateString()}</td>
                    <td>{formatAmount(withdrawal.amount, withdrawal.currency)}</td>
                    <td>
                      {PAYOUT_METHOD_LABELS[withdrawal.payoutMethod?.type] ||
                        withdrawal.payoutMethod?.type}
                    </td>
                    <td>
                      <span className={`adm-badge ${withdrawal.status}`}>
                        {WITHDRAWAL_STATUS_LABELS[withdrawal.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
