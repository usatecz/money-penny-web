import { useState } from 'react'
import type { Settings, SubscriptionPlan } from '../types/Settings'

interface SettingsPageProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => Promise<void>
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

const planRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.25rem 0',
  borderBottom: '1px solid #f0f0f0',
}

const planNameStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#1a1a2e',
}

const planDetailStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#666',
  marginTop: '0.25rem',
}

const badgeStyle: React.CSSProperties = {
  background: '#ecfdf5',
  color: '#059669',
  padding: '0.25rem 0.65rem',
  borderRadius: '999px',
  fontSize: '0.8rem',
  fontWeight: 500,
}

const priceStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  color: '#374151',
}

const planButtonStyle: React.CSSProperties = {
  padding: '0.45rem 0.9rem',
  background: '#1a1a2e',
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: 500,
  cursor: 'pointer',
}

const plans: {
  id: SubscriptionPlan
  name: string
  detail: string
  price?: string
}[] = [
  { id: 'basic', name: 'Basic', detail: 'Core diary and profile features' },
  {
    id: 'premium',
    name: 'Premium',
    detail: 'Unlock advanced features',
    price: '$20/month',
  },
]

export default function SettingsPage({
  settings,
  onSettingsChange,
}: SettingsPageProps) {
  const [saving, setSaving] = useState(false)

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan === settings.subscriptionPlan || saving) return

    setSaving(true)
    try {
      await onSettingsChange({ subscriptionPlan: plan })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h2 style={pageTitleStyle}>Settings</h2>

      <div style={cardStyle}>
        <h3
          style={{
            margin: '0 0 1.25rem',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#1a1a2e',
          }}
        >
          Subscription
        </h3>

        {plans.map((plan, index) => {
          const isCurrent = settings.subscriptionPlan === plan.id

          return (
            <div
              key={plan.id}
              style={{
                ...planRowStyle,
                borderBottom: index === plans.length - 1 ? 'none' : planRowStyle.borderBottom,
              }}
            >
              <div>
                <div style={planNameStyle}>{plan.name}</div>
                <div style={planDetailStyle}>
                  {isCurrent ? 'Your current plan' : plan.detail}
                </div>
              </div>

              {isCurrent ? (
                <span style={badgeStyle}>Current</span>
              ) : plan.price ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={priceStyle}>{plan.price}</span>
                  <button
                    type="button"
                    style={planButtonStyle}
                    disabled={saving}
                    onClick={() => void handleSelectPlan(plan.id)}
                  >
                    {saving ? 'Saving…' : 'Switch'}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  style={planButtonStyle}
                  disabled={saving}
                  onClick={() => void handleSelectPlan(plan.id)}
                >
                  {saving ? 'Saving…' : 'Switch'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
