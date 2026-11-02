// 301 redirects from the old (pre-2026) site's routes. Imported by astro.config.mjs and by the
// Playwright redirect tests, so the two never drift apart.
// When the first real story is published, point /blog and /blog/[id] at /stories.

/** @type {Record<string, { status: 301; destination: string }>} */
export const redirects = {
  '/work': { status: 301, destination: '/programs' },
  '/our-impact': { status: 301, destination: '/impact' },
  '/team': { status: 301, destination: '/about#leadership' },
  '/support': { status: 301, destination: '/partner' },
  '/services': { status: 301, destination: '/programs' },
  '/shop': { status: 301, destination: '/donate' },
  '/wellness': { status: 301, destination: '/get-involved' },
  '/blog': { status: 301, destination: '/impact' },
};

/** Old dynamic URLs (/our-impact/:id, /wellness/:id, /blog/:id) can't be config redirects (Astro
 * requires the destination to keep the parameter), so tiny on-demand endpoints in src/pages/<old>/[id].ts
 * answer them with a 301. Listed here for the tests. */
export const dynamicRedirects = {
  '/our-impact/some-old-id': '/impact',
  '/wellness/some-old-id': '/get-involved',
  '/blog/some-old-id': '/impact',
};
