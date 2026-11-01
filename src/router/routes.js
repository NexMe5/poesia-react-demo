import { lazy } from 'react';

/**
 * Every page of the site. Each page is its own code chunk: a visitor opening the Privacy Policy
 * never downloads the scroll film, and the story never waits for the legal text.
 */
export const ROUTES = {
  '/': lazy(() => import('../pages/HomePage')),
  '/privacy-policy': lazy(() => import('../pages/PrivacyPolicyPage')),
  '/terms': lazy(() => import('../pages/TermsPage')),
};

export const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));
