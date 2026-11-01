/** Layout helpers in document coordinates. */

export const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;

/** Scroll length of a pinned section: its height minus one screen. */
export const pinLen = (el) => el.offsetHeight - window.innerHeight;

export const q = (root, sel) => root.querySelector(sel);
export const qa = (root, sel) => [...root.querySelectorAll(sel)];

export const cx = (...names) => names.filter(Boolean).join(' ');
