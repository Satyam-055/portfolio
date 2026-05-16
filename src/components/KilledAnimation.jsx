import { useEffect, useState } from 'react'

const ITEMS = ['Draft state', 'Live-update widget', 'Password-protected PDFs']

const DRAW_MS  = 700
const HOLD_MS  = 300
const RESET_MS = 1400

export default function KilledAnimation() {
  const [current, setCurrent] = useState(0)
  const [drawing, setDrawing] = useState(true)
  const [struck, setStruck]   = useState([])

  useEffect(() => {
    let t
    if (drawing) {
      t = setTimeout(() => {
        setStruck((s) => [...s, current])
        setDrawing(false)
      }, DRAW_MS)
    } else {
      if (current < ITEMS.length - 1) {
        t = setTimeout(() => {
          setCurrent((c) => c + 1)
          setDrawing(true)
        }, HOLD_MS)
      } else {
        t = setTimeout(() => {
          setCurrent(0)
          setStruck([])
          setDrawing(true)
        }, RESET_MS)
      }
    }
    return () => clearTimeout(t)
  }, [drawing, current])

  return (
    <div className="mt-5 px-1 py-2 space-y-4 select-none">
      {ITEMS.map((label, i) => {
        const isDrawing = drawing && i === current
        const isDone    = struck.includes(i)

        return (
          <div key={label} className="relative block w-fit">
            <span
              className="text-[15px] font-medium transition-colors duration-500"
              style={{ color: isDone || isDrawing ? 'rgba(255,255,255,0.25)' : 'var(--text-primary)' }}
            >
              {label}
            </span>

            <svg
              className="absolute inset-0 w-full pointer-events-none overflow-visible"
              style={{ top: '52%', height: 2 }}
            >
              <line
                x1="0" y1="1" x2="100%" y2="1"
                stroke="rgba(239,68,68,0.8)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{
                  strokeDasharray: '200',
                  strokeDashoffset: isDrawing ? '0' : isDone ? '0' : '200',
                  transition: isDrawing ? `stroke-dashoffset ${DRAW_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
                }}
              />
            </svg>
          </div>
        )
      })}
    </div>
  )
}
