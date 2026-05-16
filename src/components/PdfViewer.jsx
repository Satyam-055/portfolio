import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// Render at 3× the display width so zooming in reveals real pixels, not upscaled canvas.
const INLINE_DISPLAY  = 640   // visual px in the card
const OVERLAY_DISPLAY = 900   // visual px in the overlay
const RENDER_MULT     = 3     // canvas resolution multiplier
const INLINE_RENDER   = INLINE_DISPLAY  * RENDER_MULT  // 1920
const OVERLAY_RENDER  = OVERLAY_DISPLAY * RENDER_MULT  // 2700
const INIT_SCALE      = 1 / RENDER_MULT                // 0.333

const BASE_WRAP = {
  centerOnInit:    true,
  limitToBounds:   false,
  wheel:           { step: 0.08, activationKeys: [] },
  pinch:           { step: 5 },
  doubleClick:     { step: 0.7 },
  panning:         { velocityDisabled: true },
}

/* ─── Zoom buttons  -  must be inside <TransformWrapper> ──── */
function ZoomButtons({ large }) {
  const { zoomIn, zoomOut, resetTransform } = useControls()
  const cls = large
    ? 'w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors'
    : 'w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors'
  return (
    <div className="flex items-center gap-0.5">
      <button onClick={() => zoomOut(0.3)} className={cls} title="Zoom out">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
      <button onClick={() => resetTransform()} className={`${cls} text-[10px] font-mono w-auto px-1.5`} title="Reset">1:1</button>
      <button onClick={() => zoomIn(0.3)} className={cls} title="Zoom in">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>
    </div>
  )
}

/* ─── Page nav (no context needed) ─────────────────────── */
function PageNav({ page, numPages, setPage, large }) {
  if (!numPages || numPages <= 1) return null
  const cls = large
    ? 'w-7 h-7 rounded flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-25 transition-colors'
    : 'w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] disabled:opacity-30 transition-colors'
  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className={cls}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <span className={`tabular-nums text-center ${large ? 'text-[12px] text-white/50 w-10' : 'text-[11px] text-[var(--text-secondary)] w-9'}`}>
        {page} / {numPages}
      </span>
      <button onClick={() => setPage((p) => Math.min(numPages, p + 1))} disabled={page === numPages} className={cls}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </div>
  )
}

/* ─── Main component ────────────────────────────────────── */
export default function PdfViewer({ src, label }) {
  const [numPages, setNumPages] = useState(null)
  const [page, setPage]         = useState(1)
  const [zoomed, setZoomed]     = useState(false)

  const onLoad = useCallback(({ numPages }) => setNumPages(numPages), [])

  return (
    <>
      {/* ── Inline card ───────────────────────────────── */}
      <div
        className="rounded-[10px] border overflow-hidden"
        style={{ background: 'var(--panel-soft)', borderColor: 'var(--border)' }}
      >
        <TransformWrapper
          {...BASE_WRAP}
          initialScale={INIT_SCALE}
          minScale={0.1}
          maxScale={1.2}
        >
          {() => (
            <>
              {/* Toolbar */}
              <div
                className="flex items-center justify-between px-4 py-2 border-b"
                style={{ borderColor: 'var(--border)' }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-[11px] font-mono text-[var(--text-muted)] truncate max-w-[45%]">
                  {label || src.split('/').pop()}
                </span>
                <div className="flex items-center gap-3">
                  <PageNav page={page} numPages={numPages} setPage={setPage} />
                  <ZoomButtons />
                  <button
                    onClick={() => setZoomed(true)}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--border)] transition-colors"
                    title="Fullscreen"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Canvas: 3× render, 1/3 initial scale */}
              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '480px',
                  touchAction: 'none',
                  overscrollBehavior: 'contain',
                  cursor: 'grab',
                  userSelect: 'none',
                  background: 'var(--panel-soft)',
                }}
                contentStyle={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '16px',
                }}
              >
                <Document file={src} onLoadSuccess={onLoad} loading="">
                  <Page
                    pageNumber={page}
                    width={INLINE_RENDER}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-md"
                  />
                </Document>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* ── Fullscreen overlay ────────────────────────── */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 backdrop-blur-sm flex flex-col"
          style={{ touchAction: 'none' }}
        >
          {/* Close */}
          <button
            onClick={() => setZoomed(false)}
            className="absolute top-4 right-5 z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div className="px-6 pt-4 pb-1 shrink-0">
            <span className="text-[11px] font-mono text-white/35">{label || src.split('/').pop()}</span>
          </div>

          <div className="flex-1 overflow-hidden" style={{ touchAction: 'none' }}>
            <TransformWrapper
              {...BASE_WRAP}
              initialScale={INIT_SCALE}
              minScale={0.08}
              maxScale={1.5}
            >
              {() => (
                <div className="h-full flex flex-col">
                  <div
                    className="flex items-center justify-center gap-5 py-2 shrink-0"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <PageNav page={page} numPages={numPages} setPage={setPage} large />
                    <ZoomButtons large />
                  </div>

                  <TransformComponent
                    wrapperStyle={{
                      flex: 1,
                      width: '100%',
                      touchAction: 'none',
                      overscrollBehavior: 'contain',
                      cursor: 'grab',
                      userSelect: 'none',
                    }}
                    contentStyle={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'flex-start',
                      padding: '24px',
                    }}
                  >
                    <Document file={src} onLoadSuccess={onLoad} loading="">
                      <Page
                        pageNumber={page}
                        width={OVERLAY_RENDER}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="shadow-2xl"
                      />
                    </Document>
                  </TransformComponent>
                </div>
              )}
            </TransformWrapper>
          </div>
        </div>
      )}
    </>
  )
}
