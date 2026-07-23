import { GoogleLogin, CredentialResponse } from '@react-oauth/google'

interface LoginPageProps {
  loginFailed: boolean
  loginError: string | null
  onSuccess: (credentialResponse: CredentialResponse) => void
  onError: () => void
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
  padding: '3rem 2.5rem',
  maxWidth: '420px',
  width: '100%',
  textAlign: 'center',
}

const titleStyle: React.CSSProperties = {
  margin: '0 0 0.5rem',
  fontSize: '1.75rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const subtitleStyle: React.CSSProperties = {
  margin: '0 0 2rem',
  color: '#666',
  fontSize: '0.95rem',
}

const errorStyle: React.CSSProperties = {
  background: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  color: '#b91c1c',
  padding: '0.75rem 1rem',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
}

export default function LoginPage({
  loginFailed,
  loginError,
  onSuccess,
  onError,
}: LoginPageProps) {
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Money Penny</h1>
        <p style={subtitleStyle}>Sign in with your Google account to continue</p>
        <p style={{ ...subtitleStyle, margin: '0 0 1.5rem', fontSize: '0.85rem' }}>
          Wrong account? Sign out of Google in your browser, use an incognito
          window, or pick a different account when prompted.
        </p>

        {loginFailed && (
          <div style={errorStyle}>
            {loginError ?? 'Login failed. Please try again.'}
          </div>
        )}

        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap={false}
          auto_select={false}
        />

        {import.meta.env.DEV && (
          <p
            style={{
              ...subtitleStyle,
              margin: '1.5rem 0 0',
              fontSize: '0.8rem',
              color: '#888',
            }}
          >
            Google sign-in failing with an origin error? In Google Cloud Console →
            Credentials → your Web client, add{' '}
            <code>http://localhost:5173</code> and <code>http://127.0.0.1:5173</code>{' '}
            under Authorized JavaScript origins, then open{' '}
            <code>http://localhost:5173</code>.
          </p>
        )}
      </div>
    </div>
  )
}
