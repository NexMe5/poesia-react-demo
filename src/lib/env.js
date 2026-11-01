/** Environment facts read once at start-up, like the prototype did. */

const mq = (q) => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(q).matches;

export const prefersReducedMotion = mq('(prefers-reduced-motion: reduce)');

/** Fine pointer with hover: the blends fan follows the cursor only here. */
export const hasFinePointer = () => mq('(hover:hover) and (pointer:fine)');

/** Phone layout breakpoint, shared with the CSS (max-width: 720px). */
export const isMobile = () => window.innerWidth <= 720;
