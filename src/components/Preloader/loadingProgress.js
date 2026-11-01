import { img } from '../../lib/assets';
import { introReady } from '../../lib/introReady';

const MAX_MS = 6000;           // a stuck resource never holds the page longer than this
const HOLD_AT = 89;            // the signature beat: the count rests at 089 before the cup fills
const HOLD_MS = 700;
const STEPS = [
  [0, 'Dosing beans'],
  [0.12, 'Grinding'],
  [0.34, 'Locking in'],
  [0.46, 'Brewing'],
  [0.78, 'Serving'],
];
/** Images that only appear in CSS (masks, counter textures) are fetched up front too. */
const CSS_IMAGES = ['motif-bird.png', 'counter-top.webp', 'counter-front.webp'];

/**
 * Drives the loader: real progress (every image on the page, the fonts, the painted intro)
 * blended with a slow creep so it never looks stuck, and never running backwards.
 * Writes the count, bar and step label straight to the DOM each frame. Returns a cancel function.
 */
export function trackLoading({ root, scene, countEl, barEl, labelEl, minMs, onFinish }) {
  const loopMs = (parseFloat(getComputedStyle(root).getPropertyValue('--pl-loop')) || 6) * 1000;
  const start = performance.now();
  let loopStart = start;
  let shown = 0;
  let total = 0;
  let done = 0;
  let held = false;
  let holdStart = 0;
  let pageLoaded = false;
  let winLoaded = document.readyState === 'complete';
  let fxReady = false;
  let currentLabel = '';
  let raf = 0;
  let cancelled = false;
  const cleanups = [];

  const settleOnce = () => { let s = false; return () => { if (!s) { s = true; done++; } }; };
  const watch = (el) => {
    const settle = settleOnce();
    total++;
    if (el.tagName === 'IMG') {
      if (el.complete) return settle();
      el.addEventListener('load', settle);
      el.addEventListener('error', settle);
    } else {
      if (el.readyState >= 2) return settle();
      el.addEventListener('loadeddata', settle);
      el.addEventListener('error', settle);
    }
    return undefined;
  };

  // wait for every image on the site, so nothing pops in while scrolling; lazy images start loading now
  document.querySelectorAll('img, video:not([preload="none"])').forEach((el) => {
    if (root.contains(el)) return;
    if (el.loading === 'lazy') el.loading = 'eager';
    watch(el);
  });
  CSS_IMAGES.forEach((name) => { const im = new Image(); im.src = img(name); watch(im); });
  total++;
  introReady.then(() => { done++; fxReady = true; });
  if (document.fonts && document.fonts.ready) {
    total++;
    document.fonts.ready.then(() => { done++; }, () => { done++; });
  }

  const onLoad = () => { winLoaded = true; };
  if (!winLoaded) {
    window.addEventListener('load', onLoad);
    cleanups.push(() => window.removeEventListener('load', onLoad));
  }
  const safety = setTimeout(() => { pageLoaded = true; }, MAX_MS);
  cleanups.push(() => clearTimeout(safety));

  const onIteration = (e) => { if (e.animationName === 'plClock') loopStart = performance.now(); };
  scene.addEventListener('animationiteration', onIteration);
  cleanups.push(() => scene.removeEventListener('animationiteration', onIteration));

  const targetProgress = (elapsed) => {
    const real = pageLoaded ? 100 : 25 + 65 * (total ? done / total : 1);
    const creep = 92 * (1 - Math.exp(-elapsed / 3500));
    const t = pageLoaded ? (held ? 100 : HOLD_AT) : Math.min(Math.max(real, creep), HOLD_AT);
    return Math.min(t, (elapsed / minMs) * 100);   // the count never jumps
  };

  const tick = (now) => {
    if (cancelled) return;
    const elapsed = now - start;
    if (!pageLoaded && winLoaded && fxReady && done >= total) pageLoaded = true;

    shown += Math.max(0, (targetProgress(elapsed) - shown) * (pageLoaded ? 0.2 : 0.08));
    if (pageLoaded && !held && shown >= HOLD_AT - 0.6) {
      if (!holdStart) holdStart = now;
      if (now - holdStart >= HOLD_MS) held = true;
    }
    if (pageLoaded && shown > 99.5) shown = 100;

    countEl.textContent = String(Math.min(100, Math.floor(shown))).padStart(3, '0');
    barEl.style.transform = `scaleX(${shown / 100})`;

    const phase = (Math.max(0, now - loopStart) % loopMs) / loopMs;
    let label = STEPS[0][1];
    for (const [at, text] of STEPS) if (phase >= at) label = text;
    if (label !== currentLabel) { currentLabel = label; labelEl.textContent = label; }

    if (pageLoaded && shown >= 100 && elapsed >= minMs) {
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
