/**
 * ClaudePixel  -  Pixel animation of Claude the cat.
 * 3-act loop: 1) Code on laptop → 2) Take a photo → 3) Ride a red bike → repeat
 * Drag the cat off the navbar to launch it; it parachutes back from the sky.
 */

import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

// Lazy AudioContext  -  created on first call (must be from a user-gesture stack
// like dragend, which is how the cinematic kicks off).
let audioCtx = null
function playPunchSound() {
  if (typeof window === 'undefined') return
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    if (!audioCtx) audioCtx = new AC()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const ctx = audioCtx
    const t0 = ctx.currentTime

    // Whoosh: filtered white-noise sweep down
    const noiseDur = 0.18
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * noiseDur), ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.85
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 0.9
    filter.frequency.setValueAtTime(7000, t0)
    filter.frequency.exponentialRampToValueAtTime(420, t0 + noiseDur)
    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(0.0001, t0)
    noiseGain.gain.exponentialRampToValueAtTime(0.55, t0 + 0.025)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, t0 + noiseDur)
    noise.connect(filter).connect(noiseGain).connect(ctx.destination)
    noise.start(t0)
    noise.stop(t0 + noiseDur + 0.02)

    // Thunk: low sine pulse landing right after the whoosh peaks
    const thunkStart = t0 + 0.07
    const thunkDur = 0.22
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, thunkStart)
    osc.frequency.exponentialRampToValueAtTime(55, thunkStart + thunkDur)
    const oscGain = ctx.createGain()
    oscGain.gain.setValueAtTime(0.0001, thunkStart)
    oscGain.gain.exponentialRampToValueAtTime(0.5, thunkStart + 0.015)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, thunkStart + thunkDur)
    osc.connect(oscGain).connect(ctx.destination)
    osc.start(thunkStart)
    osc.stop(thunkStart + thunkDur + 0.02)
  } catch (_) {
    // Audio unavailable  -  fail silently
  }
}

export default function ClaudePixel({ size = 6, detective = false, onDrop }) {
  const canvasRef = useRef(null)
  const slotRef = useRef(null)        // empty div in flow at the navbar  -  holds layout space
  const overlayRef = useRef(null)     // portal'd motion.div containing the canvas
  const rafRef = useRef(null)
  const detectiveRef = useRef(detective)
  detectiveRef.current = detective

  // ── State machine: normal | drag | fall | gap | freefall | deploy | descent | land
  const [mode, setMode] = useState('normal')
  const [target, setTarget] = useState({ x: 0, y: 0 })

  const modeRef = useRef('normal')
  modeRef.current = mode
  const targetRef = useRef(target)
  targetRef.current = target

  const homeRef = useRef({ x: 0, y: 0 })
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const wasDraggedRef = useRef(false)
  const parachuteActiveRef = useRef(false)
  parachuteActiveRef.current = mode === 'deploy' || mode === 'descent' || mode === 'land'

  // ── Cinematic camera (transforms the document, not the cat) ─────
  const cameraActiveRef = useRef(false)
  const cameraRafRef = useRef(null)
  const speedLinesRef = useRef(null)
  const backdropRef = useRef(null)
  const angryPoseRef = useRef(false) // true during the camera-hold "beat"
  const deflationRef = useRef(0)     // 0..1, ramps up in last 22% of descent
  // Scroll compensation: body transform repositions fixed descendants relative
  // to body's top-left (= viewport - scrollY). We capture scroll at cinematic
  // start and add it to motion.div translate so the cat stays at its viewport
  // slot position regardless of how far down the user scrolled.
  const [cinematicShiftY, setCinematicShiftY] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const COLS = 64
    const ROWS = 48
    const S = size
    canvas.width = COLS * S
    canvas.height = ROWS * S

    // ─── Palette ─────────────────────────────────────────
    const P = {
      body: '#c4856a', bodyLt: '#d49a82', bodyDk: '#a06b52', bodyDk2: '#8a5a42',
      eye: '#1a1a1a', nose: '#8a5a42',
      tail: '#555', tailDk: '#444',
      laptop: '#555', laptopLt: '#666', laptopDk: '#444',
      screenLt: '#0f3a0f', code: '#33ff33', codeDim: '#22aa22',
      cam: '#333', camLens: '#4488cc', camBtn: '#cc3333', flash: '#ffff88',
      // Cafe racer (RE GT 650)
      motoTank: '#cc2222', motoDk: '#991111', motoAccent: '#dd3333',
      chrome: '#cccccc', chromeDk: '#999999', exhaust: '#777',
      wheel: '#333', tire: '#222', spoke: '#555', hub: '#888',
      headlight: '#ffee88', headlightR: '#aaa',
      seat: '#1a1a1a', seatDk: '#111',
      // Parachute
      chute: '#cc2222', chuteDk: '#991111', chuteHi: '#dd3333',
      chuteWhite: '#f5f5f5', string: '#1a1a1a',
    }

    // ─── State ───────────────────────────────────────────
    let frame = 0
    let act = 1          // 1=code, 2=photo, 3=bike
    let phase = 'idle'
    let phaseT = 0
    let blinkT = 0, blink = false

    // Act 1 state
    let laptopSlide = 0, laptopOpen = 0, typeCursor = 0, codeLines = []

    // Act 2 state
    let camRaise = 0, flashAlpha = 0

    // Act 3 state
    let bikeX = 0, pedalAngle = 0

    // Tumble/interaction state
    let tumble = false
    let tumbleT = 0
    let tumbleAct = 0 // which act was interrupted
    const TUMBLE_DURATION = 120

    function px(x, y, c) { ctx.fillStyle = c; ctx.fillRect(x * S, y * S, S, S) }
    function rect(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x * S, y * S, w * S, h * S) }

    // ─── Draw Claude base body ───────────────────────────
    function drawBody(cx, cy, breathY, lookDir) {
      const x = cx - 5
      const y = cy - 9 + breathY
      // Tail
      const td = lookDir === 'left' ? 1 : -1
      px(x + 5 + td * 5, y + 5, P.tail)
      px(x + 5 + td * 6, y + 4, P.tail)
      px(x + 5 + td * 7, y + 3, P.tail)
      px(x + 5 + td * 8, y + 3, P.tailDk)
      // Head
      px(x + 2, y, P.body); px(x + 7, y, P.body) // ears
      rect(x + 2, y + 1, 7, 1, P.body)
      rect(x + 1, y + 2, 9, 1, P.body)
      if (!blink) { px(x + 3, y + 2, P.eye); px(x + 6, y + 2, P.eye) }
      rect(x + 1, y + 3, 9, 1, P.body)
      px(x + 4, y + 3, P.nose); px(x + 5, y + 3, P.nose)
      // Torso
      rect(x + 1, y + 4, 9, 1, P.bodyLt)
      rect(x + 1, y + 5, 9, 1, P.body); rect(x + 3, y + 5, 4, 1, P.bodyLt)
      rect(x + 1, y + 6, 9, 1, P.body); rect(x + 3, y + 6, 4, 1, P.bodyLt)
      rect(x + 2, y + 7, 8, 1, P.body)
      return { x, y }
    }

    // ─── Detective hat (fedora) ─────────────────────────
    function drawHat(x, y) {
      // Brim  -  wide, dark
      rect(x, y - 1, 11, 1, '#222')
      px(x - 1, y - 1, '#333')
      px(x + 11, y - 1, '#333')
      // Crown
      rect(x + 2, y - 3, 7, 2, '#333')
      rect(x + 3, y - 4, 5, 1, '#444')
      // Band
      rect(x + 2, y - 2, 7, 1, '#555')
      // Indent on top
      px(x + 5, y - 4, '#2a2a2a')
    }

    function drawLegs(x, y, pedaling, pedalA) {
      const legY = y + 8
      if (!pedaling) {
        px(x + 2, legY, P.bodyDk); px(x + 2, legY + 1, P.bodyDk2)
        px(x + 4, legY, P.bodyDk); px(x + 4, legY + 1, P.bodyDk2)
        px(x + 7, legY, P.bodyDk); px(x + 7, legY + 1, P.bodyDk2)
        px(x + 9, legY, P.bodyDk); px(x + 9, legY + 1, P.bodyDk2)
      } else {
        // Pedaling legs  -  alternate up/down
        const oA = Math.sin(pedalA) > 0 ? 0 : 1
        const oB = Math.sin(pedalA) > 0 ? 1 : 0
        px(x + 3, legY + oA, P.bodyDk); px(x + 3, legY + 1 + oA, P.bodyDk2)
        px(x + 7, legY + oB, P.bodyDk); px(x + 7, legY + 1 + oB, P.bodyDk2)
      }
    }

    // ─── Act 1: Coding ───────────────────────────────────
    function drawLaptop(lx, ly, openAmt) {
      rect(lx, ly, 12, 2, P.laptop); rect(lx, ly + 2, 12, 1, P.laptopDk)
      if (openAmt > 0.3) {
        for (let kx = 1; kx < 11; kx += 2) { px(lx + kx, ly, P.laptopLt); px(lx + kx, ly + 1, P.laptopLt) }
        rect(lx + 4, ly + 1, 4, 1, P.laptopLt)
      }
      if (openAmt > 0) {
        const sh = Math.max(1, Math.round(openAmt * 9))
        rect(lx, ly - sh, 12, sh, P.laptop); rect(lx, ly - sh, 12, 1, P.laptopDk)
        if (sh > 2) rect(lx + 1, ly - sh + 1, 10, sh - 1, P.screenLt)
      }
    }

    function drawCode(lx, ly, openAmt) {
      if (openAmt < 0.8) return
      const sh = Math.round(openAmt * 9); if (sh < 4) return
      const sx = lx + 1, sy = ly - sh + 1, sw = 10, maxH = sh - 1
      for (let i = 0; i < codeLines.length && i < maxH; i++) {
        ctx.fillStyle = i % 3 === 0 ? P.code : P.codeDim
        for (let j = 0; j < codeLines[i] && j < sw; j++)
          ctx.fillRect((sx + j) * S + 1, (sy + i) * S + Math.floor(S * 0.2), S - 2, Math.floor(S * 0.6))
      }
      if (codeLines.length < maxH && Math.floor(frame / 10) % 2 === 0) {
        ctx.fillStyle = P.code
        ctx.fillRect((sx + (typeCursor % sw)) * S + 1, (sy + codeLines.length) * S + 1, 2, S - 2)
      }
    }

    function drawGlow(lx, ly, openAmt) {
      if (openAmt < 0.9) return
      const sh = Math.round(openAmt * 9)
      ctx.fillStyle = `rgba(51,255,51,${0.04 + Math.sin(frame * 0.08) * 0.02})`
      ctx.fillRect((lx - 2) * S, (ly - sh - 2) * S, 16 * S, (sh + 6) * S)
    }

    function drawTypingArms(x, y) {
      const bob = Math.floor(frame / 5) % 2
      px(x, y + 6, P.bodyDk); px(x - 1, y + 6 + bob, P.bodyDk); px(x - 2, y + 7, P.body)
      px(x + 1, y + 7, P.bodyDk); px(x, y + 7 + (1 - bob), P.body)
    }

    function drawReachArm(x, y) {
      const ext = Math.min(Math.floor(phaseT / 5), 5)
      for (let i = 0; i < ext; i++) px(x - 1 - i, y + 6, P.bodyDk)
      if (ext > 0) px(x - 1 - ext, y + 5, P.body)
    }

    function drawHoldArm(x, y) {
      px(x, y + 6, P.bodyDk); px(x - 1, y + 6, P.bodyDk); px(x - 1, y + 7, P.body)
    }

    // ─── Act 2: Camera ───────────────────────────────────
    function drawCamera(cx, cy, raise) {
      // Camera body held in front of face
      const camX = cx - 8
      const camY = cy - 7 - Math.round(raise * 4)
      rect(camX, camY, 6, 4, P.cam)
      rect(camX + 1, camY + 1, 4, 2, P.camLens)  // lens
      px(camX + 5, camY, P.camBtn)                  // shutter button
      // Arms holding camera
      px(cx - 5, cy - 3, P.bodyDk); px(cx - 6, cy - 3, P.bodyDk)
      px(cx - 4, cy - 2, P.bodyDk); px(cx - 3, cy - 2, P.bodyDk)
    }

    function drawFlash() {
      if (flashAlpha <= 0) return
      ctx.fillStyle = `rgba(255,255,200,${flashAlpha})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // ─── Act 3: Cafe Racer (RE GT 650)  -  clean silhouette ─
    function drawMoto(bx, by, wheelAngle) {
      // bx = left edge of rear wheel center, by = wheel center Y

      // ── Wheels  -  simple clean circles ──
      const rW = bx, fW = bx + 16 // rear & front wheel X
      function drawWheel(wx) {
        // Tire ring
        const pts = [[0,-4],[1,-4],[2,-3],[3,-3],[4,-2],[4,-1],[4,0],[4,1],[4,2],[3,3],[2,3],[1,4],[0,4],
                      [-1,4],[-2,3],[-3,3],[-4,2],[-4,1],[-4,0],[-4,-1],[-4,-2],[-3,-3],[-2,-3],[-1,-4]]
        pts.forEach(([dx,dy]) => px(wx+dx, by+dy, P.tire))
        // 4 spokes rotating
        for (let i = 0; i < 4; i++) {
          const a = wheelAngle + i * Math.PI / 2
          for (let r = 1; r <= 3; r++) {
            px(wx + Math.round(Math.cos(a)*r), by + Math.round(Math.sin(a)*r), P.spoke)
          }
        }
        px(wx, by, P.hub) // hub
      }
      drawWheel(rW)
      drawWheel(fW)

      // ── Frame  -  single clean backbone ──
      for (let i = 3; i <= 14; i++) px(bx + i, by - 5, P.chromeDk) // main tube

      // ── Engine (simple block under frame) ──
      rect(bx + 5, by - 4, 4, 3, P.chrome)
      rect(bx + 6, by - 4, 2, 1, P.chromeDk) // head
      // Exhaust  -  single pipe sweeping back
      px(bx + 4, by - 2, P.exhaust); px(bx + 3, by - 1, P.exhaust)
      px(bx + 2, by - 1, P.exhaust); px(bx + 1, by - 1, P.chrome) // tip

      // ── Tank (red teardrop) ──
      rect(bx + 8, by - 8, 5, 3, P.motoTank)
      px(bx + 9, by - 9, P.motoTank); px(bx + 10, by - 9, P.motoTank) // top curve
      px(bx + 11, by - 9, P.motoDk)
      // Gold pinstripe
      px(bx + 9, by - 7, '#ddaa33'); px(bx + 10, by - 7, '#ddaa33'); px(bx + 11, by - 7, '#ddaa33')

      // ── Seat (flat cafe hump) ──
      rect(bx + 3, by - 7, 5, 1, P.seat)
      rect(bx + 2, by - 6, 6, 1, P.seat)
      px(bx + 1, by - 6, '#ff3333') // tail light

      // ── Fork (angled) ──
      px(fW - 1, by - 5, P.chrome)
      px(fW, by - 6, P.chrome)
      px(fW, by - 7, P.chrome)

      // ── Clip-on bars ──
      px(fW - 1, by - 8, P.chromeDk); px(fW, by - 8, P.chrome); px(fW + 1, by - 8, P.chromeDk)

      // ── Headlight (round) ──
      px(fW + 1, by - 6, P.headlightR); px(fW + 2, by - 6, P.headlight)
      px(fW + 1, by - 7, P.headlightR); px(fW + 2, by - 7, P.headlight)
    }

    // ─── Fire effect ──────────────────────────────────────
    function drawFire(fx, fy, intensity) {
      const colors = ['#ff4400', '#ff6600', '#ffaa00', '#ffcc00']
      for (let i = 0; i < intensity; i++) {
        const dx = Math.round((Math.random() - 0.5) * 4)
        const dy = -Math.round(Math.random() * 5)
        const c = colors[Math.floor(Math.random() * colors.length)]
        px(fx + dx, fy + dy, c)
      }
    }

    // ─── Fallen cat (on its back, legs up) ──────────────
    function drawFallenCat(cx, cy) {
      // Body flat on ground
      rect(cx - 4, cy, 9, 3, P.body)
      rect(cx - 3, cy, 7, 1, P.bodyLt)
      // Head sideways
      rect(cx - 6, cy - 1, 4, 4, P.body)
      // Eyes (dizzy X's)
      px(cx - 5, cy, P.eye); px(cx - 4, cy + 1, P.eye)
      px(cx - 4, cy, P.eye); px(cx - 5, cy + 1, P.eye)
      // Legs sticking up
      px(cx - 2, cy - 1, P.bodyDk); px(cx - 2, cy - 2, P.bodyDk2)
      px(cx + 1, cy - 1, P.bodyDk); px(cx + 1, cy - 2, P.bodyDk2)
      px(cx + 3, cy - 1, P.bodyDk); px(cx + 3, cy - 2, P.bodyDk2)
      // Tail limp
      px(cx + 5, cy + 1, P.tail); px(cx + 6, cy + 2, P.tailDk)
      // Stars around head (dizzy)
      if (Math.floor(frame / 8) % 2 === 0) {
        px(cx - 8, cy - 3, '#ffcc00')
        px(cx - 4, cy - 4, '#ffcc00')
        px(cx - 7, cy - 1, '#ffcc00')
      }
    }

    // ─── Parachute (drawn in canvas pixel-space) ────────
    // Canopy is a stepped dome from row 4 (peak) down to row 12 (skirt).
    // openT = 0..1, the deploy progress (controls how wide the canopy is).
    function drawParachute(openT, swayPx, skipRightStrings = false, canopyScale = 1) {
      const sx = swayPx | 0
      // Ramp the canopy width with openT for a "pop open" feel; canopyScale
      // shrinks the canopy on landing as it loses lift.
      const t = Math.min(1, Math.max(0, openT)) * canopyScale
      const rows = [
        [4,  36, 40, P.chuteHi],
        [5,  33, 43, P.chute],
        [6,  31, 45, P.chute],
        [7,  29, 47, P.chute],
        [8,  27, 49, P.chute],
        [9,  25, 51, P.chute],
        [10, 23, 53, P.chute],
        [11, 22, 54, P.chute],
        [12, 22, 54, P.chuteDk], // skirt
      ]
      for (const [r, c1Full, c2Full, color] of rows) {
        const cmid = (c1Full + c2Full) / 2
        const halfW = ((c2Full - c1Full) / 2) * t
        const c1 = Math.round(cmid - halfW)
        const c2 = Math.round(cmid + halfW)
        for (let c = c1; c <= c2; c++) px(c + sx, r, color)
      }
      // White panel separators (only when mostly open)
      if (t > 0.7) {
        for (let r = 6; r <= 11; r++) {
          px(30 + sx, r, P.chuteWhite)
          px(38 + sx, r, P.chuteWhite)
          px(46 + sx, r, P.chuteWhite)
        }
        px(38 + sx, 4, P.chuteWhite); px(38 + sx, 5, P.chuteWhite)
      }
      // Strings  -  extend down to just above the cat's new head position.
      if (openT > 0.5) {
        const ends = [
          [22, 13, 33, 33],
          [31, 13, 35, 33],
          [45, 13, 41, 33],
          [54, 13, 43, 33],
        ]
        for (let i2 = 0; i2 < ends.length; i2++) {
          // Right two strings = ends[2] and ends[3]; skip them when arm is up.
          if (skipRightStrings && i2 >= 2) continue
          const [x1, y1, x2, y2] = ends[i2]
          const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1))
          for (let i = 0; i <= steps; i++) {
            const k = i / steps
            const sxp = Math.round(x1 + (x2 - x1) * k) + sx
            const syp = Math.round(y1 + (y2 - y1) * k)
            px(sxp, syp, P.string)
          }
        }
      }
    }

    // Skydiving cat  -  arms spread wide, free-falling pose (no parachute)
    function drawSkydiveCat() {
      const wob = Math.floor(frame / 3) % 2
      const { x, y } = drawBody(CX, CY + wob, 0, 'right')
      if (detectiveRef.current) drawHat(x, y)
      // Arms thrown out to the sides
      px(x - 1, y + 5, P.bodyDk); px(x - 2, y + 5, P.body); px(x - 3, y + 5 + wob, P.bodyDk2)
      px(x + 10, y + 5, P.bodyDk); px(x + 11, y + 5, P.body); px(x + 12, y + 5 + wob, P.bodyDk2)
      // Legs spread
      px(x + 1, y + 8, P.bodyDk); px(x, y + 9, P.bodyDk2)
      px(x + 4, y + 8, P.bodyDk); px(x + 4, y + 9, P.bodyDk2)
      px(x + 7, y + 8, P.bodyDk); px(x + 7, y + 9, P.bodyDk2)
      px(x + 10, y + 8, P.bodyDk); px(x + 11, y + 9, P.bodyDk2)
    }

    // Angry cat with middle finger raised  -  anime cut-in pose
    function drawAngryCat() {
      const x = CX - 5
      const y = CY - 9
      // Tail flicked up (angry)
      px(x + 11, y + 5, P.tail)
      px(x + 12, y + 4, P.tail)
      px(x + 13, y + 3, P.tail)
      px(x + 13, y + 2, P.tailDk)
      // Head + ears
      px(x + 2, y, P.body); px(x + 7, y, P.body)
      rect(x + 2, y + 1, 7, 1, P.body)
      rect(x + 1, y + 2, 9, 1, P.body)
      // Angry V-shape brows above eyes
      px(x + 2, y + 1, '#1a1a1a'); px(x + 3, y + 2, '#1a1a1a')
      px(x + 7, y + 2, '#1a1a1a'); px(x + 8, y + 1, '#1a1a1a')
      // Narrowed slit eyes (just horizontal slits)
      rect(x + 3, y + 2, 1, 1, P.eye)
      rect(x + 6, y + 2, 1, 1, P.eye)
      // Cheeks + nose row
      rect(x + 1, y + 3, 9, 1, P.body)
      px(x + 4, y + 3, P.nose); px(x + 5, y + 3, P.nose)
      // Snarl mouth  -  open dark gap with fang
      rect(x + 1, y + 4, 9, 1, P.bodyLt)
      px(x + 4, y + 4, '#3a1010')
      px(x + 5, y + 4, '#5a1818')
      px(x + 6, y + 4, '#3a1010')
      px(x + 5, y + 5, '#f5f5f5') // fang
      // Torso
      rect(x + 1, y + 5, 9, 1, P.body); rect(x + 3, y + 5, 4, 1, P.bodyLt)
      rect(x + 1, y + 6, 9, 1, P.body); rect(x + 3, y + 6, 4, 1, P.bodyLt)
      rect(x + 2, y + 7, 8, 1, P.body)
      // Right arm THROWN UP  -  straight overhead
      px(x + 10, y + 4, P.bodyDk)
      px(x + 10, y + 3, P.bodyDk)
      px(x + 10, y + 2, P.bodyDk)
      px(x + 10, y + 1, P.bodyDk)
      // Fist
      px(x + 9, y, P.body)
      px(x + 10, y, P.body)
      px(x + 11, y, P.body)
      px(x + 9, y - 1, P.bodyDk)
      px(x + 11, y - 1, P.bodyDk)
      // Middle finger extended above the fist
      px(x + 10, y - 1, P.body)
      px(x + 10, y - 2, P.body)
      px(x + 10, y - 3, P.bodyLt) // tip
      // Left arm clenched against body (also raised, less dramatic)
      px(x + 1, y + 5, P.bodyDk)
      px(x, y + 5, P.bodyDk)
      px(x, y + 6, P.body)
      // Legs hanging down loose
      drawLegs(x, y, false, 0)
      // Anime sweat drop on temple
      px(x - 1, y + 1, '#7fb8ff')
      px(x - 1, y + 2, '#3d8de0')
      px(x - 2, y + 2, '#7fb8ff')
      // Anger marks (vein lines) above head
      const blink2 = Math.floor(frame / 6) % 2
      if (blink2 === 0) {
        px(x + 5, y - 5, '#cc2222')
        px(x + 4, y - 4, '#cc2222')
        px(x + 6, y - 4, '#cc2222')
      }
    }

    // Hanging cat  -  arms stretched up holding the strings
    function drawHangingCat() {
      const breathY = Math.sin(frame * 0.04) > 0.6 ? -1 : 0
      const { x, y } = drawBody(CX, CY, breathY, 'right')
      if (detectiveRef.current) drawHat(x, y)
      // Both arms reach straight up to grab the strings
      px(x + 1, y + 4, P.bodyDk)
      px(x + 1, y + 3, P.bodyDk)
      px(x + 1, y + 2, P.body)
      px(x + 9, y + 4, P.bodyDk)
      px(x + 9, y + 3, P.bodyDk)
      px(x + 9, y + 2, P.body)
      // Legs hanging down loose
      drawLegs(x, y, false, 0)
    }

    // ─── Click handler ──────────────────────────────────
    function handleClick() {
      if (wasDraggedRef.current) return       // suppress click after a drag
      if (modeRef.current !== 'normal') return // ignore during fall/parachute/etc.
      if (tumble) return
      if (phase === 'idle') return
      tumble = true
      tumbleT = 0
      tumbleAct = act
    }

    canvas.addEventListener('click', handleClick)

    // ─── Phase Machine ───────────────────────────────────
    // Cat sits low in the canvas so its feet line up with the slot's bottom
    // edge  -  closes the gap to the navbar.
    const CX = 38, CY = 44

    function nextAct() {
      act = act === 3 ? 1 : act + 1
      phase = 'idle'; phaseT = 0
      laptopSlide = 0; laptopOpen = 0; typeCursor = 0; codeLines = []
      camRaise = 0; flashAlpha = 0
      bikeX = 0; pedalAngle = 0
    }

    function updatePhase() {
      phaseT++
      blinkT++
      if (blinkT > 90 + Math.random() * 40) {
        blink = true
        if (blinkT > 95 + Math.random() * 40) { blink = false; blinkT = 0 }
      }

      if (act === 1) {
        // Coding sequence
        switch (phase) {
          case 'idle': if (phaseT > 60) { phase = 'reach'; phaseT = 0 } break
          case 'reach': if (phaseT > 35) { phase = 'pullout'; phaseT = 0 } break
          case 'pullout':
            laptopSlide = Math.min(1, phaseT / 40)
            if (phaseT > 50) { phase = 'open'; phaseT = 0 } break
          case 'open':
            laptopOpen = Math.min(1, phaseT / 35)
            if (phaseT > 45) { phase = 'typing'; phaseT = 0 } break
          case 'typing':
            if (phaseT % 5 === 0) {
              typeCursor++
              if (typeCursor > 1 + Math.random() * 8) {
                if (codeLines.length < 8) codeLines.push(typeCursor)
                else { codeLines.shift(); codeLines.push(typeCursor) }
                typeCursor = 0
              }
            }
            if (phaseT > 350) nextAct()
            break
        }
      } else if (act === 2) {
        // Photo sequence
        switch (phase) {
          case 'idle': if (phaseT > 40) { phase = 'raise'; phaseT = 0 } break
          case 'raise':
            camRaise = Math.min(1, phaseT / 30)
            if (phaseT > 40) { phase = 'hold'; phaseT = 0 } break
          case 'hold':
            if (phaseT > 50) { phase = 'snap'; phaseT = 0; flashAlpha = 0.7 } break
          case 'snap':
            flashAlpha = Math.max(0, flashAlpha - 0.03)
            if (phaseT > 30) { phase = 'hold2'; phaseT = 0 } break
          case 'hold2':
            if (phaseT > 40) { phase = 'snap2'; phaseT = 0; flashAlpha = 0.7 } break
          case 'snap2':
            flashAlpha = Math.max(0, flashAlpha - 0.03)
            if (phaseT > 30) { phase = 'lower'; phaseT = 0 } break
          case 'lower':
            camRaise = Math.max(0, camRaise - 0.04)
            if (phaseT > 40) nextAct()
            break
        }
      } else if (act === 3) {
        // Bike sequence
        switch (phase) {
          case 'idle': if (phaseT > 30) { phase = 'ride'; phaseT = 0 } break
          case 'ride':
            if (phaseT > 300) nextAct()
            break
        }
      }
    }

    // Track when parachute mode started so we can ramp the canopy open.
    let parachuteStartFrame = -1

    // ─── Tangled landing helpers ─────────────────────────
    // Flat sheet: rectangular drape over cat's head/shoulders + narrow fold
    // cascading off the left side + flat sheet spread out on the navbar
    // surface. No rounded blob  -  fabric obeys gravity and just lays flat.
    function drawFlatChute(jiggleT, slideX = 0, slideY = 0) {
      const wob = Math.round(Math.sin(jiggleT * 0.09) * 0.5)

      // Upper drape  -  covers cat's head (rows 35–38) + shoulders.
      const upperShape = [
        [32, 34, 42],
        [33, 33, 43],
        [34, 32, 44],
        [35, 32, 44], // ears row
        [36, 32, 44],
        [37, 32, 44], // eyes row
        [38, 32, 44],
        [39, 32, 44], // shoulder line  -  bottom edge of upper drape
      ]

      // Side fold  -  narrow strip cascading off the cat's left side down
      // to the navbar surface.
      const foldShape = [
        [40, 30, 33],
        [41, 28, 32],
        [42, 26, 31],
        [43, 24, 30],
      ]

      // Ground sheet  -  flat on the navbar surface, extending left far
      // beyond the cat. Lays at cat's feet level + below.
      const groundShape = [
        [44, 0, 31],
        [45, 0, 28],
        [46, 0, 24],
        [47, 0, 19],
      ]

      function drawShape(shape) {
        for (let i = 0; i < shape.length; i++) {
          const [r, c1, c2] = shape[i]
          const ry = r + slideY
          if (ry < 0 || ry >= ROWS) continue
          for (let c = c1 + wob + slideX; c <= c2 + wob + slideX; c++) {
            if (c < 0 || c >= COLS) continue
            const seed = (r * 3 + c * 2 + Math.floor(jiggleT / 12)) % 9
            const color = seed === 0 ? P.chuteHi : seed < 7 ? P.chute : P.chuteDk
            px(c, ry, color)
          }
        }
      }

      drawShape(groundShape)
      drawShape(foldShape)
      drawShape(upperShape)

      // White panel seams suggest the canopy origin and add fabric texture
      const seams = [
        [34, 35], [36, 35], [38, 35],
        [34, 41], [36, 41], [38, 41],
        [45, 8], [45, 18], [46, 12],
      ]
      for (let i = 0; i < seams.length; i++) {
        const [r, c] = seams[i]
        const ry = r + slideY
        const cx = c + wob + slideX
        if (ry >= 0 && ry < ROWS && cx >= 0 && cx < COLS) px(cx, ry, P.chuteWhite)
      }

      // Strings  -  slack on top of fabric
      const stringPath = [
        [31, 35], [32, 35], [33, 35], [34, 36],
        [31, 41], [32, 41], [33, 41], [34, 40],
        [44, 10], [45, 14], [44, 18], [45, 22],
      ]
      for (let i = 0; i < stringPath.length; i++) {
        const [r, c] = stringPath[i]
        const ry = r + slideY
        const cx = c + wob + slideX
        if (ry >= 0 && ry < ROWS && cx >= 0 && cx < COLS) px(cx, ry, P.string)
      }
    }

    // Sweat drop + cycling "?" comic FX on the side of the drape
    function drawDrapeFX(jiggleT) {
      // Sweat drop on the right side (away from drape)
      const dropY = 36 + (Math.floor(jiggleT / 5) % 3)
      if (dropY < ROWS) {
        px(48, dropY, '#88ccff')
        if (dropY + 1 < ROWS) px(48, dropY + 1, '#5599ee')
      }
      // ? mark above the drape, blinking in/out
      if ((Math.floor(jiggleT / 18) % 2) === 0) {
        px(50, 28, '#ffffff'); px(51, 28, '#ffffff')
        px(52, 29, '#ffffff'); px(52, 30, '#ffffff')
        px(51, 31, '#ffffff'); px(51, 33, '#ffffff')
      }
    }

    // ─── Render ──────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const breathY = Math.sin(frame * 0.04) > 0.6 ? -1 : 0

      // ── DEPLOY / DESCENT / LAND (parachute visible) ──
      if (parachuteActiveRef.current) {
        if (parachuteStartFrame < 0) parachuteStartFrame = frame
        const pF = frame - parachuteStartFrame

        // Canopy: pop open with overshoot (118%), settle to 100%, then breathe gently.
        let openT
        if (pF < 14)        openT = (pF / 14) * 1.18
        else if (pF < 26)   openT = 1.18 - ((pF - 14) / 12) * 0.18
        else                openT = 1 + Math.sin((pF - 26) * 0.05) * 0.02

        // Damped pendulum tilt  -  kicks in once canopy is open. In phase with
        // outer screen-space x-swing so the body leans into the direction it's
        // moving, like a real pendulum bob.
        let tilt = 0
        if (pF > 26) {
          const sec = (pF - 26) / 60
          const env = Math.exp(-0.5 * sec)
          tilt = 0.10 * env * Math.sin(2 * Math.PI * 0.55 * sec)
        }

        // Pivot at canopy top so the cat sweeps a wider arc below it.
        const pivotX = 38 * S
        const pivotY = 4 * S
        ctx.save()
        ctx.translate(pivotX, pivotY)
        ctx.rotate(tilt)
        ctx.translate(-pivotX, -pivotY)
        const angryNow = angryPoseRef.current && pF > 14
        // Canopy deflates in the last stretch of descent  -  loses lift before touchdown.
        const canopyScale = 1 - deflationRef.current * 0.55
        drawParachute(openT, 0, angryNow, canopyScale)
        if (angryNow) drawAngryCat()
        else drawHangingCat()
        ctx.restore()

        frame++
        rafRef.current = requestAnimationFrame(render)
        return
      } else {
        parachuteStartFrame = -1
      }

      // ── DRAG (held by cursor) ──
      if (modeRef.current === 'drag') {
        const { x, y } = drawBody(CX, CY, breathY, 'right')
        if (detectiveRef.current) drawHat(x, y)
        drawLegs(x, y, false, 0)
        // Arms drooping (being held)
        px(x + 1, y + 6, P.bodyDk); px(x + 9, y + 6, P.bodyDk)
        frame++
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // ── FALL / GAP / FREEFALL (no parachute yet  -  skydive pose) ──
      if (modeRef.current === 'fall' || modeRef.current === 'gap' || modeRef.current === 'freefall') {
        drawSkydiveCat()
        frame++
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // ── TUMBLE STATE ──
      if (tumble) {
        tumbleT++

        if (tumbleAct === 1) {
          // Laptop tumble: cat falls over laptop
          const lx = CX - 15, ly = 37
          // Laptop stays, tilts over time
          const tilt = Math.min(tumbleT * 0.8, 30)
          ctx.save()
          ctx.translate((lx + 6) * S, ly * S)
          ctx.rotate((tilt * Math.PI) / 180)
          ctx.translate(-(lx + 6) * S, -ly * S)
          drawLaptop(lx, ly, 1)
          ctx.restore()
          // Cat fallen on top
          drawFallenCat(CX - 2, 38)
        } else if (tumbleAct === 2) {
          // Camera falls, catches fire
          const fallY = Math.min(tumbleT * 0.5, 8)
          const camX = CX - 8, camY = CX - 11 + Math.round(fallY)
          // Draw fallen camera
          rect(camX, 38, 6, 3, P.cam)
          rect(camX + 1, 38, 4, 2, P.camLens)
          // Fire on camera
          if (tumbleT > 15) drawFire(camX + 3, 37, Math.min(tumbleT - 15, 8))
          // Cat reacting  -  stepped back, shocked
          const { x, y } = drawBody(CX + 6, CY, 0, 'left')
          drawLegs(x, y, false, 0)
          // Arms up in shock
          px(x + 1, y + 3, P.bodyDk); px(x + 1, y + 2, P.bodyDk)
          px(x + 9, y + 3, P.bodyDk); px(x + 9, y + 2, P.bodyDk)
        } else if (tumbleAct === 3) {
          // Cat falls off bike, bike slides forward
          const bikeSlide = Math.min(tumbleT * 0.4, 12)
          const motoX = 18 + Math.round(bikeSlide)
          // Bike tilted and sliding forward
          ctx.save()
          ctx.translate((motoX + 8) * S, 40 * S)
          ctx.rotate(Math.min(tumbleT * 0.3, 15) * Math.PI / 180)
          ctx.translate(-(motoX + 8) * S, -40 * S)
          drawMoto(motoX, 40, pedalAngle + tumbleT * 0.05)
          ctx.restore()
          // Cat fallen behind
          drawFallenCat(18, 39)
        }

        // Recovery  -  after tumble duration, reset to next act
        if (tumbleT > TUMBLE_DURATION) {
          tumble = false
          tumbleT = 0
          nextAct()
        }

        frame++
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // ── NORMAL ACTS ──
      if (act === 1) {
        // ── CODING ──
        const lBaseX = CX - 18, lFinalX = CX - 15
        const lx = Math.round(lBaseX + (lFinalX - lBaseX) * laptopSlide), ly = 37
        if (phase === 'pullout' || phase === 'open' || phase === 'typing') {
          drawGlow(lx, ly, laptopOpen)
          drawLaptop(lx, ly, laptopOpen)
          drawCode(lx, ly, laptopOpen)
        }
        const { x, y } = drawBody(CX, CY, breathY, 'right')
        if (detectiveRef.current) drawHat(x, y)
        if (phase === 'reach') drawReachArm(x, y)
        else if (phase === 'pullout') drawHoldArm(x, y)
        else if (phase === 'open' || phase === 'typing') drawTypingArms(x, y)
        drawLegs(x, y, false, 0)

      } else if (act === 2) {
        // ── PHOTO ──
        const { x, y } = drawBody(CX, CY, breathY, 'left')
        if (detectiveRef.current) drawHat(x, y)
        drawLegs(x, y, false, 0)
        if (phase !== 'idle') drawCamera(CX, CY, camRaise)
        drawFlash()

      } else if (act === 3) {
        // ── CAFE RACER ──
        const motoX = 18
        const motoWheelY = 40
        drawMoto(motoX, motoWheelY, pedalAngle)

        const catX = motoX + 7
        const catY = motoWheelY - 7
        const { x, y } = drawBody(catX, catY, 0, 'right')
        if (detectiveRef.current) drawHat(x, y)

        px(x + 4, y + 8, P.bodyDk); px(x + 5, y + 9, P.bodyDk2)
        px(x + 6, y + 8, P.bodyDk); px(x + 7, y + 9, P.bodyDk2)

        if (phase === 'ride') {
          const vib = Math.floor(frame / 3) % 2
          px(x + 10, y + 4, P.bodyDk)
          px(x + 11, y + 3 + vib, P.bodyDk)
          px(x + 12, y + 3, P.body)
          px(x + 10, y + 5 + vib, P.bodyDk)
          px(x + 11, y + 5, P.body)
        }

        if (phase === 'ride') pedalAngle += 0.18
      }

      frame++
      updatePhase()
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      canvas.removeEventListener('click', handleClick)
    }
  }, [size])

  // ─── Track the slot's viewport position as "home" ──────────────
  // The slot is an empty div in the navbar that reserves space. The actual
  // cat is portal'd to <body> at position:fixed, and animates to the slot's
  // viewport coordinates. This keeps the cat's positioning context stable
  // through every phase  -  no relative↔fixed switching.
  useLayoutEffect(() => {
    function updateHome() {
      const slot = slotRef.current
      if (!slot) return
      const r = slot.getBoundingClientRect()
      const next = { x: Math.round(r.left), y: Math.round(r.top) }
      homeRef.current = next
      if (modeRef.current === 'normal') {
        setTarget(next)
      }
    }
    updateHome()
    window.addEventListener('resize', updateHome)
    window.addEventListener('scroll', updateHome, true)
    return () => {
      window.removeEventListener('resize', updateHome)
      window.removeEventListener('scroll', updateHome, true)
    }
  }, [])

  // Reset document.body transform if the component unmounts mid-cinematic.
  useEffect(() => {
    return () => {
      if (cameraRafRef.current) cancelAnimationFrame(cameraRafRef.current)
      cameraRafRef.current = null
      cameraActiveRef.current = false
      document.body.style.transform = ''
      document.body.style.transformOrigin = ''
      document.body.style.willChange = ''
      if (typeof document !== 'undefined') {
        document.documentElement.style.overflow = ''
      }
      const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null
      if (rootEl) {
        rootEl.style.filter = ''
        rootEl.style.willChange = ''
      }
    }
  }, [])

  // ─── Pointer / drag handling ────────────────────────
  // Mode stays 'normal' until movement crosses the threshold; only THEN do we
  // switch into 'drag'. Pure clicks (no real movement) never enter drag mode,
  // so the canvas click handler's tumble logic still fires.
  function handlePointerDown(e) {
    if (modeRef.current !== 'normal') return

    const startClient = { x: e.clientX, y: e.clientY }
    let switchedToDrag = false
    wasDraggedRef.current = false

    function move(ev) {
      const dx = ev.clientX - startClient.x
      const dy = ev.clientY - startClient.y
      if (!switchedToDrag && Math.hypot(dx, dy) > 20) {
        switchedToDrag = true
        wasDraggedRef.current = true
        // dragOffset = where the cursor sits relative to the cat's home origin
        dragOffsetRef.current = {
          x: ev.clientX - homeRef.current.x,
          y: ev.clientY - homeRef.current.y,
        }
        setMode('drag')
      }
      if (switchedToDrag) {
        setTarget({
          x: Math.round(ev.clientX - dragOffsetRef.current.x),
          y: Math.round(ev.clientY - dragOffsetRef.current.y),
        })
      }
    }

    function up() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      if (!switchedToDrag) return // pure click  -  let canvas click handler fire

      // Determine if the cat ended up still over the navbar  -  if so, snap back.
      const navEl = slotRef.current?.parentElement?.parentElement
      const navRect = navEl?.getBoundingClientRect()
      const cur = targetRef.current
      const CANVAS_W = 64 * size
      const CANVAS_H = 48 * size
      const catCx = cur.x + CANVAS_W * 0.6
      const catCy = cur.y + CANVAS_H * 0.75
      const PAD = 40
      const stayedOnNav =
        navRect &&
        catCx > navRect.left - PAD &&
        catCx < navRect.right + PAD &&
        catCy > navRect.top - 100 &&
        catCy < navRect.bottom + PAD
      if (stayedOnNav) {
        setTarget(homeRef.current)
        setMode('normal')
      } else {
        setMode('fall')
        onDrop?.()
        window.dispatchEvent(new Event('cat-dropped'))
      }
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  // ─── Sequence orchestration ─────────────────────────
  //   fall → gap → freefall → deploy → descent → land → normal
  useEffect(() => {
    if (mode === 'fall') {
      // Free-fall straight off the bottom of the viewport.
      setTarget({ x: targetRef.current.x, y: window.innerHeight + 240 })
      const t = setTimeout(() => setMode('gap'), 600)
      return () => clearTimeout(t)
    }
    if (mode === 'gap') {
      // Off-screen pause. Snap above the top edge so the next phase can
      // physically cross into view from above.
      setTarget({ x: homeRef.current.x, y: -160 })
      const t = setTimeout(() => setMode('freefall'), 300)
      return () => clearTimeout(t)
    }
    if (mode === 'freefall') {
      // Free-fall through the top edge down to mid-screen, accelerating.
      const midY = Math.round(window.innerHeight * 0.4)
      setTarget({ x: homeRef.current.x, y: midY })
      const t = setTimeout(() => setMode('deploy'), 700)
      return () => clearTimeout(t)
    }
    if (mode === 'deploy') {
      // Canopy catches air  -  body decelerates sharply and gets yanked up.
      // Camera engages here. Cat is held in place through cinematic; descent
      // starts when the camera begins to zoom OUT, so the world pulls back
      // and reveals the cat already drifting toward the nav.
      const startY = targetRef.current.y
      setTarget({ x: targetRef.current.x, y: startY - 28 })

      // Anime punch-in sound  -  quick swoosh + thunk
      playPunchSound()

      // ── Camera: scale the document, not the cat ────────────────
      // Phases: zoom in → frozen hold (angry beat) → tracking hold (cat
      // descends, camera follows at peak zoom) → zoom out (triggered on land).
      const W = 64 * size
      const H = 48 * size
      const ZOOM_IN = 380
      const ANGRY_BEAT = 1100
      const ZOOM_OUT = 460
      const SL_FADE_OUT = 320
      const PEAK_SCALE = 2.5
      const MAX_BLUR = 3 // px at peak zoom  -  light DOF feel
      // Cat's actual body center in canvas pixel coords (not canvas center)
      const CAT_FOCUS_X = 38 * size
      const CAT_FOCUS_Y = 40 * size
      const camStart = performance.now()
      // Capture scroll position so the cat keeps its viewport slot location
      // even when the page is scrolled and body becomes the containing block.
      const scrollLockY = typeof window !== 'undefined' ? window.scrollY : 0
      const scrollLockX = typeof window !== 'undefined' ? window.scrollX : 0
      setCinematicShiftY(scrollLockY)
      // Lock html scroll for the duration of the cinematic so the offset stays consistent.
      const docEl = typeof document !== 'undefined' ? document.documentElement : null
      const prevHtmlOverflow = docEl ? docEl.style.overflow : ''
      if (docEl) docEl.style.overflow = 'hidden'
      let camFocusX = targetRef.current.x + CAT_FOCUS_X
      let camFocusY = targetRef.current.y + CAT_FOCUS_Y
      let zoomOutStart = -1

      cameraActiveRef.current = true
      document.body.style.willChange = 'transform'
      const rootEl = typeof document !== 'undefined' ? document.getElementById('root') : null
      if (rootEl) rootEl.style.willChange = 'filter'

      const camStep = (now) => {
        const elapsed = now - camStart

        // Cat has reached the nav (descent RAF flips mode → 'land')
        if (zoomOutStart < 0 && modeRef.current === 'land') {
          zoomOutStart = elapsed
        }

        // Angry pose window: visible from full zoom-in through the "beat",
        // then back to hanging cat while camera continues tracking descent.
        angryPoseRef.current =
          elapsed >= ZOOM_IN && elapsed < ZOOM_IN + ANGRY_BEAT && zoomOutStart < 0

        // Compute scale + base opacity
        let scale, opacity
        if (elapsed < ZOOM_IN) {
          const p = elapsed / ZOOM_IN
          const ease = 1 - Math.pow(1 - p, 3)
          scale = 1 + (PEAK_SCALE - 1) * ease
          opacity = ease
        } else if (zoomOutStart < 0) {
          // Holding (frozen + tracking)  -  could last seconds while cat descends
          scale = PEAK_SCALE
          opacity = 1
        } else {
          const outElapsed = elapsed - zoomOutStart
          const p = Math.min(1, outElapsed / ZOOM_OUT)
          const ease = 1 - Math.pow(1 - p, 2)
          scale = PEAK_SCALE + (1 - PEAK_SCALE) * ease
          opacity = 1 - ease
          if (outElapsed >= ZOOM_OUT) {
            document.body.style.transform = ''
            document.body.style.transformOrigin = ''
            document.body.style.willChange = ''
            if (docEl) docEl.style.overflow = prevHtmlOverflow
            setCinematicShiftY(0)
            if (rootEl) {
              rootEl.style.filter = ''
              rootEl.style.willChange = ''
            }
            if (speedLinesRef.current) speedLinesRef.current.style.opacity = '0'
            if (backdropRef.current) backdropRef.current.style.opacity = '0'
            cameraActiveRef.current = false
            angryPoseRef.current = false
            cameraRafRef.current = null
            return
          }
        }

        // Speed lines: only during the angry beat  -  fade in with zoom, hold
        // through the freeze, fade out as the cat starts descending. No
        // speed lines during the calm descent tracking.
        let slOpacity
        const slPeak = 0.45
        if (elapsed < ZOOM_IN) {
          slOpacity = (elapsed / ZOOM_IN) * slPeak
        } else if (elapsed < ZOOM_IN + ANGRY_BEAT) {
          slOpacity = slPeak
        } else if (elapsed < ZOOM_IN + ANGRY_BEAT + SL_FADE_OUT) {
          slOpacity = (1 - (elapsed - ZOOM_IN - ANGRY_BEAT) / SL_FADE_OUT) * slPeak
        } else {
          slOpacity = 0
        }

        // Track cat's BODY center (CY-4 ≈ chest), not the canvas center  - 
        // the canvas has a lot of empty space above the cat where the
        // parachute lives.
        const catCx = targetRef.current.x + CAT_FOCUS_X
        const catCy = targetRef.current.y + CAT_FOCUS_Y
        camFocusX += (catCx - camFocusX) * 0.18
        camFocusY += (catCy - camFocusY) * 0.20
        // body's transform-origin is in body coords; viewport y → body y by + scrollY
        document.body.style.transformOrigin = `${camFocusX + scrollLockX}px ${camFocusY + scrollLockY}px`
        document.body.style.transform = `scale(${scale})`

        // Lens DOF  -  blur the page (everything inside #root) while the
        // camera is engaged. Cat is portal'd OUTSIDE #root so it stays sharp.
        if (rootEl) {
          const blurAmount = Math.max(0, (scale - 1)) * (MAX_BLUR / (PEAK_SCALE - 1))
          rootEl.style.filter = blurAmount > 0.05 ? `blur(${blurAmount.toFixed(2)}px)` : ''
        }

        if (speedLinesRef.current) {
          const el = speedLinesRef.current
          el.style.left = `${catCx}px`
          el.style.top = `${catCy}px`
          el.style.opacity = String(slOpacity)
          el.style.transform = `translate(-50%, -50%) rotate(${elapsed * 0.05}deg)`
        }
        if (backdropRef.current) {
          // Slightly lighter dim during the long tracking; full dim during freeze.
          const bdBase = elapsed < ZOOM_IN + ANGRY_BEAT ? 0.32 : 0.22
          backdropRef.current.style.opacity = String(opacity * bdBase)
        }
        cameraRafRef.current = requestAnimationFrame(camStep)
      }
      cameraRafRef.current = requestAnimationFrame(camStep)

      // After the body-yank settles (~320ms), descent kicks in immediately.
      // The cat keeps moving smoothly while the camera dance plays out.
      const t = setTimeout(() => setMode('descent'), 320)
      return () => clearTimeout(t)
    }
    if (mode === 'descent') {
      // Drive position imperatively at 60fps so we can layer pendulum swing
      // on top of the gentle drift to home. Framer Motion's transition is
      // duration: 0 during descent  -  see transitionFor.
      const startTime = performance.now()
      const startX = targetRef.current.x
      const startY = targetRef.current.y
      const duration = 2800
      const swingAmp = 32      // px peak
      const swingFreq = 0.55   // Hz  -  about a swing every 1.8s
      const swingDecay = 0.5   // 1/s  -  decays to ~25% over duration

      let raf = null
      let cancelled = false
      const step = (now) => {
        if (cancelled) return
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)

        // Vertical: ease-out drift toward landing
        const yEase = 1 - Math.pow(1 - t, 1.5)
        const homeX = homeRef.current.x
        const homeY = homeRef.current.y
        const y = startY + (homeY - startY) * yEase

        // Final-30% swing damp: ramp the envelope to 0 at touchdown so the
        // cat lines up vertically and doesn't land mid-swing.
        const finalDamp = t < 0.7 ? 1 : Math.max(0, 1 - (t - 0.7) / 0.3)
        const sec = elapsed / 1000
        const env = Math.exp(-swingDecay * sec) * finalDamp
        const swing = swingAmp * env * Math.sin(2 * Math.PI * swingFreq * sec)
        const x = startX + (homeX - startX) * t + swing

        // Last 22% of descent: canopy starts deflating (loses lift before touchdown)
        deflationRef.current = t < 0.78 ? 0 : Math.min(1, (t - 0.78) / 0.22)

        setTarget({ x: Math.round(x), y: Math.round(y) })

        if (t < 1) raf = requestAnimationFrame(step)
        else setMode('land')
      }
      raf = requestAnimationFrame(step)
      return () => {
        cancelled = true
        if (raf) cancelAnimationFrame(raf)
      }
    }
    if (mode === 'land') {
      // Squash settle then resume the normal act loop.
      const t = setTimeout(() => setMode('normal'), 240)
      return () => clearTimeout(t)
    }
  }, [mode])

  // ─── Per-mode Framer Motion transition ──────────────
  function transitionFor(m) {
    switch (m) {
      case 'fall':     return { duration: 0.6, ease: [0.5, 0, 0.85, 0.4] }    // gravity ease-in
      case 'gap':      return { duration: 0 }                                  // instant snap
      case 'freefall': return { duration: 0.7, ease: [0.5, 0, 0.85, 0.4] }    // gravity ease-in
      case 'deploy':   return { duration: 0.32, ease: [0.2, 0.85, 0.4, 1] }   // sharp yank up as canopy catches air
      case 'descent':  return { duration: 0 }                                  // RAF drives target each frame
      case 'land':     return { duration: 0.22, ease: 'easeOut', times: [0, 0.3, 0.65, 1] } // squash → rebound → settle
      case 'drag':     return { duration: 0 }                                  // instant follow
      default:         return { duration: 0 }                                  // normal: snap to home
    }
  }

  const W = 64 * size
  const H = 48 * size
  // Slot reserves only as much vertical space as the cat actually occupies
  // (cat's bottom pixel is at canvas row 44 → 45 rows tall). Closes the
  // visual gap between cat's feet and the navbar's bottom edge. The canvas
  // itself stays 48 rows tall so the parachute area above + ground sheet
  // below have room.
  const SLOT_H = 45 * size

  const overlay = (
    <motion.div
      ref={overlayRef}
      initial={false}
      animate={{
        x: target.x,
        y: target.y + cinematicShiftY,
        scaleX: mode === 'land' ? [1, 1.18, 0.96, 1] : 1,
        scaleY: mode === 'land' ? [1, 0.78, 1.06, 1] : 1,
      }}
      transition={transitionFor(mode)}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: W,
        height: H,
        zIndex: 60,
        pointerEvents: mode === 'normal' || mode === 'drag' ? 'auto' : 'none',
        cursor: mode === 'drag' ? 'grabbing' : 'grab',
        touchAction: 'none',
        willChange: 'transform',
        // Pivot squash from the cat's feet (row 44 / 48 ≈ 91.7%) so the
        // body compresses upward on impact rather than around its center.
        transformOrigin: '50% 91.7%',
      }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </motion.div>
  )

  // Subtle vignette dim during cinematic  -  opacity driven imperatively from the camera RAF.
  const backdrop = (
    <div
      ref={backdropRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 18%, rgba(0,0,0,0.55) 78%)',
        zIndex: 55,
        pointerEvents: 'none',
        opacity: 0,
      }}
    />
  )

  // Comic-style radial speed lines  -  position, opacity, and rotation imperatively driven.
  // Lives inside body so it scales with the camera, growing into a full-frame burst.
  const SL_SIZE = 720
  const speedLines = (
    <div
      ref={speedLinesRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: SL_SIZE,
        height: SL_SIZE,
        // Lines use currentColor → CSS var → auto-contrast with theme
        // (dark text in light mode, light text in dark mode).
        color: 'var(--text-primary, #1a1a1a)',
        background:
          'repeating-conic-gradient(from 0deg at 50% 50%, currentColor 0deg 1.5deg, transparent 1.5deg 16deg)',
        WebkitMask:
          'radial-gradient(circle, transparent 60px, black 110px, black 320px, transparent 360px)',
        mask:
          'radial-gradient(circle, transparent 60px, black 110px, black 320px, transparent 360px)',
        pointerEvents: 'none',
        zIndex: 58,
        opacity: 0,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )

  return (
    <>
      {/* Slot  -  reserves layout space at the navbar; the actual cat is portal'd. */}
      <div
        ref={slotRef}
        style={{ width: W, height: SLOT_H, display: 'inline-block' }}
        aria-hidden="true"
      />
      {typeof document !== 'undefined' &&
        createPortal(
          <>
            {backdrop}
            {speedLines}
            {overlay}
          </>,
          document.body
        )}
    </>
  )
}
