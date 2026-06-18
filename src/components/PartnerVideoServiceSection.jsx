import { useEffect, useRef, useState } from 'react';
import { MdClose, MdFullscreen, MdVolumeOff, MdVolumeUp } from 'react-icons/md';
import { normalizeMediaUrl } from '../utils/partnerMedia';
import './PartnerVideoServiceSection.css';

function PartnerVideoServiceSection({ serviceId, sectionId, videoUrl, label = 'Service video' }) {
  const videoRef = useRef(null);
  const modalVideoRef = useRef(null);
  const shellRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const src = normalizeMediaUrl(videoUrl);

  const applyMuteState = (muted) => {
    [videoRef.current, modalVideoRef.current].forEach((video) => {
      if (video) {
        video.muted = muted;
      }
    });
    setIsMuted(muted);
  };

  const toggleSound = () => {
    const activeVideo = modalVideoRef.current || videoRef.current;
    if (!activeVideo) {
      return;
    }
    const nextMuted = !activeVideo.muted;
    applyMuteState(nextMuted);
    if (!nextMuted) {
      [videoRef.current, modalVideoRef.current].forEach((video) => {
        video?.play().catch(() => {});
      });
    }
  };

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded || !modalVideoRef.current) {
      return;
    }
    modalVideoRef.current.muted = isMuted;
    modalVideoRef.current.play().catch(() => {});
  }, [isExpanded, isMuted]);

  const handleExpand = async () => {
    const shell = shellRef.current;
    const video = videoRef.current;
    if (!shell || !video) {
      setIsExpanded(true);
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
      return;
    }

    if (shell.requestFullscreen) {
      try {
        await shell.requestFullscreen();
        return;
      } catch {
        setIsExpanded(true);
        return;
      }
    }

    setIsExpanded(true);
  };

  const handleCloseExpand = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    setIsExpanded(false);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!src) {
    return (
      <section id={sectionId || serviceId} className="partner-video-service partner-video-service--empty">
        <div className="partner-video-service-placeholder">
          <p>Upload a service video in your partner dashboard.</p>
        </div>
      </section>
    );
  }

  const videoNode = (
    <video
      ref={videoRef}
      className="partner-video-service-player"
      src={src}
      muted={isMuted}
      loop
      playsInline
      autoPlay
      preload="metadata"
      aria-label={label}
    />
  );

  return (
    <>
      <section id={sectionId || serviceId} className="partner-video-service">
        <div className="partner-video-service-shell" ref={shellRef}>
          {videoNode}
          <div className="partner-video-service-controls">
            <button
              type="button"
              className="partner-video-service-btn"
              onClick={toggleSound}
              aria-label={isMuted ? 'Turn sound on' : 'Turn sound off'}
            >
              {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
              <span>{isMuted ? 'Sound off' : 'Sound on'}</span>
            </button>
            <button
              type="button"
              className="partner-video-service-btn"
              onClick={handleExpand}
              aria-label="Expand video"
            >
              <MdFullscreen />
              <span>Expand</span>
            </button>
          </div>
        </div>
      </section>

      {isExpanded ? (
        <div className="partner-video-service-modal" role="dialog" aria-modal="true" aria-label={label}>
          <button
            type="button"
            className="partner-video-service-modal-close"
            onClick={handleCloseExpand}
            aria-label="Close expanded video"
          >
            <MdClose />
          </button>
          <div className="partner-video-service-modal-inner">
            <video
              ref={modalVideoRef}
              className="partner-video-service-modal-player"
              src={src}
              muted={isMuted}
              loop
              playsInline
              autoPlay
              controls
              aria-label={label}
            />
            <div className="partner-video-service-controls partner-video-service-controls--modal">
              <button type="button" className="partner-video-service-btn" onClick={toggleSound}>
                {isMuted ? <MdVolumeOff /> : <MdVolumeUp />}
                <span>{isMuted ? 'Sound off' : 'Sound on'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PartnerVideoServiceSection;
