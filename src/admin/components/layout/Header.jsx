import { MdMenu } from 'react-icons/md'
import '../../styles/admin.css'

export const Header = ({ title = 'Admin Dashboard', subtitle, onToggleMobileMenu }) => {
  return (
    <div className="adm-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p className="adm-header-sub">{subtitle}</p> : null}
      </div>

      <button
        type="button"
        className="adm-menu-btn"
        onClick={onToggleMobileMenu}
        aria-label="Toggle menu"
      >
        <MdMenu size={24} />
      </button>
    </div>
  )
}
