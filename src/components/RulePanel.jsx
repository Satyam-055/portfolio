import { useEffect, useState, useRef } from 'react'
import ParsePipeline from './ParsePipeline'
import PdfViewer from './PdfViewer'

export default function RulePanel({ rule, onClose }) {
  const example = rule?.example
  const panelRef = useRef(null)
  const dragRef = useRef({ startY: 0, dragging: false })
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    if (!rule) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [rule, onClose])

  const onTouchStart = (e) => {
    const panel = panelRef.current
    if (!panel) return
    if (panel.scrollTop > 0) return
    dragRef.current = { startY: e.touches[0].clientY, dragging: true }
  }

  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return
    const delta = Math.max(0, e.touches[0].clientY - dragRef.current.startY)
    setDragY(delta)
  }

  const onTouchEnd = () => {
    if (dragY > 80) { onClose() }
    dragRef.current.dragging = false
    setDragY(0)
  }

  if (!rule || !example) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/55 backdrop-blur-sm
                 max-md:items-end"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="bg-[var(--bg-card)] text-[var(--text-primary)] w-[480px] max-w-full overflow-y-auto
                   shadow-[-16px_0_48px_rgba(0,0,0,0.4)]
                   px-8 pt-7 pb-12
                   max-md:w-full max-md:h-[92vh] max-md:rounded-t-2xl max-md:px-6 max-md:pt-2 max-md:pb-8
                   max-md:shadow-[0_-16px_48px_rgba(0,0,0,0.4)]"
        style={{
          animation: 'panelIn 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragY > 0 ? 'none' : 'transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)',
          opacity: dragY > 0 ? Math.max(0.4, 1 - dragY / 200) : undefined,
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Mobile drag handle */}
        <div className="hidden max-md:block w-10 h-1 rounded-full bg-[var(--text-muted)] opacity-40 mx-auto mb-4 mt-2" />

        {/* Head */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            {rule.icon && (
              <img
                src={rule.icon}
                alt=""
                aria-hidden="true"
                className="w-7 h-7 object-contain"
              />
            )}
            <div className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--accent)]">
              {rule.title}
            </div>
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

        {example.sections ? (
          <>
            {example.intro && (
              <p className="text-[15px] leading-[1.65] mb-6 text-[var(--text-primary)]">{example.intro}</p>
            )}
            {example.sections.map((section, i) => (
              <section key={i} className="mb-7">
                {section.heading && (
                  <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[var(--text-secondary)] mb-3"
                      style={{ fontFamily: '"Work Sans", "Inter", sans-serif' }}>
                    {section.heading}
                  </h3>
                )}
                {section.body && (
                  <p className="text-[15px] leading-[1.65] mb-3.5 text-[var(--text-primary)]">{section.body}</p>
                )}
                {section.media && <Media media={section.media} />}
                {section.caption && (
                  <div className="text-[12px] italic text-[var(--text-secondary)] mt-2.5">{section.caption}</div>
                )}
              </section>
            ))}
          </>
        ) : (
          <>
            {/* Body intro (first paragraph) */}
            {example.body?.[0] && (
              <p className="text-[15px] leading-[1.65] mb-[18px] text-[var(--text-primary)]">{example.body[0]}</p>
            )}

            {/* Media */}
            <Media media={example.media} />

            {/* Caption */}
            {example.caption && (
              <div className="text-[12px] italic text-[var(--text-secondary)] mt-2.5 mb-6">{example.caption}</div>
            )}

            {/* Body remainder */}
            {example.body?.slice(1).map((p, i) => (
              <p key={i} className="text-[15px] leading-[1.65] mb-[18px] text-[var(--text-primary)]">{p}</p>
            ))}
          </>
        )}

        {/* Pipeline visualiser */}
        {example.pipelineSteps && (
          <div className="mt-6 mb-2">
            <ParsePipeline />
          </div>
        )}

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

function Media({ media }) {
  const [activeTab, setActiveTab] = useState(0)
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

  if (media.type === 'image') {
    return (
      <div className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-[10px] p-4
                      flex items-center justify-center overflow-hidden"
           style={{ minHeight: '240px', maxHeight: '460px' }}>
        <img
          src={media.src}
          alt={media.alt || ''}
          className="max-w-full max-h-full block rounded-md
                     shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]"
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

  if (media.type === 'pdf') {
    return <PdfViewer src={media.src} label={media.label} />
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
