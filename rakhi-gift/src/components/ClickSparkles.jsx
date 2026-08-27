import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Tiny gold sparks wherever she taps. Pure delight, zero purpose.
export default function ClickSparkles() {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let W = window.innerWidth
    let H = window.innerHeight
    const size = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    size()
    window.addEventListener('resize', size)

    const parts = []
    let raf = 0
    let last = 0
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016)
      last = now
      ctx.clearRect(0, 0, W, H)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.age += dt
        if (p.age >= p.life) {
          parts.splice(i, 1)
          continue
        }
        const k = 1 - p.age / p.life
        p.vy += 260 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = k
        ctx.fillStyle = '#e9b949'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * k + 0.4, 0, 6.283)
        ctx.fill()
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }
      raf = parts.length ? requestAnimationFrame(loop) : 0
    }

    const onDown = (e) => {
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 40 + Math.random() * 210
        parts.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 30,
          size: 1.2 + Math.random() * 1.7,
          age: 0,
          life: 0.4 + Math.random() * 0.5,
        })
      }
      if (!raf) {
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }
    window.addEventListener('pointerdown', onDown, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('resize', size)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  if (reduce) return null
  return <canvas ref={canvasRef} className="click-sparks" aria-hidden="true" />
}
