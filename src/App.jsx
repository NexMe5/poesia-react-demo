import { Suspense, useLayoutEffect } from 'react';
import { RouterProvider, useRouter } from './router/Router';
import { ROUTES, NotFoundPage } from './router/routes';

function CurrentPage() {
  const { path } = useRouter();
  const Page = ROUTES[path] || NotFoundPage;
  // a new page opens at its top, or where you left it when you come Back; a #chapter is landed by the page itself
  useLayoutEffect(() => {
    if (window.location.hash) return;
    const saved = window.history.state && window.history.state.y;
    window.scrollTo(0, saved != null ? saved : 0);
  }, [path]);
  // keyed by path, so leaving a page fully unmounts it (the story stops its scroll engine)
  return <Page key={path} />;
}

/** The site: one React app, one page component per URL. `path` is set only when prerendering. */
export default function App({ path }) {
  return (
    <RouterProvider initialPath={path}>
      <Suspense fallback={null}>
        <CurrentPage />
      </Suspense>
    </RouterProvider>
  );
}
