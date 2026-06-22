import { useEffect, useState } from 'react';
import {
  ReportSummaryGrid,
  SimpleBarChart,
  SimpleDonutChart,
  formatReportCount,
  formatReportMoney,
} from '../../components/reports/ReportCharts';

function formatWhen(dateString) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PartnerProgressReportTab({ api }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    api.getProgressReport()
      .then((data) => {
        if (active) setReport(data.report || null);
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Failed to load progress report');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [api]);

  if (loading) {
    return (
      <div className="pdash-panel" style={{ textAlign: 'center', padding: 48 }}>
        <div className="adm-spinner" style={{ margin: '0 auto 12px' }} />
        <p className="pdash-panel-lead">Loading progress report…</p>
      </div>
    );
  }

  if (error) {
    return <div className="pdash-panel"><div className="pdash-alert error">{error}</div></div>;
  }

  if (!report) {
    return <div className="pdash-panel"><p className="pdash-panel-lead">No report data available yet.</p></div>;
  }

  const { summary, charts, recentSignups } = report;

  return (
    <div className="report-page">
      <ReportSummaryGrid
        items={[
          { label: 'Site Signups', value: formatReportCount(summary.totalSignups) },
          { label: 'Total Orders', value: formatReportCount(summary.totalOrders) },
          { label: 'Paid Orders', value: formatReportCount(summary.paidOrders) },
          { label: 'Total Revenue', value: formatReportMoney(summary.totalRevenue) },
          { label: 'Your Earnings', value: formatReportMoney(summary.totalEarnings) },
          { label: 'Available Balance', value: formatReportMoney(summary.availableBalance) },
          { label: 'Active Projects', value: formatReportCount(summary.activeProjects) },
          { label: 'Conversion Rate', value: `${summary.conversionRate || 0}%` },
        ]}
      />

      <div className="report-chart-grid">
        <SimpleBarChart title="Signups (last 6 months)" data={charts.signups} valueFormatter={formatReportCount} />
        <SimpleBarChart title="Orders (last 6 months)" data={charts.orders} valueFormatter={formatReportCount} />
        <SimpleBarChart title="Revenue (last 6 months)" data={charts.revenue} valueFormatter={formatReportMoney} />
        <SimpleBarChart title="Earnings (last 6 months)" data={charts.earnings} valueFormatter={formatReportMoney} />
      </div>

      <div className="report-chart-grid report-chart-grid-2">
        <SimpleDonutChart title="Orders by status" data={charts.orderStatus} />
        <SimpleDonutChart title="Top services" data={charts.topServices} />
      </div>

      <div className="pdash-panel">
        <h2>Recent signups</h2>
        {!recentSignups?.length ? (
          <p className="pdash-panel-lead">No signups recorded yet.</p>
        ) : (
          <div className="report-table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentSignups.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.source}</td>
                    <td>{formatWhen(user.firstSeenAt)}</td>
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
