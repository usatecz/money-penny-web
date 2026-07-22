import { useState } from 'react'
import type { GoogleUser } from '../types/GoogleUser'
import type { Profile } from '../types/Profile'
import type { Task } from '../types/Task'
import ProfilePage from './ProfilePage'
import DiaryPage from './DiaryPage'
import SettingsPage from './SettingsPage'

export type NavView = 'profile' | 'diary' | 'settings'

interface AppLayoutProps {
  user: GoogleUser
  profile: Profile
  onProfileChange: (profile: Profile) => void
  tasks: Task[]
  onTasksChange: (tasks: Task[]) => void
  onLogout: () => void
}

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  minHeight: '100vh',
}

const sidebarStyle: React.CSSProperties = {
  width: '240px',
  background: '#1a1a2e',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem 0',
  flexShrink: 0,
}

const brandStyle: React.CSSProperties = {
  padding: '0 1.5rem 1.5rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  marginBottom: '1rem',
}

const brandTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 600,
}

const brandSubtitleStyle: React.CSSProperties = {
  margin: '0.25rem 0 0',
  fontSize: '0.8rem',
  color: 'rgba(255, 255, 255, 0.6)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const navStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0 0.75rem',
  flex: 1,
}

const navButtonStyle = (active: boolean): React.CSSProperties => ({
  display: 'block',
  width: '100%',
  padding: '0.75rem 1rem',
  background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: active ? '#fff' : 'rgba(255, 255, 255, 0.75)',
  fontSize: '0.95rem',
  fontWeight: active ? 600 : 400,
  textAlign: 'left',
  cursor: 'pointer',
})

const logoutButtonStyle: React.CSSProperties = {
  margin: '1rem 0.75rem 0',
  padding: '0.75rem 1rem',
  background: 'transparent',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '8px',
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
}

const mainStyle: React.CSSProperties = {
  flex: 1,
  padding: '2rem',
  overflow: 'auto',
}

const contentStyle: React.CSSProperties = {
  maxWidth: '800px',
  margin: '0 auto',
}

const navItems: { id: NavView; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'diary', label: 'Diary' },
  { id: 'settings', label: 'Settings' },
]

export default function AppLayout({
  user,
  profile,
  onProfileChange,
  tasks,
  onTasksChange,
  onLogout,
}: AppLayoutProps) {
  const [activeView, setActiveView] = useState<NavView>('profile')

  return (
    <div style={layoutStyle}>
      <aside style={sidebarStyle}>
        <div style={brandStyle}>
          <h1 style={brandTitleStyle}>Money Penny</h1>
          <p style={brandSubtitleStyle}>{user.email}</p>
        </div>

        <nav style={navStyle}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              style={navButtonStyle(activeView === item.id)}
              onClick={() => setActiveView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" style={logoutButtonStyle} onClick={onLogout}>
          Logout
        </button>
      </aside>

      <main style={mainStyle}>
        <div style={contentStyle}>
          {activeView === 'profile' && (
            <ProfilePage
              user={user}
              profile={profile}
              onProfileChange={onProfileChange}
            />
          )}
          {activeView === 'diary' && (
            <DiaryPage tasks={tasks} onTasksChange={onTasksChange} />
          )}
          {activeView === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  )
}
