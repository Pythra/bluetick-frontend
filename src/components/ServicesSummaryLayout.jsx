import './ServicesSummaryLayout.css';

function ServicesSummaryLayout({ reverse = false, copy, media, below }) {
  return (
    <div
      className={`container services-summary-layout-inner${
        reverse ? ' services-summary-layout-inner--reverse' : ''
      }`}
    >
      <div className="services-summary-copy">{copy}</div>
      <div className="services-summary-media">{media}</div>
      {below ? <div className="services-summary-below">{below}</div> : null}
    </div>
  );
}

export default ServicesSummaryLayout;
