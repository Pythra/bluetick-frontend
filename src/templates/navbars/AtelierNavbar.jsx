import { Link } from 'react-router-dom';
import { useTemplateNav } from '../shared/useTemplateNav';
import '../styles/templateNav.css';

function AtelierNavbar({ onScrollToSection }) {
  const nav = useTemplateNav(onScrollToSection);

  return (
    <nav className="tpl-nav tpl-nav--atelier">
      <div className="tpl-nav-atelier-shell">
        <div className={`tpl-nav-atelier-side tpl-nav-atelier-left${nav.isMenuOpen ? ' is-open' : ''}`}>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/about'))}>
            About
          </button>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(nav.scrollTarget(nav.servicesSectionId))}>
            Services
          </button>
        </div>
        <div className="tpl-nav-atelier-logo">
          <Link to="/">
            {nav.logoUrl ? (
              <img src={nav.logoUrl} alt={nav.brandName} className="tpl-nav-logo-img" />
            ) : (
              <span className="tpl-nav-brand-text">{nav.brandName}</span>
            )}
          </Link>
        </div>
        <div className={`tpl-nav-atelier-side tpl-nav-atelier-right${nav.isMenuOpen ? ' is-open' : ''}`}>
          {nav.features?.showBlog !== false && (
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/blog'))}>
              Blog
            </button>
          )}
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate(nav.isAuthenticated ? '/account' : '/login'))}>
            Account
          </button>
        </div>
        <button type="button" className="tpl-nav-toggle" aria-label="Menu" onClick={() => nav.setIsMenuOpen(!nav.isMenuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default AtelierNavbar;
