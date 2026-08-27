import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { SoundProvider } from './sound/SoundProvider.jsx'
import Intro from './components/Intro.jsx'
import PetalCanvas from './components/PetalCanvas.jsx'
import ClickSparkles from './components/ClickSparkles.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import Nav from './components/Nav.jsx'
import MusicFab from './components/MusicFab.jsx'
import Hero from './components/Hero.jsx'
import Ritual from './components/Ritual.jsx'
import PromiseCards from './components/PromiseCards.jsx'
import Story from './components/Story.jsx'
import Letter from './components/Letter.jsx'
import Diyas from './components/Diyas.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [entered, setEntered] = useState(false)

  // Lock scrolling while the intro curtain is up.
  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [entered])

  return (
    <SoundProvider>
      <AnimatePresence>
        {!entered && <Intro key="intro" onEnter={() => setEntered(true)} />}
      </AnimatePresence>

      <PetalCanvas active={entered} />
      <ClickSparkles />
      <ProgressBar />
      {entered && <Nav />}
      {entered && <MusicFab />}

      <main>
        <Hero show={entered} />
        <Ritual />
        <PromiseCards />
        <Story />
        <Letter />
        <Diyas />
      </main>
      <Footer />
    </SoundProvider>
  )
}
