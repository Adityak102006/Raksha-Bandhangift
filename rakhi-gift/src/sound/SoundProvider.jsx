import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const SoundCtx = createContext(null)

export function useSound() {
  return useContext(SoundCtx)
}

// The soundtrack streams from YouTube (hidden player, on loop).
// Interaction sounds (bells, crackle) are synthesized live with Web Audio.
// If the video cannot embed or there is no network, the synth ambience
// steps in as a fallback so the button always does something musical.
const YT_VIDEO_ID = 'FQCxZrSHzJc'

export function SoundProvider({ children }) {
  const ref = useRef({ ctx: null, master: null, droneGain: null, bellTimer: 0 })
  const yt = useRef({
    player: null,
    apiLoading: false,
    ready: false,
    failed: false,
    wantPlay: false,
    watchTimer: 0,
  })
  const [enabled, setEnabledState] = useState(false)
  const enabledRef = useRef(false)

  /* ---------------- synth engine ---------------- */

  const ensure = useCallback(() => {
    const s = ref.current
    if (s.ctx) {
      if (s.ctx.state === 'suspended') s.ctx.resume()
      return s.ctx
    }
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    try {
      s.ctx = new AC()
      s.master = s.ctx.createGain()
      s.master.gain.value = 0.9
      s.master.connect(s.ctx.destination)
    } catch {
      return null
    }
    return s.ctx
  }, [])

  const bell = useCallback((freq, dur = 1, vol = 0.06, when = 0) => {
    const s = ref.current
    if (!enabledRef.current || !s.ctx) return
    const ctx = s.ctx
    const t = ctx.currentTime + when
    try {
      const g = ctx.createGain()
      g.connect(s.master)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(vol, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
      const o1 = ctx.createOscillator()
      o1.type = 'sine'
      o1.frequency.value = freq
      const o2 = ctx.createOscillator()
      o2.type = 'sine'
      o2.frequency.value = freq * 2.01
      const g2 = ctx.createGain()
      g2.gain.value = 0.25
      o1.connect(g)
      o2.connect(g2)
      g2.connect(g)
      o1.start(t)
      o2.start(t)
      o1.stop(t + dur + 0.1)
      o2.stop(t + dur + 0.1)
    } catch {
      /* audio unavailable, stay silent */
    }
  }, [])

  const arp = useCallback(
    (notes = [392, 494, 587, 784], gap = 0.1, vol = 0.05) => {
      notes.forEach((n, i) => bell(n, 0.9, vol, i * gap))
    },
    [bell]
  )

  const boom = useCallback(() => {
    arp([523.25, 659.25, 783.99, 1046.5], 0.11, 0.06)
    bell(261.63, 2.2, 0.05, 0.1)
  }, [arp, bell])

  const crackle = useCallback(() => {
    const s = ref.current
    if (!enabledRef.current || !s.ctx) return
    try {
      const ctx = s.ctx
      const len = Math.floor(ctx.sampleRate * 0.2)
      const buf = ctx.createBuffer(1, len, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2)
      const src = ctx.createBufferSource()
      src.buffer = buf
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'
      f.frequency.value = 2400
      const g = ctx.createGain()
      g.gain.value = 0.09
      src.connect(f)
      f.connect(g)
      g.connect(s.master)
      src.start()
    } catch {
      /* ignore */
    }
  }, [])

  const startAmbient = useCallback(() => {
    const s = ref.current
    const ctx = ensure()
    if (!ctx || s.bellTimer) return
    try {
      s.droneGain = ctx.createGain()
      s.droneGain.gain.value = 0
      s.droneGain.connect(s.master)
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 320
      lp.connect(s.droneGain)
      ;[110, 164.81].forEach((f, i) => {
        const o = ctx.createOscillator()
        o.type = 'sine'
        o.frequency.value = f
        const g = ctx.createGain()
        g.gain.value = i ? 0.014 : 0.024
        o.connect(g)
        g.connect(lp)
        o.start()
      })
      s.droneGain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 2)
    } catch {
      /* ignore */
    }
    const notes = [523.25, 587.33, 659.25, 783.99, 880]
    s.bellTimer = setInterval(() => {
      if (Math.random() < 0.6) bell(notes[(Math.random() * notes.length) | 0], 2.4, 0.038)
    }, 1900)
  }, [bell, ensure])

  const stopAmbient = useCallback(() => {
    const s = ref.current
    if (s.bellTimer) {
      clearInterval(s.bellTimer)
      s.bellTimer = 0
    }
    if (s.ctx && s.droneGain) {
      try {
        s.droneGain.gain.linearRampToValueAtTime(0.0001, s.ctx.currentTime + 1)
      } catch {
        /* ignore */
      }
    }
  }, [])

  /* ---------------- youtube soundtrack ---------------- */

  const loadYouTubeApi = useCallback(
    () =>
      new Promise((resolve, reject) => {
        if (window.YT && window.YT.Player) {
          resolve()
          return
        }
        const prev = window.onYouTubeIframeAPIReady
        window.onYouTubeIframeAPIReady = () => {
          if (prev) prev()
          resolve()
        }
        if (!document.querySelector('script[data-yt-api]')) {
          const s = document.createElement('script')
          s.src = 'https://www.youtube.com/iframe_api'
          s.dataset.ytApi = '1'
          s.onerror = () => reject(new Error('api script failed'))
          document.head.appendChild(s)
        }
        setTimeout(() => {
          if (!(window.YT && window.YT.Player)) reject(new Error('api timeout'))
        }, 4500)
      }),
    []
  )

  const startSoundtrack = useCallback(() => {
    const y = yt.current
    if (y.failed) {
      startAmbient()
      return
    }
    y.wantPlay = true

    // if the player never becomes playable, fall back to the synth ambience
    clearTimeout(y.watchTimer)
    y.watchTimer = setTimeout(() => {
      if (!y.ready && y.wantPlay) {
        y.failed = true
        startAmbient()
      }
    }, 5500)

    const ensurePlayer = () => {
      if (!y.player) {
        y.player = new window.YT.Player('yt-music-host', {
          videoId: YT_VIDEO_ID,
          playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1,
            playlist: YT_VIDEO_ID, // required for loop to work
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (e) => {
              y.ready = true
              clearTimeout(y.watchTimer)
              try {
                e.target.setVolume(55)
              } catch {
                /* ignore */
              }
              stopAmbient() // in case the synth fallback had kicked in
              if (y.wantPlay) e.target.playVideo()
            },
            onStateChange: (e) => {
              if (window.YT && e.data === window.YT.PlayerState.ENDED) {
                try {
                  e.target.seekTo(0)
                  e.target.playVideo()
                } catch {
                  /* ignore */
                }
              }
            },
            onError: () => {
              // embedding disabled or video unavailable: use the fallback
              y.failed = true
              clearTimeout(y.watchTimer)
              try {
                y.player.stopVideo()
              } catch {
                /* ignore */
              }
              if (y.wantPlay) startAmbient()
            },
          },
        })
      } else if (y.ready) {
        clearTimeout(y.watchTimer)
        stopAmbient()
        try {
          y.player.playVideo()
        } catch {
          /* ignore */
        }
      }
    }

    if (window.YT && window.YT.Player) {
      ensurePlayer()
    } else {
      loadYouTubeApi().then(ensurePlayer).catch(() => {
        if (!y.ready && y.wantPlay && !y.failed) {
          y.failed = true
          startAmbient()
        }
      })
    }
  }, [loadYouTubeApi, startAmbient, stopAmbient])

  const pauseSoundtrack = useCallback(() => {
    const y = yt.current
    y.wantPlay = false
    clearTimeout(y.watchTimer)
    if (y.player && y.ready) {
      try {
        y.player.pauseVideo()
      } catch {
        /* ignore */
      }
    }
  }, [])

  /* ---------------- switchboard ---------------- */

  const setEnabled = useCallback(
    (v) => {
      enabledRef.current = v
      setEnabledState(v)
      if (v) {
        ensure() // audio context for interaction sounds
        startSoundtrack()
      } else {
        pauseSoundtrack()
        stopAmbient()
      }
    },
    [ensure, startSoundtrack, pauseSoundtrack, stopAmbient]
  )

  const toggle = useCallback(() => setEnabled(!enabledRef.current), [setEnabled])
  const unlock = useCallback(() => ensure(), [ensure])

  const value = useMemo(
    () => ({ enabled, setEnabled, toggle, unlock, bell, arp, boom, crackle }),
    [enabled, setEnabled, toggle, unlock, bell, arp, boom, crackle]
  )

  return (
    <SoundCtx.Provider value={value}>
      {children}
      {/* hidden youtube player host: kept off-screen, never display:none,
          so browsers keep its audio alive */}
      <div
        id="yt-music-host"
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          width: '320px',
          height: '180px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />
    </SoundCtx.Provider>
  )
}
