import Navbar from '../../components/Navbar';
import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import HeroMediaCarousel from '../shared/HeroMediaCarousel';
import PublicationLogosBlock from '../shared/PublicationLogosBlock';
import ImpactStatsStrip from '../shared/ImpactStatsStrip';
import '../../components/LandingPage.css';
import './StudioLanding.css';

function StudioLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-studio">
      <div className="tpl-studio-layout">
        <aside className="tpl-studio-visual" aria-hidden={!hero.showHero}>
          {hero.showHero ? (
            <>
              <PartnerMediaFrame
                src={hero.heroMediaSrc}
                type={hero.heroMediaType}
                poster={hero.heroPoster}
                className="tpl-studio-visual-media"
                overlayClassName="tpl-studio-visual-overlay"
              />
              <div className="tpl-studio-visual-caption">
                <HeroMediaCarousel
                  activeSlide={hero.activeSlide}
                  mediaKicker={hero.mediaKicker}
                  className="tpl-studio-carousel landing-media-carousel"
                />
              </div>
            </>
          ) : null}
        </aside>

        <div className="tpl-studio-main">
          <Navbar onScrollToSection={onScrollToSection} />

          <div className="tpl-studio-content">
            {hero.showHero ? (
              <div className="tpl-studio-hero">
                <p className="tpl-studio-kicker">{hero.kicker}</p>
                <h1 className="tpl-studio-title">{hero.title}</h1>
                <p className="tpl-studio-description">{hero.description}</p>
                <LandingHeroActions className="tpl-studio-actions landing-actions" />
              </div>
            ) : null}

            {hero.showPublicationLogos ? (
              <PublicationLogosBlock className="tpl-studio-logos landing-logos-strip" />
            ) : null}

            {hero.showImpactStats ? (
              <ImpactStatsStrip
                items={hero.impactItems}
                statsRef={hero.statsRef}
                statsVisible={hero.statsVisible}
                className="tpl-studio-stats landing-impact-strip"
                innerClassName="tpl-studio-stats-inner landing-impact-inner"
                itemClassName="tpl-studio-stat landing-impact-item"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudioLanding;
