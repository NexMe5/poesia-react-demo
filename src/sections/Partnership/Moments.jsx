import { useRef } from 'react';
import { useScene } from '../../engine/hooks';
import { MOMENTS } from '../../data/partnership';

/** Three café moments; the middle one drifts against the others as they pass, for a little depth. */
export default function Moments() {
  const ref = useRef(null);
  useScene(ref, (el) => {
    const figures = [...el.querySelectorAll('figure')];
    return {
      mode: 'view', start: 1, span: 1, end: 0, lag: 0.15,
      render(p) {
        figures.forEach((f, i) => { f.style.translate = `0 ${(i === 1 ? -1 : 1) * (p - 0.5) * 9}vh`; });
      },
    };
  });

  return (
    <div ref={ref} className="moments">
      {MOMENTS.map((m) => (
        <figure key={m.src}><img src={m.src} alt={m.alt} width={m.width} height={m.height} /></figure>
      ))}
    </div>
  );
}
