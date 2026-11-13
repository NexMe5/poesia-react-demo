import { img } from '../../lib/assets';
import './SplitBean.css';

/**
 * The coffee bean in two halves with its warm glow. Children (the prologue's chips) sit between glow and halves.
 * Each half is a wrapper that moves, holding a picture of the half with its rim light, warm glow and shadow
 * already painted in (bean-*-lit / bean-*-epi.webp, baked from bean-l/r.webp). They used to be three chained CSS
 * drop-shadows; on a GPU the glow's faint edge was cut off at the moving layer's rectangle, which showed as a
 * faint tilted box behind the bean.
 * `lazy`: the epilogue's bean (its own, softer bake), far below the fold; the intro's bean is the first thing on screen.
 */
export default function SplitBean({ children, lazy = false }) {
  const load = lazy ? { loading: 'lazy', decoding: 'async' } : { fetchPriority: 'high' };
  const look = lazy ? 'epi' : 'lit';
  return (
    <>
      <div className="bean-glow" />
      {children}
      <div className="bean-half bean-l"><img src={img(`bean-l-${look}.webp`)} alt="" width="721" height="990" {...load} /></div>
      <div className="bean-half bean-r"><img src={img(`bean-r-${look}.webp`)} alt="" width="721" height="990" {...load} /></div>
    </>
  );
}
