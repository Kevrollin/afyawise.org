import { test, expect } from '@playwright/test';
import { gzipSync } from 'node:zlib';
import { allPages } from './routes.ts';

/**
 * Performance and security budgets (Phase 6): home JS ≤ 30 KB gzip, page weight ≤ 500 KB,
 * no third-party requests, one font file, CSP present, no inline event handlers.
 * The local server does not compress, so text responses are measured as gzip here (as served by Vercel).
 */
const TEXT = /(html|css|javascript|json|svg|xml|text)/;

for (const path of ['/', '/partner', '/donate', '/programs/maternal-child-health']) {
  test(`budget: ${path}`, async ({ page }) => {
    const sizes: { url: string; type: string; bytes: number }[] = [];
    page.on('response', async (res) => {
      if (!res.ok()) return;
      const type = res.headers()['content-type'] ?? '';
      const body = await res.body().catch(() => Buffer.alloc(0));
      sizes.push({ url: res.url(), type, bytes: TEXT.test(type) ? gzipSync(body).length : body.length });
    });
    await page.goto(path, { waitUntil: 'networkidle' });

    const html = await page.content();
    const inlineJs = [...html.matchAll(/<script(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
      .map((m) => m[1] ?? '')
      .join('');
    const externalJs = sizes.filter((s) => /javascript/.test(s.type)).reduce((a, s) => a + s.bytes, 0);
    const jsKb = (gzipSync(Buffer.from(inlineJs)).length + externalJs) / 1024;
    const totalKb = sizes.reduce((a, s) => a + s.bytes, 0) / 1024;

    expect(jsKb, `JS ${jsKb.toFixed(1)} KB`).toBeLessThanOrEqual(30);
    expect(totalKb, `total ${totalKb.toFixed(1)} KB`).toBeLessThanOrEqual(500);
    expect(sizes.filter((s) => !s.url.startsWith('http://127.0.0.1:4321')).map((s) => s.url)).toEqual([]);
    expect(sizes.filter((s) => /font/.test(s.type)).length).toBeLessThanOrEqual(1);
    test
      .info()
      .annotations.push({
        type: 'weight',
        description: `JS ${jsKb.toFixed(1)} KB gz · total ${totalKb.toFixed(1)} KB`,
      });
  });
}

test('security: CSP on every page and no inline event handlers', async ({ request }) => {
  for (const path of allPages) {
    const html = await (await request.get(path)).text();
    const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]+)"/)?.[1] ?? '';
    expect(csp, path).toContain("default-src 'self'");
    expect(csp, path).toContain("object-src 'none'");
    expect(csp, path).not.toContain('unsafe-inline');
    expect(csp, path).not.toContain('unsafe-eval');
    expect(html, path).not.toMatch(/\son(click|load|submit|error|mouseover)=/i);
    // Style attributes are blocked by the CSP (hashes cover <style> blocks only).
    expect(html, path).not.toMatch(/<[a-z][^>]*\sstyle="/i);
  }
});

test('forms post to same-origin endpoints', async ({ page }) => {
  for (const path of ['/contact', '/partner', '/get-involved']) {
    await page.goto(path);
    for (const form of await page.locator('form[data-form]').all()) {
      await expect(form).toHaveAttribute('method', 'post');
      await expect(form).toHaveAttribute('action', /^\/api\//);
    }
  }
});
