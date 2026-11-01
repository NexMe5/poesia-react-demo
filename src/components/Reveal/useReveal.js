import { useCallback, useRef } from 'react';

/** One shared observer: flow content gets `.in` the first time it scrolls into view. */
let observer = null;
function getObserver() {
  if (!observer && typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -10% 0px' },
    );
  }
  return observer;
}

/** Ref callback that reveals its element once (works with any element type). */
export function useReveal() {
  const current = useRef(null);
  return useCallback((el) => {
    const io = getObserver();
    if (current.current && io) io.unobserve(current.current);
    current.current = el;
    if (el && io) io.observe(el);
  }, []);
}
