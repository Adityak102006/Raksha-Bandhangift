// The rakhi illustration, drawn with pure SVG in the site palette.
export default function RakhiArt({ className }) {
  return (
    <svg className={className} viewBox="0 0 220 300" role="img" aria-label="A decorated rakhi">
      <defs>
        <radialGradient id="raCenter" cx="35%" cy="30%" r="85%">
          <stop offset="0" stopColor="#ff8fb1" />
          <stop offset="0.55" stopColor="#d81e5b" />
          <stop offset="1" stopColor="#8e0f35" />
        </radialGradient>
        <linearGradient id="raGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9ad" />
          <stop offset="0.5" stopColor="#e9b949" />
          <stop offset="1" stopColor="#c9a227" />
        </linearGradient>
        <linearGradient id="raSilk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e03060" />
          <stop offset="1" stopColor="#a80f43" />
        </linearGradient>
      </defs>

      {/* silk straps */}
      <rect x="2" y="128" width="66" height="16" rx="8" fill="url(#raSilk)" stroke="#c9a227" strokeWidth="1.4" />
      <rect x="152" y="128" width="66" height="16" rx="8" fill="url(#raSilk)" stroke="#c9a227" strokeWidth="1.4" />
      <circle cx="22" cy="136" r="2.6" fill="#ffe9ad" />
      <circle cx="46" cy="136" r="2.6" fill="#ffe9ad" />
      <circle cx="174" cy="136" r="2.6" fill="#ffe9ad" />
      <circle cx="198" cy="136" r="2.6" fill="#ffe9ad" />

      {/* hanging loop with beads */}
      <path d="M110 88 V64" stroke="#c9a227" strokeWidth="2" />
      <g>
        <circle cx="110" cy="56" r="7" fill="url(#raCenter)" stroke="#c9a227" strokeWidth="1.5" />
        <circle cx="110" cy="46" r="2.2" fill="#ffe9ad" />
        <circle cx="119.5" cy="52.9" r="2.2" fill="#ffe9ad" />
        <circle cx="115.9" cy="64.1" r="2.2" fill="#ffe9ad" />
        <circle cx="104.1" cy="64.1" r="2.2" fill="#ffe9ad" />
        <circle cx="100.5" cy="52.9" r="2.2" fill="#ffe9ad" />
      </g>

      {/* main medallion */}
      <g transform="translate(110,136)">
        <circle r="50" fill="#3a1d33" stroke="url(#raGold)" strokeWidth="3" />
        <g fill="url(#raGold)" stroke="#a8741f" strokeWidth="0.8">
          <path id="raPetal" d="M0 -44 C 7 -34 7 -22 0 -14 C -7 -22 -7 -34 0 -44 Z" />
          <use href="#raPetal" transform="rotate(45)" />
          <use href="#raPetal" transform="rotate(90)" />
          <use href="#raPetal" transform="rotate(135)" />
          <use href="#raPetal" transform="rotate(180)" />
          <use href="#raPetal" transform="rotate(225)" />
          <use href="#raPetal" transform="rotate(270)" />
          <use href="#raPetal" transform="rotate(315)" />
        </g>
        <g fill="#ffe9ad">
          <circle cx="34" cy="0" r="2.8" />
          <circle cx="24" cy="24" r="2.8" />
          <circle cx="0" cy="34" r="2.8" />
          <circle cx="-24" cy="24" r="2.8" />
          <circle cx="-34" cy="0" r="2.8" />
          <circle cx="-24" cy="-24" r="2.8" />
          <circle cx="0" cy="-34" r="2.8" />
          <circle cx="24" cy="-24" r="2.8" />
        </g>
        <circle r="28" fill="url(#raCenter)" stroke="url(#raGold)" strokeWidth="3.5" />
        <g fill="#ffd98c">
          <circle cx="17" cy="0" r="1.8" />
          <circle cx="8.5" cy="14.7" r="1.8" />
          <circle cx="-8.5" cy="14.7" r="1.8" />
          <circle cx="-17" cy="0" r="1.8" />
          <circle cx="-8.5" cy="-14.7" r="1.8" />
          <circle cx="8.5" cy="-14.7" r="1.8" />
        </g>
        <circle r="10" fill="url(#raGold)" />
        <circle r="4" fill="#8e0f35" />
      </g>

      {/* hanging threads + tassels */}
      <g fill="none" stroke="#d81e5b" strokeWidth="2.5">
        <path d="M110 186 C 104 214 100 240 96 266" />
        <path d="M110 186 C 110 216 110 242 110 268" />
        <path d="M110 186 C 116 214 120 240 124 266" />
      </g>
      <g>
        <circle cx="100" cy="218" r="3" fill="#ffe9ad" />
        <circle cx="110" cy="220" r="3" fill="#ffe9ad" />
        <circle cx="120" cy="218" r="3" fill="#ffe9ad" />
        <circle cx="96" cy="266" r="4.5" fill="url(#raGold)" />
        <circle cx="110" cy="268" r="4.5" fill="url(#raGold)" />
        <circle cx="124" cy="266" r="4.5" fill="url(#raGold)" />
      </g>
    </svg>
  )
}
