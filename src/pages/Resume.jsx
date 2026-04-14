import { motion } from 'framer-motion'

// ─── Data ────────────────────────────────────────────────────
const profile = {
  name: 'Satyam Dubey',
  title: 'Product Designer',
  location: 'India',
  years: '6+',
  bio: 'I design high-trust financial tools that balance security with seamless usability. Currently leading product design at Alphanso, turning complex wealth management workflows into calm, actionable interfaces.',
}

const featured = {
  period: '2024 — Now',
  role: 'Lead Product Designer',
  company: 'Adobe',
  logo: 'adobe',
  impact:
    'Leading design for a wealth management platform serving 50K+ advisors. Driving design system adoption and establishing research practices across three product verticals.',
  achievements: [
    'Shipped end-to-end portfolio dashboard used by 12K daily active advisors',
    'Built and scaled a design system with 80+ components across web and mobile',
    'Reduced advisor onboarding time from 25 min to 8 min through flow redesign',
  ],
}

const companies = [
  { company: 'Adobe', logo: 'adobe', current: true },
  { company: 'Apple', logo: 'apple' },
  { company: 'Google', logo: 'google' },
]

const legacy = [
  { company: 'Apple', logo: 'apple', role: 'Senior Designer', period: '2021 – 2023' },
  { company: 'Google', logo: 'google', role: 'Product Designer', period: '2019 – 2021' },
  { company: 'ClearLedger', logo: 'C', logoColor: '#f59e0b', role: 'UI/UX Designer', period: '2018 – 2019' },
]

const education = {
  company: 'National Institute of Technology',
  logo: 'N',
  logoColor: '#ef4444',
  role: 'B.Tech, Computer Science',
  period: '2014 – 2018',
}

const stack = [
  { label: 'INSTRUMENTS', items: ['Figma', 'React', 'Claude', 'SQL'] },
  { label: 'DOMAINS', items: ['Fintech', 'B2B SaaS', 'Ledger Systems'] },
  { label: 'MANTRAS', items: ['Trust by default', 'Precision over speed'] },
]

// ─── Brand Logos (64x64 native, scaled via container) ────────
const brandLogos = {
  adobe: (
    <svg viewBox="0 0 64 64" fill="#FA0F00" className="w-full h-full p-2">
      <path d="M24 8H8v48L24 8z"/>
      <path d="M40 8h16v48L40 8z"/>
      <path d="M32 24l12 32h-8l-3.5-9H23L32 24z"/>
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 64 64" fill="#1A1A1A" className="w-full h-full p-2.5">
      <path d="M44.5 33.5c-.1-5 4.1-7.5 4.3-7.6-2.3-3.4-6-3.9-7.3-3.9-3.1-.3-6.1 1.8-7.7 1.8s-4-1.8-6.6-1.7c-3.4.1-6.5 2-8.3 5-3.5 6.1-.9 15.2 2.5 20.2 1.7 2.4 3.7 5.2 6.3 5.1 2.5-.1 3.5-1.6 6.5-1.6s3.9 1.6 6.6 1.6c2.7 0 4.4-2.5 6.1-4.9 1.9-2.8 2.7-5.5 2.8-5.7-.1 0-5.3-2-5.3-8zM39.5 18c1.4-1.7 2.3-4 2.1-6.3-2 .1-4.4 1.3-5.9 3-1.3 1.5-2.4 3.9-2.1 6.2 2.2.2 4.5-1.2 5.9-2.9z"/>
    </svg>
  ),
  google: (
    <svg viewBox="0 0 64 64" className="w-full h-full p-2.5">
      <path d="M52.7 32.7c0-1.8-.2-3.5-.5-5.2H32v9.8h11.6c-.5 2.7-2 5-4.3 6.5v5.4h6.9c4.1-3.7 6.4-9.2 6.4-16.5z" fill="#4285F4"/>
      <path d="M32 54c5.8 0 10.7-1.9 14.3-5.2l-6.9-5.4c-1.9 1.3-4.4 2.1-7.3 2.1-5.6 0-10.4-3.8-12.1-8.9h-7.2v5.6C16.6 49.2 23.8 54 32 54z" fill="#34A853"/>
      <path d="M19.9 36.6c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.6h-7.2C11.6 25.3 11 28.6 11 32s.6 6.7 1.7 9.2l7.2-5.6z" fill="#FBBC05"/>
      <path d="M32 18.6c3.2 0 6 1.1 8.2 3.2l6.2-6.2C43 12.5 38 10 32 10c-8.2 0-15.4 4.8-18.7 11.8l7.2 5.6c1.6-5.1 6.4-8.8 11.5-8.8z" fill="#EA4335"/>
    </svg>
  ),
}

// ─── Logo Square ─────────────────────────────────────────────
function LogoSquare({ letter, color, logo, grayscale = false }) {
  const base = 'w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300'
  const gs = grayscale ? 'grayscale group-hover:grayscale-0' : ''

  if (logo && brandLogos[logo]) {
    return (
      <div className={`${base} ${gs} bg-[var(--bg-card)] border border-[var(--border)]`}>
        {brandLogos[logo]}
      </div>
    )
  }

  return (
    <div
      className={`${base} ${gs} font-bold text-white text-[14px]`}
      style={{ backgroundColor: color || '#999' }}
    >
      {letter}
    </div>
  )
}

// ─── Component ───────────────────────────────────────────────
export default function Resume() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pb-28"
    >

      {/* ══════════════════════════════════════════════════════
          PROFILE HERO — Centered, Nahiyan-style
          ══════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8 pt-16 sm:pt-20 lg:pt-24 text-center">
        {/* Avatar */}
        <div className="relative inline-block mb-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--text-primary)] text-[var(--bg)] flex items-center justify-center text-[28px] sm:text-[32px] font-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SD
          </div>
        </div>

        {/* Name */}
        <h1
          className="text-[32px] sm:text-[42px] lg:text-[48px] font-semibold text-[var(--text-primary)] leading-[1.1] tracking-[-0.02em]"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {profile.name}
        </h1>

        {/* Title + Location */}
        <div className="flex items-center justify-center gap-3 mt-2 mb-5">
          <span className="text-[16px] text-[var(--text-secondary)]">{profile.title}</span>
          <span className="w-1 h-1 rounded-full bg-[var(--text-muted)]" />
          <span className="text-[14px] text-[var(--text-muted)] flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {profile.location}
          </span>
        </div>

        {/* Company logos — horizontal row */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {companies.map((c) => (
            <div key={c.company} className="group relative" title={c.company}>
              <LogoSquare logo={c.logo} letter={c.logo} color={c.logoColor} size="md" />
              {c.current && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] rounded-full border-2 border-[var(--bg-card)]" />
              )}
            </div>
          ))}
        </div>

        {/* Years badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[var(--border)] text-[13px] font-medium text-[var(--text-secondary)] mb-6">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {profile.years} years of experience
        </div>

        {/* Bio */}
        <p className="text-[15px] text-[var(--text-secondary)] leading-[1.75] max-w-lg mx-auto mb-8">
          {profile.bio}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <a
            href="#"
            className="bg-[#1A1A1A] text-white rounded-full px-6 py-2.5 text-[13px] font-medium hover:bg-[#333] transition-colors inline-flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
          </a>
          <a
            href="mailto:satyam.dubey@alphanso.ai"
            className="rounded-full px-6 py-2.5 text-[13px] font-medium border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors inline-flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 4l-10 8L2 4" />
            </svg>
            Message
          </a>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CONTENT — Two-column: Experience + Sidebar
          ══════════════════════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-16">
        {/* Divider */}
        <div className="border-t border-[var(--border)] mb-12" />

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── LEFT: Experience ── */}
          <div className="flex-1 min-w-0">

            <span
              className="text-[14px] italic text-[var(--text-muted)] mb-6 block"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Experience
            </span>

            {/* ── Featured Role ── */}
            <div className="mb-10">
              {/* Header row */}
              <div className="flex items-center gap-4 mb-4">
                <LogoSquare logo={featured.logo} size="lg" />
                <div className="flex-1">
                  <h3 className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight">{featured.role}</h3>
                  <p className="text-[14px] text-[var(--accent)] font-medium">{featured.company}</p>
                </div>
                <span
                  className="text-[13px] text-[var(--text-muted)] tabular-nums shrink-0 self-start mt-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {featured.period}
                </span>
              </div>

              {/* Impact */}
              <p className="text-[14px] text-[var(--text-secondary)] leading-[1.75] mb-5 pl-16">
                {featured.impact}
              </p>

              {/* Achievements */}
              <ul className="space-y-2.5 pl-16">
                {featured.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[7px] shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Divider ── */}
            <div className="border-t border-[var(--border-subtle)] mb-5" />

            {/* ── Legacy Roles ── */}
            <div className="space-y-0">
              {legacy.map((role) => (
                <div
                  key={role.company}
                  className="group flex items-center gap-4 py-3.5 border-b border-[var(--border-subtle)] last:border-0 cursor-default"
                >
                  <LogoSquare logo={role.logo} letter={role.logo} color={role.logoColor} size="sm" grayscale />
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">{role.company}</span>
                  <span className="text-[12px] text-[#C4C4C4]">—</span>
                  <span className="text-[13px] text-[var(--text-secondary)]">{role.role}</span>
                  <span className="text-[13px] text-[var(--text-muted)] ml-auto tabular-nums font-mono">{role.period}</span>
                </div>
              ))}
            </div>

            {/* ── Education ── */}
            <div className="mt-10">
              <span
                className="text-[14px] italic text-[var(--text-muted)] mb-4 block"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Education
              </span>
              <div className="group flex items-center gap-4 py-3.5 cursor-default">
                <LogoSquare letter={education.logo} color={education.logoColor} size="sm" grayscale />
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-medium text-[var(--text-primary)] block truncate">{education.company}</span>
                  <span className="text-[13px] text-[var(--text-secondary)]">{education.role}</span>
                </div>
                <span className="text-[13px] text-[var(--text-muted)] tabular-nums font-mono shrink-0">{education.period}</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Stack / Identity Sidebar ── */}
          <div className="lg:w-[260px] shrink-0">
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

              {/* Reach */}
              <div>
                <p
                  className="text-[11px] font-medium tracking-[0.15em] text-[var(--text-muted)] mb-3"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  REACH
                </p>
                <div className="space-y-2.5">
                  <a
                    href="mailto:satyam.dubey@alphanso.ai"
                    className="flex items-center gap-2.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 4l-10 8L2 4" />
                    </svg>
                    satyam.dubey@alphanso.ai
                  </a>
                  <a
                    href="https://www.linkedin.com/in/satyamdubey"
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
