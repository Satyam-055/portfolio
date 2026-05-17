import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AUTOPLAY_MS = 1300;

export default function PrototypePlayer({ steps }) {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = (next) => {
    setIdx(((next % steps.length) + steps.length) % steps.length);
  };

  // Autoplay — resets whenever idx or paused changes
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIdx((prev) => (prev + 1) % steps.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, steps.length]);

  return (
    <div
      className="w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Browser chrome */}
      <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
        {/* Mac title bar */}
        <div
          className="flex items-center gap-1.5 px-4 py-[10px] border-b border-[var(--border)]"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          <div
            className="flex-1 mx-3 rounded-md px-3 py-1 text-[11px] text-[var(--text-secondary)] border border-[var(--border)] text-center"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            app.alphanso.ai / my-advisor
          </div>
        </div>

        {/* Screen — all images stacked, CSS opacity crossfade, no blank frame */}
        <div
          className="relative overflow-hidden bg-white cursor-pointer"
          style={{ aspectRatio: '1280 / 836' }}
          onClick={() => go(idx + 1)}
        >
          {steps.map((step, i) => (
            <img
              key={i}
              src={step.img}
              alt={step.label}
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover object-top"
              style={{
                opacity: i === idx ? 1 : 0,
                filter: i === idx ? 'blur(0px)' : 'blur(5px)',
                transition: 'opacity 380ms cubic-bezier(0.87, 0, 0.13, 1), filter 380ms cubic-bezier(0.87, 0, 0.13, 1)',
                pointerEvents: i === idx ? 'auto' : 'none',
                zIndex: i === idx ? 1 : 0,
              }}
            />
          ))}

          {/* Hotspot dot — highlights the next clickable zone */}
          {steps[idx].hotspot && (
            <div
              key={`hotspot-${idx}`}
              className="absolute pointer-events-none"
              style={{
                left: `${steps[idx].hotspot.x}%`,
                top: `${steps[idx].hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              {/* Outer pulse ring */}
              <span
                className="absolute rounded-full animate-ping"
                style={{
                  width: '28px', height: '28px',
                  top: '-6px', left: '-6px',
                  backgroundColor: '#888',
                  opacity: 0.25,
                }}
              />
              {/* Core dot */}
              <span
                className="relative flex items-center justify-center w-4 h-4 rounded-full shadow-lg"
                style={{ backgroundColor: '#888', border: '2px solid white' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-3 px-0.5">
        {/* Progress bar dots */}
        <div className="flex items-center gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPaused(true); go(i); }}
              className="h-[3px] rounded-full transition-all duration-300 shrink-0"
              style={{
                width: i === idx ? '20px' : '6px',
                backgroundColor: i === idx ? 'var(--accent)' : 'var(--border)',
              }}
            />
          ))}
        </div>

        {/* Step label */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-[12px] text-[var(--text-secondary)] truncate"
            >
              <span className="text-[var(--text-primary)] font-medium">
                {idx + 1}/{steps.length}
              </span>
              {' · '}
              {steps[idx].label}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Pause / resume + arrows */}
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => setPaused((p) => !p)}
            title={paused ? 'Resume autoplay' : 'Pause autoplay'}
            className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--text-secondary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            {paused ? '▶' : '⏸'}
          </button>
          <button
            onClick={() => { setPaused(true); go(idx - 1); }}
            disabled={idx === 0}
            className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[11px] text-[var(--text-primary)] disabled:opacity-25 hover:bg-[var(--bg-card)] transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => { setPaused(true); go(idx + 1); }}
            disabled={idx === steps.length - 1}
            className="w-7 h-7 rounded-full border border-[var(--border)] flex items-center justify-center text-[11px] text-[var(--text-primary)] disabled:opacity-25 hover:bg-[var(--bg-card)] transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
