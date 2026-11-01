import { img } from '../../lib/assets';
import './SplitBean.css';

/** The coffee bean in two halves with its warm glow. Children (the prologue's chips) sit between glow and halves. */
export default function SplitBean({ children }) {
  return (
    <>
      <div className="bean-glow" />
      {children}
      <img className="bean-half bean-l" src={img('bean-l.webp')} alt="" width="501" height="700" />
      <img className="bean-half bean-r" src={img('bean-r.webp')} alt="" width="501" height="700" />
    </>
  );
}
