# Raksha Bandhan Gift 🪢

A small React + Vite website made as a Raksha Bandhan gift for my sister.
Built with framer-motion for the animations and lucide-react for icons.
The soundtrack streams from a YouTube video (hidden looping player) and all
interaction sounds (bells, chimes, firework crackle) are synthesized live
with Web Audio, so there are no audio files to ship. If the video cannot
embed or the network is offline, a generated ambience plays as a fallback.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed localhost URL.

## Build a single file to send her

```bash
npm run build:card
```

This creates `card/index.html`: one self-contained file with everything
bundled inside. Send it on WhatsApp or email, she just opens it in any browser.

## Where to personalize

All text lives in `src/data/content.js`: her name, the letter, the promises,
the story chapters, and the finale message. Colors live in `src/index.css`
under `:root`. No need to touch the components for normal edits.

## Structure

```
src/
  main.jsx            entry point
  App.jsx             page composition
  index.css           design system (palette, fonts, layout)
  data/content.js     every word on the site, in one file
  sound/SoundProvider.jsx   Web Audio synth: chimes + ambient drone
  components/
    Intro.jsx         opening gift overlay
    PetalCanvas.jsx   ambient falling petals
    ClickSparkles.jsx little gold sparks on every tap
    ProgressBar.jsx   scroll progress thread
    Nav.jsx           floating pill navigation
    MusicFab.jsx      sound on/off button
    Hero.jsx          opening section with countdown
    Countdown.jsx     live timer to 28 August 2026
    RakhiArt.jsx      the rakhi illustration
    Ritual.jsx        meaning + interactive "tie the rakhi"
    PromiseCards.jsx  six flip cards
    Story.jsx         scroll-driven mauli timeline
    Letter.jsx        sealed envelope + letter modal
    Diyas.jsx         light five diyas, fireworks finale
    Footer.jsx        credits
```
