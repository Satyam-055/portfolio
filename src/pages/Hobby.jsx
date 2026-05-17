import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'

// ─── Data ────────────────────────────────────────────────────
const hobbyData = [
  {
    id: 'jagriti-yatra',
    title: 'Jagriti Yatra',
    metadata: 'Postcard Series // 2024',
    description: 'Postcard design and photography for a 15-day entrepreneurship train journey across India.',
    href: 'https://www.behance.net/gallery/188921635/Jagriti-Yatra-Postcard-Series',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_632_webp/0fae36188921635.65a3ecb5920e7.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/6ef3d4188921635.65a3ecb592d4e.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/b2c547188921635.65a3ecb593c72.jpg',
    ],
  },
  {
    id: 'theater',
    title: 'थिएटर',
    metadata: 'Photography // 2023',
    description: 'A single-screen cinema in Ahmedabad. Two shows a day, Rs. 30 a ticket.',
    href: 'https://www.behance.net/gallery/170588269/_',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/625188170588269.6460ddcaa90f2.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/093112170588269.6460ddcaae268.gif',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/df4bc8170588269.6460ddcaab0d8.jpg',
    ],
  },
  {
    id: 'visiting-card',
    title: 'राइ का पहाड़',
    metadata: 'Graphic Design // 2023',
    description: 'A visiting card built on a Hindi idiom. Making mountains out of molehills.',
    href: 'https://www.behance.net/gallery/167965335/To-blow-an-issue-or-event-out-of-proportion',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/df04c5167965335.6432853a3efd2.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/b5cff2167965335.6432853a412cc.png',
    ],
  },
  {
    id: 'romanticizing-passion',
    title: 'Romanticizing Passion',
    metadata: 'Documentary // 2022',
    description: '40 years of puppetry. What happens to an artist after the pandemic.',
    href: 'https://www.behance.net/gallery/154171015/Romanticizing-Passion',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/f5da1d154171015.633d54fccd411.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/d35de8154171015.633d7c81136ef.jpg',
    ],
  },
  {
    id: 'banaras-ke-ghat',
    title: 'Banaras ke Ghat',
    metadata: 'Photography // 2022',
    description: 'The ghats at dawn. Rituals, river, and the light that makes Banaras feel outside of time.',
    href: 'https://www.behance.net/gallery/146861253/Banaras-ke-Ghat',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/3b3357146861253.62b838c6156bf.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/4d9c7d146861253.62b838c61658b.jpg',
      'https://mir-s3-cdn-cf.behance.net/project_modules/fs/3f6208146861253.62b838c618947.jpg',
    ],
  },
  {
    id: 'kerala',
    title: 'KERALA',
    metadata: 'Film Photography // 2022',
    description: 'Film photography. Grain, mountains, slow light.',
    href: 'https://www.behance.net/gallery/142570721/KERALA-(-Film-Photography)',
    images: [
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/83b713142570721.626946abc17a6.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200_webp/8d014d142570721.626943c2df64b.png',
      'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/6acc7f142570721.626943c1b68b1.jpg',
    ],
  },
]

// ─── Stack: overlapping, clearly offset so all cards peek through
const STACK_TRANSFORMS = [
  { rotate: -6, x: -18, y: 16  },  // bottom: peeks bottom-left
  { rotate:  4, x:  18, y: -12 },  // middle: peeks top-right
  { rotate: -1, x:   0, y:   0 },  // top: centered
]

// Fan: images spread horizontally, no rotation
function getFanTransforms(count) {
  if (count === 2) return [
    { rotate: -2, x: 0,   y: 0 },
    { rotate:  2, x: 200, y: 0 },
  ]
  return [
    { rotate: -3, x:   0, y: 0 },
    { rotate:  0, x: 200, y: 0 },
    { rotate:  3, x: 400, y: 0 },
  ]
}

// ─── ImageStack ───────────────────────────────────────────────
function ImageStack({ images }) {
  const [hovered, setHovered] = useState(false)
  const fanTransforms = getFanTransforms(images.length)

  return (
    <div
      style={{ display: 'grid', overflow: 'visible', cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((src, i) => {
        const stack = STACK_TRANSFORMS[i] || STACK_TRANSFORMS[0]
        const fan   = fanTransforms[i]    || fanTransforms[0]
        const target = hovered ? fan : stack

        return (
          <motion.div
            key={src}
            style={{ gridArea: '1/1', zIndex: i }}
            animate={{ rotate: target.rotate, x: target.x, y: target.y }}
            transition={{ type: 'spring', stiffness: 220, damping: 22, mass: 0.8 }}
          >
            <img
              src={src}
              alt=""
              className="w-full h-auto block rounded-lg border border-neutral-800 shadow-2xl"
              draggable={false}
            />
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Mobile bottom sheet ─────────────────────────────────────
function MobileSheet({ project, onClose }) {
  const sheetRef = useRef(null)
  const dragRef = useRef({ startY: 0, dragging: false })
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const onTouchStart = (e) => {
    if (sheetRef.current?.scrollTop > 0) return
    dragRef.current = { startY: e.touches[0].clientY, dragging: true }
  }
  const onTouchMove = (e) => {
    if (!dragRef.current.dragging) return
    const delta = Math.max(0, e.touches[0].clientY - dragRef.current.startY)
    setDragY(delta)
  }
  const onTouchEnd = () => {
    if (dragY > 80) onClose()
    dragRef.current.dragging = false
    setDragY(0)
  }

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/60 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        ref={sheetRef}
        className="fixed bottom-0 left-0 right-0 z-[70] bg-neutral-900 border-t border-neutral-800 rounded-t-2xl overflow-y-auto"
        style={{
          transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
          transition: dragY > 0 ? 'none' : undefined,
          opacity: dragY > 0 ? Math.max(0.4, 1 - dragY / 200) : 1,
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Images strip */}
        <div className="flex gap-2.5 px-6 pb-4 overflow-x-auto scrollbar-none">
          {project.images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="h-48 w-auto shrink-0 rounded-xl object-cover"
            />
          ))}
        </div>

        <div className="px-6 pb-10 pt-2">
          <h2
            className="text-[22px] font-semibold text-[var(--text-primary)] leading-tight mb-1"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            {project.title}
          </h2>
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)] mb-4"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {project.metadata}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed mb-6">
            {project.description}
          </p>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-primary)] border border-[var(--border)] rounded-lg px-4 py-2.5 hover:bg-white/5 transition-colors"
          >
            View on Behance
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </motion.div>
    </>
  )
}

// ─── Mobile card ─────────────────────────────────────────────
function MobileProjectCard({ project, index, onTap }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="mb-16"
    >
      <div className="max-w-[220px] sm:max-w-[260px] mx-auto mb-5 cursor-pointer" onClick={onTap}>
        <ImageStack images={project.images} />
      </div>
      <div className="px-8">
        <h2
          className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight mb-1"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          {project.title}
        </h2>
        <p
          className="text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)] mb-2"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {project.metadata}
        </p>
        <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────
// ─── Pixel Disco Ball ────────────────────────────────────────
const DISCO_PALETTE = [
  '#FFFFFF', '#E0E0E0', '#C0C0C0',
  '#FFE44D', '#FF80CC', '#7FFFFF', '#AAFFBB', '#FF9966',
]
const RAY_COLORS = ['#FFFFFF']
const RAY_COUNT = 12
const RAY_LENGTH = 220

function PixelDiscoBall() {
  const [dismissed, setDismissed] = useState(false)
  const G = 16, P = 3
  const sz = G * P        // 48px — SVG element size
  const ballR = sz / 2    // 24px — ball radius / origin offset
  const gridCx = (G - 1) / 2, gridCy = (G - 1) / 2, gridR = G / 2 - 0.6

  // Ball pixels, centered at SVG origin (0,0)
  const rects = []
  for (let r = 0; r < G; r++) {
    for (let c = 0; c < G; c++) {
      const d = Math.sqrt((r - gridCy) ** 2 + (c - gridCx) ** 2)
      if (d > gridR) continue
      const isEdge = d > gridR - 1.6
      const idx = ((Math.floor(r / 2) * 3) ^ (Math.floor(c / 2) * 5)) % DISCO_PALETTE.length
      rects.push(
        <rect key={`${r}${c}`}
          x={c * P - ballR} y={r * P - ballR}
          width={P} height={P}
          fill={isEdge ? '#444' : DISCO_PALETTE[idx]} />
      )
    }
  }

  // Rays from origin outward, with gradient fade
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => {
    const angle = (i / RAY_COUNT) * Math.PI * 2
    const x1 = Math.cos(angle) * (ballR + 2)
    const y1 = Math.sin(angle) * (ballR + 2)
    const x2 = Math.cos(angle) * (ballR + RAY_LENGTH)
    const y2 = Math.sin(angle) * (ballR + RAY_LENGTH)
    const color = RAY_COLORS[i % RAY_COLORS.length]
    return { x1, y1, x2, y2, color, id: `rg${i}` }
  })

  return createPortal(
    <motion.div
      className="fixed top-0 right-10 z-20 select-none flex flex-col items-center cursor-pointer"
      animate={dismissed ? { y: -300, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={dismissed ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
      onClick={() => setDismissed(true)}
    >
      <div className="w-px h-10 bg-neutral-400 opacity-40" />
      <div style={{ position: 'relative', width: sz, height: sz }}>

        {/* Rays SVG — overflow visible so beams escape the element bounds */}
        <motion.svg
          overflow="visible"
          style={{ position: 'absolute', top: 0, left: 0 }}
          width={sz} height={sz}
          viewBox={`${-ballR} ${-ballR} ${sz} ${sz}`}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        >
          <defs>
            {rays.map(({ x1, y1, x2, y2, color, id }) => (
              <linearGradient key={id} id={id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {rays.map(({ x1, y1, x2, y2, id }) => (
            <line key={id} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={`url(#${id})`} strokeWidth="2.5" strokeLinecap="round" />
          ))}
        </motion.svg>

        {/* Pixel ball on top */}
        <motion.svg
          style={{ position: 'relative', zIndex: 1 }}
          width={sz} height={sz}
          viewBox={`${-ballR} ${-ballR} ${sz} ${sz}`}
          shapeRendering="crispEdges"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {rects}
        </motion.svg>
      </div>
    </motion.div>,
    document.body
  )
}

export default function Hobby() {
  usePageMeta({
    title: 'Moonlight — Satyam Dubey',
    description: 'Side projects and personal work by Satyam Dubey, after hours.',
  })
  const [activeIndex, setActiveIndex] = useState(0)
  const [sheetProject, setSheetProject] = useState(null)
  const [catDropped, setCatDropped] = useState(false)

  useEffect(() => {
    const handler = () => setCatDropped(true)
    window.addEventListener('cat-dropped', handler)
    return () => window.removeEventListener('cat-dropped', handler)
  }, [])
  const sectionRefs = useRef([])

  const setupObserver = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.index)
            if (!isNaN(idx)) setActiveIndex(idx)
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )
    sectionRefs.current.forEach((el) => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const cleanup = setupObserver()
    return cleanup
  }, [setupObserver])

  const active = hobbyData[activeIndex]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {sheetProject && (
          <MobileSheet project={sheetProject} onClose={() => setSheetProject(null)} />
        )}
      </AnimatePresence>

      {/* Mobile */}
      <div className="lg:hidden pt-12 pb-28 text-[var(--text-primary)]">
        <div className="px-8 mb-10">
          <div className="flex items-start gap-3">
            <h1
              className="text-[28px] font-semibold leading-tight mb-1 shrink-0"
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              Outside Hours
            </h1>
            <span
              className="mt-1 text-[18px] leading-snug text-yellow-400 -rotate-2 shrink-0"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {catDropped ? "told you :/" : <>Pss. don't drag<br />and drop the cat.</>}
            </span>
          </div>
          <p
            className="text-[11px] tracking-[0.15em] uppercase text-[var(--text-muted)]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Photography / Graphic Design
          </p>
        </div>
        {hobbyData.map((project, i) => (
          <MobileProjectCard key={project.id} project={project} index={i} onTap={() => setSheetProject(project)} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid grid-cols-12 min-h-screen text-[var(--text-primary)]">

        {/* LEFT: scrollable image stacks */}
        <div className="col-span-7 py-20 px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-24"
          >
            <div className="relative mb-4">
              <h1
                className="text-[56px] xl:text-[72px] font-semibold leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              >
                Outside<br />Hours
              </h1>
              <span
                className="absolute top-2 left-full ml-3 text-[22px] leading-snug text-yellow-400 -rotate-3 whitespace-nowrap"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {catDropped ? "told you :/" : <>Pss. don't drag<br />and drop the cat.</>}
              </span>
            </div>
            <p
              className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Photography / Graphic Design
            </p>
          </motion.div>

          {hobbyData.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              data-index={i}
              className="mb-40 last:mb-20 w-[300px] xl:w-[360px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <ImageStack images={project.images} />
                <p
                  className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] mt-5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(hobbyData.length).padStart(2, '0')}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* RIGHT: sticky context */}
        <div className="col-span-5 border-l border-[var(--border)] relative">
          <div className="sticky top-0 h-screen flex flex-col justify-center px-12 xl:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <h2
                  className="text-[40px] xl:text-[52px] font-semibold leading-[1.0] tracking-tight mb-4"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  {active.title}
                </h2>
                <p
                  className="text-[11px] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-5"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {active.metadata}
                </p>
                <div className="w-10 h-px bg-[var(--border)] mb-5" />
                <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed max-w-xs mb-6">
                  {active.description}
                </p>
                <a
                  href={active.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  View on Behance
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </motion.div>
            </AnimatePresence>

            {/* Scroll dots */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {hobbyData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'h-6 bg-[var(--accent)]'
                      : 'h-1.5 bg-[var(--border)] hover:bg-[var(--text-muted)]'
                  }`}
                  aria-label={`Go to project ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
