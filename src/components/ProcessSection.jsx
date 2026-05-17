import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const KEYWORDS = [
  {
    id: 'brief',
    text: 'brief first',
    note: "Business POV before anything else. Why this, why now, what can't be touched. I expand the brief — I don't just restate it.",
    images: [
      '/case-studies/design-system/system-overview.png',
      '/case-studies/strategic-review/entry-point.webp',
    ],
  },
  {
    id: 'ds',
    text: 'design system as a constraint',
    note: "I pull every component I need before opening the design file. The system is a constraint, not a stylesheet. Extend only when there's genuinely no other way.",
    images: [
      '/case-studies/design-system/tokens-applied.webp',
      '/case-studies/design-system/hero.webp',
    ],
  },
  {
    id: 'hifi',
    text: 'high-fidelity fast',
    note: "No wireframes. Straight to hi-fi for the happy path. Edge cases are a completely separate phase — not squeezed in.",
    images: [
      '/case-studies/manual-account/Modal-4.webp',
      '/case-studies/strategic-review/analysis-modal.webp',
    ],
  },
  {
    id: 'loops',
    text: 'loops, not steps',
    note: "Ship, watch users, collect everything broken. That list becomes the next brief. Nothing ends at handoff.",
    images: [
      '/case-studies/manual-account/hero.webp',
      '/case-studies/strategic-review/card-account.webp',
    ],
  },
]

const TRAY_HEIGHT = 90
const TRAY_WIDTH  = 300

function TrayImages({ images }) {
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          style={{ flex: 1, height: 104, objectFit: 'cover', borderRadius: 8, minWidth: 0 }}
        />
      ))}
    </div>
  )
}

function Kw({ id, hovered, setHovered, setRect }) {
  const ref = useRef(null)
  const k   = KEYWORDS.find(k => k.id === id)
  const isDimmed = hovered && hovered !== id

  return (
    <span
      ref={ref}
      onMouseEnter={() => {
        setHovered(id)
        if (ref.current) setRect(ref.current.getBoundingClientRect())
      }}
      onMouseLeave={() => setHovered(null)}
      style={{
        color: isDimmed ? 'rgba(45,91,255,0.15)' : 'var(--accent)',
        fontStyle: 'italic',
        cursor: 'default',
        transition: 'color 0.28s',
      }}
    >
      {k.text}
    </span>
  )
}

function Dim({ children, active }) {
  return (
    <span
      style={{
        color: active ? 'rgba(163,163,163,0.12)' : 'var(--text-secondary)',
        transition: 'color 0.28s',
      }}
    >
      {children}
    </span>
  )
}

function Tray({ active, rect }) {
  if (!active || !rect) return null

  const left    = Math.min(Math.max(rect.left, 16), window.innerWidth - TRAY_WIDTH - 16)
  const spaceBelow = window.innerHeight - rect.bottom
  const topPos  = spaceBelow >= TRAY_HEIGHT + 16
    ? rect.bottom + 14
    : rect.top - TRAY_HEIGHT - 14

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: spaceBelow >= TRAY_HEIGHT + 16 ? 10 : -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: topPos,
          left,
          width: TRAY_WIDTH,
          zIndex: 60,
          pointerEvents: 'none',
        }}
      >
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontStyle: 'italic',
            fontSize: 15,
            color: 'rgba(243,244,246,0.88)',
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {active.note}
        </p>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}

export default function ProcessSection() {
  const [hovered, setHovered] = useState(null)
  const [rect,    setRect]    = useState(null)

  const active = KEYWORDS.find(k => k.id === hovered) || null
  const p = { hovered, setHovered, setRect }

  return (
    <>
      {/* Page dim */}
      {hovered && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5,5,5,0.82)',
            zIndex: 40,
            pointerEvents: 'none',
          }}
        />
      )}

      <Tray active={active} rect={rect} />

      <section
        className="max-w-5xl mx-auto px-8 lg:px-16 py-20"
        style={{ position: 'relative', zIndex: hovered ? 50 : 'auto' }}
      >
        <div className="border-t border-[var(--border)] mb-10" />

        <div className="mb-10">
          <span
            className="text-[14px] italic block mb-3"
            style={{
              fontFamily: "'Work Sans', sans-serif",
              color: hovered ? 'rgba(115,115,115,0.15)' : 'var(--text-muted)',
              transition: 'color 0.28s',
            }}
          >
            Process
          </span>
          <h2
            className="text-[32px] sm:text-[40px] font-semibold leading-[1.1] tracking-[-0.02em]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: hovered ? 'rgba(243,244,246,0.08)' : 'var(--text-primary)',
              transition: 'color 0.28s',
            }}
          >
            Chaotic by design.
          </h2>
        </div>

        <p
          className="text-[22px] sm:text-[28px] leading-[1.65]"
          style={{ fontFamily: "'Space Grotesk', sans-serif", maxWidth: 680 }}
        >
          <Dim active={hovered}>Every project starts </Dim>
          <Kw id="brief" {...p} />
          <Dim active={hovered}> — constraints, timeline, what cannot be touched. I treat the </Dim>
          <Kw id="ds" {...p} />
          <Dim active={hovered}> before touching a design file. Then it's </Dim>
          <Kw id="hifi" {...p} />
          <Dim active={hovered}> for the happy path only. The whole thing runs in </Dim>
          <Kw id="loops" {...p} />
          <Dim active={hovered}> — <span style={{ textDecoration: 'line-through', textDecorationColor: '#ef4444', textDecorationThickness: 2 }}>charged</span>, fueled by feedback.</Dim>
        </p>
      </section>
    </>
  )
}
