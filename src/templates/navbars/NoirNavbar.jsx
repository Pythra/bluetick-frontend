import { Link } from 'react-router-dom';
import { useTemplateNav } from '../shared/useTemplateNav';
import '../styles/templateNav.css';

function NoirNavbar({ onScrollToSection }) {
  const nav = useTemplateNav(onScrollToSection);

  return (
    <nav className="tpl-nav tpl-nav--noir">
      <div className="tpl-nav-noir-shell">
        <div className="tpl-nav-noir-logo">
          <Link to="/">
            {nav.logoUrl ? (
              <img src={nav.logoUrl} alt={nav.brandName} className="tpl-nav-logo-img tpl-nav-logo-img--light" />
            ) : (
              <span className="tpl-nav-brand-text tpl-nav-brand-text--light">{nav.brandName}</span>
            )}
          </Link>
        </div>
        <div className={`tpl-nav-noir-menu${nav.isMenuOpen ? ' is-open' : ''}`}>
          <button type="button" className="tpl-nav-link tpl-nav-link--light" onClick={() => nav.handleAction(() => nav.navigate('/about'))}>
            About
          </button>
          <button type="button" className="tpl-nav-link tpl-nav-link--light" onClick={() => nav.handleAction(nav.scrollTarget(nav.servicesSectionId))}>
            Services
          </button>
          {nav.features?.showBlog !== false && (
            <button type="button" className="tpl-nav-link tpl-nav-link--light" onClick={() => nav.handleAction(() => nav.navigate('/blog'))}>
              Blog
            </button>
          )}
          <button type="button" className="tpl-nav-link tpl-nav-link--light" onClick={() => nav.handleAction(() => nav.navigate(nav.isAuthenticated ? '/account' : '/login'))}>
            Account
          </button>
          {!nav.isAuthenticated && (
            <button type="button" className="tpl-nav-noir-signup" onClick={() => nav.handleAction(() => nav.navigate('/signup'))}>
              Sign Up
            </button>
          )}
        </div>
        <button type="button" className="tpl-nav-toggle tpl-nav-toggle--light" aria-label="Menu" onClick={() => nav.setIsMenuOpen(!nav.isMenuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default NoirNavbar;
