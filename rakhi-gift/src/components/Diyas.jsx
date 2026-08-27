import { useEffect, useId, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { content } from '../data/content.jsx'
import { useSound } from '../sound/SoundProvider.jsx'
import SectionHeading from './SectionHeading.jsx'

/* Fireworks canvas, active for a while once all diyas are lit. */
function Fireworks({ active }) {
  const canvasRef = useRef(null)
  const reduce = useReducedMotion()
  const sound = useSound()

  useEffect(() => {
    if (!active || reduce) return
    const canvas = canvasRef.current
    const parent = canvas.parentElement
    const ctx = canvas.getContext('2d')
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    const PAL = ['#ffdf8e', '#ff5d73', '#ffa03c', '#fff2c8', '#e9b949']

    let W = 0
    let H = 0
    const size = () => {
      W = parent.clientWidth
      H = parent.clientHeight
      canvas.width = W * DPR
      canvas.height = H * DPR
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    }
    size()
    window.addEventListener('resize', size)

    const parts = []
    const rockets = []
    const endAt = performance.now() + 13000
    let nextLaunch = 0
    let raf = 0
    let last = performance.now()
    let stopped = false

    const explode = (x, y) => {
      const col = PAL[(Math.random() * PAL.length) | 0]
      const n = 80
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 50 + Math.random() * 280
        parts.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          size: 1.4 + Math.random() * 1.2,
          color: Math.random() < 0.25 ? '#fff6e3' : col,
          age: 0,
          life: 1.1 + Math.random() * 1.2,
          tw: 6 + Math.random() * 7,
        })
      }
    }

    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      ctx.clearRect(0, 0, W, H)

      if (now < endAt && now > nextLaunch) {
        rockets.push({
          x: W * (0.12 + Math.random() * 0.76),
          y: H + 8,
          vx: -18 + Math.random() * 36,
          vy: -(H * (0.5 + Math.random() * 0.28)) * 0.9,
          py: H + 8,
          px: 0,
          sx: 0,
        })
        nextLaunch = now + 380 + Math.random() * 400
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.px = r.x
        r.py = r.y
        r.vy += 230 * dt
        r.x += r.vx * dt
        r.y += r.vy * dt
        ctx.globalCompositeOperation = 'lighter'
        ctx.strokeStyle = '#ffdf8e'
        ctx.lineWidth = 2.4
        ctx.globalAlpha = 0.9
        ctx.beginPath()
        ctx.moveTo(r.px, r.py)
        ctx.lineTo(r.x, r.y)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        if (r.vy > -46) {
          rockets.splice(i, 1)
          explode(r.x, r.y)
          sound.crackle()
        }
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.age += dt
        if (p.age >= p.life) {
          parts.splice(i, 1)
          continue
        }
        const k = 1 - p.age / p.life
        p.vy += 85 * dt
        p.vx *= Math.exp(-1.4 * dt)
        p.vy *= Math.exp(-0.4 * dt)
        const ox = p.x
        const oy = p.y
        p.x += p.vx * dt
        p.y += p.vy * dt
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = (0.45 + 0.55 * Math.abs(Math.sin(p.age * p.tw))) * k
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.size
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }

      if (!stopped && (now > endAt || !document.body.contains(canvas))) {
        // keep rendering until particles fade out
        if (now > endAt && parts.length === 0 && rockets.length === 0) {
          stopped = true
          ctx.clearRect(0, 0, W, H)
          raf = 0
          return
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', size)
    }
  }, [active, reduce, sound])

  if (!active || reduce) return null
  return <canvas ref={canvasRef} className="fw-canvas" aria-hidden="true" />
}

function Diya({ index, lit, onLight }) {
  const uid = (useId() || '').replace(/[^a-zA-Z0-9]/g, '')
  return (
    <button
      className={`diya ${lit ? 'lit' : ''}`}
      onClick={() => onLight(index)}
      aria-label={`Light diya ${index + 1}`}
      aria-pressed={lit}
    >
      <svg viewBox="0 0 120 110">
        <defs>
          <radialGradient id={`dg${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="rgba(255,214,120,.55)" />
            <stop offset="1" stopColor="rgba(255,214,120,0)" />
          </radialGradient>
          <linearGradient id={`fl${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffe9ad" />
            <stop offset="0.6" stopColor="#ffb03a" />
            <stop offset="1" stopColor="#e58a1f" />
          </linearGradient>
        </defs>

        <motion.ellipse
          cx="60" cy="44" rx="46" ry="38"
          fill={`url(#dg${uid})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: lit ? 0.95 : 0 }}
          transition={{ duration: 1 }}
        />

        <motion.g
          initial={{ scale: 0 }}
          animate={{ scale: lit ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 15 }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        >
          <path d="M60 20 C71 35 72 52 60 63 C48 52 49 35 60 20 Z" fill={`url(#fl${uid})`} />
          <motion.path
            d="M60 32 C66 41 66 49 60 55 C54 49 54 41 60 32 Z"
            fill="#fff7de"
            animate={lit ? { scale: [1, 1.08, 0.94, 1], rotate: [0, -2, 2, 0] } : { scale: 1 }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
          />
        </motion.g>

        <path
          d="M14 62 Q 24 70 60 71 Q 96 70 106 62 Q 96 86 60 88 Q 24 86 14 62 Z"
          fill="#b4562f" stroke="#7e3317" strokeWidth="2"
        />
        <path d="M14 62 Q 24 70 60 71 Q 96 70 106 62" fill="none" stroke="#e9b949" strokeWidth="2" opacity="0.85" />
        <circle cx="42" cy="76" r="2.4" fill="#e9b949" />
        <circle cx="60" cy="79" r="2.4" fill="#e9b949" />
        <circle cx="78" cy="76" r="2.4" fill="#e9b949" />
      </svg>
    </button>
  )
}

export default function Diyas() {
  const sound = useSound()
  const [lit, setLit] = useState([])
  const allLit = lit.length === 5
  const firedRef = useRef(false)

  const onLight = (i) => {
    if (lit.includes(i)) return
    setLit((prev) => [...prev, i])
    sound.bell(523.25 * Math.pow(1.122, i * 2), 1.6, 0.055)
  }

  useEffect(() => {
    if (allLit && !firedRef.current) {
      firedRef.current = true
      const t = setTimeout(() => sound.boom(), 650)
      return () => clearTimeout(t)
    }
  }, [allLit, sound])

  const left = 5 - lit.length

  return (
    <section className="section section-night" id="diyas" style={{ overflow: 'hidden' }}>
      <Fireworks active={allLit} />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <SectionHeading kicker={content.diyas.kicker} title={content.diyas.title} lead={content.diyas.lead} />

        <div className="diya-row">
          {[0, 1, 2, 3, 4].map((i) => (
            <Diya key={i} index={i} lit={lit.includes(i)} onLight={onLight} />
          ))}
        </div>

        <p className="diya-hint center">
          {!allLit ? (lit.length === 0 ? content.diyas.hint : content.diyas.left(left)) : `✨ ${content.diyas.allLit} ✨`}
        </p>

        <AnimatePresence>
          {allLit && (
            <motion.div
              className="finale"
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.5 }}
            >
              <h3>🌙 {content.diyas.finale.title}</h3>
              <p>
                {content.diyas.finale.text}
                <span className="sign">{content.diyas.finale.sign}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
