import HomePage from '../pages/HomePage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import TermsPage from '../pages/TermsPage';
import NotFoundPage from '../pages/NotFoundPage';

/**
 * Every page of the site. Pages are bundled together on purpose: their styles then ship in the one
 * stylesheet linked from the HTML <head>, so a prerendered page is fully styled from its very first paint
 * (the home page opens straight on the loader). Lazy-loading a page would move its CSS into a JS chunk that
 * arrives after the HTML, and the page would flash unstyled.
 */
export const ROUTES = {
  '/': HomePage,
  '/privacy-policy': PrivacyPolicyPage,
  '/terms': TermsPage,
};

export { NotFoundPage };
