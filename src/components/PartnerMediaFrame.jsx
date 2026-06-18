import './PartnerMediaFrame.css';

function PartnerMediaFrame({
  src,
  alt = '',
  type = 'image',
  className = '',
  poster = null,
  autoPlay = true,
  overlayClassName = '',
  children = null,
}) {
  if (!src) {
    return (
      <div className={`partner-media-placeholder ${className}`.trim()} aria-hidden={alt ? undefined : true}>
        <div className="partner-media-placeholder-inner">
          <span className="partner-media-placeholder-icon" aria-hidden="true">
            {type === 'video' ? '▶' : '◻'}
          </span>
          <p>{type === 'video' ? 'Upload a hero video in your partner dashboard' : 'Upload an image in your partner dashboard'}</p>
        </div>
        {overlayClassName ? <div className={overlayClassName} aria-hidden="true" /> : null}
        {children}
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`partner-media-frame ${className}`.trim()}>
        <video
          className="partner-media-video"
          src={src}
          poster={poster || undefined}
          autoPlay={autoPlay}
          muted
          loop
          playsInline
        />
        {overlayClassName ? <div className={overlayClassName} aria-hidden="true" /> : null}
        {children}
      </div>
    );
  }

  return (
    <div className={`partner-media-frame ${className}`.trim()}>
      <img src={src} alt={alt} className="partner-media-image" loading="lazy" decoding="async" />
      {overlayClassName ? <div className={overlayClassName} aria-hidden="true" /> : null}
      {children}
    </div>
  );
}

export default PartnerMediaFrame;
