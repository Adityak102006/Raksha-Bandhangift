import { motion } from 'framer-motion'

export default function SectionHeading({ kicker, title, lead }) {
  return (
    <div className="center">
      <motion.p
        className="kicker"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6 }}
      >
        {kicker}
      </motion.p>
      <motion.h2
        className="sec-title"
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.7, delay: 0.08 }}
      >
        {title}
      </motion.h2>
      <motion.svg
        width="260"
        height="24"
        viewBox="0 0 260 24"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
        style={{ display: 'block', margin: '20px auto 0' }}
      >
        <g fill="none" stroke="#c9a227" strokeWidth="1.5" opacity="0.85">
          <path d="M10 12 H 96" />
          <path d="M164 12 H 250" />
          <circle cx="122" cy="12" r="3.5" fill="#c9a227" />
          <circle cx="138" cy="12" r="3.5" fill="#c9a227" />
          <path d="M130 2 L 137 12 L 130 22 L 123 12 Z" />
        </g>
      </motion.svg>
      {lead && (
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7, delay: 0.16 }}
        >
          {lead}
        </motion.p>
      )}
    </div>
  )
}
