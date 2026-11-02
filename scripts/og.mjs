// Generates 1200×630 Open Graph images (public/og/<name>.png) for every page, from the page headlines
// in src/content, the brand logo and the self-hosted Inter font. Output is committed; re-run after
// changing headlines.  Usage: npm run og
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const c = await import('../src/content/en/index.ts');
const logo = JSON.parse(await fs.readFile('src/assets/brand/logo.json', 'utf8'));
// Embedded as a data URL: a page made with setContent (about:blank) cannot load file:// fonts.
const font = `data:font/woff2;base64,${(await fs.readFile('src/assets/fonts/inter-latin-var.woff2')).toString('base64')}`;
const OUT = 'public/og';

const where = `${c.org.location.ward} · ${c.org.location.county} · ${c.org.location.country}`;
const cards = [
  { name: 'default', eyebrow: 'AfyaWise CBO', title: c.home.hero.headline },
  { name: 'home', eyebrow: 'Community health in Meru County', title: c.home.hero.headline },
  { name: 'programs', eyebrow: 'Programs', title: 'Five programs, one community model' },
  { name: 'impact', eyebrow: 'Impact', title: c.impactPage.headline },
  { name: 'partner', eyebrow: 'Fund & partner', title: c.partnerPage.headline },
  { name: 'donate', eyebrow: 'Donate', title: 'Fund community health in Karama Ward' },
  { name: 'get-involved', eyebrow: 'Get involved', title: 'Volunteer, partner or give' },
  { name: 'contact', eyebrow: 'Contact', title: 'Write to the right team' },
  { name: 'about', eyebrow: 'About', title: 'A community-governed CBO in Meru County' },
  ...c.programs.map((p) => ({ name: `program-${p.slug}`, eyebrow: p.title, title: p.headline })),
];

const logoSvg = (fillA, fillB) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logo.width} ${logo.height}" height="64">${logo.mark}<path d="${logo.afya}" fill="${fillA}"/><path d="${logo.wise}" fill="${fillB}"/></svg>`;
const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="520" height="520">${logo.mark}</svg>`;

const html = (card) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url(${font}) format('woff2'); font-weight: 400 800; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; font-family: Inter, sans-serif; color: #fff;
  background: radial-gradient(900px 600px at 95% 0%, rgba(68,189,50,.28), transparent 60%), #0c2e15; }
.wrap { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; }
.mark { position: absolute; right: -90px; bottom: -110px; opacity: .12; }
.eyebrow { margin-top: auto; font-size: 26px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #fdba6b; }
h1 { margin-top: 18px; max-width: 900px; font-size: 68px; line-height: 1.06; font-weight: 800; letter-spacing: -.025em; }
.where { margin-top: 30px; font-size: 26px; color: #ddf0d8; }
.bar { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; background: linear-gradient(90deg, #1e88c8 0 33%, #3db233 33% 66%, #f7931e 66%); }
</style></head><body><div class="wrap">
<div class="mark">${markSvg}</div>
<div>${logoSvg('#ffffff', '#fdba6b')}</div>
<p class="eyebrow">${card.eyebrow}</p>
<h1>${card.title}</h1>
<p class="where">${where}</p>
</div><div class="bar"></div></body></html>`;

await fs.mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await page.setContent(html(card), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.screenshot({ type: 'png' });
  // Palette PNG keeps text crisp at a fraction of the size.
  await sharp(shot)
    .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
    .toFile(path.join(OUT, `${card.name}.png`));
}
await browser.close();
const sizes = await Promise.all(cards.map(async (k) => (await fs.stat(path.join(OUT, `${k.name}.png`))).size));
console.log(`${cards.length} OG images in ${OUT} (${Math.round(sizes.reduce((a, b) => a + b, 0) / 1024)} KB total)`);
