import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import RulePanel from '../components/RulePanel'
import projects from '../data/projects'

/* ─── Preview Block ─────────────────────────────────────── */

function PreviewBlock({ color, type, className = '', style = {} }) {
  const barColors = {
    '#CEF8E0': '#22c55e',
    '#FFF3D6': '#f59e0b',
    '#D6ECFF': '#3b82f6',
    '#E8DBFA': '#8b5cf6',
    '#FFE0E0': '#ef4444',
    '#D6F5EC': '#14b8a6',
    '#E5EAFC': '#2E53E3',
  }
  const accent = barColors[color] || '#6366f1'

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
  const barColors = {
    '#CEF8E0': '#22c55e',
    '#FFF3D6': '#f59e0b',
    '#D6ECFF': '#3b82f6',
    '#E8DBFA': '#8b5cf6',
    '#FFE0E0': '#ef4444',
    '#D6F5EC': '#14b8a6',
    '#E5EAFC': '#2E53E3',
  }
  const accent = barColors[color] || '#6366f1'

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

function DSFigure({ src, alt, caption, wide = false }) {
  if (wide) {
    return (
      <figure className="my-6">
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="block min-w-[900px] sm:min-w-0 w-full h-auto"
          />
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
  return (
    <figure className="my-6">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-auto rounded-xl border border-[var(--border)]"
      />
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
  return (
    <div className="flex-1 border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)]">
      <p
        className="text-[28px] font-bold text-[var(--text-primary)] leading-tight"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
      >
        {value}
      </p>
      <p className="text-[13px] text-[var(--text-muted)] mt-1">{label}</p>
    </div>
  )
}

/* ─── Claude mark — Claude Code loading animation ────────── */

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

/* ─── Pixel agent — cute boxy metal robot ────────────────── */

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
  // Row 1 — antenna stem
  [4, 1, 'D'],
  // Row 2 — head top highlight band
  [0, 2, 'L'], [1, 2, 'L'], [2, 2, 'L'], [3, 2, 'L'], [4, 2, 'L'],
  [5, 2, 'L'], [6, 2, 'L'], [7, 2, 'L'], [8, 2, 'L'], [9, 2, 'L'],
  // Row 3 — head metal
  [0, 3, 'L'], [1, 3, 'M'], [2, 3, 'M'], [3, 3, 'M'], [4, 3, 'M'],
  [5, 3, 'M'], [6, 3, 'M'], [7, 3, 'M'], [8, 3, 'M'], [9, 3, 'D'],
  // Row 4 — screen top
  [0, 4, 'L'], [1, 4, 'M'], [2, 4, 'S'], [3, 4, 'S'], [4, 4, 'S'],
  [5, 4, 'S'], [6, 4, 'S'], [7, 4, 'S'], [8, 4, 'M'], [9, 4, 'D'],
  // Row 5 — screen eye row (eye dots overlaid separately for blink)
  [0, 5, 'L'], [1, 5, 'M'], [2, 5, 'S'], [3, 5, 'S'], [4, 5, 'S'],
  [5, 5, 'S'], [6, 5, 'S'], [7, 5, 'S'], [8, 5, 'M'], [9, 5, 'D'],
  // Row 6 — screen blank
  [0, 6, 'L'], [1, 6, 'M'], [2, 6, 'S'], [3, 6, 'S'], [4, 6, 'S'],
  [5, 6, 'S'], [6, 6, 'S'], [7, 6, 'S'], [8, 6, 'M'], [9, 6, 'D'],
  // Row 7 — screen smile (4-wide)
  [0, 7, 'L'], [1, 7, 'M'], [2, 7, 'S'], [3, 7, 'E'], [4, 7, 'E'],
  [5, 7, 'E'], [6, 7, 'E'], [7, 7, 'S'], [8, 7, 'M'], [9, 7, 'D'],
  // Row 8 — head bottom shadow band
  [0, 8, 'D'], [1, 8, 'D'], [2, 8, 'D'], [3, 8, 'D'], [4, 8, 'D'],
  [5, 8, 'D'], [6, 8, 'D'], [7, 8, 'D'], [8, 8, 'D'], [9, 8, 'D'],
  // Row 9 — body top
  [2, 9, 'M'], [3, 9, 'M'], [4, 9, 'M'], [5, 9, 'M'], [6, 9, 'M'], [7, 9, 'M'],
  // Row 10 — body shaded
  [2, 10, 'L'], [3, 10, 'M'], [4, 10, 'M'], [5, 10, 'M'], [6, 10, 'M'], [7, 10, 'D'],
  // Row 11 — feet
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
      {/* antenna LED tip — pulses */}
      <motion.rect
        x={40}
        y={0}
        width={10}
        height={10}
        fill={METAL.A}
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* body — shaded metal */}
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

      {/* eyes — single dots that blink occasionally */}
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

/* ─── Case Study Content ────────────────────────────────── */

function getCaseStudyContent(project) {
  const type = project.previewType

  if (type === 'bars') {
    return {
      overview:
        'This project focused on giving users full visibility and control over how their income gets distributed across financial goals. We replaced a rigid allocation model with an interactive, drag-based interface that makes complex money management feel effortless.',
      challenge: [
        'Users were struggling with the existing allocation workflow. The legacy interface required multiple page navigations to adjust a single split, and there was no visual feedback until changes were saved. Drop-off during the allocation step was significantly higher than the platform average.',
        'Research interviews revealed that most users wanted to "see the math" as they moved money around. They needed confidence that adjustments to one bucket would not silently affect others. The existing system did not surface these relationships.',
        'We also identified a trust gap: users who could not preview outcomes before committing were far less likely to complete the flow. The challenge was to make allocation feel safe, transparent, and even enjoyable.',
      ],
      processIntro:
        'We started with a competitive audit of allocation UIs across banking and investment apps, then moved into rapid prototyping with real user data.',
      processSteps: [
        'Mapped 14 distinct user journeys through the existing allocation flow and identified 6 critical friction points',
        'Ran 3 rounds of unmoderated usability tests with 40+ participants, iterating on drag interaction patterns',
        'Built a constraint-satisfaction model so adjusting one allocation automatically rebalances others in real time',
        'Designed a progressive disclosure system — simple mode for quick splits, advanced mode for percentage-level control',
      ],
      solutionIntro:
        'The final design centers on a single-screen allocation canvas. Users drag allocation handles between buckets while a live preview updates totals, percentages, and projected growth in real time.',
      stats: [
        { value: '40%', label: 'Reduction in drop-off' },
        { value: '12K', label: 'Daily active users' },
        { value: '2.4min', label: 'Avg. completion time' },
      ],
      results:
        'Post-launch data confirmed that the redesigned allocation interface cut task completion time nearly in half and increased user confidence scores by 35%. The drag interaction became one of the most-praised features in quarterly NPS surveys, and the pattern was later adopted across two other product verticals.',
      deliverables: ['Design System', 'Prototype', 'User Flows', 'Spec Doc'],
    }
  }

  if (type === 'chart') {
    return {
      overview:
        'We designed an analytics experience that transforms raw transaction data into clear, actionable spending insights. The goal was to help users understand where their money goes without requiring financial literacy or manual categorization.',
      challenge: [
        'Users had access to transaction history but no meaningful way to interpret patterns. Existing analytics were limited to a static pie chart that updated monthly — too slow and too abstract to drive behavior change.',
        'Our research showed that 68% of users checked their balance daily but fewer than 10% ever opened the analytics tab. The feature existed, but it was not designed to be useful in the moments that mattered.',
        'The core challenge was building a system that could surface relevant insights at the right time, without overwhelming users with data they did not ask for.',
      ],
      processIntro:
        'We adopted a data-first design approach, working with the analytics engineering team to define what insights were technically feasible before sketching any UI.',
      processSteps: [
        'Analyzed 6 months of anonymized transaction data to identify the 12 most common spending categories and peak usage windows',
        'Co-designed the insight engine logic with data science — rules for when to surface a nudge vs. a summary vs. a warning',
        'Prototyped 5 chart interaction models and tested readability across age groups and financial literacy levels',
        'Established a design token system for data visualization to ensure consistency across chart types and themes',
      ],
      solutionIntro:
        'The solution is a layered analytics dashboard — a glanceable summary at the top, interactive breakdowns in the middle, and contextual nudges woven throughout. Charts respond to touch with detailed tooltips and comparison overlays.',
      stats: [
        { value: '5.2x', label: 'Increase in analytics engagement' },
        { value: '8min', label: 'Avg. session time' },
        { value: '89%', label: 'User satisfaction score' },
      ],
      results:
        'The new analytics experience became the second most-visited screen in the app within two weeks of launch. Users who engaged with spending insights were 3x more likely to set a budget goal, creating a strong feedback loop between awareness and action.',
      deliverables: ['Data Viz System', 'Prototype', 'Interaction Spec'],
    }
  }

  if (type === 'cards') {
    return {
      overview:
        'This project streamlined a compliance-heavy review process into a guided, card-based experience. We reduced cognitive load by breaking dense policy documents into scannable, comparable sections.',
      challenge: [
        'Advisors were spending an average of 45 minutes per policy review, manually comparing PDF documents side-by-side. Key changes between renewal periods were buried in legal language, leading to missed updates and compliance risk.',
        'The existing digital tool was essentially a PDF viewer with highlighting. It did not surface what changed, what mattered, or what required action. Advisors developed workarounds — printing pages, using sticky notes — that defeated the purpose of the digital tool.',
        'We needed to design a system that could parse complexity and present it as clarity, without losing the legal precision that compliance teams required.',
      ],
      processIntro:
        'We embedded with the compliance team for two weeks, shadowing real review sessions and documenting every workaround and pain point.',
      processSteps: [
        'Created a task-flow map of the full review process, identifying 8 steps that could be automated or simplified',
        'Designed a diff-view pattern that highlights policy changes inline with color-coded severity indicators',
        'Tested 3 information architecture models — wizard, single-page, and card-based — with 12 advisors',
        'Built an annotation system that lets advisors flag, comment, and approve sections without leaving the review flow',
      ],
      solutionIntro:
        'The final design uses a card-based layout where each policy section becomes a reviewable unit. Changes are highlighted automatically, and advisors can approve sections individually or in bulk.',
      stats: [
        { value: '40%', label: 'Faster review time' },
        { value: '97%', label: 'Compliance accuracy' },
        { value: '4.6/5', label: 'Advisor satisfaction' },
      ],
      results:
        'The redesigned review flow reduced average review time from 45 minutes to 27 minutes. Compliance teams reported zero missed policy changes in the first quarter after launch, compared to an average of 3.2 per quarter previously.',
      deliverables: ['Design System', 'Prototype', 'User Flows', 'Handoff Doc'],
    }
  }

  // type === 'list' or fallback
  return {
    overview:
      'We designed a structured, step-by-step experience that guides users through a traditionally complex process. The wizard-based approach breaks overwhelming tasks into manageable, sequential decisions.',
    challenge: [
      'The existing workflow presented all options simultaneously, creating decision paralysis. Users frequently abandoned the process midway, unsure whether their selections were correct or complete.',
      'Stakeholder interviews revealed that the primary barrier was not complexity itself, but the lack of guidance. Users did not know what information they needed upfront, what order to complete steps in, or whether they could make changes later.',
      'We needed to design a flow that felt guided without feeling restrictive — one that accommodated both first-time users who needed hand-holding and experienced users who wanted to move quickly.',
    ],
    processIntro:
      'We mapped the decision tree end-to-end, identifying required vs. optional steps and the dependencies between them.',
    processSteps: [
      'Conducted card-sorting sessions with 20 users to determine the most intuitive grouping and ordering of steps',
      'Designed a branching logic system that adapts the flow based on earlier selections, hiding irrelevant steps',
      'Created a persistent progress indicator that shows completion state and allows non-linear navigation',
      'Built inline validation and contextual help that surfaces guidance exactly when users need it',
    ],
    solutionIntro:
      'The final design is a responsive wizard with smart defaults, inline validation, and a persistent sidebar that shows progress and allows users to jump between completed sections.',
    stats: [
      { value: '62%', label: 'Higher completion rate' },
      { value: '3.8min', label: 'Avg. time to complete' },
      { value: '92%', label: 'First-attempt success' },
    ],
    results:
      'The guided flow increased end-to-end completion rates from 54% to 88%. Support ticket volume related to this workflow dropped by 71%, and the pattern was subsequently adopted as the standard for all multi-step processes across the platform.',
    deliverables: ['Prototype', 'User Flows', 'Component Library'],
  }
}

/* ─── Main Component ────────────────────────────────────── */

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = projects.find((p) => p.id === id) || projects[0]
  const otherProjects = projects.filter((p) => p.id !== project.id).slice(0, 3)
  const rich = project.caseStudy
  const content = rich || getCaseStudyContent(project)
  const [activeCat, setActiveCat] = useState(
    rich && content.componentCategories ? content.componentCategories[0].id : null
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
                <SectionLabel>The fracture</SectionLabel>
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

              {/* Research — competitor matrix */}
              <Reveal>
                <SectionLabel>Research</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.competitorIntro}
                </p>
                <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden mb-12">
                  {content.competitorMatrix.map((row, i) => (
                    <div
                      key={row.competitor}
                      className={`flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-3 sm:gap-6 ${
                        i !== content.competitorMatrix.length - 1 ? 'border-b border-[#E6E6E6]' : ''
                      }`}
                    >
                      <div className="sm:w-[200px] shrink-0 flex items-center gap-3">
                        {row.logo && (
                          <img
                            src={row.logo}
                            alt={`${row.competitor} logo`}
                            loading="lazy"
                            className="w-8 h-8 rounded-md object-contain bg-white"
                            onError={(e) => { e.currentTarget.style.display = 'none' }}
                          />
                        )}
                        <p className="text-[14px] font-semibold text-[#1A1A1A]" style={heading}>
                          {row.competitor}
                        </p>
                      </div>
                      <p className="text-[14px] text-[#6D6D6D] leading-[1.6]">{row.learning}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* The stance — doctrine */}
              <Reveal>
                <SectionLabel>The stance</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.doctrineIntro}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                  {content.doctrine.map((rule) => {
                    const hasExample = !!rule.example
                    const Card = hasExample ? 'button' : 'div'
                    return (
                      <Card
                        key={rule.title}
                        type={hasExample ? 'button' : undefined}
                        onClick={hasExample ? () => setOpenRule(rule) : undefined}
                        className={`text-left border border-[var(--border)] rounded-xl px-5 py-5 bg-[var(--bg-card)] w-full
                          ${hasExample ? 'cursor-pointer hover:border-[var(--accent)] hover:-translate-y-0.5 transition-all duration-200 group' : ''}`}
                      >
                        {rule.icon && (
                          <img
                            src={rule.icon}
                            alt=""
                            className="w-10 h-10 object-contain mb-4"
                          />
                        )}
                        <p className="text-[15px] font-semibold text-[var(--text-primary)] mb-2" style={heading}>
                          {rule.title}
                        </p>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.7]">{rule.body}</p>
                        {hasExample && (
                          <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] group-hover:gap-1.5 transition-all">
                            See it in practice
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </Reveal>

              {/* Foundations */}
              <Reveal>
                <SectionLabel>Foundations</SectionLabel>
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
              <Reveal>
                <SectionLabel>The system</SectionLabel>
                <p className="text-[var(--text-secondary)] text-[15px] leading-[1.8] mb-6">
                  {content.systemIntro}
                </p>
              </Reveal>

              {/* Tabbed component browser */}
              {content.componentCategories && activeCategory && (
                <Reveal>
                  <div className="mb-16">
                    {/* Tab bar — sticky pill style */}
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

      {/* ═══ Next Project — full width ═══ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-16 pb-20">
        <Reveal>
          <p className="text-[13px] text-[var(--text-muted)] mb-3">Next Project</p>
          <Link
            to={`/project/${otherProjects[0].id}`}
            className="group block w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-[var(--text-muted)] hover:shadow-lg transition-all"
          >
            <div className="flex items-stretch">
              <div className="flex-1 flex items-center px-8 sm:px-10 py-6 sm:py-8">
                <h3
                  className="text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-[var(--text-primary)] leading-[1.2] group-hover:text-[var(--accent)] transition-colors"
                  style={heading}
                >
                  {otherProjects[0].title}
                </h3>
              </div>
              <div
                className="w-[30%] sm:w-[35%] shrink-0 hidden sm:block"
                style={{ backgroundColor: otherProjects[0].previewColor }}
              >
                <PreviewBlock color={otherProjects[0].previewColor} type={otherProjects[0].previewType} className="h-full" />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>

      <RulePanel rule={openRule} onClose={() => setOpenRule(null)} />
    </motion.div>
  )
}
