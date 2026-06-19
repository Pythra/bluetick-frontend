import Navbar from '../../components/Navbar';
import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import HeroMediaCarousel from '../shared/HeroMediaCarousel';
import PublicationLogosBlock from '../shared/PublicationLogosBlock';
import ImpactStatsStrip from '../shared/ImpactStatsStrip';
import '../../components/LandingPage.css';
import './BoldLanding.css';

function BoldLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-bold">
      <div className="tpl-bold-bg" aria-hidden="true">
        <PartnerMediaFrame
          src={hero.heroMediaSrc}
          type={hero.heroMediaType}
          poster={hero.heroPoster}
          className="tpl-bold-bg-media"
          overlayClassName="tpl-bold-bg-overlay"
        />
      </div>

      <Navbar onScrollToSection={onScrollToSection} />

      <div className="tpl-bold-shell">
        {hero.showHero ? (
          <div className="tpl-bold-hero">
            <p className="tpl-bold-kicker">{hero.kicker}</p>
            <h1 className="tpl-bold-title">{hero.title}</h1>
            <p className="tpl-bold-description">{hero.description}</p>
            <LandingHeroActions className="tpl-bold-actions landing-actions" />

            <div className="tpl-bold-carousel">
              <HeroMediaCarousel
                activeSlide={hero.activeSlide}
                mediaKicker={hero.mediaKicker}
                className="tpl-bold-carousel-inner landing-media-carousel"
              />
            </div>
          </div>
        ) : null}

        {hero.showPublicationLogos ? (
          <PublicationLogosBlock className="tpl-bold-logos landing-logos-strip" />
        ) : null}

        {hero.showImpactStats ? (
          <ImpactStatsStrip
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
            className="tpl-bold-stats landing-impact-strip"
            innerClassName="tpl-bold-stats-inner landing-impact-inner"
            itemClassName="tpl-bold-stat landing-impact-item landing-impact-item--card"
          />
        ) : null}
      </div>
    </section>
  );
}

export default BoldLanding;
