/**
 * Looping CSS animations (the floating bags, the scroll cue, the tools marquee, the steam over the last cup...)
 * keep running when their chapter is far off screen, and the steam is SVG, which the browser redraws on the main
 * thread every frame. Chapters more than a screen away get .is-off, which pauses their animations and hides them
 * (base.css), so the phone keeps only the chapters near the screen in memory.
 */
export function pauseOffscreen(root = document) {
  if (!('IntersectionObserver' in window)) return () => {};
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.target.classList.toggle('is-off', !e.isIntersecting));
  }, { rootMargin: '120% 0px' });
  root.querySelectorAll('main > section').forEach((s) => io.observe(s));
  return () => io.disconnect();
}
