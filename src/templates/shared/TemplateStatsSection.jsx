import AnimatedNumber from './AnimatedNumber';

function TemplateStatsSection({
  variant = 'glass',
  items,
  statsRef,
  statsVisible,
}) {
  if (!items?.length) {
    return null;
  }

  if (variant === 'serif-row') {
    return (
      <section ref={statsRef} className="tpl-stats tpl-stats--serif-row" aria-label="Business impact metrics">
        <div className="tpl-stats-serif-inner">
          {items.map((stat, index) => {
            const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
            return (
              <div key={`${stat.label}-${index}`} className="tpl-stats-serif-item">
                {index > 0 ? <span className="tpl-stats-serif-divider" aria-hidden="true" /> : null}
                <p className="tpl-stats-serif-value">
                  <AnimatedNumber value={numericValue} suffix={stat.suffix || ''} isActive={statsVisible} />
                </p>
                <p className="tpl-stats-serif-label">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === 'table') {
    return (
      <section ref={statsRef} className="tpl-stats tpl-stats--table" aria-label="Business impact metrics">
        <div className="tpl-stats-table-inner">
          {items.map((stat, index) => {
            const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
            return (
              <div key={`${stat.label}-${index}`} className="tpl-stats-table-row">
                <span className="tpl-stats-table-label">{stat.label}</span>
                <span className="tpl-stats-table-value">
                  <AnimatedNumber value={numericValue} suffix={stat.suffix || ''} isActive={statsVisible} />
                </span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === 'glow') {
    return (
      <section ref={statsRef} className="tpl-stats tpl-stats--glow" aria-label="Business impact metrics">
        <div className="tpl-stats-glow-inner">
          {items.map((stat, index) => {
            const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
            return (
              <article key={`${stat.label}-${index}`} className="tpl-stats-glow-item">
                <p className="tpl-stats-glow-value">
                  <AnimatedNumber value={numericValue} suffix={stat.suffix || ''} isActive={statsVisible} />
                </p>
                <p className="tpl-stats-glow-label">{stat.label}</p>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  if (variant === 'stacked') {
    return (
      <section ref={statsRef} className="tpl-stats tpl-stats--stacked" aria-label="Business impact metrics">
        <div className="tpl-stats-stacked-inner">
          {items.map((stat, index) => {
            const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
            return (
              <div key={`${stat.label}-${index}`} className="tpl-stats-stacked-item">
                <span className="tpl-stats-stacked-value">
                  <AnimatedNumber value={numericValue} suffix={stat.suffix || ''} isActive={statsVisible} />
                </span>
                <span className="tpl-stats-stacked-label">{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  /* glass strip (modern / aurora default) */
  return (
    <section ref={statsRef} className="tpl-stats tpl-stats--glass" aria-label="Business impact metrics">
      <div className="tpl-stats-glass-inner">
        {items.map((stat, index) => {
          const numericValue = Number.parseInt(String(stat.value).replace(/\D/g, ''), 10) || 0;
          return (
            <div key={`${stat.label}-${index}`} className="tpl-stats-glass-item">
              {index > 0 ? <span className="tpl-stats-glass-divider" aria-hidden="true" /> : null}
              <p className="tpl-stats-glass-value">
                <AnimatedNumber value={numericValue} suffix={stat.suffix || ''} isActive={statsVisible} />
              </p>
              <p className="tpl-stats-glass-label">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TemplateStatsSection;
