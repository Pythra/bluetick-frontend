import Navbar from '../../components/Navbar';
import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import PublicationLogosBlock from '../shared/PublicationLogosBlock';
import ImpactStatsStrip from '../shared/ImpactStatsStrip';
import '../../components/LandingPage.css';
import './CorporateLanding.css';

function CorporateLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-corporate">
      <Navbar onScrollToSection={onScrollToSection} />

      {hero.showHero ? (
        <div className="tpl-corporate-banner">
          <PartnerMediaFrame
            src={hero.heroMediaSrc}
            type={hero.heroMediaType}
            poster={hero.heroPoster}
            className="tpl-corporate-banner-media"
            overlayClassName="tpl-corporate-banner-overlay"
          />
          <div className="tpl-corporate-banner-content">
            <p className="tpl-corporate-kicker">{hero.kicker}</p>
            <h1 className="tpl-corporate-title">{hero.title}</h1>
            <p className="tpl-corporate-description">{hero.description}</p>
            <LandingHeroActions className="tpl-corporate-actions landing-actions" />
          </div>
        </div>
      ) : null}

      <div className="tpl-corporate-body">
        {hero.showImpactStats ? (
          <ImpactStatsStrip
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
            className="tpl-corporate-stats landing-impact-strip"
            innerClassName="tpl-corporate-stats-inner landing-impact-inner"
            itemClassName="tpl-corporate-stat landing-impact-item landing-impact-item--card"
          />
        ) : null}

        {hero.showPublicationLogos ? (
          <PublicationLogosBlock className="tpl-corporate-logos landing-logos-strip" />
        ) : null}
      </div>
    </section>
  );
}

export default CorporateLanding;
