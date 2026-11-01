import { img } from '../lib/assets';
import { seededRandom, RNG_SEED, RNG_OFFSET } from '../lib/random';

/** The range fanned across the hero, back to front as in the prototype markup. */
export const HERO_BAGS = [
  { key: 'classico', src: img('bag-classico.webp'), width: 673, height: 1127 },
  { key: 'crema', src: img('bag-crema.webp'), width: 671, height: 1127 },
  { key: 'dolce', src: img('bag-dolce.webp'), width: 676, height: 1150 },
  { key: 'espresso', src: img('bag-espresso.webp'), width: 680, height: 1147 },
];

/** Bag order the prologue animates (left to right): classico, espresso, dolce, crema. */
export const HERO_BAG_ORDER = ['classico', 'espresso', 'dolce', 'crema'];

/** Floating beans on the hero: sharp ones mid-depth, soft ones in the foreground. */
export const HERO_BEANS = [
  { left: 7, top: 16, width: 64, rotate: -20, bean: '00', z: 1 },
  { left: 12, top: 58, width: 44, rotate: 30, bean: '17', z: 1 },
  { left: 47, top: 8, width: 40, rotate: 12, bean: '11', z: 1 },
  { left: 93, top: 66, width: 58, rotate: -40, bean: '08', z: 3 },
  { left: 62, top: 86, width: 40, rotate: 60, bean: '20', z: 3 },
  { left: 85, top: 6, width: 38, rotate: -10, bean: '18', z: 1 },
  { left: 88, top: 40, width: 30, rotate: 70, bean: '06', z: 1 },
].map((b) => ({ ...b, src: img(`rb-${b.bean}.webp`), depth: 0.4 + b.width / 60, low: b.top > 50 }));

/** Real beans thrown out of the crack: size, flight vector, spin and scale, from the shared seeded stream. */
const CHIP_BEANS = ['01', '03', '09', '10', '13', '14', '16', '19', '06', '17'];
export const BEAN_CHIPS = (() => {
  const rnd = seededRandom(RNG_SEED, RNG_OFFSET.chips);
  return Array.from({ length: 16 }, (_, i) => {
    const size = +(16 + rnd() * 30).toFixed(0);
    const ang = (i / 16) * Math.PI * 2 + rnd() * 0.5;
    return {
      src: img(`rb-${CHIP_BEANS[i % CHIP_BEANS.length]}.webp`),
      size,
      dx: Math.cos(ang) * (18 + rnd() * 30),
      dy: Math.sin(ang) * (14 + rnd() * 26),
      r: (rnd() - 0.5) * 720,
      s: 0.7 + rnd() * 0.8,
    };
  });
})();
