import { formatAmount } from '../../data/partnerServiceCatalog';
import './ReportCharts.css';

function maxValue(data) {
  return Math.max(...(data || []).map((entry) => entry.value || 0), 1);
}

export function ReportSummaryGrid({ items }) {
  return (
    <div className="report-summary-grid">
      {items.map((item) => (
        <div key={item.label} className="report-summary-card">
          <span className="report-summary-label">{item.label}</span>
          <strong className="report-summary-value">{item.value}</strong>
          {item.hint ? <span className="report-summary-hint">{item.hint}</span> : null}
        </div>
      ))}
    </div>
  );
}

export function SimpleBarChart({ title, data, valueFormatter = (value) => value }) {
  const peak = maxValue(data);

  return (
    <div className="report-chart-card">
      {title ? <h3>{title}</h3> : null}
      <div className="report-bar-chart">
        {(data || []).map((entry) => (
          <div key={entry.key} className="report-bar-col">
            <div className="report-bar-value">{valueFormatter(entry.value)}</div>
            <div className="report-bar-track">
              <div
                className="report-bar-fill"
                style={{ height: `${Math.max(8, (entry.value / peak) * 100)}%` }}
              />
            </div>
            <div className="report-bar-label">{entry.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SimpleDonutChart({ title, data }) {
  const total = (data || []).reduce((sum, entry) => sum + (entry.count || entry.value || 0), 0) || 1;
  const palette = ['#2563eb', '#7c3aed', '#0891b2', '#059669', '#ea580c', '#db2777'];
  let offset = 0;

  const segments = (data || []).map((entry, index) => {
    const value = entry.count || entry.value || 0;
    const percent = (value / total) * 100;
    const segment = {
      ...entry,
      percent,
      color: palette[index % palette.length],
      dash: `${percent} ${100 - percent}`,
      offset,
    };
    offset += percent;
    return segment;
  });

  return (
    <div className="report-chart-card">
      {title ? <h3>{title}</h3> : null}
      {!data?.length ? (
        <p className="report-empty">No data yet.</p>
      ) : (
        <div className="report-donut-wrap">
          <svg viewBox="0 0 42 42" className="report-donut">
            {segments.map((segment) => (
              <circle
                key={segment.name}
                className="report-donut-segment"
                cx="21"
                cy="21"
                r="15.915"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="4"
                strokeDasharray={segment.dash}
                strokeDashoffset={25 - segment.offset}
              />
            ))}
          </svg>
          <div className="report-donut-legend">
            {segments.map((segment) => (
              <div key={segment.name} className="report-donut-legend-item">
                <span className="report-donut-dot" style={{ background: segment.color }} />
                <span>{segment.name}</span>
                <strong>{segment.count ?? segment.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function formatReportMoney(value) {
  return formatAmount(value || 0);
}

export function formatReportCount(value) {
  return Number(value || 0).toLocaleString();
}
