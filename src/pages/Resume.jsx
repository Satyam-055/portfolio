import { motion } from 'framer-motion'
import { usePageMeta } from '../hooks/usePageMeta'

// ─── Data ────────────────────────────────────────────────────
const profile = {
  name: 'Satyam Dubey',
  title: 'UI/UX Designer',
  location: 'Gurgaon, India',
  bio: 'I design high-trust financial tools for advisors and their clients. Currently at Alphanso, building the product and the design system it runs on.',
}

const featured = {
  period: 'Feb 2024 - Present',
  role: 'UI/UX Designer',
  company: 'Alphanso',
  sections: [
    {
      label: 'Design System',
      bullets: [
        'Built the component library from scratch: 80+ components across tables, inputs, buttons, navigation, and feedback, so engineering could ship new surfaces without returning to design',
        'Defined the token system: color, type scale, corner radius, and shadow, so every surface stayed visually consistent without individual review',
      ],
    },
    {
      label: 'Product Work',
      bullets: [
        'Sole designer across the full product surface: advisor tools, client flows, mobile to desktop, from research to production specs',
        'Worked directly with the co-founder and advisors; design shaped what got built, not just how it looked',
      ],
    },
  ],
}

const legacy = [
  {
    company: 'Cossouq',
    role: 'Visual Designer',
    period: 'Jul 2022 - Feb 2024',
    sections: [
      {
        label: 'Web Design',
        bullets: [
          'Designed and built the marketing website — layout, typography, and responsive behaviour across breakpoints',
        ],
      },
      {
        label: 'Visual Storytelling',
        bullets: [
          'Created brand visuals, campaign graphics, and social content that carried a consistent visual language across every touchpoint',
        ],
      },
      {
        label: 'Video Editing',
        bullets: [
          'Produced and edited product and brand videos — scripting, cuts, motion, and final delivery',
        ],
      },
    ],
  },
]

const education = {
  name: "St. Xavier's College, Ahmedabad",
  letter: 'X',
  letterColor: '#7c3aed',
  degree: '',
  period: '2019 - 2022',
}

const stack = [
  { label: 'TOOLS', items: ['Figma', 'Framer', 'React', 'Claude'] },
  { label: 'DOMAINS', items: ['Fintech', 'Wealth Management', 'B2B SaaS'] },
]

// ─── Company logo marks ───────────────────────────────────────
function AlphansoMark() {
  return (
    <div className="w-16 h-16 rounded-2xl shrink-0 bg-neutral-800 border border-[var(--border)] flex items-center justify-center overflow-hidden p-3.5">
      <img src="/images/alphanso-logo.svg" alt="Alphanso" className="w-full h-full object-contain" />
    </div>
  )
}

function CossouqMark({ grayscale = false }) {
  const gs = grayscale ? 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300' : ''
  return (
    <div className={`w-9 h-9 rounded-xl shrink-0 bg-neutral-800 border border-[var(--border)] flex items-center justify-center overflow-hidden p-2 ${gs}`}>
      <img src="/images/cossouq-logo.svg" alt="Cossouq" className="w-full h-full object-contain" />
    </div>
  )
}

function LetterMark({ letter, color, size = 'sm', grayscale = false }) {
  const dim = size === 'lg' ? 'w-16 h-16 rounded-2xl text-[22px]' : 'w-9 h-9 rounded-xl text-[13px]'
  const gs = grayscale ? 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300' : ''
  return (
    <div
      className={`${dim} ${gs} flex items-center justify-center shrink-0 font-bold text-white`}
      style={{ backgroundColor: color, fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {letter}
    </div>
  )
}

function CollegeMark() {
  return (
    <div className="w-9 h-9 rounded-xl shrink-0 bg-neutral-800 border border-[var(--border)] flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
        <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" />
        <path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
      </svg>
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────
export default function Resume() {
  usePageMeta({
    title: 'Resume — Satyam Dubey | UI/UX Designer',
    description: profile.bio,
  })
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pb-28"
    >
      {/* ── Profile Hero ── */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 lg:pt-24 text-center">
        <div className="relative inline-block mb-5">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center text-[28px] sm:text-[32px] font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SD
          </div>
          {/* Current indicator */}
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#22c55e] rounded-full border-2 border-[var(--bg)]" />
        </div>

        <h1
          className="text-[32px] sm:text-[42px] lg:text-[48px] font-semibold text-[var(--text-primary)] leading-[1.1] tracking-[-0.02em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {profile.name}
        </h1>

        <div className="flex items-center justify-center gap-3 mt-2 mb-6">
          <span className="text-[16px] text-[var(--text-secondary)]">{profile.title}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="text-[14px] text-[var(--text-muted)] flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {profile.location}
          </span>
        </div>

        <p className="text-[15px] text-[var(--text-secondary)] leading-[1.75] max-w-md mx-auto mb-8">
          {profile.bio}
        </p>

        <div className="mb-16" />
      </div>

      {/* ── Two-column body ── */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16">
        <div className="border-t border-[var(--border)] mb-12" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* LEFT: Experience */}
          <div className="flex-1 min-w-0">
            <span
              className="text-[14px] italic text-[var(--text-muted)] mb-8 block"
              style={{ fontFamily: "'Work Sans', sans-serif" }}
            >
              Experience
            </span>

            {/* Featured: Alphanso */}
            <div className="mb-10">
              <div className="flex items-start gap-4 mb-6">
                <AlphansoMark size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight">{featured.role}</h3>
                  <p className="text-[14px] text-[var(--accent)] font-medium mt-0.5">{featured.company}</p>
                </div>
                <span
                  className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 mt-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {featured.period}
                </span>
              </div>

              <div className="pl-20 space-y-6">
                {featured.sections.map((section) => (
                  <div key={section.label}>
                    <p
                      className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {section.label}
                    </p>
                    <ul className="space-y-2.5">
                      {section.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[6px] shrink-0" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[var(--border-subtle)] mb-5" />

            {/* Legacy roles */}
            <div className="space-y-10">
              {legacy.map((role) => (
                <div key={role.company}>
                  <div className="flex items-start gap-4 mb-6">
                    <CossouqMark />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight">{role.role}</h3>
                      <p className="text-[14px] text-[var(--text-secondary)] font-medium mt-0.5">{role.company}</p>
                    </div>
                    <span
                      className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0 mt-1"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {role.period}
                    </span>
                  </div>

                  {role.sections && (
                    <div className="pl-[52px] space-y-6">
                      {role.sections.map((section) => (
                        <div key={section.label}>
                          <p
                            className="text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--text-muted)] mb-3"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {section.label}
                          </p>
                          <ul className="space-y-2.5">
                            {section.bullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--border)] mt-[6px] shrink-0" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="mt-10">
              <span
                className="text-[14px] italic text-[var(--text-muted)] mb-4 block"
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              >
                Education
              </span>
              <div className="group flex items-center gap-4 py-3.5">
                <CollegeMark />
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-[var(--text-primary)] block truncate">{education.name}</span>
                  {education.degree && <span className="text-[13px] text-[var(--text-secondary)]">{education.degree}</span>}
                </div>
                <span
                  className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {education.period}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="lg:w-[240px] shrink-0">
            <div className="lg:sticky lg:top-8 space-y-8">

              {stack.map((group) => (
                <div key={group.label}>
                  <p
                    className="text-[11px] font-medium tracking-[0.15em] text-[var(--text-muted)] mb-3"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {group.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="h-7 inline-flex items-center px-3 rounded-md border border-[var(--border)] text-[12px] font-medium text-[var(--text-secondary)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-[var(--border-subtle)]" />

              <div>
                <p
                  className="text-[11px] font-medium tracking-[0.15em] text-[var(--text-muted)] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  REACH
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:satyamdubey055@gmail.com"
                    className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4l-10 8L2 4" />
                    </svg>
                    satyamdubey055@gmail.com
                  </a>
                  <a
                    href="https://www.linkedin.com/in/satyam-dubey-042578192/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                  <a
                    href="https://read.cv/satyamdubey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
                    </svg>
                    Read.cv
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
