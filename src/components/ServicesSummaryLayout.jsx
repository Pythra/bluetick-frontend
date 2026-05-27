import './ServicesSummaryLayout.css';

function ServicesSummaryLayout({ reverse = false, copy, media }) {
  return (
    <div
      className={`container services-summary-layout-inner${
        reverse ? ' services-summary-layout-inner--reverse' : ''
      }`}
    >
      <div className="services-summary-copy">{copy}</div>
      <div className="services-summary-media">{media}</div>
    </div>
  );
}

export default ServicesSummaryLayout;
