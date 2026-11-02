// Post-build step for Vercel: adds site-wide security and caching headers to the Build Output API
// routing table (.vercel/output/config.json). vercel.json `headers` are not applied to prebuilt
// framework output, so they are written here, where the result can be checked locally.
// No-op for the Node build. Runs automatically after `npm run build`.
import fs from 'node:fs/promises';

const file = '.vercel/output/config.json';
let config;
try {
  config = JSON.parse(await fs.readFile(file, 'utf8'));
} catch {
  console.log('postbuild: no Vercel output, nothing to do.');
  process.exit(0);
}

const security = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
const ours = [
  { src: '^/(.*)$', headers: security, continue: true },
  { src: '^/api/(.*)$', headers: { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }, continue: true },
  {
    src: '^/(favicon\\.ico|favicon\\.svg|apple-touch-icon\\.png|icon-192\\.png|icon-512\\.png|icon-maskable-512\\.png|og/.+)$',
    headers: { 'Cache-Control': 'public, max-age=86400' },
    continue: true,
  },
];
// Idempotent: drop copies of our routes from an earlier run before prepending them.
const sig = (r) => JSON.stringify([r.src, r.headers ?? null]);
const mine = new Set(ours.map(sig));
config.routes = [...ours, ...(config.routes ?? []).filter((r) => !mine.has(sig(r)))];
await fs.writeFile(file, JSON.stringify(config, null, 2) + '\n');
console.log(`postbuild: added ${ours.length} header routes to ${file} (${config.routes.length} routes total).`);
