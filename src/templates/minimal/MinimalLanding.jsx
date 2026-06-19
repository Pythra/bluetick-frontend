import Navbar from '../../components/Navbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import PublicationLogosBlock from '../shared/PublicationLogosBlock';
import ImpactStatsStrip from '../shared/ImpactStatsStrip';
import '../../components/LandingPage.css';
import './MinimalLanding.css';

function MinimalLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-minimal">
      <Navbar onScrollToSection={onScrollToSection} />

      <div className="tpl-minimal-shell">
        {hero.showHero ? (
          <div className="tpl-minimal-hero">
            <p className="tpl-minimal-kicker">{hero.kicker}</p>
            <h1 className="tpl-minimal-title">{hero.title}</h1>
            <p className="tpl-minimal-description">{hero.description}</p>
            <LandingHeroActions className="tpl-minimal-actions landing-actions" />
          </div>
        ) : null}

        {hero.showPublicationLogos ? (
          <PublicationLogosBlock className="tpl-minimal-logos landing-logos-strip" />
        ) : null}

        {hero.showImpactStats ? (
          <ImpactStatsStrip
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
            className="tpl-minimal-stats landing-impact-strip"
            innerClassName="tpl-minimal-stats-inner landing-impact-inner"
            itemClassName="tpl-minimal-stat landing-impact-item"
          />
        ) : null}
      </div>
    </section>
  );
}

export default MinimalLanding;
