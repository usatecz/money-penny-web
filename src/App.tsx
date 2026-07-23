import { useEffect, useRef, useState } from 'react'
import {
  GoogleOAuthProvider,
  CredentialResponse,
  googleLogout,
} from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import LoginPage from './components/LoginPage'
import AppLayout from './components/AppLayout'
import type { GoogleUser, GoogleJwtPayload } from './types/GoogleUser'
import type { Profile } from './types/Profile'
import type { Settings } from './types/Settings'
import type { Task } from './types/Task'
import {
  ApiError,
  checkBackendHealth,
  createTask,
  deleteTask,
  fetchSync,
  setAuthToken,
  updateProfile,
  updateSettings,
  updateTask,
} from './api'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

function AuthApp() {
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [settings, setSettings] = useState<Settings>({ subscriptionPlan: 'basic' })
  const [loginFailed, setLoginFailed] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingSlow, setLoadingSlow] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const loginSyncPromise = useRef<Promise<void> | null>(null)
  const loadingSlowTimer = useRef<number | null>(null)

  const clearLoadingSlowTimer = () => {
    if (loadingSlowTimer.current !== null) {
      window.clearTimeout(loadingSlowTimer.current)
      loadingSlowTimer.current = null
    }
    setLoadingSlow(false)
  }

  const startLoadingSlowTimer = () => {
    clearLoadingSlowTimer()
    loadingSlowTimer.current = window.setTimeout(() => {
      setLoadingSlow(true)
    }, 5_000)
  }

  const clearSession = () => {
    setAuthToken(null)
    setUser(null)
    setProfile(null)
    setTasks([])
    setSettings({ subscriptionPlan: 'basic' })
  }

  const handleApiError = (err: unknown) => {
    if (err instanceof ApiError && err.status === 401) {
      setApiError('Your session expired. Please sign in again.')
      clearSession()
      setLoginError('Your session expired. Please sign in again.')
      return
    }

    const message =
      err instanceof ApiError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Something went wrong.'
    setApiError(message)
  }

  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setLoginFailed(true)
      setLoginError(null)
      return
    }

    if (loginSyncPromise.current) {
      return loginSyncPromise.current
    }

    loginSyncPromise.current = (async () => {
      try {
        const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential!)
        const googleUser: GoogleUser = {
          name: decoded.name,
          email: decoded.email,
          picture: decoded.picture,
          googleId: decoded.sub,
        }

        setAuthToken(credentialResponse.credential!)
        setLoading(true)
        startLoadingSlowTimer()
        setLoginFailed(false)
        setLoginError(null)
        setApiError(null)

        await checkBackendHealth()
        const sync = await fetchSync()
        setUser(googleUser)
        setProfile(sync.profile)
        setTasks(sync.tasks)
        setSettings(sync.settings)
      } catch (err) {
        clearSession()
        const devDetail =
          import.meta.env.DEV && err instanceof ApiError && err.message
            ? ` (${err.message})`
            : import.meta.env.DEV && err instanceof Error
              ? ` (${err.message})`
              : ''

        if (err instanceof ApiError) {
          setLoginFailed(true)
          const message =
            err.status === 401
              ? `Could not verify your Google account. Please try again.${devDetail}`
              : err.status === 0
                ? `${err.message}${devDetail}`
                : `Could not load your data. Check that the backend is running.${devDetail}`
          setLoginError(message)
          if (import.meta.env.DEV) {
            console.error('Login sync failed:', err.status, err.message)
          }
        } else {
          const message = `Login failed. Please try again.${devDetail}`
          setLoginFailed(true)
          setLoginError(message)
        }
      } finally {
        clearLoadingSlowTimer()
        loginSyncPromise.current = null
        setLoading(false)
      }
    })()

    return loginSyncPromise.current
  }

  const handleLoginError = () => {
    loginSyncPromise.current = null
    clearLoadingSlowTimer()
    setLoading(false)
    setLoginFailed(true)
    setLoginError(null)
  }

  const handleLogout = () => {
    googleLogout()
    loginSyncPromise.current = null
    clearLoadingSlowTimer()
    setLoading(false)
    clearSession()
    setLoginFailed(false)
    setLoginError(null)
    setApiError(null)
  }

  const handleProfileChange = async (nextProfile: Profile) => {
    try {
      const updated = await updateProfile(nextProfile)
      setProfile(updated)
      setApiError(null)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  const handleTaskCreate = async (task: Omit<Task, 'id'>) => {
    try {
      const created = await createTask(task)
      setTasks((prev) => [...prev, created])
      setApiError(null)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  const handleTaskUpdate = async (task: Task) => {
    try {
      const { id, ...payload } = task
      const updated = await updateTask(id, payload)
      setTasks((prev) => prev.map((item) => (item.id === id ? updated : item)))
      setApiError(null)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  const handleTaskDelete = async (id: string) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((task) => task.id !== id))
      setApiError(null)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  const handleSettingsChange = async (nextSettings: Settings) => {
    try {
      const updated = await updateSettings(nextSettings)
      setSettings(updated)
      setApiError(null)
    } catch (err) {
      handleApiError(err)
      throw err
    }
  }

  useEffect(() => {
    return () => {
      clearLoadingSlowTimer()
    }
  }, [])

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          color: '#555',
          textAlign: 'center',
          gap: '0.75rem',
        }}
      >
        <p style={{ margin: 0 }}>Loading your data…</p>
        {loadingSlow && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#888' }}>
            Still working… check that the backend is running on port 8000.
          </p>
        )}
        {loginError && (
          <p
            style={{
              margin: '0.5rem 0 0',
              fontSize: '0.9rem',
              color: '#b91c1c',
              maxWidth: '28rem',
            }}
          >
            {loginError}
          </p>
        )}
      </div>
    )
  }

  if (user && profile) {
    return (
      <AppLayout
        user={user}
        profile={profile}
        onProfileChange={handleProfileChange}
        tasks={tasks}
        onTaskCreate={handleTaskCreate}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        apiError={apiError}
        onDismissError={() => setApiError(null)}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <LoginPage
      loginFailed={loginFailed}
      loginError={loginError}
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
