import { useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { content } from '../data/content.jsx'

export default function Nav() {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  const lastY = useRef(0)
  const direction = useRef('up')

  useMotionValueEvent(scrollY, 'change', (v) => {
    const diff = v - lastY.current

    // only flip direction after a 10px threshold to avoid jitter
    if (diff > 10) direction.current = 'down'
    else if (diff < -10) direction.current = 'up'

    lastY.current = v

    // show when: past the hero AND scrolling up
    // hide when: scrolling down OR still inside the hero
    setShow(v > 440 && direction.current === 'up')
  })

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
