// Shared helpers for the Phase 1 audit of the live, client-rendered afyawise.org.
import fs from 'node:fs/promises';
import path from 'node:path';

export const BASE = 'https://www.afyawise.org';
export const OUT = path.resolve('audit');

// Routes named in the brief. The crawler adds any other internal route it discovers.
export const SEED_ROUTES = [
  '/',
  '/about',
  '/work',
  '/services',
  '/our-impact',
  '/team',
  '/contact',
  '/support',
  '/donate',
  '/blog',
  '/shop',
  '/wellness',
];

export const slugOf = (route) =>
  route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '__') || 'home';

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

export async function writeJson(file, data) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

export async function writeText(file, text) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, text, 'utf8');
}

/** Navigate and wait for the SPA to render (network idle, with a fallback). */
export async function load(page, route, { idle = true } = {}) {
  const resp = await page.goto(BASE + route, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  if (idle) await page.waitForLoadState('networkidle', { timeout: 20_000 }).catch(() => {});
  else await page.waitForLoadState('load', { timeout: 30_000 }).catch(() => {});
  await page.waitForTimeout(800);
  return resp;
}

/** Scroll to the bottom in steps so lazy content and in-view animations fire, then return to top. */
export async function autoScroll(page) {
  await page.evaluate(async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(200, Math.floor(window.innerHeight * 0.6));
    let stuck = 0;
    for (let i = 0; i < 400 && stuck < 3; i++) {
      const before = window.scrollY;
      window.scrollBy(0, step);
      await sleep(150);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      stuck = window.scrollY === before && atBottom ? stuck + 1 : 0;
    }
    await sleep(2500); // let count-up / fade-in animations finish
    window.scrollTo(0, 0);
    await sleep(400);
  });
}

// ---------- contrast maths (WCAG 2.x) ----------
export function parseRgb(str) {
  const m = str && str.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return { r, g, b, a };
}
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
export const luminance = ({ r, g, b }) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
export function contrast(fg, bg) {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}
export const toHex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
