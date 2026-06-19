import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import TemplateNavbar from '../shared/TemplateNavbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import TemplateLogosSection from '../shared/TemplateLogosSection';
import TemplateStatsSection from '../shared/TemplateStatsSection';
import '../styles/templateActions.css';
import '../styles/templateStats.css';
import '../styles/templateLogos.css';
import './StudioLanding.css';

function StudioLanding({ onScrollToSection }) {
  const hero = useLandingHero();
  const metaLine = `Est. ${new Date().getFullYear()} · Digital Services · ${hero.displayName}`;

  return (
    <section id="landing" className="tpl-landing tpl-editorial">
      <div className="tpl-editorial-layout">
        <div className="tpl-editorial-main">
          <TemplateNavbar templateId="studio" onScrollToSection={onScrollToSection} />

          <div className="tpl-editorial-content">
            {hero.showHero ? (
              <div className="tpl-editorial-hero">
                <p className="tpl-editorial-meta">{metaLine}</p>
                <h1 className="tpl-editorial-title">{hero.title}</h1>
                <blockquote className="tpl-editorial-quote">{hero.description}</blockquote>
                <LandingHeroActions className="tpl-editorial-actions" variant="stacked" />
                {hero.showImpactStats ? (
                  <TemplateStatsSection
                    variant="stacked"
                    items={hero.impactItems}
                    statsRef={hero.statsRef}
                    statsVisible={hero.statsVisible}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="tpl-editorial-visual">
          {hero.showHero ? (
            <PartnerMediaFrame
              src={hero.heroMediaSrc}
              type={hero.heroMediaType}
              poster={hero.heroPoster}
              className="tpl-editorial-media"
              overlayClassName="tpl-editorial-media-overlay"
            />
          ) : null}
          {hero.showPublicationLogos ? (
            <TemplateLogosSection variant="press" className="tpl-editorial-logos" />
          ) : null}
        </aside>
      </div>
    </section>
  );
}

export default StudioLanding;
