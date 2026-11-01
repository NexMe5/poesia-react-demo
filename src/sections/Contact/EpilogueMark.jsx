import { useRef } from 'react';
import SplitBean from '../../components/SplitBean/SplitBean';
import { useScene } from '../../engine/hooks';
import { ease, seg } from '../../lib/math';
import { img } from '../../lib/assets';

/** The story closes where it began: the two bean halves come back together above the wordmark. */
export default function EpilogueMark({ sectionRef }) {
  const beanRef = useRef(null);
  useScene(sectionRef, () => {
    const wrap = beanRef.current;
    const left = wrap.querySelector('.bean-l');
    const right = wrap.querySelector('.bean-r');
    return {
      mode: 'view', start: 0.95, span: 0, end: 0.12, lag: 0.1,
      render(p) {
        const t = ease.inOut(p);
        left.style.transform = `translate(${-(1 - t) * 220}%,${-(1 - t) * 30}%) rotate(${-(1 - t) * 40}deg)`;
        right.style.transform = `translate(${(1 - t) * 220}%,${(1 - t) * 30}%) rotate(${(1 - t) * 40}deg)`;
        left.style.opacity = right.style.opacity = seg(p, 0, 0.3);
        wrap.classList.toggle('joined', p > 0.985);
      },
    };
  });

  return (
    <div className="epi-stage wrap">
      <div ref={beanRef} className="epi-bean" aria-hidden="true"><SplitBean /></div>
      <img className="epi-wm" src={img('wordmark-light.png')} alt="Poesia" width="900" height="309" />
      <p className="script">Where every cup tells a story</p>
    </div>
  );
}
