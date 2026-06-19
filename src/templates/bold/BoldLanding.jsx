import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import TemplateNavbar from '../shared/TemplateNavbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import TemplateServiceTicker from '../shared/TemplateServiceTicker';
import TemplateLogosSection from '../shared/TemplateLogosSection';
import TemplateStatsSection from '../shared/TemplateStatsSection';
import '../styles/templateActions.css';
import '../styles/templateStats.css';
import '../styles/templateLogos.css';
import './BoldLanding.css';

function BoldLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-noir">
      <div className="tpl-noir-bg">
        <PartnerMediaFrame
          src={hero.heroMediaSrc}
          type={hero.heroMediaType}
          poster={hero.heroPoster}
          className="tpl-noir-bg-media"
          overlayClassName="tpl-noir-bg-overlay"
        />
      </div>

      <TemplateNavbar templateId="bold" onScrollToSection={onScrollToSection} />

      <div className="tpl-noir-shell">
        {hero.showHero ? (
          <div className="tpl-noir-hero">
            <p className="tpl-noir-kicker">{hero.kicker}</p>
            <h1 className="tpl-noir-title">{hero.title}</h1>
            <p className="tpl-noir-description">{hero.description}</p>
            <LandingHeroActions className="tpl-noir-actions" variant="bold" />
            <TemplateServiceTicker mediaKicker={hero.mediaKicker} className="tpl-noir-ticker" />
          </div>
        ) : null}

        {hero.showImpactStats ? (
          <TemplateStatsSection
            variant="glow"
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
          />
        ) : null}

        {hero.showPublicationLogos ? <TemplateLogosSection variant="spotlight" /> : null}
      </div>
    </section>
  );
}

export default BoldLanding;
