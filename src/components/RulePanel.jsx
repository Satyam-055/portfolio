import { useEffect, useState } from 'react'

export default function RulePanel({ rule, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const example = rule?.example

  useEffect(() => {
    if (!rule) return
    setActiveTab(0)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [rule, onClose])

  if (!rule || !example) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/55 backdrop-blur-sm
                 max-md:items-end"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg-card)] text-[var(--text-primary)] w-[480px] max-w-full overflow-y-auto
                   shadow-[-16px_0_48px_rgba(0,0,0,0.4)]
                   px-8 pt-7 pb-12
                   max-md:w-full max-md:h-[92vh] max-md:rounded-t-2xl max-md:px-6 max-md:pt-2 max-md:pb-8
                   max-md:shadow-[0_-16px_48px_rgba(0,0,0,0.4)]"
        style={{ animation: 'panelIn 240ms cubic-bezier(0.2, 0.8, 0.2, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="hidden max-md:block w-10 h-1 rounded-full bg-[var(--text-muted)] opacity-40 mx-auto mb-4 mt-2" />

        {/* Head */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--accent)]">
            {rule.title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 h-8 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--panel-soft)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Headline */}
        <h2 className="text-[24px] font-semibold leading-[1.35] mb-5 pt-0.5 pb-1.5"
            style={{ fontFamily: '"Work Sans", "Inter", sans-serif' }}>
          {example.headline}
        </h2>

        {/* Body intro (first paragraph) */}
        {example.body?.[0] && (
          <p className="text-[15px] leading-[1.65] mb-[18px] text-[var(--text-primary)]">{example.body[0]}</p>
        )}

        {/* Media */}
        <Media media={example.media} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Caption */}
        {example.caption && (
          <div className="text-[12px] italic text-[var(--text-secondary)] mt-2.5 mb-6">{example.caption}</div>
        )}

        {/* Body remainder */}
        {example.body?.slice(1).map((p, i) => (
          <p key={i} className="text-[15px] leading-[1.65] mb-[18px] text-[var(--text-primary)]">{p}</p>
        ))}

        {/* Rejected callout */}
        {example.rejected && (
          <div className="mt-6 px-3.5 py-3 rounded
                          bg-[var(--reject-bg)] text-[var(--reject-text)]
                          border-l-[3px] border-[var(--reject-border)]
                          text-[13px] leading-[1.5]">
            <strong className="font-semibold mr-1.5">Rejected:</strong>{example.rejected}
          </div>
        )}
      </div>
    </div>
  )
}

function Media({ media, activeTab, setActiveTab }) {
  if (!media) return null

  if (media.type === 'video') {
    return (
      <div className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-[10px] p-4 h-[460px] flex items-center justify-center overflow-hidden">
        <video
          src={media.src}
          autoPlay
          muted
          loop
          playsInline
          className="max-w-full max-h-full rounded-md"
        />
      </div>
    )
  }

  if (media.type === 'image-grid') {
    return (
      <div className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-[10px] px-[18px] py-7
                      grid grid-cols-2 gap-[18px] items-center justify-items-center
                      max-md:grid-cols-1">
        {media.srcs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className="block max-w-full max-h-[220px] w-auto h-auto"
          />
        ))}
      </div>
    )
  }

  if (media.type === 'tabbed') {
    return (
      <div>
        <div className="inline-flex gap-0.5 bg-[var(--panel-soft)] rounded-lg p-[3px] mb-3.5">
          {media.tabs.map((tab, i) => {
            const active = i === activeTab
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-3.5 py-1.5 rounded-[5px] text-[12px] font-medium font-inherit transition-colors
                  ${active
                    ? 'bg-[var(--panel-tab-active)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-[10px] px-[18px] py-5
                        h-[460px] flex items-center justify-center overflow-hidden">
          <img
            src={media.tabs[activeTab].src}
            alt={media.tabs[activeTab].label}
            className="max-w-full max-h-full block bg-white rounded-md
                       shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]"
          />
        </div>
      </div>
    )
  }

  return null
}
