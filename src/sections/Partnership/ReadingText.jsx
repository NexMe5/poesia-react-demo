import { Fragment, useRef } from 'react';
import { useScene } from '../../engine/hooks';
import { clamp, lerp } from '../../lib/math';

/** A paragraph whose words light up one by one as it passes through the screen, like being read aloud. */
export default function ReadingText({ text, className }) {
  const ref = useRef(null);
  const words = text.trim().split(/\s+/);

  useScene(ref, (el) => {
    const spans = [...el.querySelectorAll('.w')];
    return {
      mode: 'view', start: 0.85, span: 1, end: 0.45, lag: 0.2,
      render(p) {
        const n = p * spans.length * 1.05;
        spans.forEach((w, i) => { w.style.opacity = lerp(0.14, 1, clamp(n - i)); });
      },
    };
  });

  return (
    <p ref={ref} className={className} data-words>
      {words.map((w, i) => (
        <Fragment key={i}>{i > 0 && ' '}<span className="w">{w}</span></Fragment>
      ))}
    </p>
  );
}
