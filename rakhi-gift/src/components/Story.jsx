import { useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { content } from '../data/content.jsx'
import SectionHeading from './SectionHeading.jsx'

// The mauli thread on the timeline fills itself as she scrolls the story,
// and each chapter bead lights up when it enters the viewport.
function Chapter({ ch, index }) {
  const [lit, setLit] = useState(false)
  const left = index % 2 === 0

  return (
    <motion.div
      className={`tl-item ${left ? 'left' : 'right'} ${lit ? 'lit' : ''}`}
      initial={{ opacity: 0, x: left ? -44 : 44 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      onViewportEnter={() => setLit(true)}
    >
      <motion.span
        className="tl-dot"
        animate={lit ? { scale: [1, 1.5, 1.15] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        aria-hidden="true"
      />
      <div className="tl-card">
        <p className="tl-num">{ch.n}</p>
        <h3>{ch.t}</h3>
        <p>{ch.d}</p>
      </div>
    </motion.div>
  )
}

export default function Story() {
  const tlRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: tlRef,
    offset: ['start 0.82', 'end 0.55'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 22 })

  return (
    <section className="section" id="story">
      <div className="container">
        <SectionHeading kicker={content.story.kicker} title={content.story.title} lead={content.story.lead} />

        <div className="tl" ref={tlRef}>
          <div className="tl-track" aria-hidden="true">
            <motion.div className="tl-fill" style={{ scaleY }} />
          </div>
          {content.story.chapters.map((ch, i) => (
            <Chapter key={ch.t} ch={ch} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
