import { test, expect } from '@playwright/test';
import { allPages, pages } from './routes.ts';

test.describe('every route renders', () => {
  for (const path of allPages) {
    test(`${path} renders with one h1, landmarks and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
      page.on('pageerror', (e) => errors.push(String(e)));

      const res = await page.goto(path, { waitUntil: 'networkidle' });
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('header')).toHaveCount(1);
      await expect(page.locator('main#main')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
      await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
});

test.describe('SEO basics', () => {
  test('titles and descriptions are unique; canonical, Open Graph and JSON-LD present', async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const path of pages) {
      await page.goto(path);
      const title = await page.title();
      const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
      expect(title.length, `${path} title`).toBeGreaterThan(10);
      expect(title.length, `${path} title`).toBeLessThanOrEqual(60);
      expect(description.length, `${path} description`).toBeGreaterThanOrEqual(70);
      expect(description.length, `${path} description`).toBeLessThanOrEqual(160);
      titles.add(title);
      descriptions.add(description);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://www.afyawise.org${path === '/' ? '/' : path}`,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /^https:\/\/www\.afyawise\.org\/og\/.+\.png$/,
      );
      const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
      const types = ld.map((s) => JSON.parse(s)['@type']);
      expect(types).toContain('NGO');
      expect(types).toContain('WebSite');
    }
    expect(titles.size).toBe(pages.length);
    expect(descriptions.size).toBe(pages.length);
  });

  test('FAQ structured data on the funder page', async ({ page }) => {
    await page.goto('/partner');
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((s) => JSON.parse(s));
    const faq = ld.find((x) => x['@type'] === 'FAQPage');
    expect(faq?.mainEntity.length).toBeGreaterThan(3);
  });

  test('robots.txt and sitemap are real files', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.headers()['content-type']).toContain('text/plain');
    expect(await robots.text()).toContain('Sitemap: https://www.afyawise.org/sitemap-index.xml');
    const sitemap = await request.get('/sitemap-index.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('<sitemapindex');
    const urls = await (await request.get('/sitemap-0.xml')).text();
    for (const path of pages) expect(urls).toContain(`https://www.afyawise.org${path === '/' ? '/' : path}<`);
    expect(urls).not.toContain('/thanks');
  });

  test('utility pages are noindex', async ({ page }) => {
    for (const path of ['/thanks', '/form-error', '/donate/thank-you']) {
      await page.goto(path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    }
  });

  test('unknown URLs return a real 404 with recovery links', async ({ page }) => {
    const res = await page.goto('/this-page-does-not-exist');
    expect(res?.status()).toBe(404);
    await expect(page.locator('h1')).toHaveText(/can’t find that page/);
    await expect(page.locator('main a[href="/programs"]')).toBeVisible();
  });
});

test.describe('truth rules', () => {
  test('no unconfirmed content, placeholders or old typos reach the production build', async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      const text = await page.locator('body').innerText();
      expect(text, path).not.toContain('TODO_CONFIRM');
      expect(text, path).not.toMatch(/lorem ipsum|coming soon/i);
      expect(text, path).not.toMatch(/\b(Mision|Nutritionz|Activitiesz|CHVsz)\b/);
      // Conflicting, unverified live-site claims must not appear.
      expect(text, path).not.toMatch(/1,000\+ Lives|200\+ Health Workers|95% Satisfaction|thousands of supporters/i);
    }
  });

  test('objectives are labelled as targets', async ({ page }) => {
    await page.goto('/impact');
    const targets = page.locator('#targets li');
    await expect(targets).toHaveCount(5);
    for (const li of await targets.all()) await expect(li.locator('.badge--target')).toHaveText('Target');
  });

  test('every statistic shows its source', async ({ page }) => {
    await page.goto('/');
    await expect(
      page
        .locator('#need-title ~ * a[href*="dhsprogram.com"], [aria-labelledby="need-title"] a[href*="dhsprogram.com"]')
        .first(),
    ).toBeVisible();
  });
});
