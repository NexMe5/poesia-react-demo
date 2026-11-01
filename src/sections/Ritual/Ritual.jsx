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
    const media = q(root, '.ritual-media');
    const photo = q(root, '.ritual-media img');
    const shade = q(root, '.ritual-shade');
    const lines = qa(root, '.line > span');
    return {
      render(p) {
        const m = ease.inOut(seg(p, 0.08, 0.5));
        const vmin = Math.min(window.innerWidth, window.innerHeight);
        const full = Math.hypot(window.innerWidth, window.innerHeight) / 2 + 20;
        media.style.clipPath = `circle(${lerp(vmin * 0.2, full, m)}px at 50% ${lerp(52, 50, m)}%)`;
        photo.style.transform = `scale(${lerp(1.3, 1, m)})`;
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
        <div className="ritual-media"><img src={img('pour.webp')} alt="Coffee pouring into a white cup" width="1282" height="907" /></div>
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
