import { clamp, ease, lerp, seg } from '../../lib/math';
import { q, qa } from '../../lib/dom';

const CARD_TILT = [3, -4, 4];
const ORBIT_START = [20, 140, 255];

/**
 * II · Craft: three chapters (Altitude, Roasted, Soil to cup) around one pinned bag.
 * Three beans circle the bag on a tilted ring that keeps turning on its own clock;
 * at the end they drop away and only the bag stays, ready to hand over to the blends.
 */
export function createCraftScene(root, { reducedMotion }) {
  const giants = qa(root, '.giant .gw');
  const beans = qa(root, '.orbit .ob');
  const bag = q(root, '.craft-bag');
  const pillars = qa(root, '.pillar');
  const cards = qa(root, '.pcard');
  const floor = q(root, '.craft-floor');
  const head = q(root, '.craft-head');
  const orb = { p: 0, o: 0, dy: 0, drop: 0, bh: 0, back: [] };
  let alive = true;
  let raf = 0;

  function drawOrbit(now) {
    // seen from a little above: the far side passes behind the bag's top, the near side crosses its middle
    const bh = orb.bh || window.innerHeight * 0.6;
    const tilt = (-10 * Math.PI) / 180;
    const rx = Math.min(bh * 0.6, window.innerWidth / 2 - 48);
    const ry = bh * 0.34;
    const cy = -bh * 0.24;
    beans.forEach((b, i) => {
      const th = ((ORBIT_START[i] + orb.p * 220) * Math.PI) / 180 + (now / 1000) * 0.21;
      const x0 = Math.cos(th) * rx;
      const y0 = Math.sin(th) * ry;
      const depth = Math.sin(th);
      const x = x0 * Math.cos(tilt) - y0 * Math.sin(tilt);
      const y = x0 * Math.sin(tilt) + y0 * Math.cos(tilt) + cy;
      const back = depth < 0;
      if (back !== orb.back[i]) { orb.back[i] = back; b.classList.toggle('back', back); }
      b.style.opacity = orb.o * (back ? 0.9 : 1);
      b.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) translateY(${orb.dy}vh) rotate(${th * 57.3 * 0.5 + i * 70 + orb.drop * (i % 2 ? -260 : 300)}deg) scale(${1 + depth * 0.3})`;
    });
  }

  // the ring keeps turning only while the stage is on screen (an observer says when; no layout reads per frame)
  let onScreen = false;
  const io = reducedMotion ? null : new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen && !raf) raf = requestAnimationFrame(loop);
  });
  function loop(now) {
    raf = 0;
    if (!alive || !onScreen) return;
    if (orb.o > 0.001) drawOrbit(now);
    raf = requestAnimationFrame(loop);
  }
  if (io) io.observe(root);

  const render = (p) => {
    const e = ease.out(clamp(1 + p / 0.75));   // entrance plays while the cream scrolls up, so it never arrives empty
    const qp = seg(p, 0.04, 0.87);
    const u = qp * 2;
    const k = Math.min(1, Math.floor(u));
    const t = u - k;
    const f = Math.min(2, k + ease.inOut(clamp((t - 0.3) / 0.4)));   // 0 → 1 → 2 with resting plateaus
    const x = ease.inOut(seg(p, 0.89, 0.955));
    const keep = 1 - x;                                             // exit: only the bag stays

    giants.forEach((g, i) => {
      const d = f - i;
      const a = Math.abs(d);
      const enter = i === 0 ? (1 - e) * 36 : 0;
      g.style.opacity = clamp(1 - a * 2.3) * (i === 0 ? e : 1) * keep;
      g.style.transform = `translate(-50%,-50%) translate3d(${-enter}vw,${-d * 22}vh,0) scale(${1 - Math.min(a, 1) * 0.08})`;
    });
    bag.style.transform = `translate(-50%,-50%) translate3d(0,${(1 - e) * 26 + Math.sin(qp * Math.PI * 3) * 1.2 * keep}vh,0) rotate(${lerp(-9, 7, f / 2)}deg) scale(${0.94 + e * 0.06})`;
    floor.style.opacity = keep;
    head.style.opacity = keep;
    bag.style.opacity = e;

    orb.p = p;
    orb.drop = ease.in(seg(p, 0.88, 0.955));
    orb.o = e * (1 - seg(p, 0.95, 0.97));
    orb.dy = (1 - e) * 26 + orb.drop * 90;
    if (reducedMotion || orb.o <= 0.001) drawOrbit(0);

    pillars.forEach((el, i) => {
      const d = f - i;
      const a = Math.abs(d);
      const o = clamp(1 - a * 2.2) * (i === 0 ? e : 1) * keep;
      el.style.opacity = o;
      el.style.visibility = o < 0.02 ? 'hidden' : 'visible';
      el.style.transform = `translate3d(0,${-d * 46 + (i === 0 ? (1 - e) * 30 : 0)}px,0)`;
    });
    cards.forEach((el, i) => {
      const d = f - i;
      const a = Math.abs(d);
      el.style.opacity = clamp(1 - a * 1.6) * (i === 0 ? e : 1) * keep;
      // incoming cards slide in from the right, outgoing ones drop away like a dealt polaroid
      el.style.transform = d < 0
        ? `translate3d(${-d * 26}vw,${-d * 4}vh,0) rotate(${CARD_TILT[i] - d * 14}deg)`
        : `translate3d(${-d * 6}vw,${d * 26}vh,0) rotate(${CARD_TILT[i] - d * 18}deg)`;
    });
  };

  return {
    render,
    size() { orb.bh = bag.offsetHeight; },
    dispose() { alive = false; cancelAnimationFrame(raf); if (io) io.disconnect(); },
  };
}
