// Phase 1: download every image the live site uses (from the crawl data) for reuse and review,
// and write a manifest with bytes, natural vs rendered size, alt text and where each is used.
// Usage: node scripts/audit/assets.mjs   (run after crawl.mjs)
import fs from 'node:fs/promises';
import path from 'node:path';
import { BASE, OUT, writeJson, writeText, ensureDir } from './lib.mjs';

const pagesDir = path.join(OUT, 'data', 'pages');
const files = (await fs.readdir(pagesDir)).filter((f) => f.endsWith('.desktop.json'));
const assets = new Map();

const add = (raw, info) => {
  if (!raw || raw.startsWith('data:')) return;
  const url = new URL(raw, BASE + '/');
  if (!['www.afyawise.org', 'afyawise.org'].includes(url.hostname)) return;
  const key = url.pathname;
  const a = assets.get(key) || { path: key, usedOn: new Set(), alts: new Set(), natural: null, rendered: [] };
  a.usedOn.add(info.route);
  if (info.alt !== undefined) a.alts.add(info.alt === null ? '(no alt attribute)' : info.alt === '' ? '(empty alt)' : info.alt);
  if (info.natural) a.natural = info.natural;
  if (info.rendered) a.rendered.push(info.rendered);
  assets.set(key, a);
};

for (const f of files) {
  const d = JSON.parse(await fs.readFile(path.join(pagesDir, f), 'utf8'));
  for (const img of d.images) {
    add(img.src, {
      route: d.route,
      alt: img.alt,
      natural: img.naturalWidth ? `${img.naturalWidth}x${img.naturalHeight}` : null,
      rendered: `${img.renderedWidth}x${img.renderedHeight}`,
    });
  }
  for (const bg of d.bgImages) {
    for (const m of bg.value.matchAll(/url\("?([^")]+)"?\)/g)) {
      add(m[1], { route: d.route, rendered: `${bg.renderedWidth}x${bg.renderedHeight} (css background)` });
    }
  }
  for (const l of d.meta.linkTags) if (/icon/.test(l.rel || '')) add(l.href, { route: d.route, rendered: 'favicon' });
}

const destRoot = path.join(OUT, 'assets', 'original');
const manifest = [];
for (const a of assets.values()) {
  const res = await fetch(BASE + a.path);
  const type = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const isImage = type.startsWith('image/');
  if (isImage) {
    const dest = path.join(destRoot, decodeURIComponent(a.path));
    await ensureDir(path.dirname(dest));
    await fs.writeFile(dest, buf);
  }
  const maxRendered = a.rendered
    .map((r) => r.match(/^(\d+)x(\d+)/))
    .filter(Boolean)
    .reduce((m, r) => Math.max(m, +r[1]), 0);
  const naturalW = a.natural ? +a.natural.split('x')[0] : null;
  manifest.push({
    path: a.path,
    status: res.status,
    contentType: type,
    bytes: buf.length,
    kb: +(buf.length / 1024).toFixed(1),
    natural: a.natural,
    maxRenderedWidth: maxRendered || null,
    oversizeFactor: naturalW && maxRendered ? +(naturalW / maxRendered).toFixed(1) : null,
    alts: [...a.alts],
    usedOn: [...a.usedOn].sort(),
    saved: isImage,
  });
}
manifest.sort((x, y) => y.bytes - x.bytes);
await writeJson(path.join(OUT, 'assets', 'manifest.json'), manifest);
const md = [
  '| Asset | Type | KB | Natural | Max rendered width | Oversize | Alt text(s) | Used on |',
  '|---|---|---:|---|---:|---:|---|---|',
  ...manifest.map(
    (m) =>
      `| \`${m.path}\` | ${m.contentType.replace('image/', '')} | ${m.kb} | ${m.natural ?? ''} | ${m.maxRenderedWidth ?? ''} | ${m.oversizeFactor ? m.oversizeFactor + 'x' : ''} | ${m.alts.join('; ')} | ${m.usedOn.join(', ')} |`,
  ),
].join('\n');
await writeText(path.join(OUT, 'assets', 'manifest.md'), md + '\n');
const total = manifest.reduce((s, m) => s + m.bytes, 0);
console.log(`${manifest.length} assets, ${(total / 1024 / 1024).toFixed(2)} MB total`);
console.table(manifest.slice(0, 15).map(({ path: p, kb, natural, maxRenderedWidth, oversizeFactor }) => ({ p, kb, natural, maxRenderedWidth, oversizeFactor })));
