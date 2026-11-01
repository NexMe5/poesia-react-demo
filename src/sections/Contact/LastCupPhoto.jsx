import { useCallback, useRef } from 'react';
import { useScene } from '../../engine/hooks';
import { useReveal } from '../../components/Reveal/useReveal';
import { img } from '../../lib/assets';
import '../../components/Reveal/Reveal.css';

/** The last cup, framed in an arch, with a curl of steam; it drifts a little with the scroll. */
export default function LastCupPhoto() {
  const ref = useRef(null);
  const reveal = useReveal();
  const setRef = useCallback((el) => { ref.current = el; reveal(el); }, [reveal]);

  useScene(ref, (el) => {
    const layer = el.querySelector('.plx');
    return {
      mode: 'view', start: 1, span: 1, end: 0, lag: 0.15,
      render(p) { layer.style.transform = `translate3d(0,${(0.5 - p) * 9}%,0)`; },
    };
  });

  return (
    <figure ref={setRef} className="lc-photo rv" aria-hidden="true">
      <div className="arch">
        <div className="plx">
          <img src={img('cafe-signature.webp')} alt="" width="1000" height="1500" loading="lazy" />
          <svg className="steam" viewBox="0 0 100 190" preserveAspectRatio="none">
            <defs>
              <filter id="steamBlur" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="2.6" /></filter>
            </defs>
            <g filter="url(#steamBlur)">
              <path d="M45 188C30 160 62 136 46 106S36 56 52 20" />
              <path d="M58 188C72 158 44 130 60 98S70 50 56 14" />
              <path d="M51 188C41 166 59 150 51 122S43 82 49 50" />
            </g>
          </svg>
        </div>
      </div>
    </figure>
  );
}
