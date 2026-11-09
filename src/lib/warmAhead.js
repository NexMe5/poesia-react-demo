/**
 * Photos below the first screen are lazy, so the loader only waits for the intro. This keeps them ready anyway:
 *
 *   ahead    each chapter's photos are fetched and decoded about two screens before it scrolls in, so a big photo
 *            is never decoded in the middle of a scroll frame (the stutter the old load-everything loader avoided)
 *   in order once the intro is open, the rest of the story is fetched one chapter at a time, top to bottom, so a
 *            slow connection stays ahead of the reader. Only fetched, not decoded: decoding everything up front put
 *            ~110 MB of bitmaps in a phone's memory, which then evicted them again.
 */
export function warmAhead(root = document) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const sections = [...root.querySelectorAll('main > section')];
  const warmed = new WeakSet();
  let cancelled = false;

  const fetchNow = (im) => { if (im.loading === 'lazy') im.loading = 'eager'; };
  const decodeSoon = (im) => {
    if (warmed.has(im)) return;
    warmed.add(im);
    fetchNow(im);
    const go = () => { if (!cancelled && im.decode) im.decode().catch(() => {}); };
    if (im.complete) go();
    else im.addEventListener('load', go, { once: true });
  };

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('near');   // lets CSS-only images (masks, textures) load from here on
    e.target.querySelectorAll('img').forEach(decodeSoon);
    io.unobserve(e.target);
  }), { rootMargin: '200% 0px' });
  sections.forEach((s) => io.observe(s));

  let i = 0;
  const settled = (im) => new Promise((resolve) => {
    if (im.complete) return resolve();
    im.addEventListener('load', resolve, { once: true });
    im.addEventListener('error', resolve, { once: true });
  });
  const next = () => {
    if (cancelled || i >= sections.length) return;
    const imgs = [...sections[i++].querySelectorAll('img')].filter((im) => !im.complete);
    imgs.forEach(fetchNow);
    Promise.all(imgs.map(settled)).then(() => setTimeout(next, 30));
  };
  next();

  return () => { cancelled = true; io.disconnect(); };
}
