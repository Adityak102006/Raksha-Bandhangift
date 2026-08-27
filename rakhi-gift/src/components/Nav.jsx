import { useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { content } from '../data/content.jsx'

export default function Nav() {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (v) => setShow(v > 440))

  return (
    <AnimatePresence>
      {show && (
        <motion.nav
          className="nav"
          /* x is animated by framer so the -50% centering never gets wiped out */
          initial={{ y: -80, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: -80, x: '-50%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
          aria-label="Sections"
        >
          {content.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
