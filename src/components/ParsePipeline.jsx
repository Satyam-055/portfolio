import { useEffect, useState } from 'react'

const STAGES = [
  { id: 'pdf',      label: 'PDF in',         color: '#6366f1' },
  { id: 'redact',   label: 'Redact PII',      color: '#ef4444' },
  { id: 'llama',    label: 'LLaMA parses',    color: '#f59e0b' },
  { id: 'gpt',      label: 'GPT classifies',  color: '#10b981' },
  { id: 'out',      label: 'Account out',     color: '#2D5BFF' },
]

const CYCLE_MS = 1200

/* ─── Document preview per stage ─────────────────────────── */
function DocLines({ stage }) {
  const lines = [
    { w: '70%', pii: true,  label: 'John M. Doe' },
    { w: '55%', pii: false, label: 'Fidelity Investments' },
    { w: '45%', pii: true,  label: 'SSN •••-••-4291' },
    { w: '60%', pii: false, label: 'Account Summary' },
    { w: '40%', pii: true,  label: '****-****-5679' },
    { w: '50%', pii: false, label: 'Holdings' },
    { w: '65%', pii: false, label: 'Balance as of Mar 2026' },
    { w: '35%', pii: false, label: '$284,619.47' },
  ]

  return (
    <div className="space-y-[6px]">
      {lines.map((line, i) => {
        const isRedacted = line.pii && (stage === 'redact' || stage === 'llama' || stage === 'gpt' || stage === 'out')
        const isTagged   = !line.pii && (stage === 'llama' || stage === 'gpt' || stage === 'out')
        const isPii      = line.pii && stage === 'pdf'

        return (
          <div key={i} className="flex items-center gap-2" style={{ width: line.w }}>
            <div
              className="h-[9px] rounded-sm flex-1 transition-all duration-500 relative overflow-hidden"
              style={{
                background: isRedacted
                  ? '#1a1a1a'
                  : isPii
                  ? 'rgba(239,68,68,0.35)'
                  : isTagged
                  ? 'rgba(99,102,241,0.25)'
                  : 'rgba(255,255,255,0.1)',
                border: isPii
                  ? '1px solid rgba(239,68,68,0.6)'
                  : isTagged
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid transparent',
              }}
            >
              {isRedacted && (
                <div className="absolute inset-0 flex items-center px-1.5">
                  <span className="text-[6px] text-gray-600 font-mono tracking-widest select-none">
                    ██████████
                  </span>
                </div>
              )}
            </div>
            {(stage === 'llama' || stage === 'gpt' || stage === 'out') && !line.pii && (
              <span
                className="text-[7px] font-mono shrink-0 px-1 rounded transition-all duration-300"
                style={{ color: '#6366f1', background: 'rgba(99,102,241,0.12)' }}
              >
                {i === 0 || i === 1 ? 'inst' : i === 3 || i === 5 ? 'cat' : i === 6 ? 'date' : 'val'}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Output card ─────────────────────────────────────────── */
function OutputCard({ active }) {
  const fields = [
    { label: 'Institution', value: 'Fidelity Investments' },
    { label: 'Type',        value: 'Brokerage' },
    { label: 'Account',     value: '****5679' },
    { label: 'Balance',     value: '$284,619.47' },
    { label: 'As of',       value: 'Mar 31, 2026' },
  ]

  return (
    <div
      className="rounded-xl border transition-all duration-500 overflow-hidden"
      style={{
        borderColor: active ? 'rgba(45,91,255,0.6)' : 'rgba(255,255,255,0.08)',
        background: active ? 'rgba(45,91,255,0.08)' : 'rgba(255,255,255,0.03)',
        boxShadow: active ? '0 0 24px rgba(45,91,255,0.2)' : 'none',
      }}
    >
      <div className="px-3 py-2 border-b flex items-center gap-2"
           style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: active ? '#2D5BFF' : '#444' }} />
        <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Account</span>
        {active && (
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
            ✓ Created
          </span>
        )}
      </div>
      <div className="px-3 py-2 space-y-1.5">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-[10px] text-white/35">{label}</span>
            <span
              className="text-[10px] font-medium transition-all duration-500"
              style={{ color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.15)' }}
            >
              {active ? value : '———'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Arrow connector ─────────────────────────────────────── */
function Arrow({ active, color }) {
  return (
    <div className="flex items-center justify-center w-6 shrink-0">
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path
          d="M0 6h16M11 1l5 5-5 5"
          stroke={active ? color : 'rgba(255,255,255,0.12)'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'stroke 400ms' }}
        />
      </svg>
    </div>
  )
}

/* ─── Stage pill ──────────────────────────────────────────── */
function StagePill({ stage, active, done }) {
  return (
    <div
      className="flex flex-col items-center gap-1.5 shrink-0"
      style={{ minWidth: 72 }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-400"
        style={{
          background: active ? `${stage.color}22` : done ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.03)',
          border: `1.5px solid ${active ? stage.color : done ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'}`,
          boxShadow: active ? `0 0 12px ${stage.color}55` : 'none',
        }}
      >
        <StageIcon id={stage.id} color={active ? stage.color : done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'} />
      </div>
      <span
        className="text-[9px] font-medium text-center leading-tight transition-colors duration-400"
        style={{ color: active ? 'rgba(255,255,255,0.9)' : done ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)' }}
      >
        {stage.label}
      </span>
    </div>
  )
}

function StageIcon({ id, color }) {
  const s = { width: 14, height: 14, fill: 'none', stroke: color, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }
  if (id === 'pdf')    return <svg {...s} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
  if (id === 'redact') return <svg {...s} viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  if (id === 'llama')  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color}>
      <path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/>
    </svg>
  )
  if (id === 'gpt')    return (
    /* OpenAI logo mark */
    <svg width="14" height="14" viewBox="0 0 41 41" fill={color}>
      <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.211-2.328 10.079 10.079 0 0 0-9.617 6.977 9.967 9.967 0 0 0-6.663 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.211 2.328 10.079 10.079 0 0 0 9.617-6.976 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.82zm-22.498 8.71a3.586 3.586 0 0 1 .48-5.01l9.163-7.582-1.064-1.287-9.163 7.582a5.188 5.188 0 0 0-.694 7.245 5.188 5.188 0 0 0 7.245.694l9.163-7.582-1.064-1.286-9.163 7.582a3.583 3.583 0 0 1-4.903-.356zm16.27-9.09-9.163 7.581 1.064 1.287 9.163-7.582a3.585 3.585 0 0 1-.48 5.011l-9.163 7.581 1.064 1.287 9.163-7.582a5.188 5.188 0 0 0 .694-7.245 5.19 5.19 0 0 0-7.245-.694l-9.163 7.582 1.064 1.286 9.163-7.581a3.583 3.583 0 0 1 4.84.07z"/>
    </svg>
  )
  if (id === 'out')    return <svg {...s} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  return null
}

/* ─── Main component ──────────────────────────────────────── */
export default function ParsePipeline() {
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % STAGES.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  const activeStage = STAGES[activeIdx]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        <span className="ml-3 text-[10px] font-mono text-white/25">document-lens · processing</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: activeStage.color }} />
          <span className="text-[9px] font-mono" style={{ color: activeStage.color }}>{activeStage.label}</span>
        </div>
      </div>

      {/* Stage progress bar */}
      <div className="flex px-4 pt-4 pb-2 gap-1 items-center overflow-x-auto">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-1">
            <StagePill
              stage={stage}
              active={i === activeIdx}
              done={i < activeIdx}
            />
            {i < STAGES.length - 1 && (
              <Arrow active={i < activeIdx} color={STAGES[i + 1].color} />
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-2">
        {/* Left: document */}
        <div
          className="rounded-lg p-3 transition-all duration-500"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${activeIdx === 0 ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <path d="M1 1h5.5L9 3.5V11H1V1z" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="rgba(255,255,255,0.05)"/>
              <path d="M6 1v3h3" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            </svg>
            <span className="text-[9px] font-mono text-white/30">Fidelity_Statement_Mar.pdf</span>
          </div>
          <DocLines stage={activeStage.id} />
        </div>

        {/* Right: output card */}
        <div className="flex flex-col justify-between gap-2">
          <OutputCard active={activeIdx === 4} />
          {/* Status label */}
          <div
            className="rounded-lg px-3 py-2 text-[10px] font-mono transition-all duration-500"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              color: activeStage.color,
            }}
          >
            {activeIdx === 0 && '↑ receiving document...'}
            {activeIdx === 1 && '⬛ stripping PII fields...'}
            {activeIdx === 2 && '◈ identifying structure...'}
            {activeIdx === 3 && '◎ classifying + normalising...'}
            {activeIdx === 4 && '✓ 98% accuracy · account ready'}
          </div>
        </div>
      </div>
    </div>
  )
}
