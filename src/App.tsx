import { useState } from 'react'
import { GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import LoginPage from './components/LoginPage'
import AppLayout from './components/AppLayout'
import type { GoogleUser, GoogleJwtPayload } from './types/GoogleUser'
import type { Profile } from './types/Profile'
import type { Task } from './types/Task'
import { profileFromGoogle } from './utils/profileFromGoogle'
import { createDefaultTasks } from './utils/defaultTasks'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function AuthApp() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loginFailed, setLoginFailed] = useState(false)

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setLoginFailed(true)
      return
    }

    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential)
      const googleUser: GoogleUser = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        googleId: decoded.sub,
      }
      setUser(googleUser)
      setProfile(profileFromGoogle(googleUser))
      setTasks(createDefaultTasks())
      setLoginFailed(false)
    } catch {
      setLoginFailed(true)
    }
  }

  const handleLoginError = () => {
    setLoginFailed(true)
  }

  const handleLogout = () => {
    setUser(null)
    setProfile(null)
    setTasks([])
    setLoginFailed(false)
  }

  if (user && profile) {
    return (
      <AppLayout
        user={user}
        profile={profile}
        onProfileChange={setProfile}
        tasks={tasks}
        onTasksChange={setTasks}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <LoginPage
      loginFailed={loginFailed}
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  )
}

function App() {
  if (!clientId) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
          color: '#b91c1c',
        }}
      >
        <p>
          Missing VITE_GOOGLE_CLIENT_ID. Copy .env.example to .env and add your
          Google OAuth client ID.
        </p>
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthApp />
    </GoogleOAuthProvider>
  )
}

export default App
