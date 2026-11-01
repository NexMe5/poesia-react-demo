import { memo, useEffect, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import BlendCopy from './BlendCopy';
import BlendTag from './BlendTag';
import { engine } from '../../engine/scrollEngine';
import { useLanding } from '../../navigation/landings';
import { docTop, pinLen } from '../../lib/dom';
import { BLENDS, BLEND_HASHES, COUNTER_BEANS, blendShotMiddle } from '../../data/blends';
import { createBlendsStage } from './blendsStage';
import './Blends.css';

/**
 * IV · Blends. The section starts one screen early and sits above the craft stage: at the moment it pins,
 * both stages show the same bag in the same place on the same ground, so the cut can't be seen.
 */
function Blends() {
  const ref = useRef(null);

  useEffect(() => {
    const section = ref.current;
    const stage = createBlendsStage(section, {
      reducedMotion: engine.reducedMotion,
      getCraftBag: () => engine.shared.craftBag ?? document.querySelector('.craft-bag'),
    });
    if (engine.reducedMotion) {
      stage.measure();
      stage.setShot(2, true);
      return () => stage.dispose();
    }
    const offScene = engine.addScene(section, stage.render, { lag: 0.35, size: stage.measure });
    const offFrame = engine.addFrameHook(stage.syncVisibility);
    return () => { offScene(); offFrame(); stage.dispose(); };
  }, []);

  // "Blends" links land on the range shot (four bags on the counter); a blend link lands in its own shot
  useLanding('#blends', (el) => docTop(el) + pinLen(el) * 0.11);
  useLanding(BLEND_HASHES, (_el, i) => docTop(ref.current) + pinLen(ref.current) * blendShotMiddle(i));

  return (
    <section ref={ref} id="blends" className="scene blends" data-tone="dark" aria-labelledby="blends-h">
      <div className="sticky">
        <div className="bird on-dark" aria-hidden="true" />
        <SectionHeader className="blends-head wrap" label="Our blends" labelId="blends-h" />
        <div className="blend-bg" aria-hidden="true" />
        <div className="blend-dark" aria-hidden="true">
          <Leaves variant="cl-a" />
          <Leaves variant="cl-b" />
        </div>
        <div className="blend-wash" aria-hidden="true" />
        <div className="counter" aria-hidden="true"><div className="ctr-top" /><div className="ctr-front" /></div>
        <h3 className="range-title t-title" aria-hidden="true">Four blends, one <em>story</em>.</h3>
        <div className="cbeans" aria-hidden="true">
          {COUNTER_BEANS.map((b, i) => (
            <img
              key={i}
              className={b.far ? 'cbean far' : 'cbean'}
              src={b.src}
              alt=""
              style={{ '--x': b.x, '--y': b.y, '--xm': b.xm, '--ym': b.ym, '--w': b.w, '--r': b.r, ...(b.d ? { '--d': b.d } : {}) }}
            />
          ))}
        </div>
        {BLENDS.map((b) => <BlendTag key={b.id} tag={b.tag} />)}
        <div className="bnames" aria-hidden="true">
          {BLENDS.map((b) => <span key={b.id} className="bname" style={{ '--c': b.accent }}>{b.short}</span>)}
        </div>
        <div className="blend-bags" aria-hidden="true">
          <div className="bag-glow" />
          {BLENDS.map((b) => <i key={b.id} className="bshadow" />)}
          {BLENDS.map((b) => (
            <img key={b.id} className="bbag" src={b.bag.src} alt="" width={b.bag.width} height={b.bag.height} style={{ '--bd': b.bag.breathe }} />
          ))}
        </div>
        {BLENDS.map((b) => <BlendCopy key={b.id} blend={b} />)}
      </div>
    </section>
  );
}

export default memo(Blends);
