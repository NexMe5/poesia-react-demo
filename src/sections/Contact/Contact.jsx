import { memo, useRef } from 'react';
import Leaves from '../../components/Leaves/Leaves';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import Reveal from '../../components/Reveal/Reveal';
import Footer from '../../components/Footer/Footer';
import EpilogueMark from './EpilogueMark';
import LastCupPhoto from './LastCupPhoto';
import ContactWays from './ContactWays';
import { useLanding } from '../../navigation/landings';
import { docTop } from '../../lib/dom';
import { isMobile } from '../../lib/env';
import { CONTACT } from '../../data/site';
import './Contact.css';

/** Epilogue and "Get in touch": the bean closes, then the last cup and every way to reach Poesia. */
function Contact() {
  const ref = useRef(null);

  // lands with the contact block centred on screen (phones: its copy just below the header)
  useLanding('#contact', (el) => {
    const block = el.querySelector('.lc');
    return isMobile()
      ? docTop(el.querySelector('.lc-body')) - 84
      : docTop(block) + block.offsetHeight / 2 - window.innerHeight / 2;
  });

  return (
    <section ref={ref} id="contact" className="epilogue night" data-tone="dark">
      <Leaves variant="nl-a ne-a" />
      <Leaves variant="nl-b ne-b" />
      <EpilogueMark sectionRef={ref} />

      <div className="lc wrap">
        <LastCupPhoto />
        <div className="lc-body">
          <div className="lc-intro">
            <SectionHeader label="Get in touch" title={['The next cup', <>is <em>yours</em></>]} />
            <Reveal as="p" className="lc-lede">Poesia is where the finest Indian coffee, expertly roasted in Goa, meets refined hospitality.</Reveal>
          </div>
          <ContactWays />
          <Reveal className="lc-meta">
            <div>
              <p className="label">Roastery &amp; office</p>
              <p>{CONTACT.address}</p>
              <a className="tlink" href={CONTACT.directions} target="_blank" rel="noopener">Get directions ↗</a>
            </div>
            <div>
              <p className="label">Instagram &amp; Facebook</p>
              <p><a href={CONTACT.instagram} target="_blank" rel="noopener">{CONTACT.instagramHandle}</a></p>
            </div>
          </Reveal>
        </div>
      </div>

      <Footer />
    </section>
  );
}

export default memo(Contact);
