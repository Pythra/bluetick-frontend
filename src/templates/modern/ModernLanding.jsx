import Navbar from '../../components/Navbar';
import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import HeroMediaCarousel from '../shared/HeroMediaCarousel';
import PublicationLogosBlock from '../shared/PublicationLogosBlock';
import ImpactStatsStrip from '../shared/ImpactStatsStrip';
import '../../components/LandingPage.css';
import './ModernLanding.css';

function ModernLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-modern">
      <Navbar onScrollToSection={onScrollToSection} />

      <div className="tpl-modern-shell">
        {hero.showHero ? (
          <div className="tpl-modern-grid">
            <div className="tpl-modern-copy">
              <p className="tpl-modern-kicker">{hero.kicker}</p>
              <h1 className="tpl-modern-title">{hero.title}</h1>
              <p className="tpl-modern-description">{hero.description}</p>
              <LandingHeroActions className="tpl-modern-actions landing-actions" />
            </div>

            <div className="tpl-modern-media">
              <PartnerMediaFrame
                src={hero.heroMediaSrc}
                type={hero.heroMediaType}
                poster={hero.heroPoster}
                className="landing-media-video-wrap"
                overlayClassName="landing-media-overlay"
              />
              <div className="landing-media-content">
                <HeroMediaCarousel activeSlide={hero.activeSlide} mediaKicker={hero.mediaKicker} />
              </div>
            </div>
          </div>
        ) : null}

        {hero.showPublicationLogos ? <PublicationLogosBlock /> : null}
        {hero.showImpactStats ? (
          <ImpactStatsStrip
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
          />
        ) : null}
      </div>
    </section>
  );
}

export default ModernLanding;
