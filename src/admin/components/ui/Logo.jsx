export const Logo = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        backgroundColor: '#0066FF',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
        color: 'white'
      }}>
        B
      </div>
      <div>
        <div style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#121212'
        }}>
          Bluetick
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666',
          fontWeight: '500'
        }}>
          Admin
        </div>
      </div>
    </div>
  )
}
