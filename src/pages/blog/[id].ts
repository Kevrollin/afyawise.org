import type { APIRoute } from 'astro';

/** Old /blog/:id links from the previous site → /impact (301). */
export const prerender = false;
export const GET: APIRoute = ({ redirect }) => redirect('/impact', 301);
