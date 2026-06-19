import { useEffect, useState } from 'react';
import { formatAmount } from '../../data/partnerServiceCatalog';

export default function PartnerEarningsTab({ api }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEarnings().then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pdash-panel"><div className="pdash-spinner" /></div>;

  const s = data?.summary || {};

  return (
    <>
      <div className="pdash-stats">
        <div className="pdash-stat">
          <div className="pdash-stat-value">{formatAmount(s.availableBalance, s.currency)}</div>
          <div className="pdash-stat-label">Available Balance</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-value">{formatAmount(s.pendingEarnings, s.currency)}</div>
          <div className="pdash-stat-label">Pending Earnings</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-value">{formatAmount(s.withdrawableBalance, s.currency)}</div>
          <div className="pdash-stat-label">Withdrawable Balance</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-value">{formatAmount(s.totalEarnings, s.currency)}</div>
          <div className="pdash-stat-label">Total Earnings</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-value">{formatAmount(s.totalWithdrawals, s.currency)}</div>
          <div className="pdash-stat-label">Total Withdrawals</div>
        </div>
      </div>

      <div className="pdash-panel">
        <h2>Earnings History</h2>
        {!data?.transactions?.length ? (
          <p className="pdash-panel-lead">No paid orders yet.</p>
        ) : (
          <div className="pdash-table-wrap">
            <table className="pdash-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Client Price</th>
                  <th>Your Profit</th>
                  <th>Bluetick Revenue</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions.map((tx) => (
                  <tr key={tx.orderId}>
                    <td>{tx.email}</td>
                    <td>{formatAmount(tx.clientPrice, s.currency)}</td>
                    <td className="pdash-profit">{formatAmount(tx.partnerProfit, s.currency)}</td>
                    <td>{formatAmount(tx.bluetickRevenue, s.currency)}</td>
                    <td>{tx.projectStatus || tx.status}</td>
                    <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
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
