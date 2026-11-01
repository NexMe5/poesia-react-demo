/**
 * Every photo and cut-out lives in src/assets/images and goes through the bundler, so each file is
 * published under a content hash (bag-espresso.3f9a1c2e.webp). Hashed files never change, which lets the
 * host and the service worker cache them for a year; a new photo simply gets a new name.
 */
const files = import.meta.glob('../assets/images/*.{webp,png,jpg,svg}', { eager: true, query: '?url', import: 'default' });

const byName = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1), url]),
);

export function img(name) {
  const url = byName[name];
  if (!url) throw new Error(`Unknown image "${name}" — add it to src/assets/images.`);
  return url;
}
