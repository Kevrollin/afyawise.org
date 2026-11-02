// Builds the AfyaWise brand assets from src/assets/brand/mark.svg:
//  - outlined "AfyaWise" wordmark (Inter ExtraBold, camel-case W) → src/assets/brand/logo.json (used by <Logo />)
//  - public/brand/*.svg (horizontal logo, white logo, mark)
//  - favicon.svg, favicon.ico (16/32/48), apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png
// Output is committed; re-run only when the mark or colours change.  Usage: npm run brand
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import opentype from 'opentype.js';

const CACHE = path.resolve('node_modules/.cache/fonts');
const FONT_URL = 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuDyYMZg.ttf'; // Inter 800 (OFL)
const COLORS = { afya: '#196428', wise: '#A85508', white: '#FFFFFF' };

async function fontFile() {
  const file = path.join(CACHE, 'inter-800.ttf');
  try {
    return await fs.readFile(file);
  } catch {
    const res = await fetch(FONT_URL);
    if (!res.ok) throw new Error(`font download: HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.mkdir(CACHE, { recursive: true });
    await fs.writeFile(file, buf);
    return buf;
  }
}

const markSvg = await fs.readFile('src/assets/brand/mark.svg', 'utf8');
const markInner = markSvg
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/<!--[\s\S]*?-->/g, '')
  .trim()
  .replace(/\s*\n\s*/g, '');

// --- Wordmark ---------------------------------------------------------------------------------
const buf = await fontFile();
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const SIZE = 30; // in mark units (mark is 64 tall)
const capHeight = (font.tables.os2.sCapHeight / font.unitsPerEm) * SIZE;
const baseline = 32 + capHeight / 2; // caps centred on the mark
const textX = 64 + 10;
// Manual layout (glyph by glyph, with GPOS kerning): opentype.js's shaper chokes on Inter's ccmp
// lookups, and a plain Latin word needs no shaping.
const scale = SIZE / font.unitsPerEm;
const kerningLookups = font.position.getKerningTables('latn');
let penX = textX;
let prev = null;
const glyphPaths = [];
for (const ch of 'AfyaWise') {
  const glyph = font.charToGlyph(ch);
  if (prev) {
    const kern = kerningLookups
      ? font.position.getKerningValue(kerningLookups, prev.index, glyph.index)
      : font.getKerningValue(prev, glyph);
    penX += kern * scale;
  }
  glyphPaths.push(glyph.getPath(penX, baseline, SIZE));
  penX += glyph.advanceWidth * scale;
  prev = glyph;
}
const join = (paths) => paths.map((p) => p.toPathData(2)).join('');
const afya = join(glyphPaths.slice(0, 4));
const wise = join(glyphPaths.slice(4));
const advance = penX - textX;
const width = Math.ceil(textX + advance + 2);
const height = 64;

const logo = { width, height, mark: markInner, afya, wise, colors: COLORS };
await fs.writeFile('src/assets/brand/logo.json', JSON.stringify(logo) + '\n');

const horizontal = (afyaFill, wiseFill, markMarkup = markInner) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="AfyaWise"><title>AfyaWise</title>${markMarkup}<path d="${afya}" fill="${afyaFill}"/><path d="${wise}" fill="${wiseFill}"/></svg>\n`;

await fs.mkdir('public/brand', { recursive: true });
await fs.writeFile('public/brand/afyawise-logo.svg', horizontal(COLORS.afya, COLORS.wise));
await fs.writeFile('public/brand/afyawise-logo-white.svg', horizontal(COLORS.white, '#FDBA6B'));
await fs.writeFile('public/brand/afyawise-mark.svg', markSvg);

// --- Favicons ---------------------------------------------------------------------------------
// Tighter crop so the mark fills small favicons.
const tight = (bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="4 4 56 56">${bg ? `<rect x="4" y="4" width="56" height="56" fill="${bg}"/>` : ''}${markInner}</svg>`;
await fs.writeFile('public/favicon.svg', tight() + '\n');

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();
// Padded square on a solid background (apple touch icon, PWA icons). `pad` is the share of each side left empty.
const padded = (bg, pad) => {
  const inner = 56 / (1 - 2 * pad);
  const o = 32 - inner / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o} ${o} ${inner} ${inner}"><rect x="${o}" y="${o}" width="${inner}" height="${inner}" fill="${bg}"/>${markInner}</svg>`;
};
await fs.writeFile('public/apple-touch-icon.png', await png(padded('#FFFFFF', 0.12), 180));
await fs.writeFile('public/icon-192.png', await png(padded('#FFFFFF', 0.1), 192));
await fs.writeFile('public/icon-512.png', await png(padded('#FFFFFF', 0.1), 512));
await fs.writeFile('public/icon-maskable-512.png', await png(padded('#F0F8EE', 0.2), 512)); // safe zone = 80% circle

// favicon.ico with PNG-encoded 16/32/48 entries.
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(tight('#FFFFFF'), s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0);
  e.writeUInt8(s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});
await fs.writeFile('public/favicon.ico', Buffer.concat([header, ...entries, ...images]));

console.log(`logo ${width}x${height}; wordmark cap height ${capHeight.toFixed(1)}; favicons written`);
