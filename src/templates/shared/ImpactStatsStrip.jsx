import {
  IoNewspaperOutline,
  IoPeopleOutline,
  IoRocketOutline,
} from 'react-icons/io5';
import AnimatedNumber from './AnimatedNumber';

const impactStatIcons = [IoNewspaperOutline, IoPeopleOutline, IoRocketOutline];
const impactStatTones = ['mint', 'sky', 'amber'];

function ImpactStatsStrip({
  items,
  statsRef,
  statsVisible,
  className = 'landing-impact-strip',
  innerClassName = 'landing-impact-inner',
  itemClassName = 'landing-impact-item landing-impact-item--card',
}) {
  return (
    <section ref={statsRef} className={className} aria-label="Business impact metrics">
      <div className={innerClassName}>
        {items.map((stat, index) => {
          const Icon = impactStatIcons[index] || IoRocketOutline;
          const iconTone = impactStatTones[index] || 'sky';
          const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
          return (
            <article key={`${stat.label}-${index}`} className={itemClassName}>
              <div className="landing-impact-top">
                <div
                  className={`landing-impact-icon landing-impact-icon--${iconTone}`}
                  aria-hidden="true"
                >
                  <Icon />
                </div>
                <p className="landing-impact-value">
                  <AnimatedNumber
                    value={numericValue}
                    suffix={stat.suffix || ''}
                    isActive={statsVisible}
                  />
                </p>
              </div>
              <p className="landing-impact-label">{stat.label}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ImpactStatsStrip;
