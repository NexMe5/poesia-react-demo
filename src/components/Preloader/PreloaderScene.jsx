/**
 * The loader's line drawing: beans drop into the grinder, the portafilter locks in,
 * espresso pours into the cup and steam rises. Every part loops on the same 6 s clock.
 */
export default function PreloaderScene({ sceneRef }) {
  return (
    <svg ref={sceneRef} className="pl-scene" viewBox="0 -10 120 140" aria-hidden="true">
      <defs>
        <clipPath id="pl-cup-clip">
          <path d="M44 100 H76 V110 Q76 122 64 122 H56 Q44 122 44 110 Z" />
        </clipPath>
        <g id="pl-bean-shape">
          <ellipse rx="2.3" ry="3.1" fill="#a86a3a" />
          <path d="M0 -2.5 Q1 0 0 2.5" fill="none" stroke="#3b1d0d" strokeWidth=".8" strokeLinecap="round" />
        </g>
      </defs>

      {/* 1. beans fall into the hopper */}
      <g className="pl-bean pl-anim pl-off"><use href="#pl-bean-shape" transform="translate(56 -4) rotate(-20)" /></g>
      <g className="pl-bean pl-anim pl-off" style={{ animationDelay: '.2s' }}><use href="#pl-bean-shape" transform="translate(61 -6) rotate(25)" /></g>
      <g className="pl-bean pl-anim pl-off" style={{ animationDelay: '.4s' }}><use href="#pl-bean-shape" transform="translate(64 -3) rotate(-10)" /></g>

      {/* 2. grinder: shake and gear spin */}
      <g className="pl-machine pl-anim">
        <use href="#pl-bean-shape" transform="translate(58 23.5) rotate(70) scale(.85)" />
        <use href="#pl-bean-shape" transform="translate(62.5 24) rotate(-60) scale(.85)" />
        <path className="pl-line pl-draw" pathLength="1" d="M48 12 H72 L66 28 H54 Z" />
        <path className="pl-line pl-draw" pathLength="1" d="M35 28 H85 Q90 28 90 33 V53 Q90 58 85 58 H35 Q30 58 30 53 V33 Q30 28 35 28 Z" />
        <circle className="pl-gear pl-line pl-anim" cx="60" cy="43" r="7" />
        <circle cx="60" cy="43" r="1.6" fill="#f3e7d6" />
        <circle className="pl-led pl-anim" cx="82" cy="51" r="1.8" fill="var(--pl-crema)" />
      </g>

      {/* group head */}
      <path className="pl-line pl-draw" pathLength="1" d="M50 58 H70 V64 H50 Z" />

      {/* 5. espresso: first drops, then the stream */}
      <circle className="pl-drop pl-anim pl-off" cx="57" cy="76" r="1.3" fill="var(--pl-stream)" />
      <circle className="pl-drop pl-anim pl-off" cx="63" cy="76" r="1.3" fill="var(--pl-stream)" style={{ animationDelay: '.2s' }} />
      <g className="pl-off">
        <line className="pl-stream pl-anim" x1="57" y1="74" x2="57" y2="104" stroke="var(--pl-stream)" strokeWidth="1.8" />
        <line className="pl-stream pl-anim" x1="63" y1="74" x2="63" y2="104" stroke="var(--pl-stream)" strokeWidth="1.8" style={{ animationDelay: '.08s' }} />
      </g>

      {/* 3. portafilter slides in and twists to lock */}
      <g className="pl-pf pl-anim">
        <path className="pl-line" d="M46 66 H74 V69 Q74 72 71 72 H49 Q46 72 46 69 Z" />
        <path className="pl-line" d="M46 68 H28" />
        <path className="pl-line" d="M57 72.5 V74 M63 72.5 V74" strokeWidth="1.6" />
      </g>

      {/* 4. cup and saucer slide in and fill */}
      <g className="pl-cup pl-anim">
        <g clipPath="url(#pl-cup-clip)">
          <g className="pl-liquid pl-anim">
            <rect x="44" y="100" width="32" height="22" fill="var(--pl-coffee)" />
            <rect x="44" y="100" width="32" height="2.2" fill="var(--pl-crema)" />
          </g>
        </g>
        <path className="pl-line" d="M44 100 H76 V110 Q76 122 64 122 H56 Q44 122 44 110 Z" />
        <path className="pl-line" d="M76 103 Q85 103 85 109 Q85 115 76 115" />
        <path className="pl-line" d="M36 126 H84" />
      </g>

      {/* 6. steam */}
      <path className="pl-steam pl-line pl-anim" d="M54 96 q-3 -4 0 -8 q3 -4 0 -8" />
      <path className="pl-steam pl-line pl-anim" d="M60 95 q-3 -4 0 -8 q3 -4 0 -8" style={{ animationDelay: '.15s' }} />
      <path className="pl-steam pl-line pl-anim" d="M66 96 q-3 -4 0 -8 q3 -4 0 -8" style={{ animationDelay: '.3s' }} />
    </svg>
  );
}
