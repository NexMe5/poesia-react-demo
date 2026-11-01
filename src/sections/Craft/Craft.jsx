import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import { useScene } from '../../engine/hooks';
import { engine } from '../../engine/scrollEngine';
import { useLanding } from '../../navigation/landings';
import { docTop, pinLen } from '../../lib/dom';
import { img } from '../../lib/assets';
import { CRAFT_CHAPTERS, ORBIT_BEANS } from '../../data/craft';
import { createCraftScene } from './craftScene';
import './Craft.css';

/** II · Craft: one copper word behind the bag per chapter, a calligraphy line below, a polaroid beside it. */
function Craft() {
  const ref = useRef(null);
  useScene(ref, (el) => {
    // the blends stage measures this bag to take over from exactly where it stands
    engine.shared.craftBag = el.querySelector('.craft-bag');
    const scene = createCraftScene(el, { reducedMotion: engine.reducedMotion });
    return { ...scene, lag: 0.12, enter: true, rest: 0.5 };
  });
  // lands on ALTITUDE with the bag, orbit and polaroid at rest
  useLanding('#craft', (el) => docTop(el) + pinLen(el) * 0.1);

  return (
    <section ref={ref} id="craft" className="scene craft" data-tone="light" aria-labelledby="craft-h">
      <div className="sticky">
        <Leaves variant="cl-a" />
        <Leaves variant="cl-b" />
        <SectionHeader className="craft-head wrap" label="What makes Poesia special" labelAs="h2" labelId="craft-h" />
        <div className="giant" aria-hidden="true">
          {CRAFT_CHAPTERS.map((c) => <span key={c.word} style={{ '--fs': c.wordSize }}>{c.word}</span>)}
        </div>
        <div className="orbit" aria-hidden="true">
          {ORBIT_BEANS.map((b, i) => <img key={i} src={b.src} alt="" style={{ '--w': `${b.width}px` }} />)}
        </div>
        <div className="craft-floor" aria-hidden="true" />
        <img className="craft-bag" src={img('bag-espresso.webp')} alt="A 1 kg bag of Poesia Espresso Italiano" width="680" height="1147" />
        {CRAFT_CHAPTERS.map((c) => (
          <article key={c.pillar} className="pillar wrap"><h3>{c.pillar}</h3></article>
        ))}
        {CRAFT_CHAPTERS.map((c) => (
          <figure key={c.caption} className="pcard" aria-hidden="true">
            <img src={c.photo} alt="" loading="lazy" style={c.position ? { objectPosition: c.position } : undefined} />
            <figcaption>{c.caption}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default memo(Craft);
