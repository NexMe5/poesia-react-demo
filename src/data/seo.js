import { BLENDS } from './blends';
import { BUSINESS, CONTACT } from './site';

/**
 * Search and social metadata for every page — one source used by the browser (usePageMeta) and by the
 * build-time prerender (scripts/prerender.mjs), so what Google indexes is what visitors see.
 */
export const SITE_NAME = 'Poesia';
export const OG_IMAGE = '/og-image.jpg';   // 1200 × 630, in /public so its URL never changes

export const PAGES = {
  '/': {
    title: 'Poesia – Premium Coffee Roasted in Goa for Cafés & Hotels',
    description:
      'Poesia roasts premium Indian coffee from Chikmagalur and Coorg in Goa, and supplies cafés, hotels and restaurants with signature blends, espresso machines and barista training.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy · Poesia',
    description: 'How Poesia India collects, uses and protects personal data, and your rights under Indian law.',
  },
  '/terms': {
    title: 'Terms & Conditions · Poesia',
    description: 'The terms that govern use of the Poesia India website.',
  },
  404: {
    title: 'Page not found · Poesia',
    description: 'This page does not exist.',
    noindex: true,
  },
};

export const seoFor = (path) => PAGES[path] || PAGES[404];

/** Pages listed in sitemap.xml. */
export const SITEMAP = [
  { path: '/', priority: '1.0', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

/**
 * schema.org structured data for the home page: the business (with its address and contacts), the website,
 * and the four blends as its product catalogue. Only facts stated on the site — no ratings, hours or prices.
 */
export function structuredData(siteUrl) {
  const org = `${siteUrl}/#business`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': org,
        name: BUSINESS.name,
        alternateName: SITE_NAME,
        description: PAGES['/'].description,
        url: `${siteUrl}/`,
        logo: `${siteUrl}/logo.png`,
        image: `${siteUrl}${OG_IMAGE}`,
        email: CONTACT.email,
        telephone: CONTACT.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'H No. 839/16(3), Shetye Residency, Alto Porvorim, Socorro',
          addressLocality: 'Bardez',
          addressRegion: 'Goa',
          addressCountry: 'IN',
        },
        areaServed: { '@type': 'Country', name: 'India' },
        sameAs: [CONTACT.instagram],
        knowsAbout: ['Coffee roasting', 'Espresso', 'Barista training', 'Coffee equipment', 'Hospitality'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Poesia coffee blends',
          itemListElement: BLENDS.map((b) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: `Poesia ${b.name}`,
              description: `${b.note}. Arabica ${b.arabica}%${b.robusta ? `, Robusta ${b.robusta}%` : ''}. Roast level ${b.roast} of 5.`,
              brand: { '@type': 'Brand', name: SITE_NAME },
            },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SITE_NAME,
        inLanguage: 'en-IN',
        publisher: { '@id': org },
      },
    ],
  };
}
