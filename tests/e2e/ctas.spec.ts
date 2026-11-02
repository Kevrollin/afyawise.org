import { test, expect, type Page } from '@playwright/test';
import { allPages } from './routes.ts';

/**
 * Zero dead CTAs: every link resolves (and its #anchor exists), every button does something.
 */
type Found = { page: string; href: string; text: string };

async function collect(page: Page) {
  return page.evaluate(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>('a[href]')].map((a) => ({
      href: a.getAttribute('href') ?? '',
      text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 60),
    }));
    const buttons = [...document.querySelectorAll<HTMLButtonElement>('button')].map((b) => {
      const form = b.closest('form');
      const target = b.getAttribute('popovertarget');
      return {
        text: (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 60),
        submitsForm: (b.type === 'submit' || !b.getAttribute('type')) && !!form?.getAttribute('action'),
        popover: target ? !!document.getElementById(target)?.hasAttribute('popover') : false,
        scripted: b.hasAttribute('data-copy') || b.hasAttribute('data-chat-close') || b.hasAttribute('data-chat-start'),
      };
    });
    return { links, buttons };
  });
}

test('every link on every page leads somewhere real', async ({ page, request }) => {
  const internal = new Map<string, Found>();
  const problems: string[] = [];

  for (const path of allPages) {
    await page.goto(path);
    const { links, buttons } = await collect(page);
    for (const l of links) {
      if (l.href.startsWith('mailto:')) {
        if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?$/i.test(l.href)) problems.push(`${path}: bad mailto ${l.href}`);
      } else if (l.href.startsWith('tel:')) {
        if (!/^tel:\+\d{9,15}$/.test(l.href)) problems.push(`${path}: bad tel ${l.href}`);
      } else if (l.href.startsWith('#')) {
        if (l.href.length > 1 && !(await page.locator(l.href).count()))
          problems.push(`${path}: missing anchor ${l.href}`);
      } else if (l.href.startsWith('/')) {
        internal.set(l.href, { page: path, href: l.href, text: l.text });
      } else if (!/^https:\/\//.test(l.href)) {
        problems.push(`${path}: unexpected link ${l.href} ("${l.text}")`);
      }
    }
    for (const b of buttons) {
      if (!b.submitsForm && !b.popover && !b.scripted) problems.push(`${path}: button with no action ("${b.text}")`);
    }
  }

  for (const { page: from, href, text } of internal.values()) {
    const url = new URL(href, 'http://127.0.0.1:4321');
    const res = await request.get(url.pathname + url.search);
    if (res.status() >= 400) {
      problems.push(`${from}: "${text}" → ${href} returned ${res.status()}`);
      continue;
    }
    if (url.hash.length > 1) {
      await page.goto(url.pathname + url.search);
      if (!(await page.locator(url.hash).count())) problems.push(`${from}: "${text}" → ${href}: anchor not found`);
    }
  }

  expect(problems, problems.join('\n')).toEqual([]);
  expect(internal.size).toBeGreaterThan(20);
});

test('primary CTAs point at the funder path and donate page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Fund our work' }).first()).toHaveAttribute('href', '/partner');
  await expect(page.getByRole('link', { name: 'Partner with us' }).first()).toHaveAttribute('href', '/partner#request');
  await expect(page.locator('header').getByRole('link', { name: 'Donate' })).toHaveAttribute('href', '/donate');
});

test('Donate stays visible in the header at every width', async ({ page }) => {
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/about');
    await expect(page.locator('header').getByRole('link', { name: 'Donate' })).toBeVisible();
  }
});

test('project "Request proposal" buttons preselect the project in the form', async ({ page }) => {
  await page.goto('/partner');
  await page
    .locator('#project-mobile-clinics')
    .getByRole('link', { name: /Request proposal/ })
    .click();
  await expect(page).toHaveURL(/\/partner\?project=mobile-clinics#request$/);
  await expect(page.locator('#proposal-project')).toHaveValue('mobile-clinics');
});
