import { motion, useScroll, useSpring } from 'framer-motion'

// The rakhi thread of progress across the top of the page.
export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })
  return (
    <div className="progress" aria-hidden="true">
      <motion.div className="progress-fill" style={{ scaleX }} />
    </div>
  )
}
