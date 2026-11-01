import { useEffect } from 'react';
import { engine } from '../engine/scrollEngine';
import { landingFor } from './landings';

/** The address bar follows the chapter you jump to, so a link can be shared and Back returns you. */
export function remember(hash) {
  if (!window.history.pushState || window.location.hash === hash) return;
  window.history.replaceState({ y: window.scrollY }, '');
  const url = hash === '#top' ? window.location.pathname + window.location.search : hash;
  window.history.pushState({ hash }, '', url);
}

/** Jump to a chapter's finished frame. Returns false when the hash names no chapter. */
export function navigateTo(hash) {
  const y = landingFor(hash);
  if (y == null) return false;
  remember(hash);
  engine.jumpTo(y);
  return true;
}

/**
 * Wires hash links, Back/Forward and deep links.
 * `ready` turns true once the preloader has gone; a link such as /#equipment then opens on that chapter.
 */
export function useInPageNavigation(ready) {
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.closest('.menu')) return;
      const hash = a.getAttribute('href');
      const y = landingFor(hash);
      if (y == null) return;
      e.preventDefault();
      remember(hash);
      engine.jumpTo(y);
    };
    const onPop = (e) => {
      if (window.location.pathname !== '/') return;   // Back to another page: the router takes it from here
      const st = e.state || {};
      engine.jumpTo(st.y != null ? st.y : landingFor(window.location.hash || '#top'));
    };
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPop);
    };
  }, []);

  useEffect(() => {
    if (!ready) return undefined;
    const id = requestAnimationFrame(() => {
      // a chapter link (/#equipment) opens that chapter; Back from another page returns to where you were
      const h = window.location.hash;
      const saved = window.history.state && window.history.state.y;
      const y = h ? landingFor(h) : saved != null ? saved : null;
      if (y != null) engine.jumpTo(y);
    });
    return () => cancelAnimationFrame(id);
  }, [ready]);
}
