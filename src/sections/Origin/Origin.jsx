import { memo, useRef } from 'react';
import TitleLines from '../../components/SectionHeader/TitleLines';
import { useScene } from '../../engine/hooks';
import { useLanding } from '../../navigation/landings';
import { docTop, pinLen } from '../../lib/dom';
import { img } from '../../lib/assets';
import { createOriginScene } from './originScene';
import './Origin.css';

/** I · Origin: the photo window grows from a card to the whole screen, then the line rises in. */
function Origin() {
  const ref = useRef(null);
  useScene(ref, (el) => ({ render: createOriginScene(el) }));
  // lands with the photo full screen and all three lines in
  useLanding('#origin', (el) => docTop(el) + pinLen(el) * 0.92);

  return (
    <section ref={ref} id="origin" className="scene origin" data-tone="dark" aria-labelledby="origin-h">
      <div className="sticky">
        <div className="origin-media">
          <img src={img('origin.webp')} alt="Coffee pickers among the rows of a hillside estate at sunrise" width="1600" height="2400" />
        </div>
        <div className="origin-shade" />
        <div className="origin-copy wrap">
          <p className="label ol">The origin</p>
          <h2 id="origin-h" className="t-title origin-title">
            <TitleLines lines={['From the lush hills', 'of Chikmagalur,', 'the birthplace of Indian coffee.']} />
          </h2>
        </div>
      </div>
    </section>
  );
}

export default memo(Origin);
