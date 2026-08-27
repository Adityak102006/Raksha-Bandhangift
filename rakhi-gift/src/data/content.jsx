// Every word on the site lives here. Edit freely, no components needed.
// Note: no em dashes anywhere in this copy, on purpose.

export const content = {
  sisterLabel: 'my dearest sister',

  intro: {
    forLine: 'A little something, made just for',
    button: 'Open your gift',
    foot: 'sound on the top right corner, headphones if you can',
  },

  nav: [
    { href: '#ritual', label: 'The Ritual' },
    { href: '#promises', label: 'Promises' },
    { href: '#story', label: 'Our Story' },
    { href: '#letter', label: 'The Letter' },
    { href: '#diyas', label: 'Diyas' },
  ],

  hero: {
    badge: 'Shravan Purnima · 28 August 2026',
    script: 'Happy',
    title: 'Raksha Bandhan',
    sub: 'Dear Sister, one thread holds a thousand memories, and a lifetime of love and protection. This little corner of the internet was built only for you.',
    ctaPrimary: 'Tie the rakhi',
    ctaSecondary: 'Read your letter',
    note: 'scroll slowly, some things here are waiting for your touch',
  },

  ritual: {
    kicker: 'the meaning',
    title: (
      <>
        Two words that <em>tie us together</em>
      </>
    ),
    lead: 'A rakhi is not just a thread. It is a promise woven in silk that says: whoever you become, wherever you go, I am your person.',
    mantraNote: 'the ancient prayer, spoken as the rakhi is tied',
    mantra: {
      dv: ['येन बद्धो बली राजा दानवेन्द्रो महाबलः।', 'तेन त्वामभिबध्नामि रक्षे मा चल मा चल॥'],
      tr: 'I tie upon you the same thread that bound the mighty King Bali. O thread of protection, never falter, never fail.',
    },
    steps: [
      { icon: 'sparkles', label: 'Tilak on the forehead' },
      { icon: 'link', label: 'Rakhi on the wrist' },
      { icon: 'candy', label: 'A bite of mithai' },
      { icon: 'hands', label: 'A promise, forever' },
    ],
    tieHint: 'No matter the distance between us today',
    tieHintDuring: '( hold my wrist steady... )',
    tieButton: 'Tie your rakhi here',
    tieResult: {
      title: 'Tied and received.',
      text: 'This rakhi now lives on my wrist, and your love wraps around it. My promise stands,',
      emph: 'today and always.',
      replay: 'Tie it again',
    },
  },

  meaning: [
    {
      deva: 'रक्षा',
      roman: 'rakshā',
      word: 'protection',
      note: 'I have your back. Always have, always will.',
    },
    {
      deva: 'बंधन',
      roman: 'bandhan',
      word: 'the bond',
      note: 'Not a rope that ties you down. A thread that keeps us together.',
    },
  ],

  promises: {
    kicker: 'my vows, in writing',
    title: (
      <>
        Six promises, <em>sealed in gold</em>
      </>
    ),
    lead: 'Tap a card. Every one of them is legally binding in the court of us.',
    items: [
      {
        icon: 'shield',
        title: 'Your Shield',
        vow: 'Whatever comes, comes through me first.',
        text: 'Every storm heading your way has to get past me first. And storms have read my résumé. They turn around.',
      },
      {
        icon: 'phone',
        title: 'Always On Call',
        vow: 'First ring. Any hour. Always.',
        text: '3 PM or 3 AM, good news or hard days, my phone never sleeps on you. Call me. I pick up.',
      },
      {
        icon: 'lock',
        title: 'Vault of Secrets',
        vow: 'Sealed. Forever. Even from me.',
        text: 'Your secrets stay locked in a vault only siblings can find. I lost the map to yours years ago, and I never went looking again.',
      },
      {
        icon: 'star',
        title: 'First Believer',
        vow: 'I clapped first. I always will.',
        text: 'Long before the world learns your name and applauds, I already did. Quietly, proudly, every single time.',
      },
      {
        icon: 'scale',
        title: 'The Honest One',
        vow: 'Honest with you. Loyal to you.',
        text: 'I will tell you when you are wrong, and stand by you anyway. That is the deal, and it has no exit clause.',
      },
      {
        icon: 'home',
        title: 'A Home in Me',
        vow: 'My door knows only your knock.',
        text: 'Wherever I am, a room stays warm, a plate stays saved, and a door stays unlocked for you.',
      },
    ],
  },

  story: {
    kicker: 'the chapters of us',
    title: (
      <>
        One golden thread, <em>running through it all</em>
      </>
    ),
    lead: 'Scroll, and watch the mauli pull itself through our story, chapter by chapter, the way it always has.',
    chapters: [
      {
        n: 'Chapter One',
        t: 'Partners in Crime',
        d: 'Stolen chocolates, blamed breakages, unified alibis. Our first conspiracy, and we never got caught.',
      },
      {
        n: 'Chapter Two',
        t: 'The Bodyguard Era',
        d: 'Anyone who troubled you had to get past me first. Spoiler alert: nobody ever did.',
      },
      {
        n: 'Chapter Three',
        t: 'Cities Apart, Never Far',
        d: 'Different roads, same bond. Phone calls became our new adda, and distance learned to behave.',
      },
      {
        n: 'Chapter Four',
        t: 'Now and Always',
        d: 'Threads change every year. What they tie, never changes.',
      },
    ],
  },

  letter: {
    kicker: 'sealed with a kiss',
    title: (
      <>
        A letter, <em>just for you</em>
      </>
    ),
    lead: 'Some things are better handwritten. This is the closest a website gets.',
    hint: 'tap to break the seal',
    hintOpen: 'tap again to read the whole letter',
    lines: [
      { type: 'salut', text: 'Dear Sister,' },
      {
        type: 'para',
        text: 'Every year a thread finds my wrist, but what it stands for was tied long before any rakhi: in a childhood of shared secrets, stolen sweets, and epic battles over the TV remote.',
      },
      {
        type: 'para',
        text: 'You are my first friend, my forever critic, and the keeper of every embarrassing story I will never live down. Being your brother is one of the great privileges of my life.',
      },
      {
        type: 'para',
        text: 'So this Raksha Bandhan, I promise more than protection. I promise presence: beside you in your loudest victories and your quietest battles, this year and every one after.',
      },
      { type: 'para', text: 'The thread fades by next summer. The promise never does.' },
      { type: 'big', text: 'Happy Raksha Bandhan.' },
      { type: 'sign', text: 'with all my love, today and always,', small: 'YOUR BROTHER' },
    ],
  },

  diyas: {
    kicker: 'the finale',
    title: (
      <>
        Light a diya <em>for us</em>
      </>
    ),
    lead: 'Five diyas. One for every promise kept, and one for luck. When all five glow, watch the sky.',
    hint: 'tap each diya to light it',
    left: (n) => `${n} diya${n > 1 ? 's' : ''} left...`,
    allLit: 'watch the sky',
    finale: {
      title: 'May our bond glow, long after the diyas dim.',
      text: 'Same time next year, partner. Bring the rakhi, I will bring the promise, and your mithai with interest included.',
      sign: 'with all my love, Your Brother',
    },
  },

  countdown: {
    labels: ['days', 'hrs', 'min', 'sec'],
    until: 'until the thread ties us closer',
    today: 'Today is the day. Happy Raksha Bandhan!',
    after: 'The thread of 2026, tied and sealed forever.',
  },

  footer: {
    made: 'Made with love ❤️',
    tip: 'p.s. tap anywhere for sparkles',
  },
}
