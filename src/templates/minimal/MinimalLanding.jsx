import TemplateNavbar from '../shared/TemplateNavbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import TemplateLogosSection from '../shared/TemplateLogosSection';
import TemplateStatsSection from '../shared/TemplateStatsSection';
import '../styles/templateActions.css';
import '../styles/templateStats.css';
import '../styles/templateLogos.css';
import './MinimalLanding.css';

function MinimalLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-atelier">
      <TemplateNavbar templateId="minimal" onScrollToSection={onScrollToSection} />

      <div className="tpl-atelier-shell">
        {hero.showHero ? (
          <div className="tpl-atelier-hero">
            <p className="tpl-atelier-kicker">{hero.kicker}</p>
            <h1 className="tpl-atelier-title">{hero.title}</h1>
            <hr className="tpl-atelier-rule" aria-hidden="true" />
            <p className="tpl-atelier-description">{hero.description}</p>
            <LandingHeroActions className="tpl-atelier-actions" variant="text" />
          </div>
        ) : null}

        {hero.showImpactStats ? (
          <TemplateStatsSection
            variant="serif-row"
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
          />
        ) : null}

        {hero.showPublicationLogos ? <TemplateLogosSection variant="grid" /> : null}
      </div>
    </section>
  );
}

export default MinimalLanding;
