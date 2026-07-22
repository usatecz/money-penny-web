import type { GoogleUser } from '../types/GoogleUser'

interface UserProfileProps {
  user: GoogleUser
  onLogout: () => void
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '2rem',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  padding: '2.5rem',
  maxWidth: '480px',
  width: '100%',
  textAlign: 'center',
}

const avatarStyle: React.CSSProperties = {
  width: '96px',
  height: '96px',
  borderRadius: '50%',
  marginBottom: '1.25rem',
  border: '3px solid #e5e7eb',
}

const nameStyle: React.CSSProperties = {
  margin: '0 0 0.25rem',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const emailStyle: React.CSSProperties = {
  margin: '0 0 1.5rem',
  color: '#666',
  fontSize: '0.95rem',
}

const detailRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 0',
  borderBottom: '1px solid #f0f0f0',
  fontSize: '0.9rem',
}

const labelStyle: React.CSSProperties = {
  color: '#888',
  fontWeight: 500,
}

const valueStyle: React.CSSProperties = {
  color: '#333',
  fontWeight: 400,
  wordBreak: 'break-all',
  textAlign: 'right',
  maxWidth: '60%',
}

const logoutButtonStyle: React.CSSProperties = {
  marginTop: '2rem',
  padding: '0.65rem 2rem',
  background: '#fff',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
}

export default function UserProfile({ user, onLogout }: UserProfileProps) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={user.picture} alt={user.name} style={avatarStyle} />
        <h1 style={nameStyle}>{user.name}</h1>
        <p style={emailStyle}>{user.email}</p>

        <div>
          <div style={detailRowStyle}>
            <span style={labelStyle}>Name</span>
            <span style={valueStyle}>{user.name}</span>
          </div>
          <div style={detailRowStyle}>
            <span style={labelStyle}>Email</span>
            <span style={valueStyle}>{user.email}</span>
          </div>
          <div style={detailRowStyle}>
            <span style={labelStyle}>Google ID</span>
            <span style={valueStyle}>{user.googleId}</span>
          </div>
        </div>

        <button type="button" style={logoutButtonStyle} onClick={onLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}
