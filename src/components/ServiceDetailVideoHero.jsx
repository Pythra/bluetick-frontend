export default function ServiceDetailVideoHero({ titleBlack, titleBlue, lead, videoSrc, posterSrc }) {
  const hasVideo = Boolean(videoSrc);
  const hasPoster = Boolean(posterSrc);

  return (
    <header className="service-detail-hero service-detail-hero--video">
      {hasVideo ? (
        <video
          className="service-detail-hero-image"
          src={videoSrc}
          poster={hasPoster ? posterSrc : undefined}
          autoPlay
          loop
          playsInline
          controls
          preload="metadata"
        />
      ) : hasPoster ? (
        <img className="service-detail-hero-image" src={posterSrc} alt="" />
      ) : null}
      <div className="service-detail-hero-overlay" aria-hidden="true" />
      <div className="service-detail-hero-content">
        <h1 className="service-detail-title">
          <span className="services-summary-title-black">{titleBlack}</span>
          <span className="services-summary-title-blue">{titleBlue}</span>
        </h1>
        {lead ? <p className="service-detail-lead">{lead}</p> : null}
      </div>
    </header>
  );
}
