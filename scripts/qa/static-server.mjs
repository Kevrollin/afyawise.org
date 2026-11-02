// QA static server: serves dist/client the way Vercel serves static pages (Brotli/gzip, clean URLs,
// real 404, immutable caching for /_astro). The Node adapter's own server doesn't compress, which would
// understate real-world Lighthouse results. Pages only: forms/API need `npm run preview`.
// Usage: node scripts/qa/static-server.mjs [port=4322]
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve('dist/client');
const port = Number(process.argv[2] ?? 4322);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.jpg': 'image/jpeg',
};
const compressible = /^(text\/|application\/(json|xml|manifest)|image\/svg)/;

async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]).replace(/\/+$/, '') || '/';
  const candidates = [clean, `${clean}.html`, path.posix.join(clean, 'index.html')];
  for (const c of candidates) {
    const file = path.join(root, c);
    if (!file.startsWith(root)) break;
    try {
      if ((await fs.stat(file)).isFile()) return { file, status: 200 };
    } catch {
      /* try next */
    }
  }
  return { file: path.join(root, '404.html'), status: 404 };
}

http
  .createServer(async (req, res) => {
    const { file, status } = await resolve(req.url ?? '/');
    const type = types[path.extname(file)] ?? 'application/octet-stream';
    let body = await fs.readFile(file);
    const headers = {
      'Content-Type': type,
      'Cache-Control': req.url?.startsWith('/_astro/') ? 'public, max-age=31536000, immutable' : 'public, max-age=0, must-revalidate',
    };
    const accept = String(req.headers['accept-encoding'] ?? '');
    if (compressible.test(type)) {
      if (accept.includes('br')) {
        body = zlib.brotliCompressSync(body);
        headers['Content-Encoding'] = 'br';
      } else if (accept.includes('gzip')) {
        body = zlib.gzipSync(body);
        headers['Content-Encoding'] = 'gzip';
      }
      headers.Vary = 'Accept-Encoding';
    }
    res.writeHead(status, headers);
    res.end(body);
  })
  .listen(port, '127.0.0.1', () => console.log(`QA static server on http://127.0.0.1:${port}`));
