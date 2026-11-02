import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { allPages } from './routes.ts';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

// Reduced motion: the scroll-driven fade-in would otherwise leave below-the-fold text mid-animation.
test.use({ reducedMotion: 'reduce' });

for (const path of [...allPages, '/this-page-does-not-exist']) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    // Keep the raw report for the record (qa/axe/<page>.<desktop|mobile>.json).
    const slug = path === '/' ? 'home' : path.replace(/^\/|\/$/g, '').replace(/\//g, '__');
    await fs.mkdir('qa/axe', { recursive: true });
    await fs.writeFile(
      `qa/axe/${slug}.${test.info().project.name}.json`,
      JSON.stringify(
        {
          url: path,
          axe: results.testEngine.version,
          violations: results.violations,
          passes: results.passes.length,
          incomplete: results.incomplete.map((i) => ({ id: i.id, nodes: i.nodes.length, help: i.help })),
        },
        null,
        2,
      ),
    );
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
    );
    expect(summary, summary.join('\n')).toEqual([]);
  });
}

test('axe: open mobile menu', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile drawer');
  await page.goto('/');
  await page.locator('[data-menu-button]').click();
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test('axe: form error state', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('[data-error-for="name"]')).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});
