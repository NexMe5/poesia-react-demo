/**
 * Prerender: after `vite build` (browser) and `vite build --ssr` (server entry), write every page as real HTML
 * with its own title, description, canonical URL, social tags and structured data, plus robots.txt and sitemap.xml.
 *
 * Site URL, first match wins:
 *   SITE_URL=https://www.example.com          set it yourself (any host, or a custom domain)
 *   VERCEL_PROJECT_PRODUCTION_URL             set by Vercel during its builds (follows a custom domain too)
 *   https://poesiaindia.com                   the live domain, so a build made anywhere never ships
 *                                             localhost canonical URLs or structured data
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(root, process.env.PRERENDER_DIST || 'dist');
const serverEntry = path.resolve(root, process.env.PRERENDER_SSR || 'dist-ssr', 'entry-server.js');

const fromVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
const SITE = (process.env.SITE_URL || fromVercel || 'https://poesiaindia.com').replace(/\/+$/, '');
if (!process.env.SITE_URL && !fromVercel) {
  console.log(`[prerender] SITE_URL is not set — using ${SITE}.`);
}

const { render, seoFor, robotsFor, SITEMAP, structuredData } = await import(pathToFileURL(serverEntry).href);
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Safety net: every page must be styled by the stylesheet(s) linked in <head>, or it would flash unstyled
// before its JavaScript arrives. Fail the build rather than publish that.
const linkedCss = [...template.matchAll(/<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"/g)]
  .map((m) => fs.readFileSync(path.join(dist, m[1].replace(/^\//, '')), 'utf8'))
  .join('\n');
const MUST_STYLE = { '/': ['.pl{', '.prologue{', '.nav{'], '/privacy-policy': ['.legal{'], '/terms': ['.legal{'], 404: ['.nf{'] };
const flat = linkedCss.replace(/\s+/g, '');
for (const [route, selectors] of Object.entries(MUST_STYLE)) {
  const missing = selectors.filter((sel) => !flat.includes(sel));
  if (missing.length) {
    throw new Error(`[prerender] ${route}: ${missing.join(' ')} not found in the stylesheet linked from index.html — the page would render unstyled before its JavaScript loads.`);
  }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function head(route) {
  const seo = seoFor(route);
  const url = route === 404 ? null : SITE + route;
  const tags = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${esc(robotsFor(seo))}" />`,
    url && `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Poesia" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    url && `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/og-image.jpg" />`,
    `<meta property="og:image:type" content="image/jpeg" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Poesia coffee: four 1 kg bags of the house blends in sunlight" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${SITE}/og-image.jpg" />`,
    process.env.GOOGLE_SITE_VERIFICATION && `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}" />`,
    route === '/' && `<script type="application/ld+json">${JSON.stringify(structuredData(SITE)).replace(/</g, '\\u003c')}</script>`,
  ];
  return tags.filter(Boolean).join('\n    ');
}

async function page(route, file) {
  const html = await render(route === 404 ? '/404' : route);
  let out = template
    .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, head(route))
    .replace('<div id="root"></div>', `<div id="root" data-route="${route}">${html}</div>`);
  // the home page opens behind the loader: lock the scroll from the first paint
  if (route === '/') out = out.replace('<html lang="en-IN" class="js">', '<html lang="en-IN" class="js pl-lock pl-wait">');
  fs.writeFileSync(path.join(dist, file), out);
  console.log(`[prerender] ${route === 404 ? '404' : route} → ${file} (${(out.length / 1024).toFixed(0)} KB)`);
}

await page('/', 'index.html');
await page('/privacy-policy', 'privacy-policy.html');
await page('/terms', 'terms.html');
await page(404, '404.html');

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP.map((p) => `  <url><loc>${SITE}${p.path}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log(`[prerender] sitemap.xml and robots.txt for ${SITE}`);
