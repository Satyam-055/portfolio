import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import RulePanel from '../components/RulePanel'
import PdfViewer from '../components/PdfViewer'
import projects from '../data/projects'
import ToastAnimation from '../components/ToastAnimation'
import { usePageMeta } from '../hooks/usePageMeta'
import KilledAnimation from '../components/KilledAnimation'
import PrototypePlayer from '../components/PrototypePlayer'

/* ─── Preview Block ─────────────────────────────────────── */

const BAR_COLORS = {
  '#CEF8E0': '#22c55e',
  '#FFF3D6': '#f59e0b',
  '#D6ECFF': '#3b82f6',
  '#E8DBFA': '#8b5cf6',
  '#FFE0E0': '#ef4444',
  '#D6F5EC': '#14b8a6',
  '#E5EAFC': '#2E53E3',
}

function PreviewBlock({ color, type, className = '', style = {} }) {
  const accent = BAR_COLORS[color] || '#6366f1'

  if (type === 'chart') {
    return (
      <div
        className={`rounded-2xl ${className}`}
        style={{ backgroundColor: color, ...style }}
      >
        <div className="flex items-center justify-center h-full p-8 gap-6">
          <div
            className="w-24 h-24 rounded-full border-[10px] opacity-30"
            style={{ borderColor: accent, borderTopColor: 'transparent' }}
          />
          <div className="flex flex-col gap-2">
            {[72, 56, 40].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full opacity-25"
                style={{ width: w, backgroundColor: accent }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'cards') {
    return (
      <div
        className={`rounded-2xl ${className}`}
        style={{ backgroundColor: color, ...style }}
      >
        <div className="flex flex-col gap-3 p-8 h-full justify-center">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="rounded-xl h-10 opacity-20"
              style={{
                backgroundColor: accent,
                width: `${100 - n * 15}%`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (type === 'list') {
    return (
      <div
        className={`rounded-2xl ${className}`}
        style={{ backgroundColor: color, ...style }}
      >
        <div className="flex flex-col gap-3 p-8 h-full justify-center">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full opacity-30 shrink-0"
                style={{ backgroundColor: accent }}
              />
              <div
                className="h-3 rounded-full opacity-20 flex-1"
                style={{
                  backgroundColor: accent,
                  maxWidth: `${85 - n * 12}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // default: bars
  return (
    <div
      className={`rounded-2xl ${className}`}
      style={{ backgroundColor: color, ...style }}
    >
      <div className="flex items-end gap-3 h-full p-8">
        {[35, 55, 45, 70, 50, 65, 40, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm opacity-30"
            style={{ height: `${h}%`, backgroundColor: accent }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Mini Preview (smaller inline block) ───────────────── */

function MiniPreview({ color, type, className = '' }) {
  const accent = BAR_COLORS[color] || '#6366f1'

  return (
    <div
      className={`rounded-xl ${className}`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center gap-3 h-full px-6 py-4">
        <div
          className="w-10 h-10 rounded-lg opacity-25 shrink-0"
          style={{ backgroundColor: accent }}
        />
        <div className="flex-1 flex flex-col gap-1.5">
          <div
            className="h-2.5 rounded-full opacity-20"
            style={{ backgroundColor: accent, width: '70%' }}
          />
          <div
            className="h-2 rounded-full opacity-15"
            style={{ backgroundColor: accent, width: '45%' }}
          />
        </div>
      </div>
    </div>
  )
}

/* ─── DS Figure (case study images) ─────────────────────── */

function TabbedFigure({ tabs, ratio = '16 / 9' }) {
  const [active, setActive] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const current = tabs[active]
  const proportional = tabs.some((t) => t.widthPx)
  const maxPx = proportional ? Math.max(...tabs.map((t) => t.widthPx || 0)) : null
  const { containerRef, imgRef, reset, recapture, zoomIn, zoomOut } = useZoom()
  useEffect(() => {
    tabs.forEach((t) => { if (t.image) { const i = new Image(); i.src = t.image } })
  }, [tabs])
  useEffect(() => {
    recapture()
    reset()
  }, [active, recapture, reset])
  return (
    <>
    <div className="my-6">
      <div className="flex items-center justify-between mb-3.5">
        <div className="inline-flex gap-0.5 bg-[var(--panel-soft)] rounded-lg p-[3px]">
          {tabs.map((t, i) => {
            const isActive = i === active
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => setActive(i)}
                className={`px-3.5 py-1.5 rounded-[5px] text-[12px] font-medium transition-colors
                  ${isActive
                    ? 'bg-[var(--panel-tab-active)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                    : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
        <FigureToolbar reset={reset} zoomIn={zoomIn} zoomOut={zoomOut} onExpand={() => setExpanded(true)} />
      </div>
      {current.image ? (
        <figure
          ref={containerRef}
          className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-xl
                     flex items-center justify-center overflow-hidden px-6 py-10 select-none"
          style={{ height: '480px' }}
        >
          <img
            ref={imgRef}
            src={current.image}
            alt={current.alt || current.label}
            loading="lazy"
            draggable={false}
            className="block rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]"
            style={{
              width: 'auto',
              height: 'auto',
              maxWidth: proportional ? `${(current.widthPx / maxPx) * 100}%` : '100%',
              maxHeight: '100%',
              willChange: 'transform',
            }}
          />
        </figure>
      ) : (
        <div
          className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-card)]
                     flex items-center justify-center px-6 py-8 text-center"
          style={{ aspectRatio: ratio }}
        >
          <div className="max-w-[480px]">
            <p
              className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2"
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              insert img  -  {current.label}
            </p>
            <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
              {current.imagePlaceholder}
            </p>
          </div>
        </div>
      )}
    </div>
    {expanded && current.image && (
      <FullscreenOverlay src={current.image} alt={current.alt || current.label} onClose={() => setExpanded(false)} />
    )}
    </>
  )
}

function ImgPlaceholder({ description, caption, ratio = '16 / 9' }) {
  return (
    <figure className="my-6">
      <div
        className="rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-card)]
                   flex items-center justify-center px-6 py-8 text-center"
        style={{ aspectRatio: ratio }}
      >
        <div className="max-w-[480px]">
          <p
            className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            insert img
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
            {description}
          </p>
        </div>
      </div>
      {caption && (
        <figcaption
          className="text-[12px] italic text-[var(--text-muted)] mt-2"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function useZoom() {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const stateRef = useRef({ scale: 1, x: 0, y: 0, baseW: 0, baseH: 0 })
  const draggingRef = useRef(false)
  const originalStyleRef = useRef(null)

  const recapture = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    if (stateRef.current.scale > 1.001) return
    originalStyleRef.current = img.getAttribute('style') || ''
  }, [])

  const apply = useCallback(() => {
    const img = imgRef.current
    if (!img) return
    const { scale, x, y, baseW, baseH } = stateRef.current
    const zoomed = scale > 1.001 && baseW && baseH
    if (zoomed) {
      img.style.maxWidth = 'none'
      img.style.maxHeight = 'none'
      img.style.width = `${baseW * scale}px`
      img.style.height = `${baseH * scale}px`
      img.style.transform = `translate(${x}px, ${y}px)`
    } else if (originalStyleRef.current !== null) {
      img.setAttribute('style', originalStyleRef.current)
    } else {
      img.style.width = ''
      img.style.height = ''
      img.style.maxWidth = ''
      img.style.maxHeight = ''
      img.style.transform = ''
    }
    const el = containerRef.current
    if (el) el.style.overflow = zoomed ? 'hidden' : ''
  }, [])

  const captureBase = useCallback(() => {
    const img = imgRef.current
    if (!img || !img.offsetWidth) return
    if (stateRef.current.scale > 1.001) return
    if (originalStyleRef.current === null) {
      originalStyleRef.current = img.getAttribute('style') || ''
    }
    stateRef.current = {
      ...stateRef.current,
      baseW: img.offsetWidth,
      baseH: img.offsetHeight,
    }
  }, [])

  const updateCursor = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (draggingRef.current) el.style.cursor = 'grabbing'
    else if (stateRef.current.scale > 1.001) el.style.cursor = 'grab'
    else el.style.cursor = ''
  }, [])

  const reset = useCallback(() => {
    stateRef.current = { ...stateRef.current, scale: 1, x: 0, y: 0 }
    const img = imgRef.current
    if (img) {
      img.style.transition = 'width 220ms cubic-bezier(0.2, 0.8, 0.2, 1), height 220ms cubic-bezier(0.2, 0.8, 0.2, 1), transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      apply()
      setTimeout(() => {
        if (img) img.style.transition = ''
      }, 240)
    }
    updateCursor()
  }, [apply, updateCursor])

  useEffect(() => {
    const img = imgRef.current
    if (!img) return
    const onLoad = () => captureBase()
    if (img.complete) captureBase()
    img.addEventListener('load', onLoad)
    const onResize = () => captureBase()
    window.addEventListener('resize', onResize)
    return () => {
      img.removeEventListener('load', onLoad)
      window.removeEventListener('resize', onResize)
    }
  }, [captureBase])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let dragStart = null

    const onWheel = (e) => {
      const isZoom = e.ctrlKey || e.metaKey
      const t = stateRef.current

      if (isZoom) {
        e.preventDefault()
        if (!t.baseW) {
          captureBase()
          if (!stateRef.current.baseW) return
        }
        const next = Math.max(1, Math.min(5, t.scale - e.deltaY * 0.005))
        if (next <= 1.001) {
          stateRef.current = { ...stateRef.current, scale: 1, x: 0, y: 0 }
        } else {
          // Scale around image center; user can pan after to find detail
          const ratio = next / t.scale
          stateRef.current = {
            ...stateRef.current,
            scale: next,
            x: t.x * ratio,
            y: t.y * ratio,
          }
        }
        apply()
        updateCursor()
        return
      }

      // Two-finger drag / wheel pan when zoomed
      if (t.scale > 1.001) {
        e.preventDefault()
        stateRef.current = { ...t, x: t.x - e.deltaX, y: t.y - e.deltaY }
        apply()
      }
    }

    const onDown = (e) => {
      if (stateRef.current.scale <= 1.001) return
      if (e.button !== 0) return
      e.preventDefault()
      draggingRef.current = true
      dragStart = {
        clientX: e.clientX,
        clientY: e.clientY,
        startX: stateRef.current.x,
        startY: stateRef.current.y,
      }
      updateCursor()
    }

    const onMove = (e) => {
      if (!draggingRef.current || !dragStart) return
      const dx = e.clientX - dragStart.clientX
      const dy = e.clientY - dragStart.clientY
      stateRef.current = {
        ...stateRef.current,
        x: dragStart.startX + dx,
        y: dragStart.startY + dy,
      }
      apply()
    }

    const onUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      dragStart = null
      updateCursor()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [apply, updateCursor, captureBase])

  const zoomBy = useCallback((delta) => {
    const t = stateRef.current
    if (!t.baseW) {
      captureBase()
      if (!stateRef.current.baseW) return
    }
    const next = Math.max(1, Math.min(5, t.scale + delta))
    if (next <= 1.001) {
      stateRef.current = { ...stateRef.current, scale: 1, x: 0, y: 0 }
    } else {
      const ratio = next / t.scale
      stateRef.current = { ...stateRef.current, scale: next, x: t.x * ratio, y: t.y * ratio }
    }
    apply()
    updateCursor()
  }, [apply, updateCursor, captureBase])

  const zoomIn  = useCallback(() => zoomBy(0.5),  [zoomBy])
  const zoomOut = useCallback(() => zoomBy(-0.5), [zoomBy])

  return { containerRef, imgRef, reset, recapture, zoomIn, zoomOut }
}

/* ─── Figure toolbar (zoom + expand) ───────────────────────── */
function FigureToolbar({ reset, zoomIn, zoomOut, onExpand, dark = false }) {
  const base = `w-6 h-6 rounded flex items-center justify-center transition-colors`
  const cls  = dark
    ? `${base} text-white/50 hover:text-white hover:bg-white/10`
    : `${base} text-[var(--text-secondary)] hover:bg-[var(--border)]`
  return (
    <div className="flex items-center gap-0.5">
      <button onClick={zoomOut} className={cls} title="Zoom out">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button onClick={reset} className={`${cls} text-[10px] font-mono w-auto px-1.5`} title="Reset">1:1</button>
      <button onClick={zoomIn} className={cls} title="Zoom in">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      {onExpand && (
        <button onClick={onExpand} className={`${cls} ml-1`} title="Fullscreen">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
      )}
    </div>
  )
}

/* ─── Fullscreen image overlay ──────────────────────────────── */
function FullscreenOverlay({ src, alt, onClose }) {
  const { containerRef, imgRef, reset, zoomIn, zoomOut } = useZoom()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-6 pt-4 pb-2 shrink-0">
        <FigureToolbar reset={reset} zoomIn={zoomIn} zoomOut={zoomOut} dark />
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-hidden select-none px-6 pb-6"
        style={{ touchAction: 'none' }}
      >
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          draggable={false}
          className="block rounded-md shadow-2xl"
          style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', willChange: 'transform' }}
        />
      </div>
    </div>
  )
}

function ZoomableFigure({ src, alt, caption, height = 480 }) {
  const { containerRef, imgRef, reset, zoomIn, zoomOut } = useZoom()
  const [expanded, setExpanded] = useState(false)
  return (
    <>
    <figure className="my-6">
      <div
        className="bg-[var(--panel-soft)] border border-[var(--border)] rounded-xl overflow-hidden"
      >
        <div className="flex items-center justify-end px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <FigureToolbar reset={reset} zoomIn={zoomIn} zoomOut={zoomOut} onExpand={() => setExpanded(true)} />
        </div>
        <div
          ref={containerRef}
          className="flex items-center justify-center overflow-hidden px-6 py-10 select-none"
          style={{ height: `${height}px` }}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="block rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]"
            style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '100%', willChange: 'transform' }}
          />
        </div>
      </div>
      {caption && (
        <figcaption className="text-[12px] italic text-[var(--text-muted)] mt-2" style={{ fontFamily: "'Work Sans', sans-serif" }}>
          {caption}
        </figcaption>
      )}
    </figure>
    {expanded && <FullscreenOverlay src={src} alt={alt} onClose={() => setExpanded(false)} />}
    </>
  )
}

function ScrollablePreview({ src, alt, caption, height = 480 }) {
  const chromeH = 28
  const { containerRef, imgRef } = useZoom()
  return (
    <figure className="my-6">
      <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)]">
        <div
          className="flex items-center gap-1.5 px-3 border-b border-[var(--border)] bg-[var(--panel-soft)]"
          style={{ height: `${chromeH}px` }}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#28C840' }} />
        </div>
        <div
          ref={containerRef}
          className="overflow-y-auto select-none"
          style={{ height: `${height - chromeH}px`, touchAction: 'pan-y' }}
        >
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading="lazy"
            draggable={false}
            className="block w-full h-auto"
            style={{ willChange: 'transform' }}
          />
        </div>
      </div>
      {caption && (
        <figcaption
          className="text-[12px] italic text-[var(--text-muted)] mt-2"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function DSFigure({ src, alt, caption, wide = false }) {
  const { containerRef, imgRef, reset, zoomIn, zoomOut } = useZoom()
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <figure className="my-6" style={{ display: 'block', width: '100%', minWidth: 0 }}>
        <div
          className="rounded-xl border border-[var(--border)]"
          style={{ width: '100%', minWidth: 0, overflow: wide ? 'auto' : 'hidden' }}
        >
          <div className="flex items-center justify-end px-3 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <FigureToolbar reset={reset} zoomIn={zoomIn} zoomOut={zoomOut} onExpand={() => setExpanded(true)} />
          </div>
          <div ref={containerRef} className="select-none">
            <img
              ref={imgRef}
              src={src}
              alt={alt}
              loading="lazy"
              draggable={false}
              style={wide
                ? { display: 'block', height: 'auto', minWidth: '700px', willChange: 'transform' }
                : { display: 'block', width: '100%', height: 'auto', maxWidth: '100%', willChange: 'transform' }
              }
            />
          </div>
        </div>
        {caption && (
          <figcaption className="text-[12px] italic text-[var(--text-muted)] mt-2" style={{ fontFamily: "'Work Sans', sans-serif" }}>
            {caption}
          </figcaption>
        )}
      </figure>
      {expanded && <FullscreenOverlay src={src} alt={alt} onClose={() => setExpanded(false)} />}
    </>
  )
}

/* ─── Scoped Tabs (mobile / desktop variants) ──────────── */
function ScopeTabs({ tabs, height = 460 }) {
  const [active, setActive] = useState(0)
  const current = tabs[active]
  return (
    <div className="mt-4">
      <div className="inline-flex gap-0.5 bg-[var(--panel-soft)] rounded-lg p-[3px] mb-3">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={`px-3.5 py-1.5 rounded-[5px] text-[12px] font-medium transition-colors
              ${i === active
                ? 'bg-[var(--panel-tab-active)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ZoomableFigure src={current.src} alt={current.label} caption={current.caption} height={height} />
    </div>
  )
}

/* ─── Journey Tabs (PDF) ────────────────────────────────── */
function JourneyTabs({ journeys }) {
  const [active, setActive] = useState(0)
  return (
    <div className="mb-10">
      <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[var(--text-secondary)] mb-3"
          style={{ fontFamily: '"Work Sans", "Inter", sans-serif' }}>
        User journeys
      </h3>
      <div className="inline-flex gap-0.5 bg-[var(--panel-soft)] rounded-lg p-[3px] mb-3">
        {journeys.map((j, i) => (
          <button
            key={j.label}
            onClick={() => setActive(i)}
            className={`px-3.5 py-1.5 rounded-[5px] text-[12px] font-medium transition-colors
              ${i === active
                ? 'bg-[var(--panel-tab-active)] text-[var(--text-primary)] shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
                : 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            {j.label}
          </button>
        ))}
      </div>
      <PdfViewer src={journeys[active].src} label={journeys[active].label} />
    </div>
  )
}

/* ─── Token Chips ───────────────────────────────────────── */

function ColorChip({ label, color }) {
  return (
    <div className="inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)]">
      <span
        className="w-5 h-5 rounded-md border border-[var(--border)] shrink-0"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-[12px] text-[var(--text-primary)] font-medium">{label}</span>
    </div>
  )
}

function SizeChip({ label }) {
  return (
    <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] min-w-[44px]">
      <span className="text-[12px] text-[var(--text-primary)] font-medium">{label}</span>
    </div>
  )
}

/* ─── Component Tile (uniform for the tab grid) ─────────── */

function ComponentTile({ name, body, src, alt, wide = false }) {
  return (
    <article className="border border-[var(--border)] rounded-xl overflow-hidden flex flex-col">
      <div className={`${wide ? 'aspect-[16/9]' : 'aspect-[4/3]'} bg-white flex items-center justify-center p-4`}>
        <img
          src={src}
          alt={alt || name}
          loading="lazy"
          className="max-w-full max-h-full w-auto h-auto object-contain"
        />
      </div>
      <div className="px-5 py-4 bg-[#F5F5F5] border-t border-[#E6E6E6]">
        <p
          className="text-[14px] font-semibold text-[#1A1A1A] mb-1"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {name}
        </p>
        {body && <p className="text-[12.5px] text-[#6D6D6D] leading-[1.6]">{body}</p>}
      </div>
    </article>
  )
}

/* ─── Section Heading ───────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p
      className="text-[14px] italic font-medium text-[var(--label-accent)] mb-3"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      {children}
    </p>
  )
}

/* ─── Stat Card ─────────────────────────────────────────── */

function StatCard({ value, label }) {
  const isLong = value.length > 12
  return (
    <div className="flex-1 border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]">
      <p
        className={`${isLong ? 'text-[15px]' : 'text-[28px]'} font-bold text-[var(--text-primary)] leading-tight`}
        style={{ fontFamily: "'Work Sans', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-[13px] text-[var(--text-muted)] mt-1">{label}</p>
    </div>
  )
}

/* ─── Claude mark  -  Claude Code loading animation ────────── */

// U+FE0E forces text presentation so the glyphs honor `color` instead of rendering as emoji
const CLAUDE_FRAMES = ['✶︎', '✷︎', '✸︎', '✹︎', '✺︎', '✻︎', '✼︎', '✽︎']

function ClaudeMark({ size = 56 }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % CLAUDE_FRAMES.length), 240)
    return () => clearInterval(id)
  }, [])
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        lineHeight: `${size}px`,
        textAlign: 'center',
        fontSize: size,
        color: '#CC785C',
        fontFamily:
          "'Apple Color Emoji', 'Segoe UI Symbol', 'Noto Sans Symbols 2', monospace",
        userSelect: 'none',
      }}
    >
      {CLAUDE_FRAMES[i]}
    </span>
  )
}

/* ─── Pixel agent  -  cute boxy metal robot ────────────────── */

const METAL = {
  L: '#D4D4D8', // highlight
  M: '#71717A', // mid base
  D: '#3F3F46', // shadow
  S: '#18181B', // screen face background
  E: '#F4F4F5', // eyes + smile (warm white)
  A: '#CC785C', // antenna LED only
}

// 10 cols × 12 rows, each "pixel" = 10×10 in viewBox 0 0 100 120
const ROBOT_PIXELS = [
  // Row 1  -  antenna stem
  [4, 1, 'D'],
  // Row 2  -  head top highlight band
  [0, 2, 'L'], [1, 2, 'L'], [2, 2, 'L'], [3, 2, 'L'], [4, 2, 'L'],
  [5, 2, 'L'], [6, 2, 'L'], [7, 2, 'L'], [8, 2, 'L'], [9, 2, 'L'],
  // Row 3  -  head metal
  [0, 3, 'L'], [1, 3, 'M'], [2, 3, 'M'], [3, 3, 'M'], [4, 3, 'M'],
  [5, 3, 'M'], [6, 3, 'M'], [7, 3, 'M'], [8, 3, 'M'], [9, 3, 'D'],
  // Row 4  -  screen top
  [0, 4, 'L'], [1, 4, 'M'], [2, 4, 'S'], [3, 4, 'S'], [4, 4, 'S'],
  [5, 4, 'S'], [6, 4, 'S'], [7, 4, 'S'], [8, 4, 'M'], [9, 4, 'D'],
  // Row 5  -  screen eye row (eye dots overlaid separately for blink)
  [0, 5, 'L'], [1, 5, 'M'], [2, 5, 'S'], [3, 5, 'S'], [4, 5, 'S'],
  [5, 5, 'S'], [6, 5, 'S'], [7, 5, 'S'], [8, 5, 'M'], [9, 5, 'D'],
  // Row 6  -  screen blank
  [0, 6, 'L'], [1, 6, 'M'], [2, 6, 'S'], [3, 6, 'S'], [4, 6, 'S'],
  [5, 6, 'S'], [6, 6, 'S'], [7, 6, 'S'], [8, 6, 'M'], [9, 6, 'D'],
  // Row 7  -  screen smile (4-wide)
  [0, 7, 'L'], [1, 7, 'M'], [2, 7, 'S'], [3, 7, 'E'], [4, 7, 'E'],
  [5, 7, 'E'], [6, 7, 'E'], [7, 7, 'S'], [8, 7, 'M'], [9, 7, 'D'],
  // Row 8  -  head bottom shadow band
  [0, 8, 'D'], [1, 8, 'D'], [2, 8, 'D'], [3, 8, 'D'], [4, 8, 'D'],
  [5, 8, 'D'], [6, 8, 'D'], [7, 8, 'D'], [8, 8, 'D'], [9, 8, 'D'],
  // Row 9  -  body top
  [2, 9, 'M'], [3, 9, 'M'], [4, 9, 'M'], [5, 9, 'M'], [6, 9, 'M'], [7, 9, 'M'],
  // Row 10  -  body shaded
  [2, 10, 'L'], [3, 10, 'M'], [4, 10, 'M'], [5, 10, 'M'], [6, 10, 'M'], [7, 10, 'D'],
  // Row 11  -  feet
  [1, 11, 'D'], [2, 11, 'D'], [7, 11, 'D'], [8, 11, 'D'],
]

function PixelAgent({ size = 44 }) {
  return (
    <motion.svg
      viewBox="0 0 100 120"
      width={size * (100 / 120)}
      height={size}
      aria-hidden="true"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ overflow: 'visible', shapeRendering: 'crispEdges' }}
    >
      {/* antenna LED tip  -  pulses */}
      <motion.rect
        x={40}
        y={0}
        width={10}
        height={10}
        fill={METAL.A}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* body  -  shaded metal */}
      {ROBOT_PIXELS.map(([col, row, c]) => (
        <rect
          key={`${col}-${row}`}
          x={col * 10}
          y={row * 10}
          width="10"
          height="10"
          fill={METAL[c]}
        />
      ))}

      {/* eyes  -  single dots that blink occasionally */}
      <motion.g
        fill={METAL.E}
        animate={{ opacity: [1, 1, 0, 1] }}
        transition={{
          duration: 4,
          times: [0, 0.93, 0.96, 1],
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <rect x={30} y={50} width="10" height="10" />
        <rect x={60} y={50} width="10" height="10" />
      </motion.g>
    </motion.svg>
  )
}

/* ─── Scroll-reveal wrapper ─────────────────────────────── */

function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Main Component ────────────────────────────────────── */

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [id])
  const project = projects.find((p) => p.id === id) || projects[0]
  usePageMeta({
    title: `${project.title} | Satyam Dubey`,
    description: project.description,
    image: project.heroImage,
  })
  const caseStudyProjects = projects.filter((p) => p.caseStudy)
  const currentIdx = caseStudyProjects.findIndex((p) => p.id === project.id)
  const nextProject = caseStudyProjects[(currentIdx + 1) % caseStudyProjects.length]
  const rich = project.caseStudy
  const content = rich
  const [activeCat, setActiveCat] = useState(
    content?.componentCategories ? content.componentCategories[0].id : null
  )
  const [openRule, setOpenRule] = useState(null)
  const activeCategory = content.componentCategories?.find((c) => c.id === activeCat)

  const mono = { fontFamily: "'JetBrains Mono', monospace" }
  const heading = { fontFamily: "'Work Sans', sans-serif" }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pb-20"
    >

      {/* ── Top Navigation ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M19 12H5M12 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to projects
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[13px] text-[var(--text-muted)]">
            <Link to="/" className="hover:text-[var(--text-secondary)] transition-colors">
              Work
            </Link>
            <span>/</span>
            <span className="text-[var(--text-secondary)]">{project.title}</span>
          </div>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <Reveal>
          {project.heroImage ? (
            <div
              className="h-[260px] sm:h-[340px] lg:h-[400px] w-full rounded-2xl overflow-hidden"
              style={{ backgroundColor: project.previewColor }}
            >
              <img
                src={project.heroImage}
                alt={project.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          ) : (
            <PreviewBlock
              color={project.previewColor}
              type={project.previewType}
              className="h-[260px] sm:h-[340px] lg:h-[400px] w-full"
            />
          )}
        </Reveal>

        <Reveal className="mt-8">
          <h1
            className="text-[30px] sm:text-[36px] lg:text-[42px] font-bold text-[var(--text-primary)] leading-tight"
            style={heading}
          >
            {project.title}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed mt-3 max-w-2xl">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="h-7 inline-flex items-center px-3 rounded-md border border-[var(--border)] text-[12px] font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ── Two-Column Layout ───────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-12 flex flex-col lg:flex-row gap-12">
        {/* ─ Left: Main Content ─ */}
        <div className="flex-1 min-w-0">
          {rich ? (
            <>
              {/* TL;DR */}
              <Reveal>
                <div className="border-l-2 border-[var(--accent)] pl-5 py-1 mb-12">
                  <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2" style={mono}>TL;DR</p>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.7]">
                    {content.tldr}
                  </p>
                </div>
              </Reveal>

              {/* Overview / The fracture opening */}
              <Reveal>
                <SectionLabel>{content.sectionLabels?.fracture || 'The fracture'}</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[16px] leading-[1.75] mb-6">
                  {content.overview}
                </p>
                <div className="space-y-5 mb-12">
                  {content.challenge.map((para, i) => (
                    <p key={i} className="text-[var(--text-secondary)] text-[15px] leading-[1.8]">
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Entry points at top  -  Manual Account */}
              {content.entryPoints && (
                <Reveal>
                  <SectionLabel>Entry points</SectionLabel>
                  <div className="space-y-4 mb-12">
                    {content.entryPoints.map((item) => (
                      <div key={item.title} className="border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]">
                        <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-2" style={heading}>{item.title}</p>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{item.body}</p>
                        {item.tabs && <ScopeTabs tabs={item.tabs} />}
                        {!item.tabs && item.image && <DSFigure src={item.image} alt={item.alt} />}
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Widget preview at top  -  Strategic Review */}
              {content.widgetSizes && content.showWidgetAtTop && (
                <Reveal>
                  <SectionLabel>{content.sectionLabels?.foundations || 'The widget'}</SectionLabel>
                  {content.widgetSizesIntro && (
                    <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">{content.widgetSizesIntro}</p>
                  )}
                  <div className="mb-12">
                    <TabbedFigure tabs={content.widgetSizes} ratio="16 / 9" />
                  </div>
                </Reveal>
              )}

              {/* Research  -  competitor matrix (only if defined) */}
              {content.competitorMatrix && (
                <Reveal>
                  <SectionLabel>{content.sectionLabels?.research || 'Research'}</SectionLabel>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                    {content.competitorIntro}
                  </p>
                  <div className="border border-[var(--border)] rounded-xl overflow-hidden mb-12 bg-[var(--bg-card)]">
                    {content.competitorMatrix.map((row, i) => (
                      <div
                        key={row.competitor}
                        className={`flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-3 sm:gap-6 ${
                          i !== content.competitorMatrix.length - 1 ? 'border-b border-[var(--border)]' : ''
                        }`}
                      >
                        <div className="sm:w-[200px] shrink-0 flex items-center gap-3">
                          <img
                            src={row.logo || `https://www.google.com/s2/favicons?domain=${(row.domain || row.competitor.toLowerCase().replace(/\s+/g, ''))}.com&sz=64`}
                            alt=""
                            loading="lazy"
                            className="w-7 h-7 rounded-md object-contain bg-[var(--panel-soft)] p-0.5"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]" style={heading}>
                            {row.competitor}
                          </p>
                        </div>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">{row.learning}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Moodboard */}
              {content.moodboard && (
                <Reveal>
                  <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[var(--text-secondary)] mb-3"
                      style={{ fontFamily: '"Work Sans", "Inter", sans-serif' }}>
                    Moodboard
                  </h3>
                  <div className="mb-10">
                    <PdfViewer src={content.moodboard.src} label={content.moodboard.label} />
                  </div>
                </Reveal>
              )}

              {/* Journey maps */}
              {content.journeys && (
                <Reveal>
                  <JourneyTabs journeys={content.journeys} />
                </Reveal>
              )}

              {/* Pain points  -  only if defined */}
              {content.painPoints && (
                <Reveal>
                  <div className="space-y-3 mb-12">
                    {content.painPoints.map((pt) => (
                      <div key={pt.title} className="border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            pt.severity === 'Critical'
                              ? 'bg-red-950/40 text-red-400'
                              : 'bg-orange-950/40 text-orange-400'
                          }`}>
                            {pt.severity}
                          </span>
                          <p className="text-[14px] font-semibold text-[var(--text-primary)]" style={heading}>{pt.title}</p>
                        </div>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7] mb-3">{pt.body}</p>
                        <div className="flex items-start gap-2 pt-3 border-t border-[var(--border-subtle)]">
                          <span className="text-[var(--accent)] mt-0.5 shrink-0">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" strokeLinecap="round"/></svg>
                          </span>
                          <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{pt.opportunity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Journey  -  image-led narrative section (only if defined) */}
              {content.journey && (
                <Reveal>
                  <SectionLabel>{content.sectionLabels?.journey || 'The journey'}</SectionLabel>
                  <p className="text-[var(--text-secondary)] text-[17px] leading-[1.85] mb-8 max-w-2xl">
                    {content.journey.intro}
                  </p>
                  {content.journey.image ? (
                    <ZoomableFigure
                      src={content.journey.image}
                      alt={content.journey.alt}
                      caption={content.journey.caption}
                      height={content.journey.wide ? 600 : 480}
                    />
                  ) : (
                    <ImgPlaceholder
                      description={content.journey.placeholder}
                      caption={content.journey.caption}
                      ratio="21 / 9"
                    />
                  )}
                </Reveal>
              )}

              {/* The stance  -  doctrine */}
              <Reveal>
                <SectionLabel>{content.sectionLabels?.stance || 'The stance'}</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.doctrineIntro}
                </p>
                {(() => {
                  const hasMedia = content.doctrine.some((r) => r.imagePlaceholder || r.image || r.tabs)
                  const gridClass = hasMedia
                    ? 'space-y-4 mb-12'
                    : 'grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12'
                  return (
                    <div className={gridClass}>
                      {content.doctrine.map((rule) => {
                        const hasExample = !!rule.example
                        const hasInlineInteraction = !!rule.tabs || !!rule.scrollable
                        const cardIsButton = hasExample && !hasInlineInteraction
                        const Card = cardIsButton ? 'button' : 'div'
                        const cardProps = cardIsButton
                          ? {
                              type: 'button',
                              onClick: () => setOpenRule(rule),
                              className:
                                'relative text-left border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)] w-full cursor-pointer hover:border-[var(--accent)] hover:-translate-y-0.5 transition-all duration-200 group',
                            }
                          : {
                              className:
                                'relative text-left border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)] w-full',
                            }
                        return (
                          <Card key={rule.title} {...cardProps}>
                            {hasExample && (
                              cardIsButton ? (
                                <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] group-hover:gap-1.5 transition-all pointer-events-none">
                                  See it in practice
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setOpenRule(rule)}
                                  className="absolute top-5 right-5 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:gap-1.5 transition-all cursor-pointer"
                                >
                                  See it in practice
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>
                              )
                            )}
                            {rule.icon && (
                              <img
                                src={rule.icon}
                                alt=""
                                className="w-10 h-10 object-contain mb-4"
                              />
                            )}
                            <p
                              className="text-[15px] font-semibold text-[var(--text-primary)] mb-2"
                              style={{ ...heading, paddingRight: hasExample ? '160px' : 0 }}
                            >
                              {rule.title}
                            </p>
                            <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{rule.body}</p>
                            {rule.animate === 'toast' ? (
                              <ToastAnimation />
                            ) : rule.animate === 'killed' ? (
                              <KilledAnimation />
                            ) : rule.tabs ? (
                              <TabbedFigure tabs={rule.tabs} ratio="16 / 9" />
                            ) : rule.scrollable && rule.image ? (
                              <ScrollablePreview src={rule.image} alt={rule.alt || rule.title} caption={rule.caption} />
                            ) : rule.image ? (
                              <DSFigure src={rule.image} alt={rule.alt || rule.title} caption={rule.caption} />
                            ) : rule.imagePlaceholder ? (
                              <ImgPlaceholder description={rule.imagePlaceholder} ratio="16 / 9" />
                            ) : null}
                          </Card>
                        )
                      })}
                    </div>
                  )
                })()}
              </Reveal>

              {/* Prototype player */}
              {content.prototypeSteps && (
                <Reveal>
                  <SectionLabel>The flow</SectionLabel>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                    Six steps. Click through to see exactly how a review goes from request to in-progress.
                  </p>
                  <div className="mb-12">
                    <PrototypePlayer steps={content.prototypeSteps} />
                  </div>
                </Reveal>
              )}

              {/* Scope showcase  -  only if defined */}
              {content.scopeShowcase && (
                <Reveal>
                  <SectionLabel>{content.sectionLabels?.showcase || 'The scope'}</SectionLabel>
                  {content.scopeShowcaseIntro && (
                    <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                      {content.scopeShowcaseIntro}
                    </p>
                  )}
                  <div className="space-y-4 mb-12">
                    {content.scopeShowcase.map((item) => (
                      <div
                        key={item.title}
                        className="border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]"
                      >
                        <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-2" style={heading}>
                          {item.title}
                        </p>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{item.body}</p>
                        {item.sizes && (
                          <TabbedFigure tabs={item.sizes} ratio="16 / 9" />
                        )}
                        {item.tabs && (
                          <ScopeTabs tabs={item.tabs} />
                        )}
                        {item.pdf && (
                          <div className="mt-4">
                            <PdfViewer src={item.pdf} label={item.pdfLabel} />
                          </div>
                        )}
                        {!item.sizes && !item.tabs && !item.pdf && item.imagePlaceholder && (
                          <ImgPlaceholder description={item.imagePlaceholder} ratio="21 / 9" />
                        )}
                        {!item.sizes && !item.tabs && !item.pdf && item.image && (
                          <DSFigure src={item.image} alt={item.alt} caption={item.caption} wide={!!item.wide} />
                        )}
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}

              {/* Foundations */}
              <Reveal>
                <SectionLabel>{content.sectionLabels?.foundations || 'Foundations'}</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.foundationsIntro}
                </p>
                {content.tokenComposition && (
                  <div className="mb-8">
                    <DSFigure
                      src={content.tokenComposition.src}
                      alt={content.tokenComposition.alt}
                      caption={content.tokenComposition.caption}
                    />
                  </div>
                )}
                {content.foundationsImagePlaceholder && (
                  <div className="mb-8">
                    <ImgPlaceholder
                      description={content.foundationsImagePlaceholder}
                      ratio="21 / 9"
                    />
                  </div>
                )}
                <div className="space-y-6 mb-12">
                  {content.foundations.map((f) => (
                    <div key={f.title} className="border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]">
                      <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-2" style={heading}>
                        {f.title}
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7] mb-3">{f.body}</p>
                      {f.colorGroups && (
                        <div className="space-y-3 mt-4">
                          {f.colorGroups.map((group) => (
                            <div key={group.label}>
                              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2" style={mono}>
                                {group.label}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {group.items.map((c) => (
                                  <ColorChip key={c.label} label={c.label} color={c.color} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {f.sizeChips && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {f.sizeChips.map((s) => (
                            <SizeChip key={s} label={s} />
                          ))}
                        </div>
                      )}
                      {f.image && (
                        <div className="mt-4">
                          <img
                            src={f.image.src}
                            alt={f.image.alt}
                            loading="lazy"
                            className="w-full h-auto rounded-lg border border-[var(--border)]"
                          />
                        </div>
                      )}
                      {f.typeSamples && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {f.typeSamples.map((t) => (
                            <div
                              key={t.family}
                              className="inline-flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)]"
                            >
                              <span
                                className="text-[22px] text-[var(--text-primary)] leading-none"
                                style={{
                                  fontFamily:
                                    t.family === 'Work Sans'
                                      ? "'Work Sans', sans-serif"
                                      : "'Inter', sans-serif",
                                }}
                              >
                                {t.family}
                              </span>
                              <span
                                className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
                                style={mono}
                              >
                                {t.usage}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {f.namingHint && (
                        <p className="mt-3 text-[12px] text-[var(--text-muted)]" style={mono}>
                          {f.namingHint}
                        </p>
                      )}
                      {f.shadowDemo && (
                        <div className="mt-4 flex items-center justify-center bg-[var(--bg)] py-10 rounded-lg border border-[var(--border)]">
                          <div
                            className="w-32 h-20 rounded-lg bg-white"
                            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}
                          />
                        </div>
                      )}
                      {f.tokenExamples && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {f.tokenExamples.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg)] text-[12px] text-[var(--text-primary)]"
                              style={mono}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* The system */}
              {content.systemIntro && (
                <Reveal>
                  <SectionLabel>The system</SectionLabel>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                    {content.systemIntro}
                  </p>
                </Reveal>
              )}

              {/* Tabbed component browser */}
              {content.componentCategories && activeCategory && (
                <Reveal>
                  <div className="mb-16">
                    {/* Tab bar  -  sticky pill style */}
                    <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-[var(--bg)]/90 backdrop-blur-sm mb-8">
                      <div
                        className="flex gap-2 overflow-x-auto"
                        role="tablist"
                      >
                        {content.componentCategories.map((cat) => {
                          const isActive = cat.id === activeCat
                          return (
                            <button
                              key={cat.id}
                              role="tab"
                              aria-selected={isActive}
                              onClick={() => setActiveCat(cat.id)}
                              className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap rounded-full border transition-all ${
                                isActive
                                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]'
                              }`}
                              style={heading}
                            >
                              {cat.label}
                              {cat.items.length > 0 && (
                                <span
                                  className={`ml-1.5 text-[10px] ${
                                    isActive ? 'text-white/70' : 'text-[var(--text-muted)]'
                                  }`}
                                  style={mono}
                                >
                                  {cat.items.length}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Active category */}
                    <div role="tabpanel">
                      <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-8">
                        {activeCategory.description}
                      </p>

                      {activeCategory.body && (
                        <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-8">
                          {activeCategory.body}
                        </p>
                      )}

                      {activeCategory.items.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {activeCategory.items.map((item) => (
                            <ComponentTile
                              key={item.src}
                              name={item.name}
                              body={item.body}
                              src={item.src}
                              alt={item.name}
                              wide={item.wide}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Building alongside agents */}
              {content.agents && (
                <Reveal>
                  <div className="flex items-center justify-between gap-6 mb-2">
                    <div className="flex items-center gap-3">
                      <SectionLabel>Building alongside agents</SectionLabel>
                      <PixelAgent size={40} />
                    </div>
                    <ClaudeMark size={48} />
                  </div>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                    {content.agentsIntro}
                  </p>
                  <div className="space-y-3 mb-6">
                    {content.agents.map((a) => (
                      <div key={a.name} className="flex flex-col sm:flex-row gap-1 sm:gap-5 px-5 py-4 border border-[var(--border)] rounded-xl">
                        <p className="sm:w-[140px] shrink-0 text-[13px] font-semibold text-[var(--accent)]" style={mono}>
                          {a.name}
                        </p>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{a.body}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-12">
                    {content.agentsClose}
                  </p>
                </Reveal>
              )}

              {/* Stats */}
              <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                  {content.stats.map((stat, i) => (
                    <StatCard key={i} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </Reveal>

              {/* Results */}
              <Reveal>
                <SectionLabel>Results</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-12">
                  {content.results}
                </p>
              </Reveal>

              {/* Reflection */}
              <Reveal>
                <SectionLabel>Reflection</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.reflectionIntro}
                </p>
                <div className="space-y-4 mb-8">
                  {content.reflection.map((r) => (
                    <div key={r.title} className="border-l-2 border-[var(--border)] pl-5">
                      <p className="text-[14px] font-semibold text-[var(--text-primary)] mb-1" style={heading}>
                        {r.title}
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{r.body}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-8">
                  {content.reflectionClose}
                </p>
              </Reveal>

              {/* Divider */}
              <div className="border-t border-[var(--border)] my-14" />
            </>
          ) : (
            <>
              {/* Overview */}
              <Reveal>
                <SectionLabel>Overview</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[16px] leading-[1.75] mb-12">
                  {content.overview}
                </p>
              </Reveal>

              {/* The Challenge */}
              <Reveal>
                <SectionLabel>The challenge</SectionLabel>
                <div className="space-y-5 mb-12">
                  {content.challenge.map((para, i) => (
                    <p
                      key={i}
                      className="text-[var(--text-secondary)] text-[15px] leading-[1.8]"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>

              {/* Process */}
              <Reveal>
                <SectionLabel>Process</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.processIntro}
                </p>
              </Reveal>

              <Reveal>
                <PreviewBlock
                  color={project.previewColor}
                  type={project.previewType}
                  className="h-[200px] sm:h-[260px] mb-6"
                />
              </Reveal>

              <Reveal>
                <ol className="space-y-3 mb-12">
                  {content.processSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-[15px] leading-[1.7]">
                      <span
                        className="text-[13px] font-semibold text-[var(--text-muted)] mt-0.5 shrink-0 w-5 text-right"
                        style={mono}
                      >
                        {i + 1}.
                      </span>
                      <span className="text-[var(--text-secondary)]">{step}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>

              {/* Solution */}
              <Reveal>
                <SectionLabel>Solution</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.solutionIntro}
                </p>
              </Reveal>

              <Reveal>
                <div className="flex gap-3 mb-6">
                  <MiniPreview
                    color={project.previewColor}
                    type={project.previewType}
                    className="flex-1 h-[56px]"
                  />
                  <MiniPreview
                    color={project.previewColor}
                    type={project.previewType}
                    className="flex-1 h-[56px]"
                  />
                </div>
              </Reveal>

              <Reveal>
                <PreviewBlock
                  color={project.previewColor}
                  type={project.previewType}
                  className="h-[200px] sm:h-[280px] mb-8"
                />
              </Reveal>

              {/* Stats */}
              <Reveal>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                  {content.stats.map((stat, i) => (
                    <StatCard key={i} value={stat.value} label={stat.label} />
                  ))}
                </div>
              </Reveal>

              {/* Results */}
              <Reveal>
                <SectionLabel>Results</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-8">
                  {content.results}
                </p>
              </Reveal>

              {/* Divider */}
              <div className="border-t border-[var(--border)] my-14" />
            </>
          )}
        </div>

        {/* ─ Right: Metadata Sidebar ─ */}
        <div className="w-full lg:w-[280px] shrink-0 order-first lg:order-last">
          <div className="lg:sticky lg:top-8">
            <div className="space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1" style={mono}>Role</p>
                <p className="text-[14px] font-medium text-[var(--text-primary)]">{project.role}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1" style={mono}>Timeline</p>
                <p className="text-[14px] font-medium text-[var(--text-primary)]">{project.timeline}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1" style={mono}>Platform</p>
                <p className="text-[14px] font-medium text-[var(--text-primary)]">{project.platform}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-1.5" style={mono}>Team</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.team.map((m) => (
                    <span key={m} className="bg-[var(--bg-card-hover)] rounded-full px-3 py-1 text-[12px] text-[var(--text-secondary)] font-medium">{m}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t border-[var(--border)] my-6" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] mb-2" style={mono}>Deliverables</p>
              <div className="space-y-1.5">
                {content.deliverables.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
                    <span className="text-[14px] text-[var(--text-primary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--border)] my-6" />
            <a href="#" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[var(--accent)] hover:text-[#1a45e0] transition-colors">
              View Live
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Next Project  -  full width ═══ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 pb-20">
        <Reveal>
          <p className="text-[13px] text-[var(--text-muted)] mb-3">Next Project</p>
          <Link
            to={`/project/${nextProject.id}`}
            className="group block w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--text-muted)] hover:shadow-lg transition-all"
          >
            <div className="flex items-stretch" style={{ height: '120px' }}>
              <div className="flex-1 flex items-center px-8 sm:px-10">
                <h3
                  className="text-[15px] sm:text-[17px] lg:text-[19px] font-semibold text-[var(--text-primary)] leading-[1.2] group-hover:text-[var(--accent)] transition-colors"
                  style={heading}
                >
                  {nextProject.title}
                </h3>
              </div>
              <div className="w-[30%] sm:w-[35%] shrink-0 hidden sm:block overflow-hidden">
                <img
                  src={nextProject.heroImage}
                  alt={nextProject.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>

      <RulePanel rule={openRule} onClose={() => setOpenRule(null)} />
    </motion.div>
  )
}
