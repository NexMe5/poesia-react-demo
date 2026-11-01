import { clamp, lerp } from '../../lib/math';
import { seededRandom, RNG_SEED, RNG_OFFSET } from '../../lib/random';

/**
 * The torn reveal. The tear runs along the real bean's crease (its seed partition, sampled from the
 * cut-out), then on up and down the screen with a little hand-torn jitter. It clips the two dark panels,
 * their paper fibres and the glowing crack line.
 */
const CREASE = [[.545, 0], [.5055, .0357], [.4731, .0714], [.522, .1071], [.5172, .1429], [.5163, .1786], [.5033, .2143], [.4921, .25], [.4853, .2857], [.4673, .3214], [.4825, .3571], [.4894, .3929], [.4929, .4286], [.5118, .4643], [.5246, .5], [.5193, .5357], [.5207, .5714], [.5181, .6071], [.5193, .6429], [.523, .6786], [.5076, .7143], [.5079, .75], [.5204, .7857], [.5443, .8214], [.5075, .8571], [.4894, .8929], [.5471, .9286], [.5522, .9643], [.5212, 1]];
const BEAN_TILT = -12;
const SEGS = 13;

const rnd = seededRandom(RNG_SEED, RNG_OFFSET.tear);
const JIT_TOP = Array.from({ length: SEGS }, () => rnd() - 0.5);
const JIT_BOTTOM = Array.from({ length: SEGS }, () => rnd() - 0.5);
const FIBRE_JIT = Array.from({ length: 90 }, () => rnd());

export function createTear({ stage, beanStage, panelL, panelR, fiberL, fiberR, crackLine }) {
  /** `shift` is the wordmark's centring shift: the bean (and so the crease) moves with it. */
  function build(shift = 0) {
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    if (!W || !H) return;   // not laid out: keep the last good shape
    const bw = beanStage.offsetWidth;
    const bh = (bw * 700) / 501;
    const th = (BEAN_TILT * Math.PI) / 180;
    const c = Math.cos(th);
    const sn = Math.sin(th);
    const k = -sn / c;
    const mid = CREASE.map(([u, v]) => {
      const x = (u - 0.5) * bw;
      const y = (v - 0.5) * bh;
      return [W / 2 + shift + x * c - y * sn, H / 2 + x * sn + y * c];
    });
    const [tx, ty] = mid[0];
    const [bx, by] = mid[mid.length - 1];
    const top = [];
    const bot = [];
    for (let i = 0; i < SEGS; i++) {
      const t = i / SEGS;
      const y = lerp(-0.02 * H, ty, t);
      const fade = 1 - t * 0.7;
      top.push([tx + (y - ty) * k + JIT_TOP[i] * 26 * fade, y]);
    }
    for (let i = 1; i <= SEGS; i++) {
      const t = i / SEGS;
      const y = lerp(by, 1.02 * H, t);
      const fade = 0.3 + t * 0.7;
      bot.push([bx + (y - by) * k + JIT_BOTTOM[i - 1] * 26 * fade, y]);
    }
    const pts = [...top, ...mid, ...bot].map(([x, y]) => [+(clamp(x / W, 0.2, 0.8) * 100).toFixed(2), +((y / H) * 100).toFixed(2)]);
    const offset = (dir) => pts.map(([px, py], i) => [+(px + dir * (0.3 + FIBRE_JIT[i % FIBRE_JIT.length] * 0.7)).toFixed(2), py]);
    const poly = (side, list) => {
      const edge = list.map(([px, py]) => `${px}% ${py}%`).join(',');
      return side === 'l' ? `polygon(-2% -2%,${edge},-2% 102%)` : `polygon(102% -2%,${edge},102% 102%)`;
    };
    panelL.style.clipPath = poly('l', pts);
    panelR.style.clipPath = poly('r', pts.map(([px, py]) => [+(px - 0.3).toFixed(2), py]));
    fiberL.style.clipPath = poly('l', offset(1));
    fiberR.style.clipPath = poly('r', offset(-1));
    crackLine.setAttribute('points', pts.map((p) => p.join(',')).join(' '));
  }
  return { build };
}
