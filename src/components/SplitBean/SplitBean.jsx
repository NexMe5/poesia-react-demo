import { img } from '../../lib/assets';
import './SplitBean.css';

/**
 * The coffee bean in two halves with its warm glow. Children (the prologue's chips) sit between glow and halves.
 * Each half is a wrapper that moves, holding the image that carries the shadows (see SplitBean.css).
 */
export default function SplitBean({ children }) {
  return (
    <>
      <div className="bean-glow" />
      {children}
      <div className="bean-half bean-l"><img src={img('bean-l.webp')} alt="" width="501" height="700" /></div>
      <div className="bean-half bean-r"><img src={img('bean-r.webp')} alt="" width="501" height="700" /></div>
    </>
  );
}
