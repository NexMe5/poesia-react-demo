import { introReady } from '../../lib/introReady';

const MAX_MS = 12000;          // a stuck resource never holds the page longer than this (slow networks get real progress meanwhile)
const HOLD_AT = 89;            // the signature beat: the count rests at 089 while the cup fills
/** The first brew always plays to the moment its cup is full (6 s loop × .93 ≈ 5.6 s), so the loader never cuts mid-pour. */
const FIRST_CUP_FULL = 0.93;
const STEPS = [
  [0, 'Dosing beans'],
  [0.12, 'Grinding'],
  [0.34, 'Locking in'],
  [0.46, 'Brewing'],
  [0.78, 'Serving'],
];
/**
 * Only the first screen holds the loader: the intro (bean, wordmark, dust) and the hero it tears open to,
 * plus the header. Every later chapter loads behind it and is decoded just before it scrolls in
 * (lib/warmAhead.js). Waiting for the whole site meant ~3.4 MB on the wire and ~110 MB of decoded
 * photos before a phone on a slow network saw anything, and the decoded photos were evicted again anyway.
 */
const CRITICAL = '#top img, .nav img';

/**
 * Drives the loader: real progress (every image on the page, the fonts, the painted intro)
 * blended with a slow creep so it never looks stuck, and never running backwards.
 * Writes the count, bar and step label straight to the DOM each frame. Returns a cancel function.
 */
export function trackLoading({ root, scene, countEl, barEl, labelEl, onFinish }) {
  const loopMs = (parseFloat(getComputedStyle(root).getPropertyValue('--pl-loop')) || 6) * 1000;
  // one full brew at least; if the site is still loading then, the machine keeps brewing until it is ready
  const minMs = loopMs * FIRST_CUP_FULL;
  // The machine is drawn by CSS animations that start with the first paint of the prerendered HTML, before this
  // script runs. Count, label and the end of the first brew therefore follow the CSS animation's own clock.
  const clock = scene.getAnimations ? scene.getAnimations().find((a) => a.animationName === 'plClock') : null;
  const t0 = performance.now();
  const brewTime = () => (clock && clock.currentTime != null ? clock.currentTime : performance.now() - t0);
  let shown = 0;
  let total = 0;
  let done = 0;
  let pageLoaded = false;
  let winLoaded = document.readyState === 'complete';
  let fxReady = false;
  let currentLabel = '';
  let raf = 0;
  let cancelled = false;
  const cleanups = [];

  const settleOnce = () => { let s = false; return () => { if (!s) { s = true; done++; } }; };
  // An image counts only once it is downloaded *and decoded*: decoding a large photo the first time it
  // scrolls into view is what makes a phone stutter mid-scroll, so it happens here, behind the loader.
  const decodeThen = (im, settle) => {
    if (typeof im.decode === 'function') im.decode().then(settle, settle);
    else settle();
  };
  const watch = (el) => {
    const settle = settleOnce();
    total++;
    if (el.tagName === 'IMG') {
      if (el.complete) { decodeThen(el, settle); return undefined; }
      el.addEventListener('load', () => decodeThen(el, settle), { once: true });
      el.addEventListener('error', settle, { once: true });
    } else {
      if (el.readyState >= 2) return settle();
      el.addEventListener('loadeddata', settle);
      el.addEventListener('error', settle);
    }
    return undefined;
  };

  // wait for the first screen only; the rest of the story streams in behind the loader
  document.querySelectorAll(CRITICAL).forEach((el) => {
    if (root.contains(el)) return;
    watch(el);
  });
  total++;
  introReady.then(() => { done++; fxReady = true; });
  if (document.fonts && document.fonts.ready) {
    total++;
    document.fonts.ready.then(() => { done++; }, () => { done++; });
  }

  // window 'load' waits for every image on the page, so it is no longer part of the gate
  winLoaded = true;
  const safety = setTimeout(() => { pageLoaded = true; }, MAX_MS);
  cleanups.push(() => clearTimeout(safety));

  // The first brew's count: rises with the pour, rests on 089 while the cup fills, reaches 100 as it is full.
  const firstBrew = (f) => (f < 0.8 ? (f / 0.8) * HOLD_AT : f < 0.96 ? HOLD_AT : HOLD_AT + ((f - 0.96) / 0.04) * (100 - HOLD_AT));

  const tick = () => {
    if (cancelled) return;
    const elapsed = brewTime();
    if (!pageLoaded && winLoaded && fxReady && done >= total) pageLoaded = true;

    const real = 25 + 65 * (total ? done / total : 1);
    // a gentle creep keeps the count alive on a slow connection; real progress leads
    const creep = 60 * (1 - Math.exp(-elapsed / 6000));
    const target = pageLoaded
      ? firstBrew(Math.min(1, elapsed / minMs))
      : Math.min(firstBrew(Math.min(1, elapsed / minMs)), Math.max(real, creep), HOLD_AT);
    shown += Math.max(0, (target - shown) * 0.25);

    countEl.textContent = String(Math.min(100, Math.floor(shown))).padStart(3, '0');
    barEl.style.transform = `scaleX(${shown / 100})`;

    const phase = (elapsed % loopMs) / loopMs;
    let label = STEPS[0][1];
    for (const [at, text] of STEPS) if (phase >= at) label = text;
    if (label !== currentLabel) { currentLabel = label; labelEl.textContent = label; }

    // open once the first cup is full and everything is in (on a slow network: as soon as it is)
    if (pageLoaded && elapsed >= minMs) {
      countEl.textContent = '100';
      barEl.style.transform = 'scaleX(1)';
      labelEl.textContent = 'Ready';
      onFinish();
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    cleanups.forEach((fn) => fn());
  };
}
