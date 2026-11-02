// Builds the self-hosted Inter variable WOFF2 used by the site: Latin glyphs only (enough for
// English and Kiswahili), weight axis limited to 400–800. Output is committed; re-run only if the
// character set or weights change.  Usage: npm run fonts
import fs from 'node:fs/promises';
import path from 'node:path';
import subsetFont from 'subset-font';

const SRC = 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2';
const OUT_DIR = 'src/assets/fonts';
const OUT = path.join(OUT_DIR, 'inter-latin-var.woff2');

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join('');
const chars =
  range(0x20, 0x7e) + // Basic Latin
  range(0xa0, 0xff) + // Latin-1 Supplement (é, ©, ×, ·, etc.)
  '‐‑‒–—‘’‚“”„•…′″‹›' + // dashes, quotes, bullet, ellipsis, primes
  '€™←↑→↓↗−≤≥≈  '; // € ™ arrows − ≤ ≥ ≈ nbsp

const src = await fs.readFile(SRC);
const out = await subsetFont(src, chars, {
  targetFormat: 'woff2',
  variationAxes: { wght: { min: 400, max: 800 } },
});
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.writeFile(OUT, out);
await fs.copyFile('node_modules/@fontsource-variable/inter/LICENSE', path.join(OUT_DIR, 'Inter-OFL.txt'));
console.log(
  `${SRC} (${(src.length / 1024).toFixed(1)} KB) -> ${OUT} (${(out.length / 1024).toFixed(1)} KB), ${[...chars].length} characters`,
);
