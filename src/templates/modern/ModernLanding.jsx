import PartnerMediaFrame from '../../components/PartnerMediaFrame';
import TemplateNavbar from '../shared/TemplateNavbar';
import { useLandingHero } from '../shared/useLandingHero';
import LandingHeroActions from '../shared/LandingHeroActions';
import TemplateFeatureChips from '../shared/TemplateFeatureChips';
import TemplateLogosSection from '../shared/TemplateLogosSection';
import TemplateStatsSection from '../shared/TemplateStatsSection';
import '../../components/LandingPage.css';
import '../styles/templateActions.css';
import '../styles/templateStats.css';
import '../styles/templateLogos.css';
import './ModernLanding.css';

function ModernLanding({ onScrollToSection }) {
  const hero = useLandingHero();

  return (
    <section id="landing" className="tpl-landing tpl-aurora">
      <div className="tpl-aurora-bg" aria-hidden="true">
        <div className="tpl-aurora-blob tpl-aurora-blob--1" />
        <div className="tpl-aurora-blob tpl-aurora-blob--2" />
        <div className="tpl-aurora-grid" />
      </div>

      <TemplateNavbar templateId="modern" onScrollToSection={onScrollToSection} />

      <div className="tpl-aurora-shell">
        {hero.showHero ? (
          <div className="tpl-aurora-bento">
            <div className="tpl-aurora-bento-copy">
              <p className="tpl-aurora-kicker">{hero.kicker}</p>
              <h1 className="tpl-aurora-title">{hero.title}</h1>
              <p className="tpl-aurora-description">{hero.description}</p>
              <LandingHeroActions className="tpl-aurora-actions" variant="aurora" />
              <TemplateFeatureChips className="tpl-aurora-chips" />
            </div>

            <div className="tpl-aurora-bento-trust">
              {(hero.impactItems || []).slice(0, 3).map((stat, index) => (
                <div key={stat.label} className="tpl-aurora-trust-item">
                  <span className="tpl-aurora-trust-value">
                    {stat.value}{stat.suffix || ''}
                  </span>
                  <span className="tpl-aurora-trust-label">{stat.label.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              ))}
            </div>

            <div className="tpl-aurora-bento-media">
              <PartnerMediaFrame
                src={hero.heroMediaSrc}
                type={hero.heroMediaType}
                poster={hero.heroPoster}
                className="tpl-aurora-media-frame"
                overlayClassName="tpl-aurora-media-overlay"
              />
            </div>
          </div>
        ) : null}

        {hero.showImpactStats ? (
          <TemplateStatsSection
            variant="glass"
            items={hero.impactItems}
            statsRef={hero.statsRef}
            statsVisible={hero.statsVisible}
          />
        ) : null}

        {hero.showPublicationLogos ? <TemplateLogosSection variant="marquee" /> : null}
      </div>
    </section>
  );
}

export default ModernLanding;
