import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import { content } from '../data/content.jsx'
import { useSound } from '../sound/SoundProvider.jsx'
import SectionHeading from './SectionHeading.jsx'

const lineVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.35 + i * 0.16, duration: 0.6 },
  }),
}

export default function Letter() {
  const sound = useSound()
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState(false)

  // a tiny preview of the real letter, shown on the card as it rises out
  const salut = content.letter.lines.find((l) => l.type === 'salut')
  const previewParas = content.letter.lines.filter((l) => l.type === 'para').slice(0, 2)

  const openEnvelope = () => {
    if (open) {
      // tap on an open envelope puts it back to its sealed state
      resetAll()
      return
    }
    setOpen(true)
    sound.bell(392, 0.9, 0.05)
    sound.bell(523.25, 0.9, 0.05, 0.16)
    setTimeout(() => setModal(true), 1050)
  }

  // closing the letter also reseals the envelope, back to how it was
  const resetAll = () => {
    setModal(false)
    setOpen(false)
  }

  useEffect(() => {
    if (!modal) return
    const onKey = (e) => {
      if (e.key === 'Escape') resetAll()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  return (
    <section className="section" id="letter">
      <div className="container center">
        <SectionHeading kicker={content.letter.kicker} title={content.letter.title} lead={content.letter.lead} />

        <motion.div
          className="env-wrap"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7 }}
          onClick={openEnvelope}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openEnvelope()
            }
          }}
          aria-label="Open the letter"
          whileHover={{ scale: 1.03, rotate: -1 }}
        >
          <div className="env">
            <div className="env-back" />
            <motion.div
              className="env-letter"
              animate={open ? { y: -96, rotate: -1.5 } : { y: 0, rotate: 0 }}
              transition={{ delay: open ? 0.45 : 0, type: 'spring', stiffness: 120, damping: 16 }}
            >
              <div className="letter-preview">
                {salut && <p className="lp-salut">{salut.text}</p>}
                {previewParas.map((l) => (
                  <p className="lp-line" key={l.text.slice(0, 12)}>
                    {l.text}
                  </p>
                ))}
              </div>
            </motion.div>
            <div className="env-front" />
            <motion.div
              className="env-flap"
              style={{ transformOrigin: 'top center', zIndex: open ? 1 : 4 }}
              animate={{ rotateX: open ? 178 : 0 }}
              transition={{ type: 'spring', stiffness: 110, damping: 17 }}
            />
            <motion.div
              className="seal"
              animate={open ? { opacity: 0, scale: 0.3, rotate: 40 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.45 }}
            >
              <Heart size={20} fill="currentColor" />
            </motion.div>
          </div>
          <p className="env-hint">{open ? content.letter.hintOpen : content.letter.hint}</p>
        </motion.div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target.classList.contains('overlay')) resetAll()
            }}
            role="dialog"
            aria-modal="true"
            aria-label="A letter for you"
          >
            <motion.div
              className="paper"
              initial={{ y: 48, scale: 0.95, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 30, scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <button className="close-x" onClick={resetAll} aria-label="Close letter">
                <X size={17} />
              </button>
              <svg className="orn" viewBox="0 0 180 30" aria-hidden="true">
                <g fill="none" stroke="#a80f43" strokeWidth="1.3" opacity="0.75">
                  <path d="M8 15 H 66" />
                  <path d="M114 15 H 172" />
                  <circle cx="80" cy="15" r="3" />
                  <circle cx="100" cy="15" r="3" />
                  <path d="M90 3 L 97.5 15 L 90 27 L 82.5 15 Z" />
                </g>
              </svg>
              {content.letter.lines.map((l, i) => (
                <motion.p key={i} className={`ln ${l.type}`} custom={i} variants={lineVariants} initial="hidden" animate="show">
                  {l.text}
                  {l.small && <small>{l.small}</small>}
                </motion.p>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
