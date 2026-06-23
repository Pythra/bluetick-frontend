import {
  MdInventory2,
  MdPayments,
  MdPeople,
  MdAccessTime,
  MdTrendingUp,
  MdAccountBalanceWallet,
  MdOpenInNew,
  MdCheckCircle,
} from 'react-icons/md';
import { formatAmount } from '../../data/partnerServiceCatalog';

export default function PartnerDashboardTab({
  dashboard,
  overview,
  siteSettings,
  siteUrl,
  setupChecklist,
  completionPercent,
  kycStatus = 'not_started',
  onCompleteKyc,
}) {
  const stats = dashboard?.stats || overview?.stats || {};

  return (
    <>
      {kycStatus === 'approved' ? (
        <div className="pdash-kyc-banner pdash-kyc-banner--complete">
          <strong>KYC completed</strong>
          <span>Your identity verification is approved. You can connect a custom domain from My Website → Domain.</span>
        </div>
      ) : kycStatus === 'pending' ? (
        <div className="pdash-kyc-banner pdash-kyc-banner--pending">
          <strong>KYC under review</strong>
          <span>Your documents were submitted and are awaiting approval from the Bluetick team.</span>
        </div>
      ) : (
        <div className="pdash-kyc-banner pdash-kyc-banner--action">
          <div>
            <strong>Complete your KYC</strong>
            <span>Submit identity verification from Settings before you can connect a custom domain.</span>
          </div>
          {onCompleteKyc ? (
            <button type="button" className="pdash-btn pdash-btn-primary" onClick={onCompleteKyc}>
              Complete KYC
            </button>
          ) : null}
        </div>
      )}

      <div className="pdash-stats pdash-stats--wide">
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdInventory2 size={22} /></div>
          <div className="pdash-stat-value">{stats.totalOrders ?? 0}</div>
          <div className="pdash-stat-label">Total Orders</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdPayments size={22} /></div>
          <div className="pdash-stat-value">{formatAmount(stats.totalRevenue)}</div>
          <div className="pdash-stat-label">Total Revenue</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdPeople size={22} /></div>
          <div className="pdash-stat-value">{stats.totalClients ?? 0}</div>
          <div className="pdash-stat-label">Total Clients</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdAccessTime size={22} /></div>
          <div className="pdash-stat-value">{stats.pendingOrders ?? stats.pending ?? 0}</div>
          <div className="pdash-stat-label">Pending Orders</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdTrendingUp size={22} /></div>
          <div className="pdash-stat-value">{stats.activeProjects ?? 0}</div>
          <div className="pdash-stat-label">Active Projects</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdAccountBalanceWallet size={22} /></div>
          <div className="pdash-stat-value">{formatAmount(stats.pendingEarnings)}</div>
          <div className="pdash-stat-label">Pending Earnings</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdAccountBalanceWallet size={22} /></div>
          <div className="pdash-stat-value">{formatAmount(stats.availableBalance)}</div>
          <div className="pdash-stat-label">Available Balance</div>
        </div>
        <div className="pdash-stat">
          <div className="pdash-stat-icon"><MdPayments size={22} /></div>
          <div className="pdash-stat-value">{formatAmount(stats.totalWithdrawals)}</div>
          <div className="pdash-stat-label">Total Withdrawals</div>
        </div>
      </div>

      {stats.analytics ? (
        <div className="pdash-panel">
          <h2>Analytics</h2>
          <div className="pdash-grid-3">
            <div className="pdash-mini-stat">
              <strong>{stats.analytics.conversionRate ?? 0}%</strong>
              <span>Conversion Rate</span>
            </div>
            <div className="pdash-mini-stat">
              <strong>{formatAmount(stats.analytics.monthlyRevenue)}</strong>
              <span>Monthly Revenue</span>
            </div>
            <div className="pdash-mini-stat">
              <strong>{stats.analytics.monthlyOrders ?? 0}</strong>
              <span>Orders This Month</span>
            </div>
          </div>
          {stats.analytics.topServices?.length ? (
            <div style={{ marginTop: 16 }}>
              <strong>Top Services</strong>
              <ul className="pdash-simple-list">
                {stats.analytics.topServices.map((s) => (
                  <li key={s.name}>{s.name} — {s.count} order{s.count === 1 ? '' : 's'}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="pdash-grid-2">
        <div className="pdash-panel">
          <h2>Your Live Site</h2>
          <p className="pdash-panel-lead">
            Share this link with your audience. Orders placed here appear in your dashboard automatically.
          </p>
          {siteUrl ? (
            <a className="adm-site-url" href={siteUrl} target="_blank" rel="noopener noreferrer">
              <MdOpenInNew size={15} style={{ verticalAlign: '-2px', marginRight: 5 }} />
              {siteUrl}
            </a>
          ) : null}
        </div>

        <div className="pdash-panel">
          <h2>Site Setup Progress</h2>
          <p className="pdash-panel-lead">{completionPercent}% complete</p>
          <div className="pdash-checklist">
            {setupChecklist.map((item) => (
              <div key={item.label} className={`pdash-check-item${item.done ? ' done' : ''}`}>
                <MdCheckCircle size={18} color={item.done ? '#047857' : '#94a3b8'} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
