/**
 * Hobby Page — "Digital Zine" Mode
 *
 * A radical visual departure from the clean fintech portfolio.
 * Dark, brutalist, experimental. Stacked image galleries with
 * fan-out hover, sticky context panel synced via IntersectionObserver.
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Data ────────────────────────────────────────────────────
const hobbyData = [
  {
    id: 'akatsuki',
    title: 'Akatsuki Akatsuki',
    metadata: '11 x 5 metric tons // 2024',
    description:
      'First photoshop poster. Exploring liquid distortion and high-saturation palettes.',
    images: ['/images/akatsuki-1.jpg', '/images/akatsuki-2.jpg'],
  },
  {
    id: 'travel-journal',
    title: 'Travel Journal',
    metadata: '1080x1920 px // 2024',
    description:
      'Journal if you going to thailand. Traditional motifs meeting modern layouts.',
    images: [
      '/images/journal-1.jpg',
      '/images/journal-2.jpg',
      '/images/journal-3.jpg',
    ],
  },
  {
    id: 'neon-tokyo',
    title: 'Neon Tokyo',
    metadata: '3840x2160 px // 2024',
    description:
      'Cyberpunk-inspired composites. Layering glow, grain, and geometry over city shots.',
    images: [
      '/images/neon-1.jpg',
      '/images/neon-2.jpg',
      '/images/neon-3.jpg',
    ],
  },
  {
    id: 'brutalist-poster',
    title: 'Brutalist Poster',
    metadata: 'A2 print // 2023',
    description:
      'Typography-first poster series. Helvetica Neue pushed to its breaking point.',
    images: ['/images/brutalist-1.jpg', '/images/brutalist-2.jpg'],
  },
]

// ─── Static transforms for the "tossed on desk" look ─────────
const STACK_TRANSFORMS = [
  { rotate: -2, x: 0, y: 0 },       // bottom
  { rotate: 3, x: 15, y: -10 },      // middle
  { rotate: -1, x: -20, y: 15 },     // top
]

// Fan-out positions on hover — spread cards so edges show
const FAN_TRANSFORMS = [
  { rotate: -6, x: -40, y: 20 },
  { rotate: 4, x: 30, y: -30 },
  { rotate: -1, x: -10, y: -60 },
]

// ─── ImageStack Component ────────────────────────────────────
function ImageStack({ images, title }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative w-full aspect-[4/5] cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((src, i) => {
        const base = STACK_TRANSFORMS[i] || STACK_TRANSFORMS[0]
        const fan = FAN_TRANSFORMS[i] || FAN_TRANSFORMS[0]
        const target = hovered ? fan : base

        return (
          <motion.div
            key={src}
            className="absolute inset-0"
            style={{ zIndex: i }}
            animate={{
              rotate: target.rotate,
              x: target.x,
              y: target.y,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              mass: 0.8,
            }}
          >
            <img
              src={src}
              alt={`${title} — ${i + 1}`}
              className="w-full h-full object-cover rounded-lg border border-neutral-800 shadow-2xl"
              draggable={false}
            />
            {/* Grain overlay */}
            <div className="absolute inset-0 rounded-lg opacity-20 mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC43NSIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')]" />
          </motion.div>
        )
      })}
    </div>
  )
}

// ─── Mobile / Tablet Card (stacked vertically) ──────────────
function MobileProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-14 sm:mb-16"
    >
      {/* Image stack — constrained width, centered */}
      <div className="max-w-[240px] sm:max-w-[280px] mx-auto mb-5">
        <ImageStack images={project.images} title={project.title} />
      </div>

      {/* Text context */}
      <div className="px-6 sm:px-8">
        <h2
          className="text-xl sm:text-2xl font-bold uppercase tracking-tight leading-none mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {project.title}
        </h2>
        <p
          className="text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-3"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: '#EAB308',
          }}
        >
          {project.metadata}
        </p>
        <p
          className="text-xs sm:text-sm text-neutral-400 leading-relaxed"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── Main Hobby Page ─────────────────────────────────────────
export default function Hobby() {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRefs = useRef([])

  // IntersectionObserver to sync scroll position → sticky text
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

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

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
      {/* Global dark bg + dot grid handled by App wrapper */}

      {/* ── MOBILE / TABLET LAYOUT ── */}
      <div className="lg:hidden pt-12 pb-28 text-[var(--text-primary)]">
        <div className="px-6 sm:px-8 mb-10">
          <h1
            className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            After Hours
          </h1>
          <p
            className="text-xs tracking-[0.15em] uppercase text-neutral-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Experiments // Off-screen work
          </p>
        </div>

        {hobbyData.map((project, i) => (
          <MobileProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden lg:grid grid-cols-12 min-h-screen text-[var(--text-primary)]">
        {/* LEFT — Scrollable image stacks (col-span-7) */}
        <div className="col-span-7 py-20 px-12 lg:px-20">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-24"
          >
            <h1
              className="text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-none mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              After
              <br />
              Hours
            </h1>
            <p
              className="text-xs tracking-[0.2em] uppercase text-neutral-500 mt-4"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Experiments // Off-screen work // Digital zine
            </p>
          </motion.div>

          {/* Project stacks */}
          {hobbyData.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => (sectionRefs.current[i] = el)}
              data-index={i}
              className="mb-32 lg:mb-40 last:mb-20 max-w-[360px] xl:max-w-[480px]"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <ImageStack images={project.images} title={project.title} />

                {/* Project index marker */}
                <p
                  className="text-[10px] tracking-[0.3em] uppercase text-neutral-600 mt-6"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(hobbyData.length).padStart(2, '0')}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        {/* RIGHT — Sticky context panel (col-span-5) */}
        <div className="col-span-5 border-l border-neutral-800 relative">
          <div className="sticky top-0 h-screen flex flex-col justify-center px-12 lg:px-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {/* Title */}
                <h2
                  className="text-4xl xl:text-6xl font-bold uppercase tracking-tight leading-[0.95] mb-6"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {active.title}
                </h2>

                {/* Metadata — neon accent */}
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-6"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#EAB308',
                  }}
                >
                  {active.metadata}
                </p>

                {/* Divider */}
                <div className="w-12 h-px bg-neutral-700 mb-6" />

                {/* Description */}
                <p
                  className="text-sm text-neutral-400 leading-relaxed max-w-sm"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {active.description}
                </p>

                {/* Image count indicator */}
                <div className="flex gap-1.5 mt-8">
                  {active.images.map((_, j) => (
                    <div
                      key={j}
                      className="w-6 h-1 rounded-full bg-neutral-700"
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Scroll progress dots */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {hobbyData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    sectionRefs.current[i]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                    })
                  }}
                  className={`w-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'h-6 bg-[#EAB308]'
                      : 'h-1.5 bg-neutral-700 hover:bg-neutral-500'
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
