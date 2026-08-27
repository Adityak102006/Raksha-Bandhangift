import { motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useSound } from '../sound/SoundProvider.jsx'

export default function MusicFab() {
  const sound = useSound()
  return (
    <motion.button
      className={`fab ${sound.enabled ? '' : 'off'}`}
      onClick={sound.toggle}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 18 }}
      title={sound.enabled ? 'Music on, tap to mute' : 'Music off, tap to play'}
      aria-label="Toggle ambient music"
    >
      {sound.enabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  )
}
