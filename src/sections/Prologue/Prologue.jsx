import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SplitBean from '../../components/SplitBean/SplitBean';
import { img } from '../../lib/assets';
import { BEAN_CHIPS, HERO_BAGS, HERO_BEANS } from '../../data/prologue';
import { usePrologueMotion } from './usePrologueMotion';
import './Prologue.css';

/**
 * Prologue: a coffee bean on a dark stage under the copper POESIA wordmark. Scrolling cracks it,
 * tears the stage open along its crease and reveals the sunlit hero with the four bags.
 */
function Prologue() {
  const ref = useRef(null);
  usePrologueMotion(ref);

  return (
    <section ref={ref} id="top" className="scene prologue" data-tone="dark" aria-label="Introduction">
      <div className="sticky">
        <div className="hero" data-tone-inner="light">
          <div className="hero-shade" />
          <div className="hero-light" />
          {/* the same plant, placed as on every cream chapter after it (craft, the blends' opening, the menu) */}
          <Leaves variant="cl-a" eager />
          <Leaves variant="cl-b" eager />
          <div className="hero-beans" aria-hidden="true">
            {HERO_BEANS.map((b, i) => (
              <div
                key={i}
                className={b.low ? 'hb low' : 'hb'}
                style={{ left: `${b.left}%`, top: `${b.top}%`, '--w': `${b.width}px`, '--z': b.z }}
              >
                <img src={b.src} alt="" />
              </div>
            ))}
          </div>
          <div className="hero-bags" aria-hidden="true">
            {HERO_BAGS.map((b) => (
              <div key={b.key} className={`bag b-${b.key}`}>
                <img src={b.src} alt="" width={b.width} height={b.height} />
              </div>
            ))}
          </div>
          <div className="hero-copy wrap">
            <h1 className="hc">Crafted<br className="mbr" /> in <em>Goa</em>.</h1>
            <p className="label hc hero-sub">Curated for exceptional hospitality</p>
          </div>
          <div className="hero-cta wrap">
            <div className="cta-row hc">
              <a className="btn btn-solid" href="#blends">Explore the blends</a>
              <a className="tlink" href="#contact">Partner with Poesia</a>
            </div>
          </div>
        </div>

        <div className="tear" aria-hidden="true">
          <div className="tear-half tear-l"><canvas className="tear-shade" /><div className="fiber" /><div className="panel"><canvas className="wmark" /></div></div>
          <div className="tear-half tear-r"><canvas className="tear-shade" /><div className="fiber" /><div className="panel"><canvas className="wmark" /></div></div>
          <canvas className="dust" />
          <img className="bokeh b1" src={img('bk-2.webp')} alt="" />
          <img className="bokeh b2" src={img('bk-1.webp')} alt="" />
          <img className="bokeh b3" src={img('bk-3.webp')} alt="" />
          <div className="intro-bottom"><p className="tagline">Where every cup tells a story</p></div>
          <div className="scroll-hint"><span className="eyebrow">Scroll</span><i /><b /></div>
        </div>

        <div className="bean-stage" aria-hidden="true">
          <div className="bean-rot">
            <SplitBean>
              <div className="chips">
                {BEAN_CHIPS.map((c, i) => (
                  <div key={i} className="chip" style={{ '--s': `${c.size}px` }}><img src={c.src} alt="" /></div>
                ))}
              </div>
            </SplitBean>
          </div>
        </div>
        <div className="crack" aria-hidden="true"><div className="crack-in"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline /></svg></div></div>
      </div>
    </section>
  );
}

export default memo(Prologue);
