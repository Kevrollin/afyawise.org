// Viewport-sized screenshots for design review (full-page shots of long mobile pages are unreadable).
// Usage: node scripts/qa/peek.mjs <outDir> <route> <width>x<height> [scrollY,...] [--menu]
import { chromium } from 'playwright';
import path from 'node:path';

const [out, route = '/', size = '390x844', offsets = '0', ...rest] = process.argv.slice(2);
const [width, height] = size.split('x').map(Number);
const base = process.env.BASE ?? 'http://127.0.0.1:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce', isMobile: width < 768, hasTouch: width < 1024 });
await page.goto(base + route, { waitUntil: 'networkidle' });
const name = (route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '__')) + `-${width}`;
if (rest.includes('--menu')) {
  await page.click('[data-menu-button]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(out, `${name}-menu.png`) });
} else {
  for (const y of offsets.split(',').map(Number)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(out, `${name}-y${y}.png`) });
  }
}
await browser.close();
console.log('ok', name);
