// Phase 1 spot-checks: (1) the mobile hamburger (an <img onClick>, not a button) and what it reveals;
// (2) what the "Chat with us" toggle loads (Chatbase iframe) and any privacy notice it shows.
// Usage: node scripts/audit/menu-chat.mjs
import { chromium } from 'playwright';
import path from 'node:path';
import { OUT, load, writeJson } from './lib.mjs';

const browser = await chromium.launch();
const result = {};

// 1) Mobile menu
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await load(page, '/');
  const toggle = page.locator('#menu');
  result.menuToggle = await toggle.evaluate((el) => ({
    tag: el.tagName.toLowerCase(),
    alt: el.getAttribute('alt'),
    role: el.getAttribute('role'),
    tabIndex: el.tabIndex,
    focusable: el.tabIndex >= 0,
  }));
  await page.keyboard.press('Tab');
  result.firstTabStop = await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 120));
  await toggle.click();
  await page.waitForTimeout(800);
  result.mobileMenuLinks = await page.evaluate(() =>
    [...document.querySelectorAll('nav a')]
      .filter((a) => a.getBoundingClientRect().height > 0)
      .map((a) => ({ text: a.innerText.trim(), href: a.getAttribute('href') })),
  );
  await page.screenshot({ path: path.join(OUT, 'screenshots', 'home-390-menu-open.png') });
  await ctx.close();
}

// 2) Chat toggle
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const thirdParty = new Set();
  page.on('request', (r) => {
    const h = new URL(r.url()).hostname;
    if (!h.endsWith('afyawise.org')) thirdParty.add(h);
  });
  await load(page, '/');
  result.thirdPartyBeforeClick = [...thirdParty];
  await page.getByRole('button', { name: 'Chat with us' }).click();
  await page.waitForTimeout(6000);
  result.thirdPartyAfterClick = [...thirdParty];
  const frame = page.frames().find((f) => f.url().includes('chatbase'));
  result.chatIframeSrc = frame?.url() ?? null;
  result.chatText = frame ? (await frame.evaluate(() => document.body.innerText).catch(() => '')).slice(0, 1500) : null;
  await page.screenshot({ path: path.join(OUT, 'screenshots', 'home-1440-chat-open.png') });
  await ctx.close();
}

await browser.close();
await writeJson(path.join(OUT, 'data', 'menu-chat.json'), result);
console.log(JSON.stringify(result, null, 2));
