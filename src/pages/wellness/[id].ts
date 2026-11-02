import type { APIRoute } from 'astro';

/** Old /wellness/:id links from the previous site → /get-involved (301). */
export const prerender = false;
export const GET: APIRoute = ({ redirect }) => redirect('/get-involved', 301);
