import { test, expect } from '@playwright/test';

test('skip link moves focus to the main content', async ({ page }) => {
  await page.goto('/partner');
  await page.keyboard.press('Tab');
  const skip = page.locator('a.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('current page is marked in the navigation', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop navigation');
  await page.goto('/impact');
  await expect(page.locator('header nav a[aria-current="page"]')).toHaveText('Impact');
});

test('mobile menu opens, is keyboard-usable and closes with Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile drawer');
  await page.goto('/');
  const button = page.locator('[data-menu-button]');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  const drawer = page.locator('#mobile-nav');
  await expect(drawer).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer.getByRole('link', { name: 'Programs' })).toBeVisible();
  await expect(drawer.locator('.mobile-link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('mobile menu links navigate', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile drawer');
  await page.goto('/');
  await page.locator('[data-menu-button]').click();
  await page.locator('#mobile-nav').getByRole('link', { name: 'Fund & partner' }).click();
  await expect(page).toHaveURL(/\/partner$/);
});

test('touch targets are at least 44px on mobile', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  for (const path of ['/', '/partner', '/donate', '/contact']) {
    await page.goto(path);
    const small = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLElement>(
          'main a, main button, header a, header button, footer a, main input, main select',
        ),
      ]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          // Inline text links inside a sentence are exempt (WCAG 2.5.8 inline exception).
          const inline = style.display === 'inline' && el.closest('p, li, dd') !== null;
          // Hidden spam traps don't count; a checkbox's tap target is its wrapping label.
          const hiddenTrap = el.closest('[aria-hidden="true"]') !== null;
          const input = el as HTMLInputElement;
          const labelled =
            (input.type === 'checkbox' || input.type === 'radio') &&
            (el.closest('label')?.getBoundingClientRect().height ?? 0) >= 44;
          return (
            r.width > 0 &&
            r.height > 0 &&
            !inline &&
            !hiddenTrap &&
            !labelled &&
            input.type !== 'hidden' &&
            (r.height < 44 || r.width < 24)
          );
        })
        .map(
          (el) =>
            `${el.tagName} "${(el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(el.getBoundingClientRect().height)}px`,
        ),
    );
    expect(small, `${path}: ${small.join(', ')}`).toEqual([]);
  }
});
