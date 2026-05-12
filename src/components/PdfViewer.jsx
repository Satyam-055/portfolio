import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export default function PdfViewer({ src, label }) {
  const [numPages, setNumPages]   = useState(null)
  const [page, setPage]           = useState(1)
  const [scale, setScale]         = useState(1)
  const [zoomed, setZoomed]       = useState(false)
  const [loading, setLoading]     = useState(true)

  const onLoad = useCallback(({ numPages }) => {
    setNumPages(numPages)
    setLoading(false)
  }, [])

  const zoom = (delta) => setScale((s) => Math.min(3, Math.max(0.5, +(s + delta).toFixed(1))))

  return (
    <>
      {/* Inline viewer */}
      <div
        className="rounded-[10px] overflow-hidden border"
        style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)' }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[40%]">
            {label || src.split('/').pop()}
          </span>

          <div className="flex items-center gap-3">
            {/* Page nav */}
            {numPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] disabled:opacity-30 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">
                  {page} / {numPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                  disabled={page === numPages}
                  className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] disabled:opacity-30 transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
            )}

            {/* Zoom */}
            <div className="flex items-center gap-1">
              <button onClick={() => zoom(-0.25)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors text-[14px] font-medium">−</button>
              <span className="text-[11px] text-[var(--text-secondary)] w-8 text-center tabular-nums">{Math.round(scale * 100)}%</span>
              <button onClick={() => zoom(+0.25)} className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors text-[14px] font-medium">+</button>
            </div>

            {/* Fullscreen */}
            <button
              onClick={() => setZoomed(true)}
              className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
              title="Fullscreen"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
              </svg>
            </button>
          </div>
        </div>

        {/* PDF canvas */}
        <div className="overflow-auto" style={{ maxHeight: 520 }}>
          <div className="flex justify-center py-4 px-4">
            {loading && (
              <div className="flex items-center justify-center h-64 text-[var(--text-muted)] text-[12px]">
                Loading…
              </div>
            )}
            <Document file={src} onLoadSuccess={onLoad} onLoadError={() => setLoading(false)} loading="">
              <Page
                pageNumber={page}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-md"
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Fullscreen overlay */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-sm flex flex-col"
          onClick={() => setZoomed(false)}
        >
          {/* Overlay toolbar */}
          <div
            className="flex items-center justify-between px-6 py-3 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[11px] font-mono text-white/40">{label || src.split('/').pop()}</span>
            <div className="flex items-center gap-4">
              {numPages > 1 && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span className="text-[12px] text-white/50 tabular-nums">{page} / {numPages}</span>
                  <button onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page === numPages}
                    className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1">
                <button onClick={() => zoom(-0.25)} className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-[15px] font-medium">−</button>
                <span className="text-[12px] text-white/50 w-9 text-center tabular-nums">{Math.round(scale * 100)}%</span>
                <button onClick={() => zoom(+0.25)} className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-[15px] font-medium">+</button>
              </div>
              <button onClick={() => setZoomed(false)}
                className="w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Fullscreen canvas */}
          <div className="flex-1 overflow-auto flex justify-center items-start py-8 px-6" onClick={(e) => e.stopPropagation()}>
            <Document file={src} onLoadSuccess={onLoad} loading="">
              <Page
                pageNumber={page}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-2xl"
              />
            </Document>
          </div>
        </div>
      )}
    </>
  )
}
