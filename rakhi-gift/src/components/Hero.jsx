import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MousePointerClick } from 'lucide-react'
import { content } from '../data/content.jsx'
import Countdown from './Countdown.jsx'
import RakhiArt from './RakhiArt.jsx'

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.15 } },
}
const letterVariant = {
  hidden: { y: 46, opacity: 0, rotate: 6 },
  show: { y: 0, opacity: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
}

export default function Hero({ show }) {
  const { scrollY } = useScroll()
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 921px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 921px)')
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // the floating art drifts slightly on scroll, desktop only
  const artY = useTransform(scrollY, [0, 700], [0, isDesktop ? 60 : 0])

  return (
    <header className="hero" id="home">
      <div className="container hero-grid">
        <div>
          <motion.span
            className="hero-badge"
            initial={{ opacity: 0, y: 14 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            🪢 {content.hero.badge}
          </motion.span>

          <p className="hero-script script">
            <motion.span
              className="wide"
              initial={{ opacity: 0, y: 18 }}
              animate={show ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.05 }}
              style={{ display: 'block' }}
            >
              {content.hero.script}
            </motion.span>
          </p>

          <motion.h1
            className="display hero-title"
            variants={titleContainer}
            initial="hidden"
            animate={show ? 'show' : 'hidden'}
            aria-label={content.hero.title}
          >
            {content.hero.title.split('').map((ch, i) => (
              <motion.span
                key={i}
                className="L"
                variants={letterVariant}
                aria-hidden="true"
              >
                {ch === ' ' ? '\u00A0' : ch}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 22 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Dear Sister, one thread holds a thousand memories, and a lifetime of{' '}
            <em>love and protection</em>. This little corner of the internet was built only for you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Countdown />
          </motion.div>

          <motion.div
            className="hero-cta"
            initial={{ opacity: 0, y: 22 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.05 }}
          >
            <a className="btn btn-primary" href="#ritual">
              {content.hero.ctaPrimary} 🪢
            </a>
            <a className="btn btn-ghost" href="#letter">
              {content.hero.ctaSecondary} 💌
            </a>
          </motion.div>

          <motion.p
            className="hero-note"
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <MousePointerClick size={15} /> {content.hero.note}
          </motion.p>
        </div>

        <div className="hero-art">
          <div className="hero-blob" />
          <motion.div style={{ y: artY }}>
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-1.2, 1.2, -1.2] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <RakhiArt className="hero-rak" />
            </motion.div>
          </motion.div>
          {[
            { top: '12%', left: '16%', d: 0 },
            { top: '64%', left: '6%', d: 0.9 },
            { top: '8%', left: '74%', d: 1.6 },
            { top: '78%', left: '82%', d: 0.4 },
          ].map((s, i) => (
            <motion.span
              key={i}
              className="hero-spark"
              style={{ top: s.top, left: s.left }}
              animate={{ opacity: [0.15, 1, 0.15], scale: [0.8, 1.15, 0.8] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: s.d, ease: 'easeInOut' }}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
              </svg>
            </motion.span>
          ))}
        </div>
      </div>

      <motion.div
        className="scroll-cue"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.9, duration: 1 }}
      >
        <span>scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} />
        </motion.span>
      </motion.div>
    </header>
  )
}
