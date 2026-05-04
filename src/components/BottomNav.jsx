import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ClaudePixel from './ClaudePixel'
import { useTheme } from '../context/ThemeContext'

// ─── Contact data ────────────────────────────────────────────
const CONTACTS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/satyamdubey',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:satyam.dubey@alphanso.ai',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4l-10 8L2 4" />
      </svg>
    ),
    copyable: 'satyam.dubey@alphanso.ai',
  },
  {
    label: 'Read.cv',
    href: 'https://read.cv/satyamdubey',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    external: true,
  },
]

// ─── Hooks ───────────────────────────────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return
      handler()
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

// ─── Tab icons (filled when active) ──────────────────────────
function IconWork({ active }) {
  return active ? (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M20 7h-4V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM10 5h4v2h-4V5z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round" />
    </svg>
  )
}
function IconResume({ active }) {
  return active ? (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-2 16H8v-1h4v1zm2-3H8v-1h6v1zm0-3H8v-1h6v1zm-1-4V3.5L18.5 9H13z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconHobby({ active }) {
  // Incognito — hat + glasses
  return active ? (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      {/* Hat */}
      <path d="M2 11h20v2H2z"/>
      <path d="M5 11c0-4 3.13-7 7-7s7 3 7 7"/>
      {/* Glasses */}
      <circle cx="8" cy="16" r="3"/>
      <circle cx="16" cy="16" r="3"/>
      <path d="M11 16h2"/>
      <path d="M5 16H3M21 16h-2"/>
    </svg>
  ) : (
    <svg className="w-5 h-5 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {/* Hat */}
      <line x1="2" y1="11" x2="22" y2="11"/>
      <path d="M5 11c0-4 3.13-7 7-7s7 3 7 7"/>
      {/* Glasses */}
      <circle cx="8" cy="16" r="3"/>
      <circle cx="16" cy="16" r="3"/>
      <line x1="11" y1="16" x2="13" y2="16"/>
      <line x1="5" y1="16" x2="3" y2="16"/>
      <line x1="21" y1="16" x2="19" y2="16"/>
    </svg>
  )
}

// ─── Sun / Moon icons for theme toggle ───────────────────────
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

// ─── Desktop Option Tray ─────────────────────────────────────
function DesktopTray({ forceDark, onClose }) {
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, onClose)

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('satyam.dubey@alphanso.ai')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={`absolute bottom-full right-0 mb-3 w-56 rounded-xl p-1.5 shadow-xl border ${
        forceDark
          ? 'bg-black/80 backdrop-blur-md border-white/10'
          : 'bg-white/80 backdrop-blur-md border-white/20'
      }`}
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{ transformOrigin: 'bottom right' }}
    >
      {CONTACTS.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.external ? '_blank' : undefined}
          rel={c.external ? 'noopener noreferrer' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
            forceDark
              ? 'text-neutral-300 hover:bg-white/10'
              : 'text-[#464646] hover:bg-gray-100'
          }`}
          onClick={onClose}
        >
          <span className={forceDark ? 'text-neutral-400' : 'text-[#6D6D6D]'}>{c.icon}</span>
          {c.label}
          {c.external && (
            <svg className="ml-auto opacity-40" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </a>
      ))}
      {/* Copy email button */}
      <div className={`mx-2 my-1 border-t ${forceDark ? 'border-white/10' : 'border-gray-200'}`} />
      <button
        onClick={copyEmail}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
          forceDark
            ? 'text-neutral-500 hover:bg-white/10'
            : 'text-[#999] hover:bg-gray-100'
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
        </svg>
        {copied ? 'Copied!' : 'Copy email'}
      </button>
    </motion.div>
  )
}

// ─── Mobile Bottom Sheet ─────────────────────────────────────
function MobileSheet({ forceDark, onClose }) {
  const [copied, setCopied] = useState(false)

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText('satyam.dubey@alphanso.ai')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Sheet */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl pb-8 ${
          forceDark
            ? 'bg-neutral-900 border-t border-neutral-700/60'
            : 'bg-white border-t border-gray-200'
        }`}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-4">
          <div className={`w-10 h-1 rounded-full ${forceDark ? 'bg-neutral-700' : 'bg-gray-300'}`} />
        </div>

        <div className="px-6">
          <h3 className={`text-lg font-semibold mb-4 ${forceDark ? 'text-white' : 'text-[#222]'}`}>
            Get in touch
          </h3>

          <div className="flex flex-col gap-1">
            {CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-medium transition-colors ${
                  forceDark
                    ? 'text-neutral-200 hover:bg-white/10'
                    : 'text-[#464646] hover:bg-gray-50'
                }`}
                onClick={onClose}
              >
                <span className={forceDark ? 'text-neutral-400' : 'text-[#6D6D6D]'}>{c.icon}</span>
                {c.label}
                {c.external && (
                  <svg className="ml-auto opacity-40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* Copy email */}
          <button
            onClick={copyEmail}
            className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[13px] font-medium transition-colors ${
              forceDark
                ? 'bg-white/10 text-neutral-300 hover:bg-white/15'
                : 'bg-gray-100 text-[#6D6D6D] hover:bg-gray-200'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
            {copied ? 'Copied!' : 'Copy email address'}
          </button>
        </div>
      </motion.div>
    </>
  )
}

// ─── Pixel hand for hobby mode ───────────────────────────────
function PixelHand() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="6" y="1" width="2" height="3" fill="#EAB308" />
      <rect x="4" y="2" width="2" height="3" fill="#EAB308" />
      <rect x="8" y="2" width="2" height="3" fill="#EAB308" />
      <rect x="10" y="3" width="2" height="3" fill="#EAB308" />
      <rect x="3" y="5" width="10" height="4" fill="#EAB308" />
      <rect x="4" y="9" width="8" height="3" fill="#CA8A04" />
      <rect x="5" y="12" width="6" height="2" fill="#CA8A04" />
    </svg>
  )
}

// ─── Main BottomNav ──────────────────────────────────────────
export default function BottomNav() {
  const location = useLocation()
  const isMobile = useIsMobile()
  const [contactOpen, setContactOpen] = useState(false)
  const [pillHovered, setPillHovered] = useState(false)
  const waveRef = useRef(null)
  const { theme, toggleTheme } = useTheme()

  // Cat visibility — persisted to localStorage, defaults to visible
  const [catVisible, setCatVisible] = useState(() => {
    try {
      const saved = localStorage.getItem('catVisible')
      return saved === null ? true : saved === 'true'
    } catch {
      return true
    }
  })
  useEffect(() => {
    try { localStorage.setItem('catVisible', String(catVisible)) } catch {}
  }, [catVisible])
  const toggleCat = () => setCatVisible((v) => !v)


  const isHobby = location.pathname === '/hobby'
  // forceDark: on hobby page always dark; otherwise follow theme
  const forceDark = isHobby || theme === 'dark'
  const moonlightAudioRef = useRef(null)

  // Play sound when clicking Moonlight tab (must be in click handler for autoplay policy)
  const playMoonlightSound = () => {
    if (!moonlightAudioRef.current) {
      moonlightAudioRef.current = new Audio('/sounds/moonlight.mp3')
      moonlightAudioRef.current.volume = 0.4
    }
    moonlightAudioRef.current.currentTime = 0
    moonlightAudioRef.current.play().catch(() => {})
  }

  // Close contact when route changes
  useEffect(() => { setContactOpen(false) }, [location.pathname])

  const tabClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors duration-500 w-12 h-12 sm:w-auto sm:h-auto justify-center sm:justify-start ${
      isActive
        ? 'bg-[var(--accent)] text-white'
        : forceDark
          ? 'text-neutral-400 hover:bg-white/10'
          : 'text-[#999] hover:bg-black/5'
    }`

  return (
    <>
      {/* Mobile bottom sheet */}
      <AnimatePresence>
        {contactOpen && isMobile && (
          <MobileSheet forceDark={forceDark} onClose={() => setContactOpen(false)} />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
        {/* Claude pixel animation */}
        {catVisible && (
          <div className="absolute bottom-full left-[-32px] mb-[-16px]">
            <ClaudePixel size={3} detective={location.pathname === '/hobby'} />
          </div>
        )}

        {/* Desktop tray */}
        <AnimatePresence>
          {contactOpen && !isMobile && (
            <DesktopTray forceDark={forceDark} onClose={() => setContactOpen(false)} />
          )}
        </AnimatePresence>

        {/* ── Nav Pill ── */}
        <div
          className={`relative flex items-center rounded-2xl shadow-lg px-6 sm:px-10 py-3 sm:py-2 gap-2 sm:gap-1 transition-colors duration-500 ${
            forceDark
              ? 'bg-neutral-900 border border-neutral-700/60'
              : 'bg-white border border-gray-200'
          }`}
          onMouseEnter={() => setPillHovered(true)}
          onMouseLeave={() => setPillHovered(false)}
        >
          {/* Cat visibility toggle — pixel cat lives in the thumb (uses real palette from ClaudePixel) */}
          <button
            onClick={toggleCat}
            role="switch"
            aria-checked={catVisible}
            aria-label={catVisible ? 'Hide cat' : 'Show cat'}
            title={catVisible ? 'Hide cat' : 'Show cat'}
            className={`relative shrink-0 w-[40px] h-[22px] rounded-full transition-colors duration-300 ${
              catVisible
                ? 'bg-[#c4856a]'
                : forceDark
                  ? 'bg-neutral-700'
                  : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] flex items-center justify-center transition-transform duration-300 ${
                catVisible ? 'translate-x-[18px]' : 'translate-x-0'
              }`}
            >
              {/* Pulled directly from ClaudePixel.drawBody — same shape, same palette */}
              <svg width="14" height="11" viewBox="0 0 10 8" shapeRendering="crispEdges">
                {/* Ears */}
                <rect x="2" y="0" width="1" height="1" fill="#c4856a" />
                <rect x="7" y="0" width="1" height="1" fill="#c4856a" />
                {/* Head row 1 — top of head */}
                <rect x="2" y="1" width="7" height="1" fill="#c4856a" />
                {/* Head row 2 with eyes */}
                <rect x="1" y="2" width="9" height="1" fill="#c4856a" />
                <rect x="3" y="2" width="1" height="1" fill="#1a1a1a" />
                <rect x="6" y="2" width="1" height="1" fill="#1a1a1a" />
                {/* Face row with nose */}
                <rect x="1" y="3" width="9" height="1" fill="#c4856a" />
                <rect x="4" y="3" width="2" height="1" fill="#8a5a42" />
                {/* Torso top — lighter */}
                <rect x="1" y="4" width="9" height="1" fill="#d49a82" />
                {/* Torso */}
                <rect x="1" y="5" width="9" height="1" fill="#c4856a" />
                <rect x="3" y="5" width="4" height="1" fill="#d49a82" />
                <rect x="1" y="6" width="9" height="1" fill="#c4856a" />
                <rect x="3" y="6" width="4" height="1" fill="#d49a82" />
                {/* Torso bottom */}
                <rect x="2" y="7" width="8" height="1" fill="#c4856a" />
              </svg>
            </span>
          </button>

          {/* Divider after cat toggle */}
          <div className={`w-px h-4 mx-1 opacity-20 transition-colors duration-500 ${forceDark ? 'bg-neutral-400' : 'bg-gray-400'}`} />

          <NavLink to="/" end className={tabClass}>
            {({ isActive }) => (<><IconWork active={isActive} /><span className="hidden sm:inline">Work</span></>)}
          </NavLink>

          <NavLink to="/resume" className={tabClass}>
            {({ isActive }) => (<><IconResume active={isActive} /><span className="hidden sm:inline">Resume</span></>)}
          </NavLink>

          <div className={`w-px h-4 mx-1 opacity-30 transition-colors duration-500 ${forceDark ? 'bg-neutral-400' : 'bg-gray-400'}`} />

          <NavLink to="/hobby" className={tabClass} onClick={playMoonlightSound}>
            {({ isActive }) => (<><IconHobby active={isActive} /><span className="hidden sm:inline">Moonlight</span></>)}
          </NavLink>

          {/* Divider before theme toggle */}
          <div className={`w-px h-4 mx-2 opacity-20 transition-colors duration-500 ${forceDark ? 'bg-neutral-400' : 'bg-gray-400'}`} />

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500 ${
              forceDark
                ? 'hover:bg-white/10 text-neutral-400'
                : 'hover:bg-gray-100 text-[#6D6D6D]'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Divider before wave */}
          <div className={`w-px h-4 mx-1 opacity-20 transition-colors duration-500 ${forceDark ? 'bg-neutral-400' : 'bg-gray-400'}`} />

          {/* Wave hand button */}
          <motion.button
            ref={waveRef}
            onClick={() => setContactOpen((v) => !v)}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-500 ${
              forceDark
                ? 'hover:bg-white/10'
                : 'hover:bg-gray-100'
            }`}
            animate={
              pillHovered
                ? { rotate: [0, 20, 0, 20, 0] }
                : { rotate: 0 }
            }
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            aria-label="Get in touch"
          >
            {isHobby ? <PixelHand /> : <span className="text-[16px] leading-none">👋</span>}
          </motion.button>
        </div>
      </div>
    </>
  )
}
