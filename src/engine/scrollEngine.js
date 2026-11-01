import { clamp } from '../lib/math';
import { prefersReducedMotion } from '../lib/env';

/**
 * Scroll engine: the one loop that drives every pinned chapter.
 *
 * A scene is a DOM element plus a render(progress) function. Each frame the engine works out how far
 * the page has scrolled through every scene, eases that number towards its target (so motion stays
 * fluid with a native, unmodified scroll), and calls render only when the value changed.
 * The loop sleeps once the page is still and every scene has settled; scrolling or a re-measure wakes it.
 *
 * Scene options
 *   lag     smoothing factor per frame (default .13; lower = softer)
 *   mode    'view' — progress while the element passes through the viewport (start/span/end tune the window)
 *   enter   pinned scenes may report -1 → 0 during the screen before they pin, so their opening plays early
 *   size()  called before each measure (a scene can resize itself or cache layout)
 *   rest    progress rendered once when the visitor prefers reduced motion (default 1)
 */
function createScrollEngine({ reducedMotion }) {
  let scenes = [];
  const frameHooks = new Set();
  const resizeHooks = new Set();
  const measureHooks = new Set();
  let looping = false;
  let idle = 0;
  let lastY = -1;
  let started = false;
  let cleanups = [];

  /** Values one chapter publishes for another (the craft bag for the blends hand-off, etc.). */
  const shared = {};

  const byDocumentOrder = (a, b) =>
    a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

  function addScene(el, render, opts = {}) {
    const scene = { el, render, sp: null, last: -2, top: 0, h: 0, len: 1, ...opts };
    // measured top to bottom, so a chapter that resizes itself (the journey) is settled before those below it
    scenes = [...scenes, scene].sort(byDocumentOrder);
    if (started) requestAnimationFrame(measure);
    return () => { scenes = scenes.filter((s) => s !== scene); };
  }

  function progress(s, y) {
    const vh = window.innerHeight;
    if (s.mode === 'view') {
      const a = s.top - vh * (s.start ?? 0.9);
      const b = s.top + s.h * (s.span ?? 0.8) - vh * (s.end ?? 0.4);
      return clamp((y - a) / Math.max(1, b - a));
    }
    if (s.enter && y < s.top) return Math.max(-1, (y - s.top) / vh);
    return clamp((y - s.top) / s.len);
  }

  function measure() {
    const vh = window.innerHeight;
    for (const s of scenes) {
      if (s.size) s.size();
      s.top = s.el.getBoundingClientRect().top + window.scrollY;
      s.h = s.el.offsetHeight;
      s.len = Math.max(1, s.h - vh);
    }
    // layout is read here, once, never during a scroll frame (reading it after writing styles forces a reflow)
    measureHooks.forEach((fn) => fn());
    wake();
  }

  const runFrameHooks = (y) => frameHooks.forEach((fn) => fn(y));

  function frame() {
    const y = window.scrollY;
    let busy = y !== lastY;
    lastY = y;
    for (const s of scenes) {
      const p = progress(s, y);
      if (s.sp === null) s.sp = p;
      s.sp += (p - s.sp) * (s.lag ?? 0.13);
      if (Math.abs(p - s.sp) < 0.0004) s.sp = p;
      if (s.sp !== p) busy = true;
      if (s.sp !== s.last) { s.render(s.sp); s.last = s.sp; }
    }
    runFrameHooks(y);
    idle = busy ? 0 : idle + 1;
    if (idle < 20 && started) requestAnimationFrame(frame);
    else looping = false;
  }

  function wake() {
    if (!looping && started && !reducedMotion) {
      looping = true;
      idle = 0;
      requestAnimationFrame(frame);
    }
  }

  /** Jump to a scroll position and snap every scene straight to that frame, so nothing replays on arrival. */
  function jumpTo(y) {
    if (y == null) return;
    y = Math.max(0, Math.round(y));
    window.scrollTo(0, y);
    if (!reducedMotion) {
      for (const s of scenes) {
        const p = progress(s, y);
        s.sp = p;
        if (p !== s.last) { s.render(p); s.last = p; }
      }
    }
    runFrameHooks(y);
    wake();
  }

  /** Per-frame UI work that is not a scene (nav tone, stage visibility). Returns an unsubscribe. */
  function addFrameHook(fn) {
    frameHooks.add(fn);
    return () => frameHooks.delete(fn);
  }

  /** Layout to cache after every measure (section bands, offsets), so frame hooks never read layout. */
  function addMeasureHook(fn) {
    measureHooks.add(fn);
    return () => measureHooks.delete(fn);
  }

  /** Work to redo when the viewport changes, before scenes are measured again. */
  function addResizeHook(fn) {
    resizeHooks.add(fn);
    return () => resizeHooks.delete(fn);
  }

  /** Attach the listeners and render the first frame. Returns a stop function. */
  function start() {
    if (started) return stop;
    started = true;
    const listen = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    measure();
    if (reducedMotion) {
      // every scene shows its resting state once; only the UI hooks follow the scroll
      scenes.forEach((s) => s.render(s.rest ?? 1));
      const onScroll = () => runFrameHooks(window.scrollY);
      listen(window, 'scroll', onScroll, { passive: true });
      onScroll();
    } else {
      listen(window, 'scroll', wake, { passive: true });
      wake();
    }

    let timer;
    const remeasure = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { resizeHooks.forEach((fn) => fn()); measure(); }, 120);
    };
    // Phones resize the window whenever the address bar slides in or out while scrolling. The stages are
    // sized in svh and don't change, so re-measuring then would only stall the scroll: react to width
    // changes (rotation, desktop resizing) and to real height changes only.
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    listen(window, 'resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (touch && w === lastW && Math.abs(h - lastH) < 160) return;
      lastW = w;
      lastH = h;
      remeasure();
    });
    listen(window, 'load', measure);
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(remeasure);
      ro.observe(document.body);
      cleanups.push(() => ro.disconnect());
    }
    if (document.fonts) document.fonts.ready.then(() => started && measure());
    cleanups.push(() => clearTimeout(timer));
    return stop;
  }

  function stop() {
    started = false;
    looping = false;
    cleanups.forEach((fn) => fn());
    cleanups = [];
  }

  return { reducedMotion, shared, addScene, addFrameHook, addMeasureHook, addResizeHook, measure, wake, jumpTo, progress, start, stop };
}

/** The page has one scroll, so it has one engine. */
export const engine = createScrollEngine({ reducedMotion: prefersReducedMotion });
