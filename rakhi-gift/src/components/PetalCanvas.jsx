import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const COLORS = [
  ['#f6a9c0', '#e0708f'],
  ['#ee7fa6', '#d81e5b'],
  ['#ffc15e', '#e8963d'],
  ['#ffa23e', '#e07b1f'],
  ['#ffd98e', '#e8b45c'],
]

// Soft marigold and rose petals drifting over the whole page.
export default function PetalCanvas({ active }) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!active || reduce) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = 0
    let H = 0
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    const petals = []

    const resize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const make = () => {
      const c = COLORS[(Math.random() * COLORS.length) | 0]
      return {
        x: -30 + Math.random() * (W + 60),
        y: -20 - Math.random() * 80,
        len: 10 + Math.random() * 9,
        wid: 6 + Math.random() * 5,
        color: c[0],
        edge: c[1],
        vy: 26 + Math.random() * 34,
        sway: 16 + Math.random() * 30,
        swayF: 0.6 + Math.random() * 0.9,
        phase: Math.random() * 6.28,
        rot: Math.random() * 6.28,
        vr: -1.2 + Math.random() * 2.4,
        alpha: 0.55 + Math.random() * 0.35,
      }
    }

    const target = () => Math.max(14, Math.min(40, Math.round(W / 28)))
    for (let i = 0; i < target(); i++) {
      const p = make()
      p.y = Math.random() * H
      petals.push(p)
    }

    const draw = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.beginPath()
      ctx.moveTo(0, -p.len * 0.5)
      ctx.quadraticCurveTo(p.wid * 0.6, -p.len * 0.08, 0, p.len * 0.5)
      ctx.quadraticCurveTo(-p.wid * 0.6, -p.len * 0.08, 0, -p.len * 0.5)
      ctx.closePath()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.fill()
      ctx.globalAlpha = p.alpha * 0.5
      ctx.strokeStyle = p.edge
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.restore()
      ctx.globalAlpha = 1
    }

    let raf = 0
    let last = performance.now()
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, W, H)
      if (petals.length < target() && Math.random() < 0.3) petals.push(make())
      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i]
        p.y += p.vy * dt
        p.x += Math.sin(now * 0.001 * p.swayF + p.phase) * p.sway * dt
        p.rot += p.vr * dt
        if (p.y > H + 30 || p.x < -70 || p.x > W + 70) {
          petals.splice(i, 1)
          continue
        }
        draw(p)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, reduce])

  if (!active || reduce) return null
  return <canvas ref={canvasRef} className="petals" aria-hidden="true" />
}
