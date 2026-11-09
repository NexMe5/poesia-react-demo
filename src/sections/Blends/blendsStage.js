import { hasFinePointer, isMobile } from '../../lib/env';
import { q, qa } from '../../lib/dom';
import { BLENDS, blendShotAt, blendShotMiddle } from '../../data/blends';

/**
 * IV · Blends: a short film in shots. Like a smart-animate prototype, each scroll threshold plays a
 * whole timed shot (CSS transitions) instead of scrubbing:
 *   0 hand-off — the craft bag, exactly where the craft stage left it
 *   1 the range — four bags standing on an oak counter, alive under the pointer
 *   2–5 one blend in focus, its colour pouring out from the bag and filling the room
 */

/** The range fanned across the stage: [x vw, y vh, rotate, scale] for espresso, classico, dolce, crema. */
const SHELF = {
  desktop: [[50, 84.6, -1.5, 0.74], [33.5, 80.2, -3.5, 0.6], [64.5, 80.8, 2.5, 0.62], [77.8, 78.6, 5, 0.52]],
  phone: [[42, 70.6, -1.5, 0.66], [16, 67.6, -3.5, 0.5], [67, 68, 2.5, 0.52], [86, 66.4, 5, 0.44]],
};
const DEPTH = [1, 0.6, 0.66, 0.45];   // how far each bag drifts with the pointer

export function createBlendsStage(section, { reducedMotion, getCraftBag }) {
  const stage = q(section, '.sticky');
  const el = {
    copies: qa(section, '.blend'),
    bags: qa(section, '.bbag'),
    shadows: qa(section, '.bshadow'),
    tags: qa(section, '.btag'),
    counter: q(section, '.counter'),
    counterTop: q(section, '.ctr-top'),
    glow: q(section, '.bag-glow'),
    names: qa(section, '.bname'),
    bagsWrap: q(section, '.blend-bags'),
    room: q(section, '.blend-bg'),
    wash: q(section, '.blend-wash'),
  };
  let sectionTop = 0;   // cached in measure(): never read layout during a scroll frame
  const hand = { dx: 0, dy: 0, s: 1, r: 7 };   // where the craft bag stood, relative to this stage's bag slot
  const slot = { x: 0, y: 0 };                 // this stage's bag slot
  let shot = -1;
  const cleanups = [];

  // the living fan (range shot only): bags drift with the pointer by depth, lift when hovered, open their blend on click
  const live = {
    mx: 0, my: 0, tx: 0, ty: 0, hover: -1, lift: [0, 0, 0, 0], on: false, raf: 0,
    reset() {
      live.hover = -1;
      live.on = false;
      el.bags.forEach((b) => { b.style.translate = ''; });
      el.tags.forEach((t) => t.classList.remove('on'));
    },
    tick() {
      if (stage.dataset.s !== '1') { live.on = false; return; }
      live.mx += (live.tx - live.mx) * 0.08;
      live.my += (live.ty - live.my) * 0.08;
      el.bags.forEach((b, i) => {
        live.lift[i] += ((live.hover === i ? 1 : 0) - live.lift[i]) * 0.14;
        b.style.translate = `${live.mx * DEPTH[i] * 16}px ${live.my * DEPTH[i] * 6 - live.lift[i] * 18}px`;
        el.shadows[i].style.scale = `${1 - live.lift[i] * 0.14} ${1 - live.lift[i] * 0.2}`;
      });
      live.raf = requestAnimationFrame(live.tick);
    },
    start() {
      if (!live.on && stage.dataset.s === '1') { live.on = true; live.raf = requestAnimationFrame(live.tick); }
    },
  };

  const pose = (node, x, y, r, sc, o, delay, z) => {
    node.style.transitionDelay = `${delay}s, ${o ? delay : 0}s`;
    node.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,0) rotate(${r}deg) scale(${sc})`;
    node.style.opacity = o;
    node.style.zIndex = z;
  };

  function setShot(s, instant) {
    if (s === shot) return;
    shot = s;
    const mob = isMobile();
    const W = window.innerWidth / 100;
    const H = window.innerHeight / 100;
    const k = s - 2;   // the blend in focus, or < 0 before the first one
    const shelf = mob ? SHELF.phone : SHELF.desktop;
    const bh = el.bags[0].offsetHeight / H;
    const fan = shelf.map(([x, bot, r, sc]) => [x, bot - bh * (0.1 + 0.4 * sc), r, sc]);

    stage.dataset.s = s;
    section.dataset.tone = s <= 1 ? 'light' : 'dark';   // the header reads the cream stage as light
    stage.classList.toggle('instant', !!instant);
    if (k >= 0) {
      el.room.style.backgroundColor = BLENDS[k].room;
      el.wash.style.setProperty('--wash', BLENDS[k].room);
      el.glow.style.setProperty('--blend-glow', BLENDS[k].glow);
    }
    // blends two and four mirror the composition on wide screens: the bag crosses left, the words right
    const alt = k % 2 === 1 && !mob ? window.innerWidth - 2 * slot.x : 0;
    el.glow.style.setProperty('--gx', `${alt}px`);

    el.bags.forEach((bag, i) => {
      const [fx, fy, fr, fs] = fan[i];
      const toFanX = fx * W - slot.x;
      const toFanY = fy * H - slot.y;
      if (s === 0) {
        if (i === 0) pose(bag, hand.dx, hand.dy, hand.r, hand.s, 1, 0, 5);
        else pose(bag, toFanX, toFanY + 14 * H, fr * 1.6, fs * 0.8, 0, 0, 4 - i);
      } else if (s === 1) {
        // the rest of the range rises in behind it, one after another
        pose(bag, toFanX, toFanY, fr, fs, 1, i === 0 ? 0 : 0.12 + i * 0.1, i === 0 ? 5 : 4 - i);
      } else if (i === k) {
        pose(bag, alt, 0, alt ? 3 : 0, 1, 1, 0.05, 5);
      } else {
        // the others leave the frame, spinning away to the side they came from
        const side = i < k ? -1 : 1;
        pose(bag, side * (mob ? 95 : 62) * W, 8 * H, side * 26, 0.78, 0, i === k - 1 || i === k + 1 ? 0 : 0.04, 3);
      }
    });

    // contact shadows and name tags follow the shelf poses
    const lip = el.counter.offsetTop + el.counterTop.offsetHeight;
    el.shadows.forEach((sh, i) => {
      const [fx, bot, , sc] = shelf[i];
      const w = el.bags[i].offsetWidth * sc;
      sh.style.setProperty('--sw', `${w * 1.02}px`);
      sh.style.transform = `translate(-50%,-50%) translate3d(${fx * W - slot.x}px,${bot * H - slot.y - 0.5 * H}px,0)`;
      sh.style.opacity = s === 1 ? 1 : 0;
      sh.style.transitionDelay = s === 1 ? `${(i ? 0.12 + i * 0.1 : 0) + 0.5}s` : '0s';
    });
    el.tags.forEach((t, i) => {
      t.style.left = `${shelf[i][0] * W}px`;
      t.style.top = `${lip + (mob ? 1.4 : 2.2) * H}px`;
    });
    if (s !== 1) live.reset();
    el.copies.forEach((c, i) => { c.classList.toggle('on', i === k); c.classList.toggle('past', k >= 0 && i < k); });
    el.names.forEach((n, i) => { n.classList.toggle('on', i === k); n.classList.toggle('past', k >= 0 && i < k); });
    if (instant) requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.remove('instant')));
  }

  /** Where the craft bag stood and where this stage's slot is, both from layout (transforms ignored). */
  function measure() {
    const craftBag = getCraftBag();
    sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const b0 = el.bags[0];
    const st = stage.getBoundingClientRect();
    const cr = el.bagsWrap.getBoundingClientRect();
    slot.x = cr.left - st.left + b0.offsetLeft;
    slot.y = cr.top - st.top + b0.offsetTop;
    if (craftBag) {
      hand.dx = craftBag.offsetLeft - slot.x;
      hand.dy = craftBag.offsetTop - slot.y;
      hand.s = craftBag.offsetHeight / Math.max(1, b0.offsetHeight);
    }
    el.wash.style.setProperty('--at', `${((slot.x / window.innerWidth) * 100).toFixed(1)}%`);
    const s = shot;
    shot = -1;
    setShot(s < 0 ? 0 : s, true);
  }

  const listen = (target, type, fn) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };
  if (hasFinePointer() && !reducedMotion) {
    listen(stage, 'pointermove', (e) => {
      live.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      live.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      live.start();
    });
    el.bags.forEach((b, i) => {
      listen(b, 'pointerenter', () => {
        if (stage.dataset.s !== '1') return;
        live.hover = i;
        el.tags.forEach((t, j) => t.classList.toggle('on', j === i));
        live.start();
      });
      listen(b, 'pointerleave', () => {
        if (live.hover === i) { live.hover = -1; el.tags[i].classList.remove('on'); }
      });
    });
  }
  // a bag on the counter opens its own blend: scroll to the middle of that shot
  el.bags.forEach((b, i) => listen(b, 'click', () => {
    if (stage.dataset.s !== '1') return;
    const len = section.offsetHeight - window.innerHeight;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + len * blendShotMiddle(i), behavior: 'smooth' });
  }));

  return {
    render: (p) => setShot(blendShotAt(p)),
    measure,
    setShot,
    /** While the section slides over the pinned craft stage its own stage stays hidden; it appears the moment it pins. */
    syncVisibility: (() => {
      let shown = null;
      return (y) => {
        const show = sectionTop - y <= 0.5;
        if (show !== shown) { shown = show; stage.style.visibility = show ? 'visible' : 'hidden'; }
      };
    })(),
    dispose() { cancelAnimationFrame(live.raf); cleanups.forEach((fn) => fn()); },
  };
}
