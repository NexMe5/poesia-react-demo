import { img } from '../../lib/assets';
import './SplitBean.css';

/**
 * The coffee bean in two halves with its warm glow. Children (the prologue's chips) sit between glow and halves.
 * Each half is a wrapper that moves, holding the image that carries the shadows (see SplitBean.css).
 * `lazy`: the epilogue's bean, far below the fold; the intro's bean is the first thing on screen.
 */
export default function SplitBean({ children, lazy = false }) {
  const load = lazy ? { loading: 'lazy', decoding: 'async' } : { fetchPriority: 'high' };
  return (
    <>
      <div className="bean-glow" />
      {children}
      <div className="bean-half bean-l"><img src={img('bean-l.webp')} alt="" width="501" height="700" {...load} /></div>
      <div className="bean-half bean-r"><img src={img('bean-r.webp')} alt="" width="501" height="700" {...load} /></div>
    </>
  );
}
