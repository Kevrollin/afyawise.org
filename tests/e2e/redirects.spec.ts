import { test, expect } from '@playwright/test';
import { redirects, dynamicRedirects } from '../../src/config/redirects.mjs';

test.describe('old routes redirect permanently', () => {
  for (const [from, { status, destination }] of Object.entries(redirects)) {
    test(`${from} → ${destination}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(status);
      expect(res.headers()['location']).toBe(destination);
    });
  }
  for (const [from, destination] of Object.entries(dynamicRedirects)) {
    test(`${from} → ${destination}`, async ({ request }) => {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status()).toBe(301);
      expect(res.headers()['location']).toBe(destination);
    });
  }

  test('/team lands on the leadership section of About', async ({ page }) => {
    await page.goto('/team');
    await expect(page).toHaveURL(/\/about#leadership$/);
    await expect(page.locator('#leadership')).toBeVisible();
  });
});
