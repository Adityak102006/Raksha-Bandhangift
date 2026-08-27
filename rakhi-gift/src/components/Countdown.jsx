import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { content } from '../data/content.jsx'

// Raksha Bandhan 2026: 28 August, local time.
const TARGET = new Date(2026, 7, 28)
const END = new Date(2026, 7, 29)

const pad = (n) => (n < 10 ? '0' : '') + n

export default function Countdown() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  if (now >= TARGET && now < END) {
    return (
      <div>
        <span className="cd-today">{content.countdown.today}</span>
      </div>
    )
  }
  if (now >= END) {
    return (
      <div>
        <span className="cd-today">{content.countdown.after}</span>
      </div>
    )
  }

  const diff = TARGET - now
  const s = Math.floor(diff / 1000)
  const values = [
    Math.floor(s / 86400),
    Math.floor((s % 86400) / 3600),
    Math.floor((s % 3600) / 60),
    s % 60,
  ]

  return (
    <div>
      <div className="cd">
        {values.map((v, i) => (
          <div className="cd-cell" key={content.countdown.labels[i]}>
            <span className="cd-slot">
              <AnimatePresence initial={false}>
                <motion.span
                  key={v}
                  className="cd-num"
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  {pad(v)}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="cd-lab">{content.countdown.labels[i]}</span>
          </div>
        ))}
      </div>
      <p className="hero-note" style={{ marginTop: 12 }}>
        {content.countdown.until}
      </p>
    </div>
  )
}
