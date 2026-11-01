import { isMobile } from '../../lib/env';

/**
 * Coffee dust: a fine plume of ground coffee rising up and to the right of the bean, a softer puff to
 * the left, a warm haze behind it and a few larger grounds. Sprites are pre-rendered, the static haze is
 * painted once as the canvas background, and drawing runs at 30 fps only while `isActive()`.
 */
const COLS = [[222, 170, 120], [176, 114, 68], [128, 78, 44], [242, 206, 160]];
const DIRS = [(-62 * Math.PI) / 180, (-128 * Math.PI) / 180];
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function dotSprite([R, G, B], soft) {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, `rgba(${R},${G},${B},1)`);
  g.addColorStop(soft, `rgba(${R},${G},${B},.8)`);
  g.addColorStop(1, `rgba(${R},${G},${B},0)`);
  x.fillStyle = g;
  x.fillRect(0, 0, 32, 32);
  return c;
}

/** An irregular coffee ground, lit from the top left like the letters. */
function groundSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const x = c.getContext('2d');
  const n = 6 + ((Math.random() * 3) | 0);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 9 + Math.random() * 6;
    pts.push([16 + Math.cos(a) * r, 16 + Math.sin(a) * r * (0.6 + Math.random() * 0.4)]);
  }
  x.beginPath();
  x.moveTo((pts[0][0] + pts[n - 1][0]) / 2, (pts[0][1] + pts[n - 1][1]) / 2);
  pts.forEach((p, i) => { const q = pts[(i + 1) % n]; x.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2); });
  const g = x.createLinearGradient(6, 6, 26, 26);
  g.addColorStop(0, '#c48a55');
  g.addColorStop(0.45, '#7a4826');
  g.addColorStop(1, '#3a200f');
  x.fillStyle = g;
  x.fill();
  return c;
}

export function createCoffeeDust({ canvas, beanStage, isActive, reducedMotion }) {
  const ctx = canvas.getContext('2d');
  const CRISP = COLS.map((c) => dotSprite(c, 0.55));
  const SOFT = COLS.map((c) => dotSprite(c, 0.12));
  const GROUNDS = Array.from({ length: 8 }, groundSprite);
  let W = 0;
  let H = 0;
  let dpr = 1;
  let parts = [];
  let ox = 0;
  let oy = 0;
  let R = 1;
  let raf = 0;
  let odd = false;

  function spawn(q, fresh) {
    const amb = q.amb;
    const side = !amb && Math.random() < 0.2 ? 1 : 0;
    const reach = side ? 0.55 : 1;
    q.side = side;
    q.reach = reach;
    q.d = Math.pow(Math.random(), 1.7) * R * reach * (fresh ? 1 : 0.25);
    q.lat = gauss() * 0.32;
    q.v = (0.1 + Math.random() * 0.32) * (amb ? 0.5 : 1);
    q.life = fresh ? Math.random() : 0;
    q.dl = 0.0016 + Math.random() * 0.003;
    q.ph = Math.random() * 6.28;
    q.spin = (Math.random() - 0.5) * 0.02;
    q.rot = Math.random() * 6.28;
    const k = Math.random();
    q.kind = amb ? (k < 0.85 ? 0 : 1) : k < 0.74 ? 0 : k < 0.94 ? 1 : 2;
    q.r = q.kind === 0 ? 0.55 + Math.random() * 1.1 : q.kind === 1 ? 2 + Math.random() * 3.5 : 1.8 + Math.random() * 2.6;
    q.a = q.kind === 0 ? 0.45 + Math.random() * 0.5 : q.kind === 1 ? 0.1 + Math.random() * 0.18 : 0.75 + Math.random() * 0.25;
    q.c = (Math.random() * 4) | 0;
    q.g = (Math.random() * 8) | 0;
    if (amb) { q.x = Math.random() * W; q.y = Math.random() * H; }
  }

  function size() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!canvas.clientWidth || !canvas.clientHeight) return;   // not laid out
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const bw = beanStage.offsetWidth;
    const bh = (bw * 700) / 501;
    const mob = isMobile();
    ox = W / 2 + bw * 0.16;
    oy = H / 2 - bh * 0.32;
    R = mob ? H * 0.36 : Math.min(W * 0.42, H * 0.62);
    const N = mob ? 170 : 380;
    parts = Array.from({ length: N }, (_, i) => { const q = { amb: i < N * 0.14 }; spawn(q, true); return q; });

    // static haze: warm clouds along the plume and a glow behind the bean, painted once at quarter resolution
    const haze = document.createElement('canvas');
    haze.width = Math.ceil(W / 4);
    haze.height = Math.ceil(H / 4);
    const h = haze.getContext('2d');
    h.scale(0.25, 0.25);
    const blob = (x, y, r, a, col = '168,104,58') => {
      const g = h.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(1, `rgba(${col},0)`);
      h.fillStyle = g;
      h.fillRect(x - r, y - r, r * 2, r * 2);
    };
    for (let k = 0; k < 9; k++) {
      const t = k / 8;
      const d = t * R * 0.85;
      const dir = DIRS[0];
      blob(ox + Math.cos(dir) * d + gauss() * 20, oy + Math.sin(dir) * d + gauss() * 20, R * (0.14 + t * 0.22), 0.085 * (1 - t * 0.7));
    }
    for (let k = 0; k < 4; k++) {
      const d = (k / 3) * R * 0.4;
      blob(ox - bw * 0.3 + Math.cos(DIRS[1]) * d, oy + Math.sin(DIRS[1]) * d, R * (0.1 + k * 0.05), 0.05);
    }
    blob(W / 2, H / 2 - bh * 0.1, bh * 0.9, 0.1, '200,120,60');
    canvas.style.background = `url(${haze.toDataURL()}) 0 0/100% 100% no-repeat`;
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const q of parts) {
      q.life += q.dl * 2;
      q.d += q.v * 2;
      q.ph += 0.024;
      q.rot += q.spin * 2;
      if (q.life >= 1) spawn(q, false);
      let x;
      let y;
      if (q.amb) {
        q.y -= q.v;
        q.x += Math.sin(q.ph) * 0.3;
        if (q.y < -8) q.y = H + 8;
        x = q.x;
        y = q.y;
      } else {
        const dir = DIRS[q.side];
        const ux = Math.cos(dir);
        const uy = Math.sin(dir);
        const spread = q.lat * (R * 0.08 + q.d * 0.55);
        if (q.d > R * q.reach) { spawn(q, false); continue; }
        x = ox + ux * q.d - uy * spread + Math.sin(q.ph) * 3;
        y = oy + uy * q.d + ux * spread;
      }
      const fade = Math.sin(Math.PI * q.life) * (q.amb ? 0.6 : 1 - Math.min(1, q.d / (R * q.reach)) * 0.7);
      ctx.globalAlpha = q.a * fade;
      if (q.kind === 2) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(q.rot);
        ctx.drawImage(GROUNDS[q.g], -q.r, -q.r, q.r * 2, q.r * 2);
        ctx.restore();
      } else {
        const sp = q.kind === 1 ? SOFT[q.c] : CRISP[q.c];
        const s = q.r * 2.2;
        ctx.drawImage(sp, x - s / 2, y - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
  }

  size();
  // the dust drifts slowly, so 30 frames a second is plenty
  const loop = () => {
    odd = !odd;
    if (odd && isActive()) draw();
    raf = requestAnimationFrame(loop);
  };
  if (reducedMotion) draw();
  else loop();

  return { size, dispose() { cancelAnimationFrame(raf); } };
}
