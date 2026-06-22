import bluego from '../assets/bluego.png';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';

export default function AuthShell({
  asideTitle,
  asideHighlight,
  asideLead,
  perks = [],
  formTitle,
  formSub,
  children,
}) {
  const { isPartnerSite, brandName, logoUrl, primaryColor } = usePartnerBranding();
  const accentColor = isPartnerSite && primaryColor ? primaryColor : '#2563eb';

  const logo = isPartnerSite ? (
    logoUrl ? (
      <img src={logoUrl} alt={brandName} className="auth-form-logo" />
    ) : (
      <span className="auth-form-logo-text" style={{ color: accentColor }}>
        {brandName}
      </span>
    )
  ) : (
    <img src={bluego} alt="Bluetick" className="auth-form-logo" />
  );

  return (
    <div className="auth-shell">
      <aside
        className="auth-aside"
        style={{ '--auth-accent': accentColor }}
      >
        <div className="auth-aside-inner">
          <h1>
            {asideTitle}
            {asideHighlight ? <span>{asideHighlight}</span> : null}
          </h1>
          {asideLead ? <p className="auth-aside-lead">{asideLead}</p> : null}
          {perks.length ? (
            <ul className="auth-perks">
              {perks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </aside>

      <section className="auth-form-panel">
        <div className="auth-form-header">{logo}</div>
        <h1>{formTitle}</h1>
        {formSub ? <p className="auth-form-sub">{formSub}</p> : null}
        {children}
      </section>
    </div>
  );
}
