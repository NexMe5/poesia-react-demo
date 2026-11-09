import { useEffect } from 'react';
import { seoFor, robotsFor, SITE_NAME, OG_IMAGE } from '../data/seo';

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

/**
 * Keeps the document head in step with the page on in-app navigation: title, description, canonical
 * and social tags. (The prerendered HTML already carries the same tags for crawlers.)
 */
export function usePageMeta(path) {
  useEffect(() => {
    const seo = seoFor(path);
    const origin = window.location.origin;
    const url = origin + (path === 404 ? window.location.pathname : path);
    document.title = seo.title;
    setMeta('name', 'description', seo.description);
    setMeta('name', 'robots', robotsFor(seo));
    setMeta('property', 'og:title', seo.title);
    setMeta('property', 'og:description', seo.description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:image', origin + OG_IMAGE);
    setMeta('name', 'twitter:title', seo.title);
    setMeta('name', 'twitter:description', seo.description);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = url;
  }, [path]);
}
