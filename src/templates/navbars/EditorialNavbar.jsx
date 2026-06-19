import { Link } from 'react-router-dom';
import { useTemplateNav } from '../shared/useTemplateNav';
import '../styles/templateNav.css';

function EditorialNavbar({ onScrollToSection }) {
  const nav = useTemplateNav(onScrollToSection);

  return (
    <nav className="tpl-nav tpl-nav--editorial">
      <div className="tpl-nav-editorial-shell">
        <Link to="/" className="tpl-nav-editorial-brand">
          {nav.logoUrl ? (
            <img src={nav.logoUrl} alt={nav.brandName} className="tpl-nav-logo-img" />
          ) : (
            <span className="tpl-nav-brand-text">{nav.brandName.toUpperCase()}</span>
          )}
        </Link>
        <div className={`tpl-nav-editorial-menu${nav.isMenuOpen ? ' is-open' : ''}`}>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/about'))}>
            About
          </button>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(nav.scrollTarget(nav.servicesSectionId))}>
            Services
          </button>
          {nav.features?.showBlog !== false && (
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/blog'))}>
              Journal
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

export default EditorialNavbar;
