import { motion } from 'framer-motion'
import { content } from '../data/content.jsx'
import { useSound } from '../sound/SoundProvider.jsx'

// The opening curtain: a mauli thread draws itself across the night,
// beads pop along it, then an invitation.
export default function Intro({ onEnter }) {
  const sound = useSound()

  const enter = () => {
    sound.setEnabled(true)
    sound.arp([392, 494, 587.33, 783.99], 0.12, 0.05)
    onEnter()
  }

  return (
    <motion.div
      className="intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -60, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } }}
    >
      <div className="intro-inner">
        <svg width="min(86vw, 560px)" viewBox="0 0 700 130" aria-hidden="true">
          <defs>
            <linearGradient id="introThread" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#d81e5b" />
              <stop offset="0.5" stopColor="#e9b949" />
              <stop offset="1" stopColor="#d81e5b" />
            </linearGradient>
          </defs>
          <motion.path
            d="M-20 74 L 130 32 L 265 96 L 400 34 L 535 96 L 670 44 L 720 70"
            fill="none"
            stroke="url(#introThread)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.6, delay: 0.2, ease: 'easeInOut' }}
          />
          {[
            [130, 32, '#e9b949'],
            [265, 96, '#ff5d73'],
            [400, 34, '#e9b949'],
            [535, 96, '#ff5d73'],
            [670, 44, '#e9b949'],
          ].map(([cx, cy, fill], i) => (
            <motion.circle
              key={i}
              cx={cx}
              cy={cy}
              r={i % 2 ? 5 : 6}
              fill={fill}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 + i * 0.14, type: 'spring', stiffness: 380, damping: 14 }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}
        </svg>

        <motion.p
          className="intro-for"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.8 }}
        >
          {content.intro.forLine}
        </motion.p>
        <motion.h1
          className="intro-name"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.8 }}
        >
          {content.sisterLabel}
        </motion.h1>

        <motion.button
          className="btn btn-gold"
          onClick={enter}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.6, duration: 0.7 }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          🪢 {content.intro.button}
        </motion.button>

        <motion.p
          className="intro-foot"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.1, duration: 1 }}
        >
          {content.intro.foot}
        </motion.p>
      </div>
    </motion.div>
  )
}
