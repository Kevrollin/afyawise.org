// Renders an SVG at several sizes (light and dark backgrounds) next to an optional reference image,
// for checking the logo mark and icons by eye.
// Usage: node scripts/preview-svg.mjs <file.svg> <out.png> [reference.png|jpg]
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [svgFile, out, ref] = process.argv.slice(2);
const data = 'data:image/svg+xml;base64,' + fs.readFileSync(svgFile).toString('base64');
const sizes = [16, 24, 32, 48, 64, 128, 256];
const cells = sizes
  .map((s) => `<figure><img src="${data}" width="${s}" height="${s}" alt=""><figcaption>${s}</figcaption></figure>`)
  .join('');
const refImg = ref
  ? `<figure><img src="${pathToFileURL(path.resolve(ref)).href}" width="200" alt=""><figcaption>reference</figcaption></figure>`
  : '';
const html = `<!doctype html><html><body style="margin:0;padding:16px;font:13px sans-serif;display:flex;gap:20px;align-items:flex-end;background:#fff">
${cells}<figure style="background:#0C2E15;padding:12px;color:#fff"><img src="${data}" width="64" height="64" alt=""><figcaption>on dark</figcaption></figure>${refImg}
<style>figure{margin:0;text-align:center}</style></body></html>`;
const tmp = path.resolve(out.replace(/\.png$/, '.html'));
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1150, height: 310 } });
await page.goto(pathToFileURL(tmp).href);
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
fs.rmSync(tmp);
console.log('wrote', out);
