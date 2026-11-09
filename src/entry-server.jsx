import { prerenderToNodeStream } from 'react-dom/static';
import App from './App';
import { seoFor, robotsFor, SITEMAP, structuredData } from './data/seo';

/**
 * Build-time rendering (used by scripts/prerender.mjs, never shipped to the browser).
 * Renders a page to HTML, waiting for its lazy chunk, so each URL is published with its real content.
 */
export async function render(path) {
  const { prelude } = await prerenderToNodeStream(<App path={path} />);
  let html = '';
  for await (const chunk of prelude) html += chunk;
  return html;
}

export { seoFor, robotsFor, SITEMAP, structuredData };
