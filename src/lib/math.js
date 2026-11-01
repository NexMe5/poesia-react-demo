/** Small numeric helpers shared by every scroll scene. */

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Progress of `p` through the window [a, b], clamped to 0..1. */
export const seg = (p, a, b) => clamp((p - a) / (b - a));

export const lerp = (a, b, t) => a + (b - a) * t;

export const ease = {
  out: (t) => 1 - Math.pow(1 - t, 3),
  in: (t) => t * t * t,
  inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  expo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
};
