import { test, expect, type Page } from '@playwright/test';

const consent = (page: Page, form: string) => page.locator(`#${form}-consent`).check();

test.describe('contact form', () => {
  test('shows inline errors and focuses the first invalid field', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('[data-error-for="reason"]')).toBeVisible();
    await expect(page.locator('#contact-reason')).toBeFocused();
    await expect(page.locator('#contact-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#contact-form [data-status]')).toContainText('check the highlighted fields');
  });

  test('submits and shows success (mail provider: log)', async ({ page }) => {
    await page.goto('/contact');
    await page.locator('#contact-reason').selectOption('partner');
    await page.locator('#contact-name').fill('Test Person');
    await page.locator('#contact-email').fill('test@example.org');
    await page.locator('#contact-subject').fill('Partnership enquiry');
    await page.locator('#contact-message').fill('We would like to discuss a WASH partnership in Tigania East.');
    await consent(page, 'contact');
    await page.waitForTimeout(2600); // the form's minimum-time spam trap
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText('Thank you. Your message is on its way.')).toBeVisible();
    await expect(page.locator('#contact-form')).toBeHidden();
  });

  test('shows a clear error with an email fallback when delivery fails (mocked)', async ({ page }) => {
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ ok: false, code: 'delivery_failed' }),
      }),
    );
    await page.goto('/contact');
    await page.locator('#contact-reason').selectOption('other');
    await page.locator('#contact-name').fill('Test Person');
    await page.locator('#contact-email').fill('test@example.org');
    await page.locator('#contact-subject').fill('Hello');
    await page.locator('#contact-message').fill('Testing the failure message.');
    await consent(page, 'contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.locator('#contact-form [data-status]')).toContainText('info@afyawise.org');
  });

  test('works without JavaScript (native validation + redirect to /thanks)', async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto('/contact');
    await page.locator('#contact-reason').selectOption('volunteer');
    await page.locator('#contact-name').fill('No JS Person');
    await page.locator('#contact-email').fill('nojs@example.org');
    await page.locator('#contact-subject').fill('Volunteering');
    await page.locator('#contact-message').fill('I can help with health education on weekends.');
    await page.locator('#contact-consent').check();
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/\/thanks\?form=contact$/);
    await expect(page.locator('h1')).toContainText('Thank you');
    await ctx.close();
  });
});

test.describe('proposal request form', () => {
  test('submits a funder request', async ({ page }) => {
    await page.goto('/partner?program=water-sanitation-hygiene#request');
    await expect(page.locator('#proposal-program')).toHaveValue('water-sanitation-hygiene');
    await page.locator('#proposal-name').fill('Grace Funder');
    await page.locator('#proposal-organisation').fill('Example Foundation');
    await page.locator('#proposal-email').fill('grace@example.org');
    await page.locator('#proposal-country').fill('Kenya');
    await page.locator('#proposal-interest').selectOption('project');
    await page.locator('#proposal-budget').selectOption('10k-50k');
    await page.locator('#proposal-message').fill('We fund WASH in schools and would like a concept note.');
    await consent(page, 'proposal');
    await page.waitForTimeout(2600);
    await page.getByRole('button', { name: 'Request a proposal' }).click();
    await expect(page.getByText('Thank you. Your message is on its way.')).toBeVisible();
  });
});

test.describe('volunteer form', () => {
  test('requires at least one skill, then submits', async ({ page }) => {
    await page.goto('/get-involved');
    await page.locator('#volunteer-name').fill('Vol Unteer');
    await page.locator('#volunteer-email').fill('vol@example.org');
    await page.locator('#volunteer-phone').fill('+254 712 345 678');
    await page.locator('#volunteer-location').fill('Meru, Kenya');
    await page.locator('#volunteer-availability').selectOption('weekends');
    await consent(page, 'volunteer');
    await page.getByRole('button', { name: 'Send volunteer details' }).click();
    await expect(page.locator('[data-error-for="skills"]')).toBeVisible();
    await page.getByLabel('Health education').check();
    await page.waitForTimeout(2600);
    await page.getByRole('button', { name: 'Send volunteer details' }).click();
    await expect(page.getByText('Thank you. Your message is on its way.')).toBeVisible();
  });
});

/** POST a form the way a browser does (same-origin fetch, so the CSRF Origin check passes). */
async function post(page: Page, url: string, fields: Record<string, string>) {
  await page.goto('/contact');
  return page.evaluate(
    async ({ url, fields }) => {
      const body = new FormData();
      for (const [k, v] of Object.entries(fields)) body.append(k, v);
      const res = await fetch(url, { method: 'POST', body, headers: { Accept: 'application/json' } });
      return { status: res.status, json: await res.json().catch(() => null) };
    },
    { url, fields },
  );
}

test.describe('server-side protection', () => {
  test('rejects invalid data with field errors', async ({ page }) => {
    const res = await post(page, '/api/contact', {
      name: '',
      email: 'not-an-email',
      reason: 'nonsense',
      subject: '',
      message: 'short',
      consent: '',
    });
    expect(res.status).toBe(422);
    expect(Object.keys(res.json.errors)).toEqual(
      expect.arrayContaining(['name', 'email', 'reason', 'subject', 'message', 'consent']),
    );
  });

  test('quietly accepts (and drops) honeypot submissions', async ({ page }) => {
    const res = await post(page, '/api/contact', {
      website: 'http://spam.example',
      name: 'Bot',
      email: 'bot@example.org',
      reason: 'other',
      subject: 'x',
      message: 'buy now buy now',
      consent: 'yes',
    });
    expect(res.status).toBe(200);
    expect(res.json.ok).toBe(true);
  });

  test('blocks cross-site form posts (CSRF origin check)', async ({ request }) => {
    const res = await request.post('/api/contact', {
      headers: { Origin: 'https://evil.example' },
      form: {
        name: 'X',
        email: 'x@example.org',
        reason: 'other',
        subject: 'x',
        message: 'cross-site attempt',
        consent: 'yes',
      },
    });
    expect(res.status()).toBe(403);
  });

  test('donation endpoints refuse politely until credentials are configured', async ({ page }) => {
    const card = await post(page, '/api/donate/card', { amount: '1000', currency: 'KES', email: 'd@example.org' });
    expect(card.status).toBe(503);
    const mpesa = await post(page, '/api/donate/mpesa', { phone: '0712345678', amount: '500' });
    expect(mpesa.status).toBe(503);
  });
});
