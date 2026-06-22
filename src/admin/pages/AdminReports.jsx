import { useCallback, useEffect, useState } from 'react';
import {
  ReportSummaryGrid,
  SimpleBarChart,
  SimpleDonutChart,
  formatReportCount,
  formatReportMoney,
} from '../../components/reports/ReportCharts';

export default function AdminReports({ apiUrl, adminToken }) {
  const [overview, setOverview] = useState(null);
  const [partnerReport, setPartnerReport] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingPartner, setLoadingPartner] = useState(false);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${adminToken}` };

  const loadOverview = useCallback(async () => {
    setLoadingOverview(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/reports/overview`, { headers });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load reports');
      }
      setOverview(data.report);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load reports');
    } finally {
      setLoadingOverview(false);
    }
  }, [apiUrl, adminToken]);

  const loadPartnerReport = useCallback(async (partnerId) => {
    if (!partnerId) {
      setPartnerReport(null);
      return;
    }

    setLoadingPartner(true);
    setError('');
    try {
      const response = await fetch(`${apiUrl}/api/admin/reports/partners/${partnerId}`, { headers });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load partner report');
      }
      setPartnerReport(data.report);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load partner report');
    } finally {
      setLoadingPartner(false);
    }
  }, [apiUrl, adminToken]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    loadPartnerReport(selectedPartnerId);
  }, [selectedPartnerId, loadPartnerReport]);

  const activeReport = selectedPartnerId ? partnerReport : overview;
  const charts = activeReport?.charts || overview?.charts || {};
  const summary = activeReport?.summary || overview?.summary || {};

  return (
    <div className="adm-panel report-page">
      <div className="report-admin-head">
        <div>
          <h2 style={{ margin: '0 0 6px' }}>Progress Reports</h2>
          <p className="pdash-panel-lead" style={{ margin: 0 }}>
            Platform-wide performance with drill-down into individual partner sites.
          </p>
        </div>
        <div className="report-admin-filter">
          <label htmlFor="partner-report-select">View</label>
          <select
            id="partner-report-select"
            value={selectedPartnerId}
            onChange={(event) => setSelectedPartnerId(event.target.value)}
          >
            <option value="">All partners (overview)</option>
            {(overview?.partners || []).map((partner) => (
              <option key={partner.partnerId} value={partner.partnerId}>
                {partner.partnerName} ({partner.partnerSubdomain})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? <div className="pdash-alert error">{error}</div> : null}

      {loadingOverview || (selectedPartnerId && loadingPartner) ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div className="adm-spinner" style={{ margin: '0 auto 12px' }} />
          <p className="pdash-panel-lead">Loading report…</p>
        </div>
      ) : (
        <>
          <ReportSummaryGrid
            items={
              selectedPartnerId
                ? [
                    { label: 'Site Signups', value: formatReportCount(summary.totalSignups) },
                    { label: 'Total Orders', value: formatReportCount(summary.totalOrders) },
                    { label: 'Paid Orders', value: formatReportCount(summary.paidOrders) },
                    { label: 'Total Revenue', value: formatReportMoney(summary.totalRevenue) },
                    { label: 'Partner Earnings', value: formatReportMoney(summary.totalEarnings) },
                    { label: 'Available Balance', value: formatReportMoney(summary.availableBalance) },
                    { label: 'Active Projects', value: formatReportCount(summary.activeProjects) },
                    { label: 'Conversion Rate', value: `${summary.conversionRate || 0}%` },
                  ]
                : [
                    { label: 'Active Partners', value: formatReportCount(summary.totalPartners) },
                    { label: 'Total Signups', value: formatReportCount(summary.totalSignups) },
                    { label: 'Total Orders', value: formatReportCount(summary.totalOrders) },
                    { label: 'Paid Orders', value: formatReportCount(summary.paidOrders) },
                    { label: 'Gross Revenue', value: formatReportMoney(summary.totalRevenue) },
                    { label: 'Partner Earnings', value: formatReportMoney(summary.partnerEarnings) },
                    { label: 'Bluetick Revenue', value: formatReportMoney(summary.bluetickRevenue) },
                    { label: 'Signups (6 mo)', value: formatReportCount(summary.signupsThisPeriod) },
                  ]
            }
          />

          <div className="report-chart-grid">
            <SimpleBarChart title="Signups (last 6 months)" data={charts.signups} valueFormatter={formatReportCount} />
            <SimpleBarChart title="Orders (last 6 months)" data={charts.orders} valueFormatter={formatReportCount} />
            <SimpleBarChart title="Revenue (last 6 months)" data={charts.revenue} valueFormatter={formatReportMoney} />
            {selectedPartnerId ? (
              <SimpleBarChart title="Partner earnings (last 6 months)" data={charts.earnings} valueFormatter={formatReportMoney} />
            ) : (
              <SimpleBarChart title="Partner earnings (last 6 months)" data={charts.partnerEarnings} valueFormatter={formatReportMoney} />
            )}
          </div>

          {!selectedPartnerId ? (
            <SimpleBarChart title="Bluetick revenue (last 6 months)" data={charts.bluetickRevenue} valueFormatter={formatReportMoney} />
          ) : (
            <div className="report-chart-grid report-chart-grid-2">
              <SimpleDonutChart title="Orders by status" data={charts.orderStatus} />
              <SimpleDonutChart title="Top services" data={charts.topServices} />
            </div>
          )}

          {!selectedPartnerId ? (
            <div className="pdash-panel">
              <h3>Partner performance</h3>
              <div className="report-table-wrap">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Partner</th>
                      <th>Subdomain</th>
                      <th>Signups</th>
                      <th>Orders</th>
                      <th>Revenue</th>
                      <th>Earnings</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {(overview?.partners || []).map((partner) => (
                      <tr key={partner.partnerId}>
                        <td>{partner.partnerName}</td>
                        <td>{partner.partnerSubdomain}</td>
                        <td>{formatReportCount(partner.totalSignups)}</td>
                        <td>{formatReportCount(partner.totalOrders)}</td>
                        <td>{formatReportMoney(partner.totalRevenue)}</td>
                        <td>{formatReportMoney(partner.totalEarnings)}</td>
                        <td>
                          <button
                            type="button"
                            className="pdash-btn pdash-btn-ghost"
                            onClick={() => setSelectedPartnerId(String(partner.partnerId))}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
