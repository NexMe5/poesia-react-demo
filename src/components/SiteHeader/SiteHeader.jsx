import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Nav from './Nav';
import Menu from './Menu';

/** Header and its menu share one open/closed state; the open menu locks the page (html.menu-open). */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
  }, [open]);
  // leaving the home page: no locked scroll or header tone left behind
  useLayoutEffect(() => () => {
    document.documentElement.classList.remove('menu-open');
    delete document.documentElement.dataset.tone;
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <Nav menuOpen={open} onToggleMenu={() => setOpen((o) => !o)} />
      <Menu open={open} onClose={close} />
    </>
  );
}
