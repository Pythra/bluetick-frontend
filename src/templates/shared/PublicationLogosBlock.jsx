import PublicationLogosCarousel from '../../components/PublicationLogosCarousel';

function PublicationLogosBlock({ className = 'landing-logos-strip' }) {
  return (
    <div className={className} aria-label="Featured media logos">
      <PublicationLogosCarousel
        title=""
        className="impact-logos-carousel landing-logos-carousel"
        includePlatformBadges
      />
    </div>
  );
}

export default PublicationLogosBlock;
