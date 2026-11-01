# Poesia — React + Vite

A scroll-driven storytelling landing page for **Poesia**, premium Indian coffee roasted in Goa, for B2B
customers (cafés, hotels, restaurants). This is the approved HTML prototype, rebuilt as a component-based
React app with the same look, motion and behaviour.

## Run it

Requires **Node 18.18+** (Node 20 or 22 recommended).

```bash
npm install
npm run dev       # local dev server  → http://localhost:5173
npm run build     # production build  → dist/ (every page prerendered for search engines)
npm run preview   # serve the build locally
```

Deploy the `dist/` folder to any static host. It is built for the domain root.

**Vercel:** import the project and pick the **Vite** preset (build `npm run build`, output `dist`). The cache
rules and clean URLs in `vercel.json` apply automatically, and the build picks up the site's production URL
from Vercel by itself. Netlify and Cloudflare Pages read `public/_headers` instead. On any other host, set
`SITE_URL` when building, for example `SITE_URL=https://www.example.com npm run build`.

## SEO

`npm run build` runs three steps:

1. `vite build` builds the browser app.
2. `vite build --ssr` builds a server copy of the same components.
3. `scripts/prerender.mjs` writes every page as finished HTML: `index.html`, `privacy-policy.html`,
   `terms.html` and `404.html`.

Search engines, WhatsApp, LinkedIn and Facebook previews therefore read real content without running
JavaScript. In the browser, React then takes over the same HTML (`hydrateRoot`) instead of drawing it again.

Each page gets:

- **Head tags:** its own `<title>`, meta description, canonical URL, Open Graph and Twitter tags. The share
  image is `public/og-image.jpg`, 1200 × 630. All page text comes from `src/data/seo.js`.
- **Structured data (home page):** schema.org data for the business (`LocalBusiness` with address, phone,
  email and Instagram), the website, and the four blends as its product catalogue. Nothing invented: no
  ratings, prices or opening hours.
- **`sitemap.xml` and `robots.txt`,** generated with the production URL.
- **A real 404:** unknown URLs get `404.html` with a 404 status and `noindex`.

Optional: set `GOOGLE_SITE_VERIFICATION` in the Vercel environment variables to add Google's verification
meta tag. Verifying through DNS works too.

### After the first deploy

1. In **Google Search Console**, add the property, verify it, and submit `https://<your-domain>/sitemap.xml`.
2. Create a **Google Business Profile** for the roastery. Use the same name, address and phone as the site.
   For searches like "coffee roaster in Goa" or "coffee supplier for cafés Goa", this matters more than
   anything on the page.
3. Link the website from Instagram and Facebook. Ask partner cafés and hotels to link to it too. Links from
   real businesses are what lifts a new site in search.
4. Once a custom domain is added in Vercel, redeploy. The canonical URLs and sitemap update themselves.

## Pages

The site is one React app with a small router (`src/router/`). Each URL renders a page component:

| URL | Page component | What it is |
|-----|----------------|------------|
| `/` | `pages/HomePage.jsx` | the scroll story (loader, header, WhatsApp button, chapters) |
| `/privacy-policy` | `pages/PrivacyPolicyPage.jsx` | Privacy Policy |
| `/terms` | `pages/TermsPage.jsx` | Terms & Conditions |
| anything else | `pages/NotFoundPage.jsx` | 404 |

- **Adding a page.** Create a component in `src/pages/` and add one line to `src/router/routes.js`.
- **Code splitting.** Pages are lazy-loaded, so each is its own chunk. Someone opening the Privacy Policy
  never downloads the scroll film.
- **Moving between pages.** Navigation runs as a React transition: the current page stays on screen until
  the next one is ready. Back returns to where you were.
- **The loader** plays once per visit. Coming back to the home page from another page skips it.
- **Legal pages.** Both use `pages/legal/LegalLayout.jsx`, and their text lives in `pages/legal/content/`.
  Footer chapter links on a legal page open the story at that chapter (for example `/#equipment`).
- **Hosting.** Each page is its own prerendered HTML file, served at a clean URL (`cleanUrls` in
  `vercel.json`, and the default on Netlify and Cloudflare Pages).

## Caching

- **Hashed files.** Code, styles, fonts and every photo go through the bundler, so each is published under a
  content hash (for example `bag-espresso-3f9a1c2e.webp`). Because those files never change, `vercel.json` and
  `public/_headers` let browsers and the CDN cache them for a year. Pages are always revalidated, so a new
  deploy shows up straight away.
- **Service worker** (`public/sw.js`, production only):
  - `/assets/*` is served cache-first.
  - Pages are network-first, with that page's cached copy as the offline fallback.
  - Repeat visits open instantly and the whole site works offline.
  - Bump `VERSION` in `sw.js` to clear every cache on the next visit.
- **Components.** Chapters render once and are memoised. Scroll motion writes styles directly and never
  re-renders React.

## The story

| # | Chapter | Component | What happens on scroll |
|---|---------|-----------|------------------------|
| – | Loader | `components/Preloader` | A line-drawn espresso machine brews one cup while every image, font and the intro canvas load. The count rests at 089 for a beat before it fills. |
| 0 | Prologue | `sections/Prologue` | A bean sits under the copper POESIA wordmark. It cracks, the dark stage tears along its crease, and the sunlit hero with the four bags comes through. |
| I | Origin | `sections/Origin` | A photo card opens out to the whole screen. Then the line about Chikmagalur rises in. |
| II | Craft | `sections/Craft` | Three chapters (Altitude, Roasted, Soil to cup) play around one pinned bag, with beans orbiting it. |
| IV | Blends | `sections/Blends` | Each scroll threshold plays a whole timed shot. First the craft bag is handed off, then the range stands on a counter, then each blend gets its colour wash. |
| V | Ritual | `sections/Ritual` | A pour shows through a small circle that opens to fill the screen, then the quote appears. |
| VI | Journey | `sections/Journey` | Soil to cup runs sideways: scrolling down slides the track across. |
| VII | Equipment | `sections/Equipment` | Machines, Grinders, Automatic and Tools take turns on one stage. On phones, Tools becomes a carousel. |
| VIII | Partnership | `sections/Partnership` | The promise lights up word by word, followed by three café moments and the closing line. |
| – | Contact | `sections/Contact` | The bean closes again, then the last cup, the contact rows and the footer. |

## Project structure

```
src/
├── main.jsx                 browser entry: global CSS, then hydrate <App/>, then the service worker
├── entry-server.jsx         build-time entry used by the prerender (never shipped to the browser)
├── App.jsx                  the router and the current page
├── styles/                  global layer: tokens, self-hosted fonts, base type, buttons, "night room"
├── engine/
│   ├── scrollEngine.js      the one rAF loop that scrubs every pinned scene
│   └── hooks.js             useScrollEngine · useScene · useFrameHook
├── navigation/
│   ├── landings.js          each chapter registers its "finished frame" for in-page links
│   └── useInPageNavigation  hash links, Back/Forward, deep links (/#equipment)
├── data/                    all copy and content (blends, equipment, journey, contact…)
├── router/                  Router.jsx (RouterProvider, Link, useRouter) · routes.js (URL → page)
├── pages/                   HomePage, PrivacyPolicyPage, TermsPage, NotFoundPage · legal/ (layout + text)
├── assets/                  fonts and images (hashed by the bundler)
├── lib/                     math (clamp/seg/ease), seeded random, env, dom, asset paths
├── components/              shared UI: Preloader, SiteHeader (Nav + Menu), WhatsAppFloat, Footer,
│                            SectionHeader, Reveal, Leaves, SplitBean, CopyButton, icons
└── sections/                one folder per chapter: JSX + co-located CSS + its scene module
scripts/
└── prerender.mjs            writes each page's HTML, head tags, sitemap.xml and robots.txt
public/
├── og-image.jpg, logo.png   social share image and logo (stable URLs)
├── site.webmanifest, icon-*.png
├── sw.js                    service worker
├── _headers                 cache rules for Netlify / Cloudflare Pages
└── favicon.png, apple-touch-icon.png
```

### How the motion works

- **Native scroll, smoothed scenes.** The page scrolls normally. `engine/scrollEngine.js` reads `scrollY`
  once per frame and works out each scene's progress (0 → 1 through its pinned section). It eases that value
  and calls the scene's `render(progress)`. Once everything is still, the loop sleeps.
- **React renders the markup and the engine animates it.** Chapters render once (they are memoised). Each
  chapter registers its scene in an effect: `useScene(ref, el => ({ render, lag, size, … }))`. The render
  functions write `transform` and `opacity` straight to the DOM, which keeps 60 fps without re-rendering React.
- **Scene modules are plain JS.** Files such as `craftScene.js`, `blendsStage.js` and `equipmentScene.js`
  hold the choreography, so the JSX stays readable.
- **Cross-chapter hand-offs** go through `engine.shared`. For example, the craft bag is measured by the
  blends stage so the cut between the two can't be seen.
- **Navigation** lands on each chapter's finished frame: Craft at rest, Blends on the counter, Contact
  centred. It also updates the address bar, so links can be shared and Back works.
- **Reduced motion.** When the OS asks for less motion, `html.rm` is set. Every scene renders its resting
  state once, and the `.rm` rules in each stylesheet lay the chapters out as normal flow.

### Styling

Styles are plain CSS. Each component keeps its stylesheet next to it, and that stylesheet is imported by the
component. The global layer (`styles/index.css`) is imported first.

Class names are global on purpose. The scroll engine, the reduced-motion mode (`html.rm`) and the header
tone (`html[data-tone]`) all style across components. Tokens (colour, type, spacing, radius) live in
`styles/tokens.css`. The page forces its own colours in dark-mode browsers with `color-scheme: only light`.

### Editing content

The copy, products, phone numbers and links live in `src/data/`. For example:

- To change a blend's tasting note or roast level, edit `data/blends.js`.
- To add a machine, add an item to `data/equipment.js` and put its cut-out in `src/assets/images/`.
- To change the WhatsApp number or the pre-filled messages, edit `data/site.js`.

## Notes

- **The legal text should be reviewed by a lawyer** before launch. It follows the Information Technology
  Act, 2000 and the Digital Personal Data Protection Act, 2023, and it describes how the site actually works
  (no cookies, analytics or forms). Fill in the business's registered legal name if it differs from
  "Poesia India" and a named Grievance Officer (`src/data/site.js` and `src/pages/legal/content/`). If you add
  analytics, a contact form or cookies later, update the Privacy Policy.

- Fonts (Libre Baskerville, Lato, Pinyon Script; SIL Open Font License) are self-hosted Latin subsets in
  `src/assets/fonts`, so the site makes no third-party requests.
- The random-looking details (tear jitter, bean chips, leaf shadows) come from one seeded generator
  (`lib/random.js`), so they look the same on every visit.
