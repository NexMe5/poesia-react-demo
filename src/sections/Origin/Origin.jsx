import { memo, useRef } from 'react';
import TitleLines from '../../components/SectionHeader/TitleLines';
import { useScene } from '../../engine/hooks';
import { useLanding } from '../../navigation/landings';
import { docTop, pinLen } from '../../lib/dom';
import { img } from '../../lib/assets';
import { createOriginScene } from './originScene';
import './Origin.css';

/** I · Origin: the photo stands full screen; the label and the line rise in over it. */
function Origin() {
  const ref = useRef(null);
  // `enter`: the scene also hears the screen before it pins, while the photo rises over the hero (the dawn fade)
  useScene(ref, (el) => ({ render: createOriginScene(el), enter: true }));
  // lands with the photo full screen and all three lines in
  useLanding('#origin', (el) => docTop(el) + pinLen(el) * 0.92);

  return (
    <section ref={ref} id="origin" className="scene origin" data-tone="dark" aria-labelledby="origin-h">
      <div className="sticky">
        <div className="origin-media">
          <img src={img('origin.webp')} alt="Coffee pickers among the rows of a hillside estate at sunrise" width="1600" height="2400" loading="lazy" decoding="async" />
        </div>
        <div className="origin-shade" />
        <div className="origin-copy wrap">
          <p className="label ol">The origin</p>
          <h2 id="origin-h" className="t-title origin-title">
            <TitleLines lines={['From the lush hills', 'of Chikmagalur,', 'the birthplace of Indian coffee.']} />
          </h2>
        </div>
      </div>
      {/* above the stage, straddling the chapter's top edge: see .origin-dawn */}
      <div className="origin-dawn" aria-hidden="true" />
    </section>
  );
}

export default memo(Origin);
