/**
 * ClaudePixel — Pixel animation of Claude the cat.
 * 3-act loop: 1) Code on laptop → 2) Take a photo → 3) Ride a red bike → repeat
 * Drag the cat off the navbar to launch it; it parachutes back from the sky.
 */

import { useRef, useEffect, useState, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'

export default function ClaudePixel({ size = 6, detective = false }) {
  const canvasRef = useRef(null)
  const slotRef = useRef(null)        // empty div in flow at the navbar — holds layout space
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
      // Brim — wide, dark
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
        // Pedaling legs — alternate up/down
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

    // ─── Act 3: Cafe Racer (RE GT 650) — clean silhouette ─
    function drawMoto(bx, by, wheelAngle) {
      // bx = left edge of rear wheel center, by = wheel center Y

      // ── Wheels — simple clean circles ──
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

      // ── Frame — single clean backbone ──
      for (let i = 3; i <= 14; i++) px(bx + i, by - 5, P.chromeDk) // main tube

      // ── Engine (simple block under frame) ──
      rect(bx + 5, by - 4, 4, 3, P.chrome)
      rect(bx + 6, by - 4, 2, 1, P.chromeDk) // head
      // Exhaust — single pipe sweeping back
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
    function drawParachute(openT, swayPx) {
      const sx = swayPx | 0
      // Ramp the canopy width with openT for a "pop open" feel.
      const t = Math.min(1, Math.max(0, openT))
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
      // Strings — only attach once the canopy is mostly open
      if (t > 0.5) {
        const ends = [
          [22, 13, 33, 27],
          [31, 13, 35, 27],
          [45, 13, 41, 27],
          [54, 13, 43, 27],
        ]
        for (const [x1, y1, x2, y2] of ends) {
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

    // Skydiving cat — arms spread wide, free-falling pose (no parachute)
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

    // Hanging cat — arms stretched up holding the strings
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
    const CX = 38, CY = 38

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

    // ─── Render ──────────────────────────────────────────
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const breathY = Math.sin(frame * 0.04) > 0.6 ? -1 : 0

      // ── DEPLOY / DESCENT / LAND (parachute visible) ──
      if (parachuteActiveRef.current) {
        if (parachuteStartFrame < 0) parachuteStartFrame = frame
        const t = (frame - parachuteStartFrame) / 12 // ~200ms canopy ramp
        const sway = Math.sin(frame * 0.06) * 0.6
        drawParachute(t, sway)
        drawHangingCat()
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

      // ── FALL / GAP / FREEFALL (no parachute yet — skydive pose) ──
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
          // Cat reacting — stepped back, shocked
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

        // Recovery — after tumble duration, reset to next act
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
  // through every phase — no relative↔fixed switching.
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
      if (!switchedToDrag) return // pure click — let canvas click handler fire

      // Determine if the cat ended up still over the navbar — if so, snap back.
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
      // Hold position while the canopy pops open in the canvas.
      const t = setTimeout(() => setMode('descent'), 200)
      return () => clearTimeout(t)
    }
    if (mode === 'descent') {
      // Float gently down to home with the parachute fully open.
      setTarget({ x: homeRef.current.x, y: homeRef.current.y })
      const t = setTimeout(() => setMode('land'), 2500)
      return () => clearTimeout(t)
    }
    if (mode === 'land') {
      const t = setTimeout(() => setMode('normal'), 200)
      return () => clearTimeout(t)
    }
  }, [mode])

  // ─── Per-mode Framer Motion transition ──────────────
  function transitionFor(m) {
    switch (m) {
      case 'fall':     return { duration: 0.6, ease: [0.5, 0, 0.85, 0.4] }    // gravity ease-in
      case 'gap':      return { duration: 0 }                                  // instant snap
      case 'freefall': return { duration: 0.7, ease: [0.5, 0, 0.85, 0.4] }    // gravity ease-in
      case 'deploy':   return { duration: 0 }                                  // hold
      case 'descent':  return { duration: 2.5, ease: [0.42, 0.4, 0.58, 0.6] } // near-linear glide
      case 'land':     return { duration: 0.2, ease: 'easeOut' }
      case 'drag':     return { duration: 0 }                                  // instant follow
      default:         return { duration: 0 }                                  // normal: snap to home
    }
  }

  const W = 64 * size
  const H = 48 * size

  const overlay = (
    <motion.div
      ref={overlayRef}
      initial={false}
      animate={{ x: target.x, y: target.y }}
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

  return (
    <>
      {/* Slot — reserves layout space at the navbar; the actual cat is portal'd. */}
      <div
        ref={slotRef}
        style={{ width: W, height: H, display: 'inline-block' }}
        aria-hidden="true"
      />
      {typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </>
  )
}
