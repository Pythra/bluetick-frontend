import { Link } from 'react-router-dom';
import CurrencySelector from '../../components/CurrencySelector';
import { useTemplateNav } from '../shared/useTemplateNav';
import '../styles/templateNav.css';

function AuroraNavbar({ onScrollToSection }) {
  const nav = useTemplateNav(onScrollToSection);

  return (
    <nav className="tpl-nav tpl-nav--aurora">
      <div className="tpl-nav-aurora-shell">
        <div className="tpl-nav-aurora-logo">
          <Link to="/">
            {nav.logoUrl ? (
              <img src={nav.logoUrl} alt={nav.brandName} className="tpl-nav-logo-img" />
            ) : (
              <span className="tpl-nav-brand-text">{nav.brandName}</span>
            )}
          </Link>
        </div>
        <div className={`tpl-nav-aurora-menu${nav.isMenuOpen ? ' is-open' : ''}`}>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/about'))}>
            About
          </button>
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(nav.scrollTarget(nav.servicesSectionId))}>
            Services
          </button>
          {nav.features?.showBlog !== false && (
            <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate('/blog'))}>
              Blog
            </button>
          )}
          <button type="button" className="tpl-nav-link" onClick={() => nav.handleAction(() => nav.navigate(nav.isAuthenticated ? '/account' : '/login'))}>
            Account
          </button>
          <CurrencySelector />
          {!nav.isAuthenticated && (
            <button type="button" className="tpl-nav-aurora-signup" onClick={() => nav.handleAction(() => nav.navigate('/signup'))}>
              Sign Up
            </button>
          )}
        </div>
        <button type="button" className="tpl-nav-toggle" aria-label="Menu" onClick={() => nav.setIsMenuOpen(!nav.isMenuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}

export default AuroraNavbar;
