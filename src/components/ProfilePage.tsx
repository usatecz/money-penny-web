import { useEffect, useState } from 'react'
import type { GoogleUser } from '../types/GoogleUser'
import type { Profile } from '../types/Profile'

interface ProfilePageProps {
  user: GoogleUser
  profile: Profile
  onProfileChange: (profile: Profile) => Promise<void>
}

const pageTitleStyle: React.CSSProperties = {
  margin: '0 0 1.5rem',
  fontSize: '1.75rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '12px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  padding: '2rem',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.25rem',
  marginBottom: '2rem',
  paddingBottom: '1.5rem',
  borderBottom: '1px solid #f0f0f0',
}

const avatarStyle: React.CSSProperties = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  border: '3px solid #e5e7eb',
}

const googleNameStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const googleHintStyle: React.CSSProperties = {
  margin: '0.25rem 0 0',
  fontSize: '0.85rem',
  color: '#888',
}

const fieldStyle: React.CSSProperties = {
  marginBottom: '1.25rem',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.4rem',
  fontSize: '0.85rem',
  fontWeight: 500,
  color: '#555',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '0.95rem',
  color: '#333',
}

const saveButtonStyle: React.CSSProperties = {
  marginTop: '0.5rem',
  padding: '0.65rem 1.5rem',
  background: '#1a1a2e',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
}

const savedMessageStyle: React.CSSProperties = {
  display: 'inline-block',
  marginLeft: '1rem',
  fontSize: '0.9rem',
  color: '#059669',
}

const fields: { key: keyof Profile; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'surname', label: 'Surname' },
  { key: 'address', label: 'Address' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
]

export default function ProfilePage({
  user,
  profile,
  onProfileChange,
}: ProfilePageProps) {
  const [draft, setDraft] = useState<Profile>(profile)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(profile)
  }, [profile])

  const handleChange = (key: keyof Profile, value: string) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onProfileChange(draft)
      setSaved(true)
    } catch {
      setSaved(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 style={pageTitleStyle}>Profile</h2>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <img src={user.picture} alt={user.name} style={avatarStyle} />
          <div>
            <p style={googleNameStyle}>{user.name}</p>
            <p style={googleHintStyle}>Signed in with Google</p>
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            void handleSave()
          }}
        >
          {fields.map(({ key, label }) => (
            <div key={key} style={fieldStyle}>
              <label htmlFor={`profile-${key}`} style={labelStyle}>
                {label}
              </label>
              <input
                id={`profile-${key}`}
                type={key === 'email' ? 'email' : 'text'}
                value={draft[key]}
                onChange={(event) => handleChange(key, event.target.value)}
                style={inputStyle}
              />
            </div>
          ))}

          <div>
            <button type="submit" style={saveButtonStyle} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            {saved && <span style={savedMessageStyle}>Profile saved</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
