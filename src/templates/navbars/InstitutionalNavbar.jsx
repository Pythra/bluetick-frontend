import { Link } from 'react-router-dom';
import CurrencySelector from '../../components/CurrencySelector';
import { useTemplateNav } from '../shared/useTemplateNav';
import '../styles/templateNav.css';

function InstitutionalNavbar({ onScrollToSection }) {
  const nav = useTemplateNav(onScrollToSection);

  return (
    <header className="tpl-nav tpl-nav--institutional">
      <div className="tpl-nav-inst-top">
        <div className="tpl-nav-inst-top-inner">
          {nav.contactEmail ? <a href={`mailto:${nav.contactEmail}`}>{nav.contactEmail}</a> : null}
          {nav.contactPhone ? <a href={`tel:${nav.contactPhone.replace(/\s/g, '')}`}>{nav.contactPhone}</a> : null}
        </div>
      </div>
      <nav className="tpl-nav-inst-main">
        <div className="tpl-nav-inst-main-inner">
          <div className="tpl-nav-inst-logo-wrap">
            <Link to="/" className="tpl-nav-inst-logo">
              {nav.logoUrl ? (
                <img src={nav.logoUrl} alt={nav.brandName} className="tpl-nav-logo-img" />
              ) : (
                <span className="tpl-nav-brand-text">{nav.brandName}</span>
              )}
            </Link>
          </div>
          <div className={`tpl-nav-inst-menu${nav.isMenuOpen ? ' is-open' : ''}`}>
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/about'))}>
              About
            </button>
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(nav.scrollTarget(nav.servicesSectionId))}>
              Services
            </button>
            {nav.features?.showBlog !== false && (
              <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/blog'))}>
                Insights
              </button>
            )}
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate(nav.isAuthenticated ? '/account' : '/login'))}>
              Account
            </button>
            <CurrencySelector />
            {!nav.isAuthenticated && (
              <button type="button" className="tpl-nav-inst-cta" onClick={() => nav.handleAction(() => nav.navigate('/signup'))}>
                Get Started
              </button>
            )}
          </div>
          <button type="button" className="tpl-nav-toggle" aria-label="Menu" onClick={() => nav.setIsMenuOpen(!nav.isMenuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
  );
}

export default InstitutionalNavbar;
