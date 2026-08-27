import { motion } from 'framer-motion'
import { content } from '../data/content.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <motion.svg
        width="220"
        height="24"
        viewBox="0 0 220 24"
        aria-hidden="true"
        style={{ display: 'block', margin: '0 auto 16px', opacity: 0.7 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.7 }}
        viewport={{ once: true }}
      >
        <g fill="none" stroke="#a5814f" strokeWidth="1.2">
          <path d="M8 12 H 84" />
          <path d="M136 12 H 212" />
          <circle cx="102" cy="12" r="3" />
          <circle cx="118" cy="12" r="3" />
          <path d="M110 3 L 117 12 L 110 21 L 103 12 Z" />
        </g>
      </motion.svg>
      <p>{content.footer.made}</p>
      <p className="tip">{content.footer.tip}</p>
    </footer>
  )
}
