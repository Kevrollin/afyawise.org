// Full-page screenshots of every route at every breakpoint (Phase 7 QA), with reduced motion so
// scroll-driven reveals don't leave sections half-faded.
// Usage: node scripts/qa/screens.mjs [--base http://127.0.0.1:4321] [--out qa/screenshots] [--widths 390,1440] [routes...]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const take = (name, fallback) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args.splice(i, 2)[1];
};
const base = take('--base', 'http://127.0.0.1:4321');
const out = path.resolve(take('--out', 'qa/screenshots'));
const widths = take('--widths', '320,360,390,414,768,1024,1280,1440,1920').split(',').map(Number);
const landscape = args.includes('--landscape') ? (args.splice(args.indexOf('--landscape'), 1), true) : false;
const routes = args.length
  ? args
  : ['/', '/programs', '/programs/maternal-child-health', '/impact', '/partner', '/donate', '/get-involved', '/contact', '/about', '/privacy', '/terms', '/404-test-page'];
const slug = (r) => (r === '/' ? 'home' : r.replace(/^\/|\/$/g, '').replace(/\//g, '__'));

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
const viewports = widths.map((w) => ({ width: w, height: w < 768 ? 844 : 900, label: String(w) }));
if (landscape) viewports.push({ width: 844, height: 390, label: '844x390-landscape' });
for (const vp of viewports) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
    isMobile: vp.width < 768 || vp.label.includes('landscape'),
    hasTouch: vp.width < 1024,
  });
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    // JPEG keeps 120 full-page shots small enough to commit.
    await page.screenshot({ path: path.join(out, `${slug(route)}-${vp.label}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
    report.push({ route, viewport: vp.label, horizontalOverflowPx: overflow });
  }
  await ctx.close();
}
await browser.close();
const bad = report.filter((r) => r.horizontalOverflowPx > 0);
await fs.writeFile(path.join(out, 'overflow-report.json'), JSON.stringify(report, null, 2));
console.log(`${report.length} screenshots in ${out}; horizontal overflow on ${bad.length}:`, bad);
