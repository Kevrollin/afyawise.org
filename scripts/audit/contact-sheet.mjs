// Renders a labelled contact sheet of raster images (for reviewing which photos look like real
// fieldwork vs stock or AI-generated). Usage: node scripts/audit/contact-sheet.mjs <imageDir> <out.png>
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(process.argv[2] ?? 'audit/assets/original');
const out = path.resolve(process.argv[3] ?? 'audit/assets/contact-sheet.png');
const files = [];
const walk = (d) =>
  fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(jpe?g|png|webp)$/i.test(e.name) && fs.statSync(p).size > 20000) files.push(p);
  });
walk(root);
const cells = files
  .map(
    (f) =>
      `<figure><img src="${pathToFileURL(f).href}"><figcaption>${path.relative(root, f)} - ${Math.round(fs.statSync(f).size / 1024)} KB</figcaption></figure>`,
  )
  .join('');
const html = `<html><body style="margin:0;background:#fff;font:12px sans-serif"><div style="display:grid;grid-template-columns:repeat(5,260px);gap:8px;padding:8px">${cells}</div>
<style>figure{margin:0}img{width:260px;height:260px;object-fit:contain;background:#eee;display:block}figcaption{padding:2px 0;word-break:break-all}</style></body></html>`;
const tmp = out.replace(/\.png$/, '.html');
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1350, height: 800 } });
await page.goto(pathToFileURL(tmp).href);
await page.waitForTimeout(1500);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
fs.rmSync(tmp);
console.log(`${files.length} images -> ${out}`);
