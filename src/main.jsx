import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// global layer first: tokens, fonts, base type, buttons — every component stylesheet builds on it
import './styles/index.css';
import { prefersReducedMotion } from './lib/env';
import App from './App';
import { normalizePath } from './router/Router';
import { ROUTES } from './router/routes';
import { registerServiceWorker } from './lib/registerServiceWorker';

// reduced motion: every scene collapses to its resting state (see the .rm rules in each stylesheet)
if (prefersReducedMotion) document.documentElement.classList.add('rm');

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// The production build ships each page prerendered, marked with the route it was rendered for.
// When that matches the address, React takes over the HTML instead of redrawing it. If a host ever serves
// another page's HTML (a fallback), it is discarded and the right page is drawn fresh.
const served = container.dataset.route;
const here = normalizePath(window.location.pathname);
const matches = served === here || (served === '404' && !(here in ROUTES));
if (served && matches) {
  hydrateRoot(container, app);
} else {
  if (served) {
    container.textContent = '';
    document.documentElement.classList.remove('pl-lock', 'pl-wait');
  }
  createRoot(container).render(app);
}

registerServiceWorker();
