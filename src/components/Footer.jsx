export default function Footer() {
  return (
    <footer style={{ width: '100%', borderTop: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '64px 64px 40px' }}>

        {/* 70 / 30 row */}
        <div className="flex flex-col lg:flex-row" style={{ gap: 40, alignItems: 'flex-start', marginBottom: 32 }}>

          {/* Illustration — 70% */}
          <div className="w-full lg:w-[70%]" style={{ flexShrink: 0 }}>
            <img
              src="/images/footer-illustration.png"
              alt="Teen Darwaza, Ahmedabad"
              style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.9 }}
              draggable={false}
            />
          </div>

          {/* Description — 30% */}
          <div className="w-full lg:w-[30%]" style={{ display: 'flex', alignItems: 'flex-start', paddingBottom: 8 }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontStyle: 'italic',
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              An illustration I love — Teen Darwaza, Ahmedabad. A city that keeps showing up in everything I make.
            </p>
          </div>

        </div>

        {/* Single-line credits */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 20,
          paddingBottom: 88,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontSize: 12,
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
        }}>
          <span>Illustrations by <span style={{ color: 'var(--text-secondary)' }}>DivyaShree Dubey</span></span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>Made by Human ♥</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>All rights (and wrongs) reserved © 2026</span>
        </div>

      </div>
    </footer>
  )
}
