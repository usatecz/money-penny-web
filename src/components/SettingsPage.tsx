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

export default function SettingsPage() {
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

        <div style={planRowStyle}>
          <div>
            <div style={planNameStyle}>Basic</div>
            <div style={planDetailStyle}>Your current plan</div>
          </div>
          <span style={badgeStyle}>Current</span>
        </div>

        <div style={{ ...planRowStyle, borderBottom: 'none' }}>
          <div>
            <div style={planNameStyle}>Premium</div>
            <div style={planDetailStyle}>Unlock advanced features</div>
          </div>
          <span style={priceStyle}>$20/month</span>
        </div>
      </div>
    </div>
  )
}
