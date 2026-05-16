import { useEffect, useState } from 'react'

const STATES = [
  { label: 'Importing',  color: '#6366f1', icon: 'spinner' },
  { label: 'Verifying',  color: '#f59e0b', icon: 'pulse'   },
  { label: 'Ready',      color: '#10b981', icon: 'check'   },
]

const HOLD_MS = 1600

export default function ToastAnimation() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % STATES.length), HOLD_MS)
    return () => clearInterval(id)
  }, [])

  const s = STATES[idx]

  return (
    <div className="mt-5 flex items-center select-none">
      <div
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all duration-500"
        style={{
          background: `${s.color}12`,
          border: `1px solid ${s.color}40`,
        }}
      >
        <Icon type={s.icon} color={s.color} />
        <span className="text-[12px] font-medium transition-colors duration-500" style={{ color: s.color }}>
          {s.label}
        </span>
      </div>
    </div>
  )
}

function Icon({ type, color }) {
  if (type === 'spinner') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="2.5" strokeLinecap="round"
         style={{ animation: 'spin 1s linear infinite' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
  if (type === 'pulse') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}
         strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
