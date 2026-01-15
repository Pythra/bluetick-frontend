import { MdMenu } from 'react-icons/md'

export const Header = ({ title = "Admin Dashboard", onSignout, onToggleMobileMenu }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px 24px', 
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <h1 style={{ 
        fontSize: 'clamp(20px, 5vw, 24px)', 
        fontWeight: '700', 
        color: '#121212', 
        margin: '0' 
      }}>{title}</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        {/* Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          style={{
            display: 'none',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#0066FF',
            border: 'none',
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
          }}
          className="header-menu-btn"
          aria-label="Toggle menu"
        >
          <MdMenu size={24} />
        </button>
        
        <style>{`
          @media (max-width: 768px) {
            .header-menu-btn {
              display: flex !important;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
