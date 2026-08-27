import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Phone, Lock, Sparkles, Scale, Home } from 'lucide-react'
import { content } from '../data/content.jsx'
import { useSound } from '../sound/SoundProvider.jsx'
import SectionHeading from './SectionHeading.jsx'

const ICONS = {
  shield: Shield,
  phone: Phone,
  lock: Lock,
  star: Sparkles,
  scale: Scale,
  home: Home,
}

function PromiseCard({ item, index }) {
  const [flipped, setFlipped] = useState(false)
  const sound = useSound()
  const Icon = ICONS[item.icon]

  const flip = () => {
    setFlipped((f) => !f)
    sound.bell(flipped ? 659.25 : 880, 0.5, 0.03)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.12 }}
      whileHover={{ y: -6 }}
    >
      <div
        className="pcard"
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${item.title}. Tap to reveal the promise.`}
        onClick={flip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            flip()
          }
        }}
      >
        <motion.div
          className="pcard-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: [0.3, 0.9, 0.3, 1] }}
        >
          <div className="pface pfront">
            <div className="icon-blob">
              <Icon size={28} />
            </div>
            <div className="tt">{item.title}</div>
            <div className="hint">tap to flip</div>
          </div>
          <div className="pface pback">
            <p className="vow">{item.vow}</p>
            <p className="txt">{item.text}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function PromiseCards() {
  return (
    <section className="section" id="promises" style={{ background: 'linear-gradient(180deg, transparent, rgba(255,241,222,.7) 30%, rgba(255,241,222,.7) 70%, transparent)' }}>
      <div className="container">
        <SectionHeading
          kicker={content.promises.kicker}
          title={content.promises.title}
          lead={content.promises.lead}
        />
        <div className="grid-3">
          {content.promises.items.map((p, i) => (
            <PromiseCard key={p.title} item={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
