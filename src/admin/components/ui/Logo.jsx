export const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <img
        src="/bluetickgeng-logo.png"
        alt="Bluetickgeng Development"
        style={{
          width: '160px',
          maxWidth: '100%',
          height: 'auto',
          objectFit: 'contain'
        }}
      />
      <div>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#121212'
        }}>
          Admin
        </div>
      </div>
    </div>
  )
}
