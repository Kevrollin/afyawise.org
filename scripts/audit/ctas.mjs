// Phase 1: click every CTA / button / link on the live afyawise.org and record what happens.
// Safety: every non-GET request is aborted (and logged), so no form can reach the live inbox.
// Header/footer elements are tested once (on "/"); page-body elements on every route.
// Usage: node scripts/audit/ctas.mjs
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import { BASE, OUT, SEED_ROUTES, load, writeJson, writeText } from './lib.mjs';

const SEL = 'a, button, [role=button], input[type=submit], input[type=button]';

function snapshot() {
  const text = document.body.innerText;
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  const fixed = [...document.querySelectorAll('body *')].filter((el) => {
    const cs = getComputedStyle(el);
    return cs.position === 'fixed' && cs.display !== 'none' && cs.visibility !== 'hidden' && el.getBoundingClientRect().height > 40;
  }).length;
  return {
    url: location.href,
    scrollY: Math.round(window.scrollY),
    hash: h,
    len: text.length,
    dialogs: document.querySelectorAll('[role=dialog], [aria-modal=true], dialog[open]').length,
    fixed,
  };
}

function listCandidates(sel) {
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
  return [...document.querySelectorAll(sel)].map((el, idx) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      idx,
      tag: el.tagName.toLowerCase(),
      text:
        norm(el.innerText).slice(0, 80) ||
        norm(el.getAttribute('aria-label')) ||
        (el.querySelector('img') ? `(image: ${el.querySelector('img').getAttribute('alt') || 'no alt'})` : '(icon only)'),
      href: el.getAttribute('href'),
      type: el.getAttribute('type'),
      inForm: !!el.closest('form'),
      nestedInLink: el.tagName !== 'A' && !!el.closest('a[href]'),
      containsButton: el.tagName === 'A' && !!el.querySelector('button'),
      region: el.closest('header, nav') ? 'header' : el.closest('footer') ? 'footer' : 'main',
      // Nearest heading in the enclosing card/section, so identical labels ("Get Started") in
      // different cards are tested separately.
      context: (() => {
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const h = p.querySelector('h1,h2,h3,h4,h5,h6');
          if (h) return norm(h.innerText).slice(0, 40);
        }
        return '';
      })(),
      visible: r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden',
    };
  });
}

async function destinationInfo(page) {
  return page
    .evaluate(() => ({
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()).filter(Boolean),
      words: document.body.innerText.split(/\s+/).filter(Boolean).length,
    }))
    .catch(() => null);
}

async function testRoute(browser, route, globalSeen) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const blocked = [];
  await ctx.route('**/*', (r) => {
    const m = r.request().method();
    if (m === 'GET' || m === 'HEAD' || m === 'OPTIONS') return r.continue();
    blocked.push({ method: m, url: r.request().url(), body: (r.request().postData() || '').slice(0, 300) });
    return r.abort();
  });
  const page = await ctx.newPage();
  page.on('dialog', (d) => d.dismiss().catch(() => {}));
  await load(page, route);
  const candidates = (await page.evaluate(listCandidates, SEL)).filter((c) => c.visible);

  const seenHere = new Set();
  const results = [];
  for (const c of candidates) {
    const sig = `${c.tag}|${c.text}|${c.href ?? ''}`;
    const localSig = `${sig}|${c.context}`;
    if (c.region !== 'main') {
      if (globalSeen.has(sig)) continue;
      globalSeen.add(sig);
    }
    if (seenHere.has(localSig)) continue;
    seenHere.add(localSig);
    if (c.nestedInLink) continue; // the wrapping <a> is tested instead

    const base = { route, region: c.region, tag: c.tag, text: c.text, context: c.context, href: c.href, inForm: c.inForm };
    if (c.href && /^(mailto|tel|sms|whatsapp):/i.test(c.href)) {
      results.push({ ...base, outcome: 'external-protocol', detail: c.href });
      continue;
    }

    await load(page, route, { idle: true });
    blocked.length = 0;
    const loc = page.locator(SEL).nth(c.idx);
    try {
      await loc.scrollIntoViewIfNeeded({ timeout: 5000 });
      await page.waitForTimeout(400);
      const a = await page.evaluate(snapshot);
      await page.waitForTimeout(1200);
      const a2 = await page.evaluate(snapshot);
      const animated = a.hash !== a2.hash;
      const popupP = ctx.waitForEvent('page', { timeout: 4000 }).catch(() => null);
      await loc.click({ timeout: 5000 }).catch(async () => loc.dispatchEvent('click'));
      const popup = await popupP;
      await page.waitForTimeout(1500);
      const b = await page.evaluate(snapshot).catch(() => null);
      let outcome = 'DEAD';
      let detail = 'no navigation, no new tab, no visible change, no request';
      if (popup) {
        await popup.waitForLoadState('domcontentloaded', { timeout: 15000 }).catch(() => {});
        outcome = 'new-tab';
        detail = popup.url();
        await popup.close().catch(() => {});
      } else if (b && b.url !== a2.url) {
        const from = new URL(a2.url);
        const to = new URL(b.url);
        if (from.pathname === to.pathname && to.hash) {
          outcome = 'anchor';
          detail = to.hash;
        } else {
          outcome = 'navigates';
          detail = to.origin === BASE ? to.pathname + to.hash : b.url;
          await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
          const dest = await destinationInfo(page);
          if (dest) detail += `  (dest h1: ${JSON.stringify(dest.h1)}, ${dest.words} words)`;
        }
      } else if (blocked.length) {
        outcome = 'form-submit-attempt';
        detail = blocked.map((x) => `${x.method} ${x.url}`).join(', ');
      } else if (b && (b.dialogs > a2.dialogs || b.fixed > a2.fixed)) {
        outcome = 'opens-overlay';
        detail = `dialogs ${a2.dialogs}->${b.dialogs}, fixed layers ${a2.fixed}->${b.fixed}`;
      } else if (b && !animated && b.hash !== a2.hash) {
        outcome = 'ui-change';
        detail = `page text changed (${a2.len} -> ${b.len} chars)`;
      } else if (b && Math.abs(b.scrollY - a2.scrollY) > 50) {
        outcome = 'scrolls';
        detail = `scrollY ${a2.scrollY} -> ${b.scrollY}`;
      } else if (b && animated && b.hash !== a2.hash) {
        outcome = 'unclear';
        detail = 'page has autonomous animation; text changed but may be unrelated';
      }
      results.push({ ...base, outcome, detail });
    } catch (e) {
      results.push({ ...base, outcome: 'error', detail: e.message.split('\n')[0] });
    }
  }
  await ctx.close();
  return results;
}

async function main() {
  const globalSeen = new Set();
  const only = process.argv.slice(2);
  const routes = only.length ? only : SEED_ROUTES;
  // Partial runs (e.g. re-testing pages that timed out) replace only those routes' rows.
  const prevFile = path.join(OUT, 'data', 'cta-results.json');
  const prev = only.length ? JSON.parse(await fs.readFile(prevFile, 'utf8').catch(() => '[]')) : [];
  const all = prev.filter((r) => !only.includes(r.route));
  if (only.length) {
    for (const r of prev) if (r.region && r.region !== 'main') globalSeen.add(`${r.tag}|${r.text}|${r.href ?? ''}`);
  }
  for (const route of routes) {
    process.stdout.write(`ctas ${route} ... `);
    const browser = await chromium.launch(); // fresh per route so a crash can't cascade
    const res = await testRoute(browser, route, globalSeen).catch((e) => [{ route, outcome: 'error', detail: e.message }]);
    await browser.close().catch(() => {});
    all.push(...res);
    console.log(`${res.length} tested, ${res.filter((r) => r.outcome === 'DEAD').length} dead`);
  }
  const order = (r) => SEED_ROUTES.indexOf(r.route) === -1 ? 99 : SEED_ROUTES.indexOf(r.route);
  all.sort((a, b) => order(a) - order(b));
  await writeJson(path.join(OUT, 'data', 'cta-results.json'), all);
  const md = [
    '| Page | Region | Element | Label | In section | href | Outcome | Detail |',
    '|---|---|---|---|---|---|---|---|',
    ...all.map((r) =>
      `| \`${r.route}\` | ${r.region ?? ''} | ${r.tag ?? ''} | ${(r.text ?? '').replace(/\|/g, '/')} | ${(r.context ?? '').replace(/\|/g, '/')} | ${r.href ? '`' + r.href + '`' : ''} | **${r.outcome}** | ${(r.detail ?? '').replace(/\|/g, '/')} |`,
    ),
  ].join('\n');
  await writeText(path.join(OUT, 'data', 'cta-results.md'), md + '\n');
  console.log(`done: ${all.length} elements, ${all.filter((r) => r.outcome === 'DEAD').length} dead`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

