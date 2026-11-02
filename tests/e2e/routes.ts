import { programs } from '../../src/content/en/programs.ts';

/** Every public, indexable page. */
export const pages = [
  '/',
  '/programs',
  ...programs.map((p) => `/programs/${p.slug}`),
  '/impact',
  '/partner',
  '/donate',
  '/get-involved',
  '/contact',
  '/about',
  '/privacy',
  '/terms',
];

/** Utility pages: render, but are noindex and not in the sitemap. */
export const utilityPages = ['/thanks', '/form-error', '/donate/thank-you'];

export const allPages = [...pages, ...utilityPages];
