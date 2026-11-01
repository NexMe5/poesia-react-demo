import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import PreloaderScene from './PreloaderScene';
import { trackLoading } from './loadingProgress';
import { prefersReducedMotion } from '../../lib/env';
import { cx } from '../../lib/dom';
import './Preloader.css';

const FILL_MS = 600;   // the full cup and its steam, before the fade
const FADE_MS = 650;
const LOCK = ['pl-lock', 'pl-wait'];   // html.pl-lock: no scrolling · html.pl-wait: the intro waits to enter

/** The loader plays once per visit; coming back to the home page from another page skips it. */
let played = false;
export const introHasPlayed = () => played;

/**
 * Brewing loader. Holds the page (html.pl-lock / html.pl-wait) until every image, the fonts and the
 * painted intro are ready, then fills the cup, fades out and calls `onDone`.
 */
export default function Preloader({ minMs = 1200, onDone }) {
  const rootRef = useRef(null);
  const sceneRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const labelRef = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const [phase, setPhase] = useState('loading');   // loading → done → hidden → gone
  const [still, setStill] = useState(false);       // reduced motion: the cup is shown ready

  // hold the page before the first paint; release it if the visitor leaves mid-load
  useLayoutEffect(() => {
    document.documentElement.classList.add(...LOCK);
    // decided after mount, so the prerendered HTML is the same for every visitor
    setStill(prefersReducedMotion);
    return () => document.documentElement.classList.remove(...LOCK);
  }, []);

  useEffect(() => {
    const timers = [];
    const cancel = trackLoading({
      root: rootRef.current,
      scene: sceneRef.current,
      countEl: countRef.current,
      barEl: barRef.current,
      labelEl: labelRef.current,
      minMs,
      onFinish: () => {
        setPhase('done');
        timers.push(setTimeout(() => {
          setPhase('hidden');
          timers.push(setTimeout(() => {
            document.documentElement.classList.remove(...LOCK);
            played = true;
            setPhase('gone');
            onDoneRef.current?.();
          }, FADE_MS));
        }, FILL_MS));
      },
    });
    return () => { cancel(); timers.forEach(clearTimeout); };
  }, [minMs]);

  if (phase === 'gone') return null;

  return (
    <div
      ref={rootRef}
      className={cx('pl', still && 'is-static', phase !== 'loading' && 'is-done', phase === 'hidden' && 'is-hidden')}
      role="status"
      aria-label="Loading"
    >
      <div className="pl-center">
        <PreloaderScene sceneRef={sceneRef} />
        <p className="pl-label" ref={labelRef}>Dosing beans</p>
      </div>
      <div className="pl-count" aria-hidden="true"><span ref={countRef}>000</span>%</div>
      <div className="pl-bar" ref={barRef} />
    </div>
  );
}
