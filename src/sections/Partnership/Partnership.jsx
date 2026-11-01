import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import Reveal from '../../components/Reveal/Reveal';
import ReadingText from './ReadingText';
import Moments from './Moments';
import { useLanding } from '../../navigation/landings';
import { docTop } from '../../lib/dom';
import { WHATSAPP } from '../../data/site';
import { PROMISE_TEXT, WHO_WE_SERVE } from '../../data/partnership';
import './Partnership.css';

/** VIII · Partnership: the promise read out word by word, who we serve, three café moments and the closing line. */
function Partnership() {
  const ref = useRef(null);

  // lands where the promise is fully read out, but never with the title tucked under the header
  useLanding('#partner', (el) => {
    const text = el.querySelector('[data-words]');
    const head = el.querySelector('.sh');
    const read = docTop(text) + text.offsetHeight - window.innerHeight * 0.45 + 8;
    return Math.max(docTop(el), Math.min(read, docTop(head) - 96));
  });

  return (
    <section ref={ref} id="partner" className="promise" data-tone="light" aria-labelledby="partner-h">
      <Leaves variant="pl-a" />
      <Leaves variant="pl-b" />
      <Leaves variant="pl-c" />
      <div className="wrap">
        <div className="promise-head">
          <SectionHeader label="The partnership" title={['Lasting', <em key="p">partnerships</em>]} titleId="partner-h" />
          <div className="promise-body">
            <ReadingText className="promise-text" text={PROMISE_TEXT} />
            <Reveal as="ul" className="serve" aria-label="Who we serve">
              {WHO_WE_SERVE.map((s) => <li key={s}>{s}</li>)}
            </Reveal>
          </div>
        </div>

        <Moments />

        <Reveal className="promise-sign">
          <p className="t-quote">For us, hospitality isn&apos;t where our job ends. <span className="hl">It&apos;s where it matters most.</span></p>
          <div className="promise-cta">
            <a className="btn btn-solid" href="#contact">Start a partnership</a>
            <a className="tlink" href={WHATSAPP.tasting} target="_blank" rel="noopener">Request a tasting</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default memo(Partnership);
