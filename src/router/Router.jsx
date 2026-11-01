import { createContext, startTransition, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * A small client-side router on the History API: the whole site is one React app, and each URL renders
 * its page component. /privacy-policy and /privacy-policy/ are the same page.
 */
const RouterContext = createContext(null);

export const normalizePath = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path) || '/';

/** `initialPath` is given when rendering on the server (prerender); in the browser the address bar decides. */
export function RouterProvider({ initialPath, children }) {
  const [path, setPath] = useState(() => initialPath ?? normalizePath(window.location.pathname));

  // page changes are transitions: the current page stays on screen until the next one is ready, then swaps
  useEffect(() => {
    const onPop = () => startTransition(() => setPath(normalizePath(window.location.pathname)));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  /** Go to another page of the site. `to` may carry a hash ("/#equipment") to open the story at a chapter. */
  const navigate = useCallback((to) => {
    const url = new URL(to, window.location.href);
    const next = normalizePath(url.pathname);
    if (next === normalizePath(window.location.pathname) && url.hash) {
      window.location.hash = url.hash;                       // same page: let the page handle its own anchor
      return;
    }
    // remember where this page was scrolled, so Back returns to the same spot
    window.history.replaceState({ ...(window.history.state || {}), y: window.scrollY }, '');
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
    startTransition(() => setPath(next));
  }, []);

  const value = useMemo(() => ({ path, navigate }), [path, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

/** An internal link: a real <a href> (works in a new tab with Ctrl/Cmd), routed in-app on a plain click. */
export function Link({ to, onClick, children, ...rest }) {
  const { navigate } = useRouter();
  const handle = (e) => {
    if (onClick) onClick(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest}>{children}</a>;
}
