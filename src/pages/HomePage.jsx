import { memo, useCallback, useEffect, useState } from 'react';
import Preloader, { introHasPlayed } from '../components/Preloader/Preloader';
import SiteHeader from '../components/SiteHeader/SiteHeader';
import WhatsAppFloat from '../components/WhatsAppFloat/WhatsAppFloat';
import Prologue from '../sections/Prologue/Prologue';
import Origin from '../sections/Origin/Origin';
import Craft from '../sections/Craft/Craft';
import Blends from '../sections/Blends/Blends';
import Ritual from '../sections/Ritual/Ritual';
import Journey from '../sections/Journey/Journey';
import Equipment from '../sections/Equipment/Equipment';
import Partnership from '../sections/Partnership/Partnership';
import Contact from '../sections/Contact/Contact';
import { engine } from '../engine/scrollEngine';
import { useScrollEngine } from '../engine/hooks';
import { useInPageNavigation } from '../navigation/useInPageNavigation';
import { usePageMeta } from '../lib/usePageMeta';

/** The story, soil to cup. Chapters never re-render; their motion runs on the scroll engine. */
const Story = memo(function Story() {
  return (
    <main>
      <Prologue />
      <Origin />
      <Craft />
      <Blends />
      <Ritual />
      <Journey />
      <Equipment />
      <Partnership />
      <Contact />
    </main>
  );
});

/** Home page: the loader (first visit only), the header, the WhatsApp button and the story. */
export default function HomePage() {
  usePageMeta('/');
  const [introDone, setIntroDone] = useState(introHasPlayed);
  const onPreloaderDone = useCallback(() => setIntroDone(true), []);

  useScrollEngine();                  // after every chapter has registered its scenes
  useInPageNavigation(introDone);     // deep links (/#equipment) open once the loader has gone
  useEffect(() => { if (introDone) engine.wake(); }, [introDone]);

  return (
    <>
      {!introHasPlayed() && <Preloader onDone={onPreloaderDone} />}
      <SiteHeader />
      <WhatsAppFloat armed={introDone} />
      <Story />
    </>
  );
}
