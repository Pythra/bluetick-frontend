import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import TemplateNavbar from '../shared/TemplateNavbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import TemplateLogosSection from '../shared/TemplateLogosSection';
import TemplateStatsSection from '../shared/TemplateStatsSection';
import '../styles/templateActions.css';
import '../styles/templateStats.css';
import '../styles/templateLogos.css';
import './CorporateLanding.css';

function CorporateLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-institutional">
      <TemplateNavbar templateId="corporate" onScrollToSection={onScrollToSection} />

      {hero.showHero ? (
        <div className="tpl-inst-hero">
          <div className="tpl-inst-hero-copy">
            <p className="tpl-inst-kicker">{hero.kicker}</p>
            <h1 className="tpl-inst-title">{hero.title}</h1>
            <p className="tpl-inst-description">{hero.description}</p>
            <LandingHeroActions className="tpl-inst-actions" variant="corporate" />
          </div>
          <div className="tpl-inst-hero-media">
            <PartnerMediaFrame
              src={hero.heroMediaSrc}
              type={hero.heroMediaType}
              poster={hero.heroPoster}
              className="tpl-inst-media-frame"
              overlayClassName="tpl-inst-media-overlay"
            />
          </div>
        </div>
      ) : null}

      <div className="tpl-inst-body">
        {hero.showImpactStats ? (
          <TemplateStatsSection
            variant="table"
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
          />
        ) : null}

        {hero.showPublicationLogos ? <TemplateLogosSection variant="boxed" className="tpl-inst-logos" /> : null}
      </div>
    </section>
  );
}

export default CorporateLanding;
