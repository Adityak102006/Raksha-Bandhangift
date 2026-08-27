import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Link2, Candy, HeartHandshake } from 'lucide-react'
import { content } from '../data/content.jsx'
import { useSound } from '../sound/SoundProvider.jsx'
import SectionHeading from './SectionHeading.jsx'

const stepIcons = { sparkles: Sparkles, link: Link2, candy: Candy, hands: HeartHandshake }

/* Petal-confetti burst canvas, triggered imperatively at the wrist. */
const BurstCanvas = forwardRef(function BurstCanvas({ className }, ref) {
  const canvasRef = useRef(null)
  const st = useRef({ parts: [], running: false, raf: 0 })
  const COLORS = ['#d81e5b', '#ff7a29', '#ffb03a', '#ffd98e', '#f98da0']

  useEffect(() => {
    const s = st.current
    return () => cancelAnimationFrame(s.raf)
  }, [])

  useImperativeHandle(ref, () => ({
    burst(x, y, n = 32) {
      const c = canvasRef.current
      if (!c) return
      const s = st.current
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = c.clientWidth
      const h = c.clientHeight
      if (w === 0 || h === 0) return
      c.width = w * dpr
      c.height = h * dpr
      const ctx = c.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 120 + Math.random() * 300
        s.parts.push({
          x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 90,
          rot: Math.random() * 6.28,
          vr: -6 + Math.random() * 12,
          len: 7 + Math.random() * 6,
          wid: 4 + Math.random() * 4,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          age: 0,
          life: 1.1 + Math.random() * 0.9,
        })
      }
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2
        const sp = 40 + Math.random() * 220
        s.parts.push({
          spark: true, x, y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 30,
          size: 1.2 + Math.random() * 1.6,
          age: 0,
          life: 0.4 + Math.random() * 0.5,
        })
      }

      if (s.running) return
      s.running = true
      let last = performance.now()
      const loop = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        ctx.clearRect(0, 0, w, h)
        for (let i = s.parts.length - 1; i >= 0; i--) {
          const p = s.parts[i]
          p.age += dt
          if (p.age >= p.life) {
            s.parts.splice(i, 1)
            continue
          }
          const k = 1 - p.age / p.life
          if (p.spark) {
            p.vy += 260 * dt
            p.x += p.vx * dt
            p.y += p.vy * dt
            
            ctx.globalAlpha = k
            ctx.fillStyle = '#ffd98e'
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size * k + 0.4, 0, 6.283)
            ctx.fill()
            
            ctx.globalAlpha = 1
          } else {
            p.vy += 560 * dt
            p.x += p.vx * dt
            p.y += p.vy * dt
            p.vx *= Math.exp(-1.1 * dt)
            p.rot += p.vr * dt
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rot)
            ctx.globalAlpha = Math.min(1, k * 2)
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.moveTo(0, -p.len * 0.5)
            ctx.quadraticCurveTo(p.wid * 0.6, -p.len * 0.08, 0, p.len * 0.5)
            ctx.quadraticCurveTo(-p.wid * 0.6, -p.len * 0.08, 0, -p.len * 0.5)
            ctx.fill()
            ctx.restore()
            ctx.globalAlpha = 1
          }
        }
        if (s.parts.length) {
          s.raf = requestAnimationFrame(loop)
        } else {
          s.running = false
          ctx.clearRect(0, 0, w, h)
        }
      }
      s.raf = requestAnimationFrame(loop)
    },
  }))

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
})

/* Mauli threads that wrap the wrist: rx/ry sized so the band visibly
   curves around a realistic (slimmer) wrist. */
const WRAPS = [
  { rx: 17, ry: 40, rotate: -5, color: '#c2185b' },
  { rx: 19, ry: 43, rotate: 6, color: '#ff9f1c' },
  { rx: 15, ry: 36, rotate: -10, color: '#8e0f35' },
]

/* Finger capsules: [yMid, thickness, length, curlAngle] */
const FINGERS = [
  { y: 208, h: 24, len: 84, a: 6 },
  { y: 233, h: 25, len: 92, a: 9 },
  { y: 257, h: 24, len: 84, a: 12 },
  { y: 279, h: 20, len: 64, a: 18 },
]

export default function Ritual() {
  const sound = useSound()
  const [step, setStep] = useState(0)
  const timers = useRef([])
  const burstRef = useRef(null)
  const stageRef = useRef(null)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms))
  const running = step > 0 && step < 5

  const tie = () => {
    if (running) return
    clearTimers()
    setStep(0)
    later(() => setStep(1), 80)
    later(() => {
      setStep(2)
      sound.arp([330, 415.3, 493.9], 0.1, 0.045)
    }, 1050)
    later(() => {
      setStep(3)
      sound.bell(587.33, 0.7, 0.04)
    }, 2700)
    later(() => {
      setStep(4)
      sound.boom()
      const el = stageRef.current
      const svg = el && el.querySelector('.tie-svg')
      if (svg && burstRef.current) {
        const elR = el.getBoundingClientRect()
        const r = svg.getBoundingClientRect()
        burstRef.current.burst(
          r.left - elR.left + r.width * 0.516,
          r.top - elR.top + r.height * 0.517,
          34
        )
      }
    }, 3450)
    later(() => setStep(5), 4350)
  }

  return (
    <section className="section" id="ritual">
      <div className="container">
        <SectionHeading kicker={content.ritual.kicker} title={content.ritual.title} lead={content.ritual.lead} />

        <div className="meaning-row">
          {content.meaning.map((m, i) => (
            <motion.div
              key={m.deva}
              className="meaning-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.6, delay: i * 0.14 }}
            >
              <div className="deva">{m.deva}</div>
              <div className="roman script">{m.roman}</div>
              <div className="word">{m.word}</div>
              <p className="note">{m.note}</p>
            </motion.div>
          ))}
        </div>

        <div className="chips">
          {content.ritual.steps.map((s, i) => {
            const Icon = stepIcons[s.icon]
            return (
              <motion.span
                key={s.label}
                className="chip"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 18 }}
              >
                <Icon size={16} /> {s.label}
              </motion.span>
            )
          })}
        </div>

        <motion.div
          className="panel"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mantra">
            <span className="q q1">&ldquo;</span>
            <p className="dv" lang="hi">
              {content.ritual.mantra.dv.map((l, i) => (
                <span key={i} style={{ display: 'block' }}>
                  {l}
                </span>
              ))}
            </p>
            <p className="tr">{content.ritual.mantra.tr}</p>
            <span className="q q2">&rdquo;</span>
          </div>

          <div className="tie-stage" ref={stageRef}>
            <BurstCanvas ref={burstRef} className="burst-canvas" />
            <svg
              className="tie-svg"
              viewBox="0 0 640 460"
              role="img"
              aria-label="A rakhi being tied on a brother's wrist"
            >
              <defs>
                <radialGradient id="tieGlowGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="rgba(255, 223, 142, 0.5)" />
                  <stop offset="1" stopColor="rgba(255, 223, 142, 0)" />
                </radialGradient>
                <linearGradient id="kurtaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0e7c66" />
                  <stop offset="1" stopColor="#0a5c4c" />
                </linearGradient>
                <radialGradient id="tieCenter" cx="35%" cy="30%" r="85%">
                  <stop offset="0" stopColor="#ff8fb1" />
                  <stop offset="0.55" stopColor="#d81e5b" />
                  <stop offset="1" stopColor="#8e0f35" />
                </radialGradient>
                <linearGradient id="tieGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#ffe9ad" />
                  <stop offset="0.5" stopColor="#e9b949" />
                  <stop offset="1" stopColor="#c9a227" />
                </linearGradient>
                <linearGradient id="tieSilk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#e03060" />
                  <stop offset="1" stopColor="#a80f43" />
                </linearGradient>

                {/* skin */}
                <linearGradient id="skinFore" x1="0" y1="186" x2="0" y2="292" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffdcb0" />
                  <stop offset="0.5" stopColor="#f3c295" />
                  <stop offset="1" stopColor="#d79a67" />
                </linearGradient>
                <linearGradient id="skinHand" x1="0" y1="186" x2="0" y2="302" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffdcb0" />
                  <stop offset="0.55" stopColor="#f2c08e" />
                  <stop offset="1" stopColor="#d29264" />
                </linearGradient>
                <radialGradient id="nailG" cx="35%" cy="30%" r="85%">
                  <stop offset="0" stopColor="#ffe9d6" />
                  <stop offset="1" stopColor="#dfaa7f" />
                </radialGradient>
                <filter id="softBlur" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="2.6" />
                </filter>
              </defs>

              <motion.ellipse
                cx="330" cy="232" rx="150" ry="115"
                fill="url(#tieGlowGrad)"
                initial={{ opacity: 0 }}
                animate={step >= 4 ? { opacity: [0.25, 0.6, 0.25] } : { opacity: 0 }}
                transition={step >= 4 ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
              />

              {/* ---------- the hand and forearm ---------- */}
              <motion.g
                initial={{ x: 180, opacity: 0 }}
                animate={step >= 1 ? { x: 0, opacity: 1 } : { x: 180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 55, damping: 13 }}
              >
                {/* soft shadow beneath the arm */}
                <ellipse cx="340" cy="318" rx="160" ry="13" fill="rgba(15,5,18,0.4)" filter="url(#softBlur)" />

                {/* forearm, tapering toward the wrist */}
                <path
                  d="M484 192 C 448 186, 414 189, 386 196 C 366 201, 352 206, 345 210 L 345 262 C 354 268, 372 275, 394 280 C 424 287, 458 285, 484 279 Z"
                  fill="url(#skinFore)"
                />

                {/* back of the hand */}
                <path
                  d="M352 206 C 332 196, 308 190, 286 189 C 266 188, 250 193, 243 203 C 238 211, 236 224, 238 238 C 240 258, 246 276, 256 287 C 266 296, 284 297, 300 293 C 318 288, 334 279, 345 267 C 352 259, 354 244, 353 230 C 352 220, 352 212, 352 206 Z"
                  fill="url(#skinHand)"
                />

                {/* tendons on the back of the hand */}
                <g stroke="rgba(150,85,40,0.14)" fill="none" strokeLinecap="round">
                  <path d="M348 214 C 320 208, 288 204, 258 202" strokeWidth="5" />
                  <path d="M348 228 C 318 224, 286 222, 256 222" strokeWidth="5" />
                  <path d="M348 242 C 320 240, 292 240, 260 242" strokeWidth="4" opacity="0.7" />
                </g>

                {/* four fingers, slightly curled, layered bottom to top */}
                {FINGERS.map((f, i) => (
                  <g key={i} transform={`rotate(${f.a} 244 ${f.y})`}>
                    <rect
                      x={244 - f.len}
                      y={f.y - f.h / 2}
                      width={f.len}
                      height={f.h}
                      rx={f.h / 2}
                      fill="url(#skinHand)"
                      stroke="rgba(140,75,35,0.25)"
                      strokeWidth="1"
                    />
                    <path
                      d={`M${244 - f.len * 0.42} ${f.y - f.h / 2 + 3} Q ${244 - f.len * 0.42 - 3} ${f.y}, ${244 - f.len * 0.42} ${f.y + f.h / 2 - 3}`}
                      fill="none"
                      stroke="rgba(150,85,40,0.35)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M${244 - f.len * 0.75} ${f.y - f.h / 2 + 3.5} Q ${244 - f.len * 0.75 - 2.5} ${f.y}, ${244 - f.len * 0.75} ${f.y + f.h / 2 - 3.5}`}
                      fill="none"
                      stroke="rgba(150,85,40,0.25)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <ellipse
                      cx={244 - f.len + 11}
                      cy={f.y}
                      rx={7}
                      ry={f.h / 2 - 3.5}
                      fill="rgba(255,240,212,0.22)"
                    />
                  </g>
                ))}

                {/* crevice shadows between the fingers */}
                <g filter="url(#softBlur)">
                  <ellipse cx="243" cy="220.5" rx="11" ry="3.4" fill="rgba(140,75,35,0.35)" />
                  <ellipse cx="242" cy="245" rx="11" ry="3.4" fill="rgba(140,75,35,0.35)" />
                  <ellipse cx="241" cy="268" rx="10" ry="3.2" fill="rgba(140,75,35,0.32)" />
                </g>

                {/* thumb resting beside the hand */}
                <path
                  d="M298 266 C 284 266, 268 271, 254 280 C 241 288, 230 298, 225 306 C 221 313, 224 321, 232 322 C 240 323, 250 315, 262 306 C 275 296, 288 286, 295 277 C 299 272, 300 268, 298 266 Z"
                  fill="url(#skinHand)"
                  stroke="rgba(140,75,35,0.22)"
                  strokeWidth="1"
                />
                <path
                  d="M262 282 C 254 292, 248 300, 244 307"
                  fill="none"
                  stroke="rgba(150,85,40,0.3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="233" cy="312" rx="8.5" ry="6.5"
                  transform="rotate(-38 233 312)"
                  fill="url(#nailG)"
                  stroke="rgba(150,85,40,0.4)"
                  strokeWidth="1"
                />

                {/* wrist creases and bone */}
                <path
                  d="M316 200 C 311 220, 311 246, 317 264"
                  fill="none"
                  stroke="rgba(150,85,40,0.28)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M331 202 C 327 222, 327 246, 332 262"
                  fill="none"
                  stroke="rgba(150,85,40,0.2)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="352" cy="209" r="4.5" fill="rgba(255,240,212,0.45)" filter="url(#softBlur)" />

                {/* soft light and shade over the whole arm */}
                <ellipse cx="424" cy="199" rx="52" ry="7" fill="rgba(255,240,212,0.5)" filter="url(#softBlur)" transform="rotate(-3 424 199)" />
                <ellipse cx="416" cy="281" rx="58" ry="9" fill="rgba(150,85,45,0.28)" filter="url(#softBlur)" />
                <ellipse cx="296" cy="197" rx="38" ry="7" fill="rgba(255,240,212,0.4)" filter="url(#softBlur)" />
                <ellipse cx="288" cy="290" rx="40" ry="9" fill="rgba(150,85,45,0.28)" filter="url(#softBlur)" />

                {/* kurta sleeve and cuff */}
                <ellipse cx="480" cy="236" rx="15" ry="52" fill="rgba(90,45,25,0.4)" filter="url(#softBlur)" />
                <rect x="474" y="168" width="180" height="144" rx="26" fill="url(#kurtaGrad)" stroke="#c9a227" strokeWidth="3" />
                <rect x="482" y="172" width="12" height="136" rx="5" fill="url(#tieGold)" />
                <circle cx="562" cy="240" r="27" fill="none" stroke="#c9a227" strokeWidth="2" opacity="0.85" />
                <circle cx="562" cy="240" r="14" fill="#a80f43" />
              </motion.g>

              {/* mauli threads wrapping the wrist (drawn as the rakhi lands) */}
              {WRAPS.map((w, i) => (
                <motion.ellipse
                  key={i}
                  cx="330" cy="230"
                  rx={w.rx} ry={w.ry}
                  transform={`rotate(${w.rotate} 330 230)`}
                  fill="none"
                  stroke={w.color}
                  strokeWidth="7"
                  initial={{ pathLength: 0 }}
                  animate={step >= 3 ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.16, ease: 'easeInOut' }}
                />
              ))}

              {/* the rakhi swings down from above */}
              <motion.g
                initial={{ y: -430 }}
                animate={
                  step >= 2
                    ? { y: [-430, -70, 12, -6, 0], rotate: [0, -10, 7, -3, 0] }
                    : { y: -430 }
                }
                transition={{ duration: 1.5, times: [0, 0.32, 0.58, 0.78, 1], ease: 'easeInOut' }}
                style={{ transformBox: 'view-box', transformOrigin: '330px -80px' }}
              >
                <line x1="330" y1="-80" x2="330" y2="204" stroke="#d81e5b" strokeWidth="3.5" />
                <g transform="translate(330,238)">
                  <rect x="-42" y="-8" width="34" height="16" rx="8" fill="url(#tieSilk)" />
                  <rect x="8" y="-8" width="34" height="16" rx="8" fill="url(#tieSilk)" />
                  <circle r="36" fill="#3a1d33" stroke="url(#tieGold)" strokeWidth="2.5" />
                  <g fill="url(#tieGold)" stroke="#a8741f" strokeWidth="0.7">
                    <path id="tiePetal" d="M0 -31 C 6 -23 6 -14 0 -8 C -6 -14 -6 -23 0 -31 Z" />
                    <use href="#tiePetal" transform="rotate(60)" />
                    <use href="#tiePetal" transform="rotate(120)" />
                    <use href="#tiePetal" transform="rotate(180)" />
                    <use href="#tiePetal" transform="rotate(240)" />
                    <use href="#tiePetal" transform="rotate(300)" />
                  </g>
                  <circle r="21" fill="url(#tieCenter)" stroke="url(#tieGold)" strokeWidth="2.5" />
                  <circle r="8" fill="url(#tieGold)" />
                  <circle r="3" fill="#3a1d33" />
                </g>
              </motion.g>

              {/* the knot, tied at the top of the wrist */}
              <motion.g
                initial={{ scale: 0 }}
                animate={step >= 4 ? { scale: 1 } : { scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              >
                <path d="M0 8 C -13 24 -19 40 -17 54" stroke="#d81e5b" strokeWidth="4" fill="none" transform="translate(330,284)" strokeLinecap="round" />
                <path d="M0 8 C 13 24 19 40 17 54" stroke="#e03060" strokeWidth="4" fill="none" transform="translate(330,284)" strokeLinecap="round" />
                <circle cx="313" cy="340" r="4.5" fill="url(#tieGold)" />
                <circle cx="347" cy="340" r="4.5" fill="url(#tieGold)" />
                <circle cx="330" cy="292" r="9" fill="#d81e5b" stroke="url(#tieGold)" strokeWidth="2" />
              </motion.g>
            </svg>

            <div className="tie-ui">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div key="start" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p className="tie-hint">{content.ritual.tieHint}</p>
                    <button className="btn btn-gold" onClick={tie}>
                      🪢 {content.ritual.tieButton}
                    </button>
                  </motion.div>
                )}
                {running && (
                  <motion.p key="during" className="tie-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {content.ritual.tieHintDuring}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {step >= 5 && (
                  <motion.div
                    className="tie-result"
                    initial={{ opacity: 0, y: 20, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <h3>🪢 {content.ritual.tieResult.title}</h3>
                    <p>
                      {content.ritual.tieResult.text} <em>{content.ritual.tieResult.emph}</em>
                    </p>
                    <button className="btn btn-gold" style={{ marginTop: 18 }} onClick={tie}>
                      {content.ritual.tieResult.replay} 🔄
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
