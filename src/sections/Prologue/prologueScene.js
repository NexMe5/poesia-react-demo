import { clamp, ease, seg } from '../../lib/math';
import { q, qa } from '../../lib/dom';
import { BEAN_CHIPS, HERO_BEANS, HERO_BAG_ORDER } from '../../data/prologue';

/** The prologue tells its story in the first 80% of its scroll; the rest is the exit beat where the range lifts off. */
export const PROLOGUE_STORY = 0.8;

const BAG_TILT = [-12, -4, 9, 17];
const BAG_FROM = [-34, 18, -22, 30];
/** Where each bag flies on the way out: [x vw, y vh, extra spin]. */
const BAG_EXIT = [[-24, -118, -32], [-6, -126, -10], [14, -120, 22], [30, -112, 34]];

/**
 * Bean → crack → tear → the sunlit range. Returns render(p) for the scroll engine.
 * `onStory(p)` receives the story progress (0..1) every frame.
 */
export function createPrologueScene(root, onStory) {
  const el = {
    hint: qa(root, '.intro-bottom,.scroll-hint,.dust,.bokeh'),
    glow: q(root, '.bean-stage .bean-glow'),
    crack: q(root, '.crack'),
    tl: q(root, '.tear-l'),
    tr: q(root, '.tear-r'),
    tear: q(root, '.tear'),
    fibers: qa(root, '.fiber'),
    bl: q(root, '.bean-stage .bean-l'),
    br: q(root, '.bean-stage .bean-r'),
    chips: qa(root, '.chip'),
    beans: qa(root, '.hb'),
    bags: HERO_BAG_ORDER.map((key) => q(root, `.b-${key}`)),
    hc: qa(root, '.hc'),
    copy: q(root, '.hero-copy'),
    bagsWrap: q(root, '.hero-bags'),
  };

  return (p0) => {
    const p = clamp(p0 / PROLOGUE_STORY);
    onStory(p);
    // the header turns ink once the cream range is under it
    root.dataset.tone = p > 0.42 ? 'light' : 'dark';

    const ex = (i) => ease.inOut(seg(p0, 0.84 + i * 0.03, 0.96 + i * 0.012));
    const a = seg(p, 0, 0.13);
    el.hint.forEach((h) => {
      h.style.opacity = 1 - seg(p, 0, 0.08);
      h.style.transform = `translateY(${-seg(p, 0, 0.08) * 24}px)`;
    });

    // the crack glows down the bean, then is gone the moment the halves part
    el.crack.style.clipPath = `inset(0 0 ${(1 - ease.inOut(a)) * 100}% 0)`;
    el.crack.style.opacity = 1 - seg(p, 0.125, 0.145);

    const s = ease.inOut(seg(p, 0.13, 0.52));
    el.fibers.forEach((f) => { f.style.opacity = seg(p, 0.13, 0.17); });
    el.tl.style.transform = `translate3d(${-64 * s}vw,0,0) rotate(${-2.5 * s}deg)`;
    el.tr.style.transform = `translate3d(${64 * s}vw,0,0) rotate(${2.5 * s}deg)`;
    el.tear.style.visibility = s >= 0.999 ? 'hidden' : 'visible';
    el.tear.classList.toggle('open', s > 0.002);

    el.glow.style.opacity = (0.55 + a * 0.45) * (1 - seg(p, 0.22, 0.4));
    el.glow.style.transform = `scale(${1 + a * 0.5})`;
    const bs = ease.inOut(seg(p, 0.13, 0.58));
    const bo = 1 - seg(p, 0.46, 0.56);
    el.bl.style.transform = `translate(${-430 * bs}%,${-14 * bs}%) rotate(${-30 * bs}deg) scale(${1 + bs})`;
    el.br.style.transform = `translate(${430 * bs}%,${16 * bs}%) rotate(${26 * bs}deg) scale(${1 + bs})`;
    el.bl.style.opacity = el.br.style.opacity = bo;

    // real beans thrown out of the crack
    const cp = ease.out(seg(p, 0.14, 0.5));
    const co = 1 - seg(p, 0.32, 0.5);
    el.chips.forEach((chip, i) => {
      const c = BEAN_CHIPS[i];
      chip.style.opacity = seg(p, 0.13, 0.15) * co;
      chip.style.transform = `translate(${c.dx * cp}vw,${c.dy * cp}vh) rotate(${c.r * cp}deg) scale(${c.s})`;
    });

    // the range rises in one bag after another, then lifts off on the exit beat
    el.bags.forEach((b, i) => {
      const t = ease.out(seg(p, 0.3 + i * 0.045, 0.62 + i * 0.045));
      const x = ex(i);
      const [ox, oy, orr] = BAG_EXIT[i];
      b.style.opacity = seg(p, 0.3 + i * 0.045, 0.4 + i * 0.045);
      b.style.transform = `translate3d(${x * ox}vw,${(1 - t) * 70 + x * oy}vh,0) rotate(${BAG_TILT[i] + BAG_FROM[i] * (1 - t) + x * orr}deg)`;
    });

    const bx = ease.inOut(seg(p0, 0.83, 0.98));
    el.beans.forEach((bean, i) => {
      const h = HERO_BEANS[i];
      const t = ease.out(seg(p, 0.34 + i * 0.03, 0.7 + i * 0.02));
      bean.style.opacity = t;
      bean.style.transform = `translate3d(0,${(1 - t) * 40 * h.depth - bx * 90 * h.depth}vh,0) rotate(${h.rotate + (1 - t) * 160 + bx * 220}deg)`;
    });

    el.hc.forEach((node, i) => {
      const t = ease.out(seg(p, 0.5 + i * 0.04, 0.72 + i * 0.04));
      const x = ease.inOut(seg(p0, 0.88 + i * 0.02, 0.97 + i * 0.01));
      const fadeIn = node.classList.contains('cta-row') ? clamp(t * 2.6) : t;   // buttons: quick fade, mostly a rise
      node.style.opacity = fadeIn * (1 - x);
      node.style.transform = `translate3d(0,${(1 - t) * 34 - x * 60}px,0)`;
    });

    const hold = seg(p, 0.62, 1);
    el.copy.style.transform = `translate3d(0,${-hold * 4}vh,0)`;
    el.bagsWrap.style.transform = `translate3d(0,${-hold * 9}vh,0) scale(${1 + hold * 0.04})`;
  };
}
