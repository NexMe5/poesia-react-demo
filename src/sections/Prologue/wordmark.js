import { clamp } from '../../lib/math';
import { isMobile } from '../../lib/env';
import { markIntroReady } from '../../lib/introReady';

/**
 * Intro wordmark. Bold Baskerville capitals (the brand's display face) are drawn into a canvas,
 * softened, then lit like embossed copper with a fine cast-bronze grain. POE and SIA sit either side
 * of the split bean; because POE is wider, the whole composition (bean included) is shifted so it
 * reads truly centred — that shift is reported through `onCenterShift(dx)`.
 */
const FONT = '"Libre Baskerville","Baskerville","GFS Baskerville",Georgia,serif';
const norm = (v) => { const m = Math.hypot(...v); return v.map((x) => x / m); };
const LIGHT = norm([-0.45, -0.78, 0.62]);
const HALF = norm([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);
const STOPS = [[0, [246, 206, 158]], [0.3, [212, 150, 96]], [0.62, [158, 96, 54]], [0.84, [118, 68, 36]], [1, [160, 100, 58]]];

function tone(t) {
  t = clamp(t, 0, 1);
  let i = 1;
  while (i < STOPS.length - 1 && STOPS[i][0] < t) i++;
  const [t0, a] = STOPS[i - 1];
  const [t1, b] = STOPS[i];
  const f = (t - t0) / (t1 - t0);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

function boxH(s, d, w, h, r) {
  const k = 1 / (2 * r + 1);
  for (let y = 0; y < h; y++) {
    const o = y * w;
    let acc = 0;
    for (let x = 0; x <= r && x < w; x++) acc += s[o + x];
    for (let x = 0; x < w; x++) {
      d[o + x] = acc * k;
      if (x + r + 1 < w) acc += s[o + x + r + 1];
      if (x - r >= 0) acc -= s[o + x - r];
    }
  }
}
function boxV(s, d, w, h, r) {
  const k = 1 / (2 * r + 1);
  for (let x = 0; x < w; x++) {
    let acc = 0;
    for (let y = 0; y <= r && y < h; y++) acc += s[y * w + x];
    for (let y = 0; y < h; y++) {
      d[y * w + x] = acc * k;
      if (y + r + 1 < h) acc += s[(y + r + 1) * w + x];
      if (y - r >= 0) acc -= s[(y - r) * w + x];
    }
  }
}
/** Three box passes ≈ a gaussian blur. */
function blur(a, w, h, r) {
  const t = new Float32Array(a.length);
  const o = Float32Array.from(a);
  for (let i = 0; i < 3; i++) { boxH(o, t, w, h, r); boxV(t, o, w, h, r); }
  return o;
}

/**
 * Letter positions in CSS px: one line on every screen, POE and SIA either side of the bean, their inner
 * edges tucked just behind it. Phones get a tighter side margin so the letters stay big.
 */
function layout(mx, W, H, bw, bh, mob) {
  mx.font = `700 100px ${FONT}`;
  const capH = mx.measureText('E').actualBoundingBoxAscent || 72.7;
  const G = {};
  for (const c of 'POESIA') {
    const t = mx.measureText(c);
    G[c] = { w: (t.actualBoundingBoxLeft + t.actualBoundingBoxRight) / capH, l: t.actualBoundingBoxLeft / capH };
  }
  const gap = 0.05;
  const out = [];
  const lines = [];
  const half = W * (mob ? 0.466 : 0.455);
  // largest size at which both halves fit beside the bean
  const wl = G.P.w + G.O.w + G.E.w + gap * 2;
  const wr = G.S.w + G.I.w + G.A.w + gap * 2;
  const cap = Math.min(bh * 0.8, H * 0.34, (half - bw * 0.45) / wl, (half - bw * 0.5) / wr);
  const row = (chars, x, top) => { for (const c of chars) { out.push({ c, x, top }); x += (G[c].w + gap) * cap; } };
  const top = H / 2 - cap * 0.52;
  const eX = W / 2 - bw * 0.45 - G.E.w * cap;
  const sX = W / 2 + bw * 0.5;   // the S sits a touch clear of the bean
  row('POE', eX - (G.O.w + G.P.w + gap * 2) * cap, top);
  row('SIA', sX, top);
  lines.push(top);
  let x0 = Math.min(...out.map((g) => g.x));
  let x1 = Math.max(...out.map((g) => g.x + G[g.c].w * cap));
  // POE is wider than SIA: slide the whole word (bean included) so the composition sits in the true centre
  const dx = W / 2 - (x0 + x1) / 2;
  out.forEach((g) => { g.x += dx; });
  x0 += dx;
  x1 += dx;
  const y0 = Math.min(...lines) - cap * 0.06;
  const y1 = Math.max(...lines) + cap * 1.06;
  return { out, G, cap, lines, x0, x1, y0, y1, dx, fs: (cap / capH) * 100 };
}

export function createWordmark({ canvases, stage, beanStage, tagline, reducedMotion, onCenterShift }) {
  let ready = false;
  let disposed = false;
  let lastKey = '';
  let shift = 0;
  // fine grain comes from a 256 × 256 noise tile instead of a random number per pixel
  const NOISE = Float32Array.from({ length: 65536 }, () => Math.random() - 0.5);

  function paint() {
    if (!ready || disposed || reducedMotion || !canvases.length) return;
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    if (!W || !H) return;   // the stage is not laid out (hidden, or the page is being left)
    const mob = isMobile();
    const bw = beanStage.offsetWidth;
    const bh = (bw * 700) / 501;
    // layout observers fire often (images loading, phone toolbars): repaint only when the stage really changed
    const key = [W, H, bw, mob, window.devicePixelRatio].join();
    if (key === lastKey) return;
    lastKey = key;

    const mc = document.createElement('canvas');
    const mx = mc.getContext('2d');
    const L = layout(mx, W, H, bw, bh, mob);
    const cap = L.cap;
    if (Math.abs(L.dx - shift) > 0.5) { shift = L.dx; onCenterShift(shift); }

    const pad = Math.ceil(cap * 0.32);
    const bx = Math.floor(L.x0 - pad);
    const by = Math.floor(L.y0 - pad);
    const cw = Math.ceil(L.x1 - L.x0 + pad * 2);
    const ch = Math.ceil(L.y1 - L.y0 + pad * 2);
    const S = Math.min(2, window.devicePixelRatio || 1, 2400 / cw, 1400 / ch);
    const w = Math.round(cw * S);
    const h = Math.round(ch * S);
    mc.width = w;
    mc.height = h;
    mx.setTransform(S, 0, 0, S, -bx * S, -by * S);
    mx.fillStyle = '#fff';
    mx.textBaseline = 'alphabetic';
    for (const g of L.out) {
      mx.font = `700 ${L.fs}px ${FONT}`;
      mx.fillText(g.c, g.x + L.G[g.c].l * cap, g.top + cap);
    }

    const image = mx.getImageData(0, 0, w, h);
    const D = image.data;
    const N = w * h;
    const A = new Float32Array(N);
    for (let i = 0; i < N; i++) A[i] = D[i * 4 + 3] / 255;
    // round every corner: blur the shape, then cut it again at half height
    const r1 = Math.max(1, Math.round(cap * S * 0.006));
    const k1 = (2 * r1 + 1) * 0.7;
    const B = blur(A, w, h, r1);
    const M = new Float32Array(N);
    for (let i = 0; i < N; i++) M[i] = clamp((B[i] - 0.5) * k1 + 0.5, 0, 1);
    // bevel: a soft height field that falls off towards the edges
    const r2 = Math.max(1, Math.round(cap * S * 0.017));
    const Hf = blur(M, w, h, r2);
    for (let i = 0; i < N; i++) { const v = clamp((Hf[i] - 0.5) * 2, 0, 1); Hf[i] = 1 - (1 - v) * (1 - v); }
    // grain: fine noise plus a slow mottle, like cast bronze
    const cell = Math.max(6, Math.round(cap * S * 0.16));
    const gw = Math.ceil(w / cell) + 2;
    const gh = Math.ceil(h / cell) + 2;
    const grid = Float32Array.from({ length: gw * gh }, () => Math.random() - 0.5);
    const depth = r2 * 1.35;

    for (let y = 0; y < h; y++) {
      const yc = by + y / S;
      const li = L.lines.length > 1 && yc > H / 2 ? 1 : 0;
      const base = tone((yc - L.lines[li]) / cap);
      const gy = y / cell;
      const gy0 = gy | 0;
      const fy = gy - gy0;
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        const m = M[i];
        if (m <= 0) { D[i * 4 + 3] = 0; continue; }
        const hl = Hf[x > 0 ? i - 1 : i];
        const hr = Hf[x < w - 1 ? i + 1 : i];
        const hu = Hf[y > 0 ? i - w : i];
        const hd = Hf[y < h - 1 ? i + w : i];
        let nx = (hl - hr) * depth;
        let ny = (hu - hd) * depth;
        const nz = 1 / Math.sqrt(nx * nx + ny * ny + 1);
        nx *= nz;
        ny *= nz;
        const dif = Math.max(0, nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]);
        let spec = Math.max(0, nx * HALF[0] + ny * HALF[1] + nz * HALF[2]);
        spec *= spec; spec *= spec; spec *= spec; spec *= spec; spec *= spec;
        const gx = x / cell;
        const gx0 = gx | 0;
        const fx = gx - gx0;
        const gi = gy0 * gw + gx0;
        const mott = (grid[gi] * (1 - fx) + grid[gi + 1] * fx) * (1 - fy) + (grid[gi + gw] * (1 - fx) + grid[gi + gw + 1] * fx) * fy;
        const grain = 1 + NOISE[(x & 255) | ((y & 255) << 8)] * 0.16 + mott * 0.2;
        const sh = (0.3 + dif * 1.02) * (0.8 + 0.2 * Math.min(1, Hf[i] * 2.5)) * grain;
        D[i * 4] = base[0] * sh + spec * 120;
        D[i * 4 + 1] = base[1] * sh + spec * 98;
        D[i * 4 + 2] = base[2] * sh + spec * 70;
        D[i * 4 + 3] = m * 255;
      }
    }
    mx.setTransform(1, 0, 0, 1, 0, 0);
    mx.putImageData(image, 0, 0);

    canvases.forEach((cv) => {
      cv.width = w;
      cv.height = h;
      Object.assign(cv.style, { left: `${bx}px`, top: `${by}px`, width: `${cw}px`, height: `${ch}px` });
      const c = cv.getContext('2d');
      c.shadowColor = 'rgba(6,2,0,.62)';
      c.shadowBlur = cap * S * 0.1;
      c.shadowOffsetY = cap * S * 0.05;
      c.drawImage(mc, 0, 0);
      cv.classList.add('on');
    });
    if (tagline) {
      const below = Math.max(H / 2 + bh * 0.5, L.y1) + H * 0.04;
      tagline.style.setProperty('--tag-top', `${below.toFixed(1)}px`);
    }
  }

  // once the typeface is in, paint and tell the preloader the intro is ready
  const go = () => {
    if (ready || disposed) return;
    ready = true;
    paint();
    markIntroReady();
  };
  if (document.fonts && document.fonts.load) document.fonts.load(`700 100px "Libre Baskerville"`).then(go, go);
  const fallback = setTimeout(go, 1600);

  return {
    paint,
    dispose() { disposed = true; clearTimeout(fallback); },
  };
}
