import { useEffect, useRef } from 'react';
import { engine } from '../../engine/scrollEngine';
import { navRange, nextStop, prevStop, stopAt, storyStops, storyZones } from '../../navigation/stops';
import './StoryNav.css';

/**
 * ← → in the bottom left corner, from the Origin to the end of the equipment chapter: for visitors who do not
 * realise the story scrolls.
 * → glides (never jumps) to the next resting frame (navigation/stops), so every shot on the way still plays;
 * ← glides back to the previous one. Any touch, wheel or key during a glide hands the scroll straight back.
 * The stops are read once per layout (with the scroll engine's measure), so a scroll frame only compares two
 * numbers to grey out ← at the top and → after the last stop. Scrolling never re-renders React.
 */
export default function StoryNav({ armed }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!armed || !root) return undefined;
    const prevBtn = root.querySelector('.sn-prev');
    const nextBtn = root.querySelector('.sn-next');
    let stops = storyStops();
    let zones = storyZones();
    let range = navRange();
    let glide = 0;

    const sync = () => {
      const y = window.scrollY;
      prevBtn.disabled = prevStop(stops, y) == null;
      nextBtn.disabled = nextStop(stops, y) == null;
      // shown from the Origin to the end of the equipment chapter only (navigation/stops: navRange)
      root.classList.toggle('on', y >= range[0] - 2 && y <= range[1] + 2);
    };
    const offMeasure = engine.addMeasureHook(() => { stops = storyStops(); zones = storyZones(); range = navRange(); sync(); });

    const stopGlide = () => {
      if (glide) { cancelAnimationFrame(glide); glide = 0; }
      engine.setGliding(false);
    };
    /**
     * A glide is paced by what is on screen, not by distance. Stretches where a reveal plays (navigation/stops:
     * storyZones) are crossed at a calm reading pace; stretches where nothing changes are crossed quickly. The
     * page is cut into those pieces, each given a time, and the glide eases over the total time (moving from the
     * first frame, settling softly at the end).
     */
    const ZONE_S_PER_SCREEN = 1.05;
    const OPEN_S_PER_SCREEN = 0.22;
    const plan = (a, b) => {
      const vh = window.innerHeight;
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const cuts = [lo, hi];
      zones.forEach(([z0, z1]) => { if (z0 > lo && z0 < hi) cuts.push(z0); if (z1 > lo && z1 < hi) cuts.push(z1); });
      cuts.sort((x, y) => x - y);
      let pieces = [];
      for (let i = 0; i < cuts.length - 1; i++) {
        const p0 = cuts[i];
        const p1 = cuts[i + 1];
        const mid = (p0 + p1) / 2;
        const zone = zones.find(([z0, z1]) => mid > z0 && mid < z1);
        // a timed reveal costs its share of its fixed time; any other zone a steady pace; open page a quick one
        const cost = zone && zone[2] != null
          ? zone[2] * ((p1 - p0) / Math.max(1, zone[1] - zone[0]))
          : ((p1 - p0) / vh) * (zone ? ZONE_S_PER_SCREEN : OPEN_S_PER_SCREEN);
        pieces.push({ len: p1 - p0, cost });
      }
      if (b < a) pieces = pieces.reverse();
      const total = pieces.reduce((s, p) => s + p.cost, 0);
      return { pieces, total };
    };
    // part steady, part smoothstep: the page is already moving on the first frame (no wind-up you could
    // mistake for a delay) and still settles softly onto the stop
    const pace = (t) => 0.4 * t + 0.6 * t * t * (3 - 2 * t);
    const glideTo = (to) => {
      stopGlide();
      const from = window.scrollY;
      const d = to - from;
      if (engine.reducedMotion || Math.abs(d) < 2) { engine.jumpTo(to); return; }
      const { pieces, total } = plan(from, to);
      const dur = Math.min(2800, Math.max(800, (total + 0.25) * 1000));
      const dir = Math.sign(d);
      const t0 = performance.now();
      engine.setGliding(true);
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        // time spent so far → distance covered, piece by piece
        let c = pace(t) * total;
        let moved = 0;
        for (const p of pieces) {
          if (c >= p.cost) { c -= p.cost; moved += p.len; continue; }
          moved += p.cost ? (c / p.cost) * p.len : p.len;
          break;
        }
        window.scrollTo(0, Math.round(t < 1 ? from + dir * moved : to));
        if (t < 1) glide = requestAnimationFrame(step);
        else { glide = 0; engine.setGliding(false); }
      };
      glide = requestAnimationFrame(step);
    };
    // a second tap while gliding moves on from where that glide was heading, not from the current frame
    let target = null;
    const go = (pick) => {
      const from = glide && target != null ? target : window.scrollY;
      const to = pick(stops, from);
      if (!to) return;
      target = to.y;
      // The blends are timed shots, not scrubbed: the scroll between two of them moves nothing on screen and
      // only decides when the next shot starts. So from one blend to the next the page is set at once and the
      // shot plays immediately, instead of starting half a second into a glide.
      const here = stopAt(stops, from);
      if (to.shot && here && here.shot) { stopGlide(); engine.jumpTo(to.y); return; }
      glideTo(to.y);
    };
    const onPrev = () => go(prevStop);
    const onNext = () => go(nextStop);
    const onUserInput = (e) => { if (glide && !root.contains(e.target)) { stopGlide(); target = null; } };

    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);
    window.addEventListener('scroll', sync, { passive: true });
    ['wheel', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, onUserInput, { passive: true }));
    sync();
    return () => {
      stopGlide();
      offMeasure();
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      window.removeEventListener('scroll', sync);
      ['wheel', 'touchstart', 'keydown'].forEach((t) => window.removeEventListener(t, onUserInput));
    };
  }, [armed]);

  return (
    <nav ref={ref} className="story-nav" aria-label="Story">
      <button type="button" className="sn-prev" aria-label="Previous" disabled>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5.5M11 6l-6 6 6 6" /></svg>
      </button>
      <button type="button" className="sn-next" aria-label="Next">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13.5M13 6l6 6-6 6" /></svg>
      </button>
    </nav>
  );
}
