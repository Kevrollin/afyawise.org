// Dumps the visible text of every built page (dist/client/**/*.html) to one file, so formatting or
// refactors can be diffed for accidental whitespace/text changes (Astro 7 uses JSX whitespace rules).
// Usage: node scripts/qa/text-dump.mjs <out.txt>
import fs from 'node:fs/promises';
import path from 'node:path';

const root = 'dist/client';
const files = [];
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
await walk(root);
files.sort();
const out = [];
for (const f of files) {
  const html = await fs.readFile(f, 'utf8');
  const body = html.replace(/<head>[\s\S]*?<\/head>/, '');
  const text = body
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/g, ' ')
    .replace(/<\/?(p|div|li|h[1-6]|section|header|footer|nav|ul|ol|dt|dd|figure|figcaption|tr|td|th|summary|details|label|button|a)\b[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean);
  out.push(`### ${path.relative(root, f)}`, ...text, '');
}
await fs.writeFile(process.argv[2], out.join('\n'));
console.log(`${files.length} pages -> ${process.argv[2]}`);
