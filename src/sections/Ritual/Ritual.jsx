import { memo, useRef } from 'react';
import TitleLines from '../../components/SectionHeader/TitleLines';
import { useScene } from '../../engine/hooks';
import { clamp, ease, lerp, seg } from '../../lib/math';
import { q, qa } from '../../lib/dom';
import { img } from '../../lib/assets';
import './Ritual.css';

/** V · Ritual: a pour, seen through a small circle that opens to the whole screen, then the quote. */
function Ritual() {
  const ref = useRef(null);
  useScene(ref, (root) => {
    const stage = q(root, '.sticky');
    const media = q(root, '.ritual-media');
    const photo = q(root, '.ritual-media img');
    const shade = q(root, '.ritual-shade');
    const lines = qa(root, '.line > span');
    let W = 1;
    let H = 1;
    return {
      // the circle is a round frame as wide as the screen's diagonal (see Ritual.css), scaled down to the circle
      // and back up to the full screen, with the photo scaled the other way inside it: GPU transforms only.
      // (A clip-path circle that changed every frame made the phone re-draw the full-screen photo each frame.)
      size() { W = window.innerWidth; H = stage.clientHeight || window.innerHeight; },
      render(p) {
        const m = ease.inOut(seg(p, 0.08, 0.5));
        const frame = (W + H) / 2 + 20;                    // the frame's radius (Ritual.css: 100vw + 100svh + 40px wide)
        const full = Math.hypot(W, H) / 2 + 20;
        const s = lerp(Math.min(W, H) * 0.2, full, m) / frame;
        media.style.transform = `scale(${s})`;
        photo.style.transform = `scale(${lerp(1.3, 1, m) / s})`;
        shade.style.opacity = seg(p, 0.42, 0.6);
        lines.forEach((el, i) => {
          const t = ease.out(seg(p, 0.5 + i * 0.07, 0.7 + i * 0.07));
          el.style.transform = `translate3d(0,${(1 - t) * 110}%,0)`;
          el.style.opacity = clamp(t * 1.25);
        });
      },
    };
  });

  return (
    <section ref={ref} className="scene ritual" data-tone="dark">
      <div className="sticky">
        <div className="ritual-media"><img src={img('pour.webp')} alt="Coffee pouring into a white cup" width="1282" height="907" loading="lazy" decoding="async" /></div>
        <div className="ritual-shade" />
        <blockquote className="ritual-quote wrap">
          <p className="q t-quote">
            <TitleLines lines={['Coffee is more than', "a beverage. It's a moment", 'to connect, pause,', <>and <em>savour</em>.</>]} />
          </p>
        </blockquote>
      </div>
    </section>
  );
}

export default memo(Ritual);
