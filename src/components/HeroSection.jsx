import { useTheme } from '../context/ThemeContext'

export default function HeroSection() {
  const { theme } = useTheme()
  const strategyTags = ['User Journeys', 'Design Systems', 'High-Fidelity Prototyping']
  const fintechTags = ['Transaction Flows', 'Data Visualization', 'Privacy']

  return (
    <section className="flex flex-col lg:flex-row items-center lg:items-start gap-12 sm:gap-16 lg:gap-24 px-6 sm:px-8 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-16 lg:pt-28 lg:pb-20 max-w-6xl mx-auto w-full">

      {/* ── Left  -  Hero portrait ── */}
      <div className="relative shrink-0 w-[240px] sm:w-[280px] lg:w-[320px]">
        <img
          src="/images/hero-portrait.png"
          alt="Satyam Dubey"
          draggable={false}
          className="w-full rounded-2xl object-cover transition-all duration-500"
          style={{
            filter: theme === 'dark'
              ? 'drop-shadow(0 8px 24px rgba(0,0,0,0.4)) invert(1) brightness(1.5)'
              : 'drop-shadow(0 8px 24px rgba(0,0,0,0.12))',
          }}
        />
        {/* Blue tint overlay in dark mode */}
        {theme === 'dark' && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none mix-blend-multiply transition-opacity duration-500"
            style={{ backgroundColor: '#2D5BFF', opacity: 0.35 }}
          />
        )}
      </div>

      {/* ── Right  -  Bio + Tags ── */}
      <div className="flex-1 text-left lg:pt-4">
        <h1
          className="text-[36px] lg:text-[54px] font-semibold text-[var(--text-primary)] leading-[1.1] tracking-[-0.02em] mb-5"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Hey, <span className="italic text-[var(--accent)]">Satyam</span> here
        </h1>

        <p className="text-[17px] text-[var(--text-secondary)] mb-10 max-w-[520px] leading-[1.7]">
          I design high-trust financial tools for advisors and their clients. Currently at Alphanso, building the product and the design system it runs on.
        </p>

        <div className="flex flex-col gap-6">

          <div>
            <span
              className="text-[14px] italic text-[var(--text-muted)] mb-2.5 block"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Product strategy
            </span>
            <div className="flex flex-wrap gap-2">
              {strategyTags.map((tag) => (
                <span
                  key={tag}
                  className="h-8 inline-flex items-center px-4 rounded-lg border border-[var(--border)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span
              className="text-[14px] italic text-[var(--text-muted)] mb-2.5 block"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Fintech core
            </span>
            <div className="flex flex-wrap gap-2">
              {fintechTags.map((tag) => (
                <span
                  key={tag}
                  className="h-8 inline-flex items-center px-4 rounded-lg border border-[var(--border)] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span
              className="text-[14px] italic text-[var(--text-muted)] mb-3 block"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tools
            </span>
            <div className="flex items-center gap-4">
              <div className="w-[43px] h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors" title="Claude">
                <svg width="26" height="26" viewBox="0 0 45 42" fill="#D97757">
                  <path d="m7.75 26.27 7.77-4.36.13-.38-.13-.21h-.38l-1.3-.08-4.44-.12-3.85-.16-3.73-.2-.94-.2L0 19.4l.09-.58.79-.53 1.13.1 2.5.17 3.75.26 2.72.16 4.03.42h.64l.09-.26-.22-.16-.17-.16-3.88-2.63-4.2-2.78-2.2-1.6L3.88 11l-.6-.76-.26-1.66L4.1 7.39l1.45.1.37.1 1.47 1.13 3.14 2.43 4.1 3.02.6.5.24-.17.03-.12-.27-.45L13 9.9l-2.38-4.1-1.06-1.7-.28-1.02c-.1-.42-.17-.77-.17-1.2L10.34.21l.68-.22 1.64.22.69.6 1.02 2.33 1.65 3.67 2.56 4.99.75 1.48.4 1.37.15.42h.26v-.24l.21-2.81.39-3.45.38-4.44.13-1.25.62-1.5L23.1.57l.96.46.79 1.13-.11.73-.47 3.05-.92 4.78-.6 3.2h.35l.4-.4 1.62-2.15 2.72-3.4 1.2-1.35 1.4-1.49.9-.71h1.7l1.25 1.86-.56 1.92-1.75 2.22-1.45 1.88-2.08 2.8-1.3 2.24.12.18.31-.03 4.7-1 2.54-.46 3.03-.52 1.37.64.15.65-.54 1.33-3.24.8-3.8.76-5.66 1.34-.07.05.08.1 2.55.24 1.09.06h2.67l4.97.37 1.3.86.78 1.05-.13.8-2 1.02-2.7-.64-6.3-1.5-2.16-.54h-.3v.18l1.8 1.76 3.3 2.98 4.13 3.84.21.95-.53.75-.56-.08-3.63-2.73-1.4-1.23-3.17-2.67h-.21v.28l.73 1.07 3.86 5.8.2 1.78-.28.58-1 .35-1.1-.2L26 33.14l-2.33-3.57-1.88-3.2-.23.13-1.11 11.95-.52.61-1.2.46-1-.76-.53-1.23.53-2.43.64-3.17.52-2.52.47-3.13.28-1.04-.02-.07-.23.03-2.36 3.24-3.59 4.85-2.84 3.04-.68.27-1.18-.61.11-1.09.66-.97 3.93-5 2.37-3.1 1.53-1.79-.01-.26h-.09L6.8 30.56l-1.86.24-.8-.75.1-1.23.38-.4 3.14-2.16Z"/>
                </svg>
              </div>
              <div className="w-[43px] h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors" title="Figma">
                <svg width="20" height="28" viewBox="0 0 38 57" fill="none">
                  <path d="M19 28.5a9.5 9.5 0 119 9.5 9.5 9.5 0 01-9.5-9.5z" fill="#1ABCFE"/>
                  <path d="M0 47a9.5 9.5 0 019.5-9.5H19V47a9.5 9.5 0 11-19 0z" fill="#0ACF83"/>
                  <path d="M19 0v19h9.5a9.5 9.5 0 100-19H19z" fill="#FF7262"/>
                  <path d="M0 9.5A9.5 9.5 0 009.5 19H19V0H9.5A9.5 9.5 0 000 9.5z" fill="#F24E1E"/>
                  <path d="M0 28.5A9.5 9.5 0 009.5 38H19V19H9.5A9.5 9.5 0 000 28.5z" fill="#A259FF"/>
                </svg>
              </div>
              <div className="w-[43px] h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors" title="Gemini">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" fill="url(#gemini-grad)"/>
                  <defs><linearGradient id="gemini-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#4285F4"/><stop offset="1" stopColor="#886FBF"/></linearGradient></defs>
                </svg>
              </div>
              <div className="w-[43px] h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors" title="Adobe Creative Suite">
                <svg width="26" height="24" viewBox="0 0 30 26" fill="#FA0F00">
                  <path d="M11.5 0H0v26L11.5 0z"/><path d="M18.5 0H30v26L18.5 0z"/><path d="M15 9.6L22 26h-4.5l-2.1-5.2h-5.2L15 9.6z"/>
                </svg>
              </div>
              <div className="w-[43px] h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors" title="Webflow">
                <svg width="26" height="26" viewBox="0 0 1080 1080" fill="none">
                  <rect width="1080" height="1080" rx="200" fill="#146EF5"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M898.312 337.5L683.467 757.5H481.667L571.579 583.434H567.545C493.368 679.726 382.694 743.115 225 757.5V585.843C225 585.843 325.88 579.884 385.185 517.534H225V337.503H405.031V485.576L409.072 485.559L482.639 337.503H618.791V484.637L622.832 484.631L699.159 337.5H898.312Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
