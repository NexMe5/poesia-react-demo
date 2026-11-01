import { useEffect, useRef } from 'react';
import { engine } from '../engine/scrollEngine';
import { docTop } from '../lib/dom';

/**
 * In-page navigation lands on each chapter's finished frame, not its first.
 * Every chapter registers where its own "finished frame" is; anything unregistered lands on its top.
 */
const landings = new Map();

export function registerLanding(hash, resolve) {
  landings.set(hash, resolve);
  return () => { if (landings.get(hash) === resolve) landings.delete(hash); };
}

/** React helper: `useLanding('#craft', (el) => y)` for the lifetime of the component. */
export function useLanding(hash, resolve) {
  const ref = useRef(resolve);
  ref.current = resolve;
  const key = Array.isArray(hash) ? hash.join(' ') : hash;   // one hash, or several (resolve gets the index)
  useEffect(() => {
    const offs = key.split(' ').map((h, i) => registerLanding(h, (el) => ref.current(el, i)));
    return () => offs.forEach((off) => off());
  }, [key]);
}

/** Scroll position for a hash such as "#blends", or null if there is no such chapter. */
export function landingFor(hash) {
  if (hash === '#top') return 0;
  const el = hash && hash.length > 1 ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  if (!el) return null;
  if (engine.reducedMotion) return docTop(el);
  const resolve = landings.get(hash);
  return resolve ? resolve(el) : docTop(el);
}
