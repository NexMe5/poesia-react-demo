import { seededRandom, RNG_SEED, RNG_OFFSET } from '../../lib/random';

/**
 * Leaf shadows: sunlight through a plant, as in the bag photography.
 * Three branches with alternating leaves, drawn once from the shared seeded stream so every
 * shadow on the page is the same plant.
 */
function branch(rnd, x0, y0, len, ang, n) {
  const leaves = [];
  for (let i = 0; i < n; i++) {
    const t = (i + 1) / (n + 1);
    const x = x0 + Math.cos(ang) * len * t;
    const y = y0 + Math.sin(ang) * len * t;
    const side = i % 2 ? 1 : -1;
    const a = ang * 57.3 + side * (40 + rnd() * 25);
    const L = 70 + rnd() * 60;
    leaves.push({
      d: `M0,0 C${L * 0.3},${-L * 0.32} ${L * 0.75},${-L * 0.3} ${L},0 C${L * 0.75},${L * 0.3} ${L * 0.3},${L * 0.32} 0,0Z`,
      transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a.toFixed(1)})`,
    });
  }
  return { stem: `M${x0},${y0} L${x0 + Math.cos(ang) * len},${y0 + Math.sin(ang) * len}`, leaves };
}

export const LEAF_BRANCHES = (() => {
  const rnd = seededRandom(RNG_SEED, RNG_OFFSET.leaves);
  return [branch(rnd, 0, 40, 560, 0.38, 9), branch(rnd, 40, 0, 420, 0.9, 7), branch(rnd, 0, 260, 380, -0.12, 6)];
})();
